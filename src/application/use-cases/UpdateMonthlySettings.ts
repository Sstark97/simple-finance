/**
 * @file src/application/use-cases/UpdateMonthlySettings.ts
 * @description Caso de uso para actualizar la configuración mensual del dashboard (ingresos, ahorro, inversión).
 */
import { Dashboard } from '../../domain/models/Dashboard';
import { DashboardRepository } from '../repositories/DashboardRepository';

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
