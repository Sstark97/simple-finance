import { NetWorthRepository } from '@/lib/application/repositories/NetWorthRepository';
import type {NetWorth} from "@/lib/domain/models/NetWorth";
import type {PatrimonioDto, PatrimonioResult} from "@/lib/application/dtos/dtos";

export class GetNetWorthHistory {
  constructor(private netWorthRepository: NetWorthRepository) {}

  async execute(): Promise<PatrimonioResult> {
    try {
      const history = await this.netWorthRepository.findAll();
      return { patrimonio: this.getPatrimonioSortedFrom(history) };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error fetching net worth history:', err);
        return { patrimonio: [], error };
    }
  }

    private getPatrimonioSortedFrom = (history: NetWorth[]) => {
        return history.map((nw) => this.transformNetWorthToData(nw))
            .toSorted((a, b) => {
                const aDate = new Date(a.mes);
                const bDate = new Date(b.mes);
                return aDate.getTime() - bDate.getTime();
            });
    }

    private transformNetWorthToData(netWorth: NetWorth): PatrimonioDto {
        const total = Number.isFinite(netWorth.total) ? netWorth.total : 0;
        const hucha = Number.isFinite(netWorth.hucha) ? netWorth.hucha : 0;
        const invertido = Number.isFinite(netWorth.invertido) ? netWorth.invertido : 0;

        return {
            mes: this.formatMonthYear(netWorth.mes),
            total,
            hucha,
            invertido,
        };
    }

    private formatMonthYear(date: Date): string {
        return new Intl.DateTimeFormat('es-ES', {
            month: 'short',
            year: 'numeric',
        }).format(date);
    }

}
