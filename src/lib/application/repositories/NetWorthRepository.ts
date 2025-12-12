/**
 * @file src/application/repositories/NetWorthRepository.ts
 * @description Define la interfaz para el repositorio del Patrimonio Neto.
 */
import { NetWorth } from '@/lib/domain/models/NetWorth';

export interface NetWorthRepository {
  /**
   * Obtiene el patrimonio neto para un month específico.
   * @param month La fecha del month.
   * @returns Los datos de patrimonio neto para el month, o null si no se encuentran.
   */
  findByMonth(month: Date): Promise<NetWorth | null>;

  /**
   * Actualiza el patrimonio neto para un month específico. Si el month no existe, lo crea.
   * @param month La fecha del month a actualizar/crear.
   * @param hucha Nuevo valor de "saving".
   * @param invertido Nuevo valor de "investment".
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
