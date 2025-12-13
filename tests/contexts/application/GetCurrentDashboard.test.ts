import { describe, it, expect, vi } from 'vitest';
import { GetCurrentDashboard } from '@/lib/application/use-cases/GetCurrentDashboard';
import type { DashboardRepository } from '@/lib/application/repositories/DashboardRepository';
import type { Dashboard } from '@/lib/domain/models/Dashboard';

describe('GetCurrentDashboard', () => {
  it('should return dashboard data for a given month', async () => {
    const mockDashboard: Dashboard = {
      month: new Date('2025-12-01'),
      income: 3000,
      expenses: 1500,
      saving: 800,
      investment: 700,
      freeMoney: 0,
      state: 'OK',
    };

    const mockRepository: DashboardRepository = {
      findByMonth: vi.fn().mockResolvedValue(mockDashboard),
      updateMonthlySettings: vi.fn(),
    };

    const useCase = new GetCurrentDashboard(mockRepository);
    const result = await useCase.execute(new Date('2025-12-01'));

    expect(result).toEqual(mockDashboard);
    expect(mockRepository.findByMonth).toHaveBeenCalledWith(new Date('2025-12-01'));
    expect(mockRepository.findByMonth).toHaveBeenCalledTimes(1);
  });

  it('should return null when dashboard data is not found', async () => {
    const mockRepository: DashboardRepository = {
      findByMonth: vi.fn().mockResolvedValue(null),
      updateMonthlySettings: vi.fn(),
    };

    const useCase = new GetCurrentDashboard(mockRepository);
    const result = await useCase.execute(new Date('2025-12-01'));

    expect(result).toBeNull();
    expect(mockRepository.findByMonth).toHaveBeenCalledWith(new Date('2025-12-01'));
  });

  it('should propagate repository errors', async () => {
    const mockError = new Error('Repository connection failed');
    const mockRepository: DashboardRepository = {
      findByMonth: vi.fn().mockRejectedValue(mockError),
      updateMonthlySettings: vi.fn(),
    };

    const useCase = new GetCurrentDashboard(mockRepository);

    await expect(useCase.execute(new Date('2025-12-01'))).rejects.toThrow('Repository connection failed');
  });
});
