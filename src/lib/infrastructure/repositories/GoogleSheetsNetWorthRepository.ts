import {NetWorth} from '@/lib/domain/models/NetWorth';
import {NetWorthRepository} from '@/lib/application/repositories/NetWorthRepository';
import {GoogleSheetClient} from '@/lib/infrastructure/google/sheetsClient';
import {formatMonthForSheet, parseMonthYearString} from '@/lib/utils/dateParser';
import {SHEET_CONFIG} from '@/lib/config/sheets';


export class GoogleSheetsNetWorthRepository implements NetWorthRepository {
    private readonly NETWORTH_CONFIG = SHEET_CONFIG.networth;
    private readonly googleSheetsClient = new GoogleSheetClient();

    async findByMonth(month: Date): Promise<NetWorth | null> {
        const response = await this.googleSheetsClient.valuesForRange(`${this.NETWORTH_CONFIG.name}!${this.NETWORTH_CONFIG.range}`);
        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            return null;
        }

        const dataRow = rows.slice(1).find(row => {
            if (!row[0]) return false;
            const rowMonthString = row[0];
            return rowMonthString === formatMonthForSheet(month);
        });

        if (!dataRow) {
            return null;
        }

        return this.mapRowToNetWorth(dataRow);
    }

    async saveNetWorth(
        month: Date,
        hucha: number,
        invertido: number
    ): Promise<NetWorth> {
        const response = await this.googleSheetsClient.valuesForRange(`${this.NETWORTH_CONFIG.name}!${this.NETWORTH_CONFIG.range}`);
        const rows = response.data.values;
        const targetMonthString = formatMonthForSheet(month);

        const rowIndex = rows ? rows.slice(1).findIndex(row => {
            if (!row[0]) return false;
            const rowMonthString = row[0];
            return rowMonthString === targetMonthString;
        }) : -1;
        const newRowCreated = rowIndex === -1;

        return newRowCreated ? await this.addNetWorth(targetMonthString, hucha, invertido)
            : await this.updateNetWorth(rowIndex, rows, hucha, invertido);
    }

    async findAll(): Promise<NetWorth[]> {
        const response = await this.googleSheetsClient.valuesForRange(`${this.NETWORTH_CONFIG.name}!${this.NETWORTH_CONFIG.range}`);

        const rows = response.data.values;
        if (!rows || rows.length <= 1) {
            return [];
        }

        return rows
            .slice(1)
            .filter(row => this.isValidRow(row))
            .map(row => {
                try {
                    return this.mapRowToNetWorth(row);
                } catch (error) {
                    console.error('Error parsing row:', row, error);
                    return null;
                }
            })
            .filter((networth): networth is NetWorth => networth !== null);
    }

    private async getRowsOfNetWorth(sheetRowIndex: number) {
        const updatedRowResponse = await this.googleSheetsClient.valuesForRange(`${this.NETWORTH_CONFIG.name}!A${sheetRowIndex}:D${sheetRowIndex}`);
        const updatedRow = updatedRowResponse.data.values?.[0];
        if (!updatedRow) {
            throw new Error('No se pudo recuperar la fila actualizada de patrimonio neto.');
        }

        return this.mapRowToNetWorth(updatedRow);
    }

    private mapRowToNetWorth(row: string[]): NetWorth {
        const parseNumber = (value: string): number => {
            if (!value) return 0;
            const cleaned = value.replace(/[^\d.,-]/g, '').replace(',', '.');
            return parseFloat(cleaned) ?? 0;
        };

        const hucha = parseNumber(row[1]);
        const invertido = parseNumber(row[2]);
        const total = parseNumber(row[3]);

        const calculatedTotal = total !== 0 ? total : hucha + invertido;

        return {
            mes: parseMonthYearString(row[0]), // Ahora usa la nueva función de parseo
            hucha,
            invertido,
            total: calculatedTotal,
        };
    }

    private async updateNetWorth(rowIndex: number, rows: any[][] | null | undefined, hucha: number, invertido: number) {
        const sheetRowIndex: number = rowIndex !== -1 ? rowIndex + 2 : (rows ? rows.length : 0) + 1;
        const requests = [
            {
                range: `${this.NETWORTH_CONFIG.name}!B${sheetRowIndex}`,
                values: [[hucha]],
            },
            {
                range: `${this.NETWORTH_CONFIG.name}!C${sheetRowIndex}`,
                values: [[invertido]],
            },
        ];
        await this.googleSheetsClient.batchUpdateValues(requests);
        return await this.getRowsOfNetWorth(sheetRowIndex);
    }

    private async addNetWorth(targetMonthString: string, hucha: number, invertido: number) {
        const appendResponse = await this.googleSheetsClient.appendValues(
            `${this.NETWORTH_CONFIG.name}!A:C`,
            [targetMonthString, hucha, invertido]
        );
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
        return await this.getRowsOfNetWorth(parseInt(match[0]));
    }

    private isValidRow(row: string[]): boolean {
        if (!row || row.length === 0) return false;

        const firstCell = row[0];
        return !(!firstCell || firstCell.startsWith('#REF!') || firstCell.startsWith('#N/A') || firstCell.startsWith('#ERROR!'));
    }
}
