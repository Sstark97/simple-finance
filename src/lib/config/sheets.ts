/**
 * @file src/lib/config/sheets.ts
 * @description Configuration for Google Sheets data sources
 */

/**
 * Google Sheets configuration for each data entity
 */
export const SHEET_CONFIG = {
  /** Dashboard/monthly overview sheet */
  dashboard: {
    name: 'Dashboard',
    range: 'A:G',
  },
  /** Transactions/expenses sheet */
  transactions: {
    name: 'Gastos',
    range: 'A:D',
  },
  /** Net worth/patrimony sheet */
  networth: {
    name: 'Patrimonio',
    range: 'A:B',
  },
} as const;

/**
 * Type for sheet config keys
 */
export type SheetConfigKey = keyof typeof SHEET_CONFIG;
