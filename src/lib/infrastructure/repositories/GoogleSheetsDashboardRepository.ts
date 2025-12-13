import { Dashboard } from '@/lib/domain/models/Dashboard';
import { DashboardRepository } from '@/lib/application/repositories/DashboardRepository';
import sheets, { SPREADSHEET_ID } from '@/lib/infrastructure/google/sheetsClient';
import { formatMonthForSheet, parseMonthYearString } from '@/lib/utils/dateParser';
import { SHEET_CONFIG } from '@/lib/infrastructure/google/sheets';


export class GoogleSheetsDashboardRepository implements DashboardRepository {
  private mapRowToDashboard(row: string[]): Dashboard {
    return new Dashboard(
        parseMonthYearString(row[0]), // Ahora usa la nueva función de parseo
        parseFloat(row[1]),
        parseFloat(row[2]),
        parseFloat(row[3]),
        parseFloat(row[4]),
        parseFloat(row[5]),
        row[6]
    )
  }

  async findByMonth(month: Date): Promise<Dashboard> {
    const config = SHEET_CONFIG.dashboard;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${config.name}!${config.range}`,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return Dashboard.empty();
    }

    const targetMonthString = formatMonthForSheet(month);

    const dataRow = rows.slice(1).find(row => {
      if (!row[0]) {
          return false;
      }
      const rowMonthString = row[0];
      return rowMonthString === targetMonthString;
    });

    if (!dataRow) {
      return Dashboard.empty();
    }

    return this.mapRowToDashboard(dataRow);
  }

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

    const rowIndex = rows.slice(1).findIndex(row => {
        if (!row[0]) return false;
        const rowMonthString = row[0];
        return rowMonthString === targetMonthString;
    });

    if (rowIndex === -1) {
      throw new Error(`Mes "${targetMonthString}" no encontrado en el dashboard.`);
    }

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
