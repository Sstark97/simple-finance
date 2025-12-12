/**
 * @file src/infrastructure/repositories/GoogleSheetsTransactionRepository.ts
 * @description Implementación del TransactionRepository utilizando Google Sheets.
 */
import { TransactionRepository } from '@/lib/application/repositories/TransactionRepository';
import sheets, { SPREADSHEET_ID } from '@/lib/infrastructure/google/sheetsClient';
import { parseDayMonthYearString } from '@/lib/utils/dateParser';
import { SHEET_CONFIG } from '@/lib/config/sheets';
import type {TransactionRawData} from "@/lib/application/dtos/dtos";

export class GoogleSheetsTransactionRepository implements TransactionRepository {
  /**
   * Mapea una fila de Google Sheet a un objeto TransactionRawData.
   * @param row Array de valores de una fila.
   * @returns Objeto TransactionRawData.
   */
  private mapRowToTransaction(row: string[]): TransactionRawData {
    const amountStr = row[2] ?? '0';
    return {
      id: 0,
      fechaCobro: parseDayMonthYearString(row[0]), // Usa la nueva función de parseo
      concepto: row[1] ?? '',
      importe: parseFloat(amountStr.replace(',', '.')),
      categoria: row[3] ?? '',
    };
  }
  
  /**
   * Añade una nueva transacción.
   * @param transaction La transacción a añadir.
   * @returns La transacción añadida.
   */
  async addTransaction(transaction: Omit<TransactionRawData, 'fechaCobro'> & { fechaCobro: string }): Promise<TransactionRawData> {
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
   * Valida si una fila es válida para ser procesada
   * @param row Fila de Google Sheets
   * @returns true si la fila es válida
   */
  private isValidRow(row: string[]): boolean {
    if (!row || row.length === 0) return false;

    // Filtrar filas completamente vacías
    if (!row.some(cell => cell.trim() !== '')) {
      return false;
    }

    const firstCell = row[0];
    return !(!firstCell || firstCell.startsWith('#REF!') || firstCell.startsWith('#N/A') || firstCell.startsWith('#ERROR!'));
  }

  /**
   * Obtiene todas las transacciones.
   * @returns Un array con todas las transacciones.
   */
  async findAll(): Promise<TransactionRawData[]> {
    const config = SHEET_CONFIG.transactions;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${config.name}!${config.range}`,
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return [];
    }

    // Ignorar la primera fila (cabecera), filtrar filas inválidas y mapear el resto
    return rows
      .slice(1)
      .filter(row => this.isValidRow(row))
      .map(row => {
        try {
          return this.mapRowToTransaction(row);
        } catch (error) {
          console.error('Error parsing transaction row:', row, error);
          return null;
        }
      })
      .filter((transaction): transaction is TransactionRawData => transaction !== null && !isNaN(transaction.fechaCobro.getTime()));
  }
}
