/**
 * @file src/application/repositories/DashboardRepository.ts
 * @description Define la interfaz para el repositorio del Dashboard.
 */
import { Dashboard } from '../../domain/models/Dashboard';

export interface DashboardRepository {
  /**
   * Obtiene los datos del dashboard para un mes específico.
   * @param month La fecha del mes (por ejemplo, 2025-12-01).
   * @returns Los datos del dashboard para el mes, o null si no se encuentran.
   */
  findByMonth(month: Date): Promise<Dashboard | null>;

  /**
   * Actualiza los ingresos, ahorro e inversión para un mes específico en el dashboard.
   * @param month La fecha del mes a actualizar.
   * @param ingresos Nuevos ingresos.
   * @param ahorro Nuevo objetivo de ahorro.
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
