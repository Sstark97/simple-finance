/**
 * @file src/infrastructure/repositories/GoogleSheetsTransactionRepository.ts
 * @description Implementación del TransactionRepository utilizando Google Sheets.
 */
import { Transaction } from '../../domain/models/Transaction';
import { TransactionRepository } from '../../application/repositories/TransactionRepository';
import sheets, { SPREADSHEET_ID } from '../google/sheetsClient';

const TRANSACTIONS_SHEET_NAME = 'Gastos'; // Nombre de la pestaña de Transacciones
const TRANSACTIONS_RANGE = 'A:D'; // FECHA COBRO, CONCEPTO, IMPORTE, CATEGORIA

// Función auxiliar para parsear fechas en formato DD/MM/YYYY
// NOTA: Esta función se mantiene por si hay otras columnas que la necesiten,
// pero para la columna "FECHA COBRO" de Gastos, se usará `parseDayMonthYearString`.
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

// Función auxiliar para parsear la cadena "DD de [nombre del mes] de YYYY"
function parseDayMonthYearString(dateString: string): Date {
  if (!dateString) return new Date(NaN);
  const monthNames = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  const parts = dateString.split(' de '); // e.g., ['10', 'diciembre', '2025']
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const monthName = parts[1].toLowerCase();
    const year = parseInt(parts[2], 10);
    const monthIndex = monthNames.indexOf(monthName);
    if (monthIndex !== -1 && !isNaN(day) && !isNaN(year)) {
      return new Date(Date.UTC(year, monthIndex, day));
    }
  }
  return new Date(dateString); // Fallback a Date.parse() si el formato no coincide
}

export class GoogleSheetsTransactionRepository implements TransactionRepository {
  /**
   * Mapea una fila de Google Sheet a un objeto Transaction.
   * @param row Array de valores de una fila.
   * @returns Objeto Transaction.
   */
  private mapRowToTransaction(row: string[]): Transaction {
    const amountStr = row[2] || '0';
    return {
      fechaCobro: parseDayMonthYearString(row[0]), // Usa la nueva función de parseo
      concepto: row[1] || '',
      importe: parseFloat(amountStr.replace(',', '.')),
      categoria: row[3] || '',
    };
  }
  
  /**
   * Añade una nueva transacción.
   * @param transaction La transacción a añadir.
   * @returns La transacción añadida.
   */
  async addTransaction(transaction: Omit<Transaction, 'fechaCobro'> & { fechaCobro: string }): Promise<Transaction> {
    const row = [
      transaction.fechaCobro,
      transaction.concepto,
      transaction.importe.toString(),
      transaction.categoria,
    ];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${TRANSACTIONS_SHEET_NAME}!${TRANSACTIONS_RANGE}`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [row],
      },
    });

    if (response.status !== 200) {
      throw new Error('Error al añadir la transacción a Google Sheets.');
    }

    return { ...transaction, fechaCobro: new Date(transaction.fechaCobro) };
  }

  /**
   * Obtiene todas las transacciones.
   * @returns Un array con todas las transacciones.
   */
  async findAll(): Promise<Transaction[]> {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${TRANSACTIONS_SHEET_NAME}!${TRANSACTIONS_RANGE}`,
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return [];
    }

    // Ignorar la primera fila (cabecera), filtrar filas completamente vacías
    return rows
      .slice(1)
      .filter(row => row && row.some(cell => typeof cell === 'string' && cell.trim() !== '')) // Asegurarse de que la fila no está vacía
      .map(this.mapRowToTransaction)
      .filter(transaction => !isNaN(transaction.fechaCobro.getTime())); // Filtrar transacciones con fecha inválida
  }
}
