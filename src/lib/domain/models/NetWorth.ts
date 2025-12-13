import type {HeritageRaw} from "@/lib/application/dtos/dtos";

export class NetWorth {
  constructor(
    public readonly date: Date,
    public readonly saving: number,
    public readonly investment: number,
    public readonly total: number
  ) {}

   transformNetWorthToHeritage(): HeritageRaw {
    const total = Number.isFinite(this.total) ? this.total : 0;
    const saving = Number.isFinite(this.saving) ? this.saving : 0;
    const investment = Number.isFinite(this.investment) ? this.investment : 0;

    return {
      month: this.formatMonthYear(),
      total,
      saving,
      investment,
    };
  }

  private formatMonthYear(): string {
    return new Intl.DateTimeFormat('es-ES', {
      month: 'short',
      year: 'numeric',
    }).format(this.date);
  }
}
