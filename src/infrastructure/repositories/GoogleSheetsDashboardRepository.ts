/**
 * @file src/infrastructure/repositories/GoogleSheetsDashboardRepository.ts
 * @description Implementación del DashboardRepository utilizando Google Sheets.
 */
import { Dashboard } from '../../domain/models/Dashboard';
import { DashboardRepository } from '../../application/repositories/DashboardRepository';
import sheets, { SPREADSHEET_ID } from '../google/sheetsClient';

const DASHBOARD_SHEET_NAME = 'Dashboard'; // Nombre de la pestaña del Dashboard
const DASHBOARD_RANGE = 'A:G'; // Rango de columnas del Dashboard (MES a ESTADO)

// Función auxiliar para parsear fechas en formato DD/MM/YYYY
// Se mantiene por si se necesita para otras columnas con ese formato.
function parseDateDDMMYYYY(dateString: string): Date {
  if (!dateString) return new Date(NaN);
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Meses son 0-indexados en JavaScript
    const year = parseInt(parts[2], 10);
    return new Date(Date.UTC(year, month, day));
  }
  return new Date(dateString);
}

// Función auxiliar para formatear un objeto Date a la cadena "nombre del mes de año"
function formatMonthForSheet(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric', timeZone: 'UTC' };
  return date.toLocaleDateString('es-ES', options);
}

// Función auxiliar para parsear la cadena "nombre del mes de año" a un objeto Date
function parseMonthYearString(monthYearString: string): Date {
  const monthNames = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  const parts = monthYearString.split(' de ');
  if (parts.length === 2) {
    const monthName = parts[0].toLowerCase();
    const year = parseInt(parts[1], 10);
    const monthIndex = monthNames.indexOf(monthName);
    if (monthIndex !== -1 && !isNaN(year)) {
      return new Date(Date.UTC(year, monthIndex, 1));
    }
  }
  return new Date(NaN); // Retorna fecha inválida si no puede parsear
}


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
   * Busca los datos del dashboard para un mes específico.
   * @param month La fecha del mes a buscar.
   * @returns Los datos del dashboard, o null si no se encuentran.
   */
  async findByMonth(month: Date): Promise<Dashboard | null> {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${DASHBOARD_SHEET_NAME}!${DASHBOARD_RANGE}`,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return null;
    }

    const targetMonthString = formatMonthForSheet(month); // Formato "diciembre de 2025"

    // Buscar la fila que coincida con la cadena del mes (ignorando la primera fila que son cabeceras)
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
   * Actualiza los ingresos, ahorro e inversión para un mes específico.
   * @param month La fecha del mes a actualizar.
   * @param ingresos Nuevos ingresos.
   * @param ahorro Nuevo objetivo de ahorro.
   * @param inversion Nuevo objetivo de inversión.
   * @returns El dashboard actualizado.
   */
  async updateMonthlySettings(
    month: Date,
    ingresos: number,
    ahorro: number,
    inversion: number
  ): Promise<Dashboard> {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${DASHBOARD_SHEET_NAME}!${DASHBOARD_RANGE}`,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      throw new Error('No se encontraron datos en la hoja de Dashboard.');
    }

    const targetMonthString = formatMonthForSheet(month); // Formato "Diciembre de 2025"

    // Encontrar la fila del mes. Ignoramos la cabecera.
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
        range: `${DASHBOARD_SHEET_NAME}!B${sheetRowIndex}`, // INGRESOS
        values: [[ingresos]],
      },
      {
        range: `${DASHBOARD_SHEET_NAME}!D${sheetRowIndex}`, // AHORRO
        values: [[ahorro]],
      },
      {
        range: `${DASHBOARD_SHEET_NAME}!E${sheetRowIndex}`, // INVERSION
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
      range: `${DASHBOARD_SHEET_NAME}!A${sheetRowIndex}:G${sheetRowIndex}`,
    });

    const updatedRow = updatedRowResponse.data.values?.[0];
    if (!updatedRow) {
      throw new Error('No se pudo recuperar la fila actualizada del dashboard.');
    }

    return this.mapRowToDashboard(updatedRow);
  }
}
