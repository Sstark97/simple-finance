/**
 * @file src/infrastructure/repositories/GoogleSheetsNetWorthRepository.ts
 * @description Implementación del NetWorthRepository utilizando Google Sheets.
 */
import { NetWorth } from '@/lib/domain/models/NetWorth';
import { NetWorthRepository } from '@/lib/application/repositories/NetWorthRepository';
import sheets, { SPREADSHEET_ID } from '@/lib/infrastructure/google/sheetsClient';
import { formatMonthForSheet, parseMonthYearString } from '@/lib/utils/dateParser';
import { SHEET_CONFIG } from '@/lib/config/sheets';


export class GoogleSheetsNetWorthRepository implements NetWorthRepository {
  /**
   * Mapea una fila de Google Sheet a un objeto NetWorth.
   * @param row Array de valores de una fila.
   * @returns Objeto NetWorth.
   */
  private mapRowToNetWorth(row: string[]): NetWorth {
    // Asumiendo que el orden de las columnas es el definido en PLAN.md:
    // Col A: MES (Date)
    // Col B: HUCHA (Number)
    // Col C: INVERTIDO (Number)
    // Col D: TOTAL (Number)
    return {
      mes: parseMonthYearString(row[0]), // Ahora usa la nueva función de parseo
      hucha: parseFloat(row[1]),
      invertido: parseFloat(row[2]),
      total: parseFloat(row[3]),
    };
  }

  /**
   * Busca los datos de patrimonio neto para un mes específico.
   * @param month La fecha del mes a buscar.
   * @returns Los datos de patrimonio neto, o null si no se encuentran.
   */
  async findByMonth(month: Date): Promise<NetWorth | null> {
    const config = SHEET_CONFIG.networth;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${config.name}!${config.range}`,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return null;
    }

    const targetMonthString = formatMonthForSheet(month); // Formato "Diciembre de 2025"

    // Buscar la fila que coincida con la cadena del mes (ignorando la primera fila que son cabeceras)
    const dataRow = rows.slice(1).find(row => {
      if (!row[0]) return false;
      const rowMonthString = row[0]; // La cadena tal cual de la hoja
      return rowMonthString === targetMonthString;
    });

    if (!dataRow) {
      return null;
    }

    return this.mapRowToNetWorth(dataRow);
  }

  /**
   * Actualiza el patrimonio neto para un mes específico. Si el mes no existe, lo crea.
   * @param month La fecha del mes a actualizar/crear.
   * @param hucha Nuevo valor de "hucha".
   * @param invertido Nuevo valor de "invertido".
   * @returns El patrimonio neto actualizado o creado.
   */
  async updateNetWorth(
    month: Date,
    hucha: number,
    invertido: number
  ): Promise<NetWorth> {
    const config = SHEET_CONFIG.networth;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${config.name}!${config.range}`,
    });

    const rows = response.data.values;
    const headerRow = rows && rows.length > 0 ? rows[0] : null;

    const targetMonthString = formatMonthForSheet(month); // Formato "Diciembre de 2025"

    // Encontrar la fila del mes. Ignoramos la cabecera.
    const rowIndex = rows ? rows.slice(1).findIndex(row => {
      if (!row[0]) return false;
      const rowMonthString = row[0];
      return rowMonthString === targetMonthString;
    }) : -1;


    let sheetRowIndex: number;
    let newRowCreated = false;

    if (rowIndex !== -1) {
      // Si el mes existe, actualizamos esa fila. Sumamos 2 (1 por cabecera, 1 por índice base 1).
      sheetRowIndex = rowIndex + 2;
    } else {
      // Si el mes no existe, creamos una nueva fila al final.
      sheetRowIndex = (rows ? rows.length : 0) + 1;
      newRowCreated = true;
    }
    
    // Formatear la fecha como DD/MM/YYYY para la hoja de cálculo
    const monthFormattedForSheet = `${month.getUTCDate().toString().padStart(2, '0')}/${(month.getUTCMonth() + 1).toString().padStart(2, '0')}/${month.getUTCFullYear()}`;

    if (newRowCreated) {
        // Si el mes no existe, añadimos una nueva fila.
        const appendResponse = await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${config.name}!A:C`, // A:C para añadir MES, HUCHA, INVERTIDO
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: {
                values: [[targetMonthString, hucha, invertido]], // Usar targetMonthString para la columna MES
            },
        });
        if (appendResponse.status !== 200) {
            throw new Error('Error al añadir nueva fila de patrimonio neto a Google Sheets.');
        }

        const updatedRange = appendResponse.data.updates?.updatedRange;
        if (!updatedRange) {
            throw new Error('No se pudo obtener el rango actualizado después de añadir la fila.');
        }
        const match = updatedRange.match(/(\d+)$/);
        if (!match || !match[0]) {
            throw new Error('No se pudo extraer el número de fila del rango actualizado.');
        }
        const newRowNumber = parseInt(match[0]);
        sheetRowIndex = newRowNumber;

    } else {
        // Si el mes existe, actualizamos las columnas B y C.
        const requests = [
            {
                range: `${config.name}!B${sheetRowIndex}`, // HUCHA
                values: [[hucha]],
            },
            {
                range: `${config.name}!C${sheetRowIndex}`, // INVERTIDO
                values: [[invertido]],
            },
        ];

        await sheets.spreadsheets.values.batchUpdate({
            spreadsheetId: SPREADSHEET_ID,
            requestBody: {
                valueInputOption: 'USER_ENTERED',
                data: requests,
            },
        });
    }

    // Después de la actualización/inserción, recuperamos la fila completa para devolver el objeto NetWorth actualizado.
    const updatedRowResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${config.name}!A${sheetRowIndex}:D${sheetRowIndex}`,
    });

    const updatedRow = updatedRowResponse.data.values?.[0];
    if (!updatedRow) {
      throw new Error('No se pudo recuperar la fila actualizada de patrimonio neto.');
    }

    return this.mapRowToNetWorth(updatedRow);
  }

  /**
   * Obtiene todo el historial de patrimonio neto.
   * @returns Un array con todo el historial de patrimonio neto.
   */
  async findAll(): Promise<NetWorth[]> {
    const config = SHEET_CONFIG.networth;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${config.name}!${config.range}`,
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) { // Menor o igual a 1 para ignorar solo la cabecera
      return [];
    }

    // Ignorar la primera fila (cabecera) y mapear el resto
    return rows.slice(1).map(this.mapRowToNetWorth);
  }
}
