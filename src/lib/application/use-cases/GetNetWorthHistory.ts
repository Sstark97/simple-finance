/**
 * @file src/application/use-cases/GetNetWorthHistory.ts
 * @description Caso de uso para obtener todo el historial del patrimonio neto.
 */
import { NetWorth } from '@/lib/domain/models/NetWorth';
import { NetWorthRepository } from '@/lib/application/repositories/NetWorthRepository';

export class GetNetWorthHistory {
  constructor(private netWorthRepository: NetWorthRepository) {}

  async execute(): Promise<NetWorth[]> {
    return this.netWorthRepository.findAll();
  }
}
