import { describe, it, expect, vi } from 'vitest';
import { GetTransactions } from '@/lib/application/use-cases/GetTransactions';
import type { TransactionRepository } from '@/lib/application/repositories/TransactionRepository';
import type { TransactionRawData } from '@/lib/domain/models/TransactionRawData';

describe('GetTransactions', () => {
  it('should return all transactions', async () => {
    const mockTransactions: TransactionRawData[] = [
      {
        fechaCobro: new Date('2025-12-01'),
        concepto: 'Supermercado',
        importe: 50.5,
        categoria: 'Alimentación',
      },
      {
        fechaCobro: new Date('2025-12-05'),
        concepto: 'Netflix',
        importe: 15.99,
        categoria: 'Entretenimiento',
      },
    ];

    const mockRepository: TransactionRepository = {
      findAll: vi.fn().mockResolvedValue(mockTransactions),
      addTransaction: vi.fn(),
    };

    const useCase = new GetTransactions(mockRepository);
    const result = await useCase.execute();

    expect(result).toEqual(mockTransactions);
    expect(result).toHaveLength(2);
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no transactions exist', async () => {
    const mockRepository: TransactionRepository = {
      findAll: vi.fn().mockResolvedValue([]),
      addTransaction: vi.fn(),
    };

    const useCase = new GetTransactions(mockRepository);
    const result = await useCase.execute();

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should propagate repository errors', async () => {
    const mockError = new Error('Failed to fetch transactions');
    const mockRepository: TransactionRepository = {
      findAll: vi.fn().mockRejectedValue(mockError),
      addTransaction: vi.fn(),
    };

    const useCase = new GetTransactions(mockRepository);

    await expect(useCase.execute()).rejects.toThrow('Failed to fetch transactions');
  });
});
