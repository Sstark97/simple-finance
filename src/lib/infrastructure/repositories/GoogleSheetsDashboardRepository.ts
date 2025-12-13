/**
 * @file src/infrastructure/repositories/GoogleSheetsDashboardRepository.ts
 * @description Implementación del DashboardRepository utilizando Google Sheets.
 */
import { Dashboard } from '@/lib/domain/models/Dashboard';
import { DashboardRepository } from '@/lib/application/repositories/DashboardRepository';
import sheets, { SPREADSHEET_ID } from '@/lib/infrastructure/google/sheetsClient';
import { formatMonthForSheet, parseMonthYearString } from '@/lib/utils/dateParser';
import { SHEET_CONFIG } from '@/lib/config/sheets';


export class GoogleSheetsDashboardRepository implements DashboardRepository {
  /**
   * Mapea una fila de Google Sheet a un objeto Dashboard.
   * @param row Array de valores de una fila.
   * @returns Objeto Dashboard.
   */
  private mapRowToDashboard(row: string[]): Dashboard {
    // Asumiendo que el orden de las columnas es el definido en PLAN.md:
    // Col A: MES (Date)
    // Col B: INGRESOS (Number)
    // Col C: GASTOS (Number)
    // Col D: AHORRO (Number)
    // Col E: INVERSION (Number)
    // Col F: DINERO LIBRE (Number)
    // Col G: ESTADO (String)
    return {
      mes: parseMonthYearString(row[0]), // Ahora usa la nueva función de parseo
      ingresos: parseFloat(row[1]),
      gastos: parseFloat(row[2]),
      ahorro: parseFloat(row[3]),
      inversion: parseFloat(row[4]),
      dineroLibre: parseFloat(row[5]),
      estado: row[6],
    };
  }

  /**
   * Busca los datos del dashboard para un date específico.
   * @param month La fecha del date a buscar.
   * @returns Los datos del dashboard, o null si no se encuentran.
   */
  async findByMonth(month: Date): Promise<Dashboard | null> {
    const config = SHEET_CONFIG.dashboard;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${config.name}!${config.range}`,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return null;
    }

    const targetMonthString = formatMonthForSheet(month); // Formato "diciembre de 2025"

    // Buscar la fila que coincida con la cadena del date (ignorando la primera fila que son cabeceras)
    const dataRow = rows.slice(1).find(row => {
      if (!row[0]) {
          return false;
      }
      const rowMonthString = row[0]; // La cadena tal cual de la hoja
      return rowMonthString === targetMonthString;
    });

    if (!dataRow) {
      return null;
    }

    return this.mapRowToDashboard(dataRow);
  }

  /**
   * Actualiza los income, saving e inversión para un date específico.
   * @param month La fecha del date a actualizar.
   * @param ingresos Nuevos income.
   * @param ahorro Nuevo objetivo de saving.
   * @param inversion Nuevo objetivo de inversión.
   * @returns El dashboard actualizado.
   */
  async updateMonthlySettings(
    month: Date,
    ingresos: number,
    ahorro: number,
    inversion: number
  ): Promise<Dashboard> {
    const config = SHEET_CONFIG.dashboard;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${config.name}!${config.range}`,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      throw new Error('No se encontraron datos en la hoja de Dashboard.');
    }

    const targetMonthString = formatMonthForSheet(month); // Formato "Diciembre de 2025"

    // Encontrar la fila del date. Ignoramos la cabecera.
    const rowIndex = rows.slice(1).findIndex(row => {
        if (!row[0]) return false;
        const rowMonthString = row[0];
        return rowMonthString === targetMonthString;
    });

    if (rowIndex === -1) {
      throw new Error(`Mes "${targetMonthString}" no encontrado en el dashboard.`);
    }

    // rowIndex es el índice en el array sin cabecera,
    // para Google Sheets debemos sumar 2 (1 por la cabecera y 1 por ser índice base 1).
    const sheetRowIndex = rowIndex + 2;

    const requests = [
      {
        range: `${config.name}!B${sheetRowIndex}`, // INGRESOS
        values: [[ingresos]],
      },
      {
        range: `${config.name}!D${sheetRowIndex}`, // AHORRO
        values: [[ahorro]],
      },
      {
        range: `${config.name}!E${sheetRowIndex}`, // INVERSION
        values: [[inversion]],
      },
    ];

    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data: requests,
      },
    });

    // Después de la actualización, recuperamos la fila completa para devolver el objeto Dashboard actualizado.
    const updatedRowResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${config.name}!A${sheetRowIndex}:G${sheetRowIndex}`,
    });

    const updatedRow = updatedRowResponse.data.values?.[0];
    if (!updatedRow) {
      throw new Error('No se pudo recuperar la fila actualizada del dashboard.');
    }

    return this.mapRowToDashboard(updatedRow);
  }
}
