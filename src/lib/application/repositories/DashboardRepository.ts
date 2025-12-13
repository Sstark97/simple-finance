import { Dashboard } from '@/lib/domain/models/Dashboard';

export interface DashboardRepository {
  findByMonth(month: Date): Promise<Dashboard>;
  updateMonthlySettings(
    month: Date,
    ingresos: number,
    ahorro: number,
    inversion: number
  ): Promise<Dashboard>;
}
