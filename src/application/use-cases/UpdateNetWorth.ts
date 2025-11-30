/**
 * @file src/application/use-cases/UpdateNetWorth.ts
 * @description Caso de uso para actualizar el patrimonio neto para un mes específico.
 */
import { NetWorth } from '../../domain/models/NetWorth';
import { NetWorthRepository } from '../repositories/NetWorthRepository';

export class UpdateNetWorth {
  constructor(private netWorthRepository: NetWorthRepository) {}

  async execute(
    month: Date,
    hucha: number,
    invertido: number
  ): Promise<NetWorth> {
    // Aquí podrías añadir lógica de negocio adicional, como validaciones.
    return this.netWorthRepository.updateNetWorth(month, hucha, invertido);
  }
}
