import { NetWorthRepository } from '@/lib/application/repositories/NetWorthRepository';
import type {NetWorth} from "@/lib/domain/models/NetWorth";
import type {HeritageRaw, HeritageResult} from "@/lib/application/dtos/dtos";

export class GetHeritageUseCase {
  constructor(private netWorthRepository: NetWorthRepository) {}

  async execute(): Promise<HeritageResult> {
    try {
      const history = await this.netWorthRepository.findAll();
      return { heritage: this.getHeritageSortedFrom(history) };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error fetching net worth history:', err);
        return { heritage: [], error };
    }
  }

    private getHeritageSortedFrom = (history: NetWorth[]) => {
        return history.map((netWorth) => netWorth.transformNetWorthToHeritage())
            .toSorted((a, b) => {
                const aDate = new Date(a.month);
                const bDate = new Date(b.month);
                return aDate.getTime() - bDate.getTime();
            });
    }
}
