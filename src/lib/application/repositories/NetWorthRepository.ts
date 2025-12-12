/**
 * @file src/application/repositories/NetWorthRepository.ts
 * @description Define la interfaz para el repositorio del Patrimonio Neto.
 */
import { NetWorth } from '@/lib/domain/models/NetWorth';

export interface NetWorthRepository {
  /**
   * Obtiene el patrimonio neto para un mes específico.
   * @param month La fecha del mes.
   * @returns Los datos de patrimonio neto para el mes, o null si no se encuentran.
   */
  findByMonth(month: Date): Promise<NetWorth | null>;

  /**
   * Actualiza el patrimonio neto para un mes específico. Si el mes no existe, lo crea.
   * @param month La fecha del mes a actualizar/crear.
   * @param hucha Nuevo valor de "hucha".
   * @param invertido Nuevo valor de "invertido".
   * @returns El patrimonio neto actualizado o creado.
   */
  saveNetWorth(
    month: Date,
    hucha: number,
    invertido: number
  ): Promise<NetWorth>;

  /**
   * Obtiene todo el historial de patrimonio neto.
   * @returns Un array con todo el historial de patrimonio neto.
   */
  findAll(): Promise<NetWorth[]>;
}
