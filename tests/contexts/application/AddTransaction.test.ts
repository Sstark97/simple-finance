import { describe, it, expect, vi } from 'vitest';
import { AddTransaction } from '@/lib/application/use-cases/AddTransaction';
import type { TransactionRepository } from '@/lib/application/repositories/TransactionRepository';
import type { TransactionRawData } from '@/lib/domain/models/TransactionRaw';

describe('AddTransaction', () => {
  it('should add a transaction successfully', async () => {
    const inputTransaction = {
      fechaCobro: '2025-12-08',
      concepto: 'Supermercado',
      importe: 50.5,
      categoria: 'Alimentación',
    };

    const expectedTransaction: TransactionRawData = {
      fechaCobro: new Date('2025-12-08'),
      concepto: 'Supermercado',
      importe: 50.5,
      categoria: 'Alimentación',
    };

    const mockRepository: TransactionRepository = {
      addTransaction: vi.fn().mockResolvedValue(expectedTransaction),
      findAll: vi.fn(),
    };

    const useCase = new AddTransaction(mockRepository);
    const result = await useCase.execute(inputTransaction);

    expect(result).toEqual(expectedTransaction);
    expect(mockRepository.addTransaction).toHaveBeenCalledWith(inputTransaction);
    expect(mockRepository.addTransaction).toHaveBeenCalledTimes(1);
  });

  it('should handle transactions with different categories', async () => {
    const inputTransaction = {
      fechaCobro: '2025-12-08',
      concepto: 'Netflix',
      importe: 15.99,
      categoria: 'Entretenimiento',
    };

    const expectedTransaction: TransactionRawData = {
      fechaCobro: new Date('2025-12-08'),
      concepto: 'Netflix',
      importe: 15.99,
      categoria: 'Entretenimiento',
    };

    const mockRepository: TransactionRepository = {
      addTransaction: vi.fn().mockResolvedValue(expectedTransaction),
      findAll: vi.fn(),
    };

    const useCase = new AddTransaction(mockRepository);
    const result = await useCase.execute(inputTransaction);

    expect(result).toEqual(expectedTransaction);
    expect(result.category).toBe('Entretenimiento');
  });

  it('should propagate repository errors', async () => {
    const inputTransaction = {
      fechaCobro: '2025-12-08',
      concepto: 'Test',
      importe: 100,
      categoria: 'Test',
    };

    const mockError = new Error('Failed to add transaction to sheet');
    const mockRepository: TransactionRepository = {
      addTransaction: vi.fn().mockRejectedValue(mockError),
      findAll: vi.fn(),
    };

    const useCase = new AddTransaction(mockRepository);

    await expect(useCase.execute(inputTransaction)).rejects.toThrow('Failed to add transaction to sheet');
  });
});
