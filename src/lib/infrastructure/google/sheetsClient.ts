import { google } from 'googleapis';
import path from 'path';

// Lee las credenciales del fichero JSON.
// Asegúrate de que el fichero `credentials.json` está en la raíz del proyecto.
const KEYFILEPATH = path.join(process.cwd(), 'credentials.json');

// Define el alcance (scope) de los permisos. Para Google Sheets es suficiente con 'spreadsheets'.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Crea una nueva instancia de autenticación JWT.
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

// Obtiene el cliente de Google Sheets.
const sheets = google.sheets({ version: 'v4', auth });

/**
 * ID de la hoja de cálculo de Google Sheets.
 * REEMPLAZA ESTE VALOR con el ID de tu hoja de cálculo.
 * Lo puedes encontrar en la URL de tu Google Sheet:
 * https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
 */
export const SPREADSHEET_ID = process.env.NEXT_PUBLIC_SPREADSHEET_ID;

export default sheets;
