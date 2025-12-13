import { NetWorth } from '@/lib/domain/models/NetWorth';

export interface NetWorthRepository {
  findByMonth(month: Date): Promise<NetWorth | null>;
  saveNetWorth(month: Date, saving: number, investment: number): Promise<NetWorth>;
  findAll(): Promise<NetWorth[]>;
}
