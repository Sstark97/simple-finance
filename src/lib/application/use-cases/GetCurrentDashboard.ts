/**
 * @file src/application/use-cases/GetCurrentDashboard.ts
 * @description Caso de uso para obtener los datos del dashboard del date actual.
 */
import { Dashboard } from '@/lib/domain/models/Dashboard';
import { DashboardRepository } from '@/lib/application/repositories/DashboardRepository';

export class GetCurrentDashboard {
  constructor(private dashboardRepository: DashboardRepository) {}

  async execute(month: Date): Promise<Dashboard | null> {
    // Aquí podrías añadir lógica para determinar el "date actual"
    // o cualquier otra preparación antes de consultar el repositorio.
    return this.dashboardRepository.findByMonth(month);
  }
}
