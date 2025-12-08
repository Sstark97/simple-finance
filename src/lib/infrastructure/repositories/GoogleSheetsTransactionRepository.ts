/**
 * @file src/infrastructure/repositories/GoogleSheetsTransactionRepository.ts
 * @description Implementación del TransactionRepository utilizando Google Sheets.
 */
import { Transaction } from '@/lib/domain/models/Transaction';
import { TransactionRepository } from '@/lib/application/repositories/TransactionRepository';
import sheets, { SPREADSHEET_ID } from '@/lib/infrastructure/google/sheetsClient';
import { parseDayMonthYearString } from '@/lib/utils/dateParser';
import { SHEET_CONFIG } from '@/lib/config/sheets';

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
    const config = SHEET_CONFIG.transactions;
    const row = [
      transaction.fechaCobro,
      transaction.concepto,
      transaction.importe.toString(),
      transaction.categoria,
    ];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${config.name}!${config.range}`,
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
    const config = SHEET_CONFIG.transactions;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${config.name}!${config.range}`,
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
