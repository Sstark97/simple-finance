/**
 * @file src/application/repositories/DashboardRepository.ts
 * @description Define la interfaz para el repositorio del Dashboard.
 */
import { Dashboard } from '@/lib/domain/models/Dashboard';

export interface DashboardRepository {
  /**
   * Obtiene los datos del dashboard para un date específico.
   * @param month La fecha del date (por ejemplo, 2025-12-01).
   * @returns Los datos del dashboard para el date, o null si no se encuentran.
   */
  findByMonth(month: Date): Promise<Dashboard | null>;

  /**
   * Actualiza los income, saving e inversión para un date específico en el dashboard.
   * @param month La fecha del date a actualizar.
   * @param ingresos Nuevos income.
   * @param ahorro Nuevo objetivo de saving.
   * @param inversion Nuevo objetivo de inversión.
   * @returns El dashboard actualizado.
   */
  updateMonthlySettings(
    month: Date,
    ingresos: number,
    ahorro: number,
    inversion: number
  ): Promise<Dashboard>;
}
