/**
 * @file src/lib/types/formState.ts
 * @description Shared types for server action form states
 */

/**
 * Generic form state type for server actions
 * @template T - Type of error object (defaults to record of string arrays for field errors)
 */
export type FormState<T = Record<string, string[]>> = {
  /** Field-specific validation errors */
  errors?: T
  /** General message (success or error) */
  message?: string
  /** Whether the operation was successful */
  success?: boolean
}

/**
 * TransactionRawData-specific form state with field errors
 */
export type TransactionFormState = FormState<{
  fechaCobro?: string[]
  concepto?: string[]
  importe?: string[]
  categoria?: string[]
}>

/**
 * Monthly settings-specific form state with field errors
 */
export type MonthlySettingsFormState = FormState<{
  month?: string[]
  ingresos?: string[]
  ahorro?: string[]
  inversion?: string[]
}>

/**
 * Net worth-specific form state with field errors
 */
export type NetWorthFormState = FormState<{
  month?: string[]
  hucha?: string[]
  invertido?: string[]
}>
