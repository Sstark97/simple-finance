import type {PatrimonioDto} from "@/lib/application/dtos/dtos";

export class PkiCalculator {
    constructor(private readonly patrimonio: PatrimonioDto[]) {}

    get currentTotal(): number {
        return this.patrimonio.at(-1)?.total ?? 0;
    }

    get previousTotal(): number {
        return this.patrimonio.at(-2)?.total ?? 0;
    }

    get growthPercentage(): number {
        if (this.previousTotal === 0) return 0;
        return ((this.currentTotal - this.previousTotal) / this.previousTotal) * 100;
    }
}