/**
 * @file src/application/use-cases/UpdateMonthlySettings.ts
 * @description Caso de uso para actualizar la configuración mensual del dashboard (income, saving, inversión).
 */
import { Dashboard } from '@/lib/domain/models/Dashboard';
import { DashboardRepository } from '@/lib/application/repositories/DashboardRepository';

export class UpdateMonthlySettings {
  constructor(private dashboardRepository: DashboardRepository) {}

  async execute(
    month: Date,
    ingresos: number,
    ahorro: number,
    inversion: number
  ): Promise<Dashboard> {
    // Aquí podrías añadir lógica de negocio adicional antes de actualizar.
    return this.dashboardRepository.updateMonthlySettings(
      month,
      ingresos,
      ahorro,
      inversion
    );
  }
}
