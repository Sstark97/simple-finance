export interface PatrimonioDto {
    mes: string;
    total: number;
    hucha: number;
    invertido: number;
}

export type PatrimonioResult = {
    patrimonio: PatrimonioDto[];
    error?: string;
}