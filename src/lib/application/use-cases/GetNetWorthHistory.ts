import { NetWorthRepository } from '@/lib/application/repositories/NetWorthRepository';
import type {NetWorth} from "@/lib/domain/models/NetWorth";
import type {HeritageRaw, HeritageResult} from "@/lib/application/dtos/dtos";

export class GetNetWorthHistory {
  constructor(private netWorthRepository: NetWorthRepository) {}

  async execute(): Promise<HeritageResult> {
    try {
      const history = await this.netWorthRepository.findAll();
      return { heritage: this.getPatrimonioSortedFrom(history) };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error fetching net worth history:', err);
        return { heritage: [], error };
    }
  }

    private getPatrimonioSortedFrom = (history: NetWorth[]) => {
        return history.map((nw) => this.transformNetWorthToData(nw))
            .toSorted((a, b) => {
                const aDate = new Date(a.month);
                const bDate = new Date(b.month);
                return aDate.getTime() - bDate.getTime();
            });
    }

    private transformNetWorthToData(netWorth: NetWorth): HeritageRaw {
        const total = Number.isFinite(netWorth.total) ? netWorth.total : 0;
        const hucha = Number.isFinite(netWorth.hucha) ? netWorth.hucha : 0;
        const invertido = Number.isFinite(netWorth.invertido) ? netWorth.invertido : 0;

        return {
            month: this.formatMonthYear(netWorth.mes),
            total,
            saving: hucha,
            investment: invertido,
        };
    }

    private formatMonthYear(date: Date): string {
        return new Intl.DateTimeFormat('es-ES', {
            month: 'short',
            year: 'numeric',
        }).format(date);
    }

}
