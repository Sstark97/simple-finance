import { Dashboard } from '@/lib/domain/models/Dashboard';
import { DashboardRepository } from '@/lib/application/repositories/DashboardRepository';
import {handleGoogleSheetsError} from "@/lib/utils/errorHandler";
import {DashBoardResult} from "@/lib/application/dtos/dtos";

export class GetCurrentDashboard {
  constructor(private dashboardRepository: DashboardRepository) {}

  async execute(month: Date): Promise<DashBoardResult> {
    try {
      const dashboard = await this.dashboardRepository.findByMonth(month);

      if (dashboard.isEmpty()) {
        const errorMessage = `No se encontraron datos del dashboard para el mes seleccionado.`;
        const showMessage = true;
        return { dashboard, error: errorMessage, showMessage };
      }
        return { dashboard: dashboard, showMessage: false}
    } catch (error: unknown) {
      const {message} = handleGoogleSheetsError(error);
      const errorMessage = message;
      const showMessage = true;
        return { dashboard: Dashboard.empty(), error: errorMessage, showMessage}
    }
  }
}
