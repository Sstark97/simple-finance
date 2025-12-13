import {sheets_v4} from '@googleapis/sheets';
import {JWT} from 'google-auth-library';

const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}');

const auth = new JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = new sheets_v4.Sheets({ auth });

export const SPREADSHEET_ID = process.env.NEXT_PUBLIC_SPREADSHEET_ID;

export default sheets;

export class GoogleSheetClient {
  private readonly sheets = new sheets_v4.Sheets({ auth }).spreadsheets;
  private readonly SPREADSHEET_ID = process.env.NEXT_PUBLIC_SPREADSHEET_ID;

  async valuesForRange(range: string) {
    return await this.sheets.values.get({
      spreadsheetId: this.SPREADSHEET_ID,
      range,
    });
  }

  async appendValues(range: string, values: any[]) {
    return await this.sheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [values],
      },
    });
  }

  async batchUpdateValues(values: any[]) {
    await this.sheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data: values,
      },
    });
  }
}
