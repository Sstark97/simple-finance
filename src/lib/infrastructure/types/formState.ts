export type FormState<T = Record<string, string[]>> = {
  errors?: T
  message?: string
  success?: boolean
}

export type TransactionFormState = FormState<{
  fechaCobro?: string[]
  concepto?: string[]
  importe?: string[]
  categoria?: string[]
}>

export type MonthlySettingsFormState = FormState<{
  month?: string[]
  ingresos?: string[]
  ahorro?: string[]
  inversion?: string[]
}>


export type NetWorthFormState = FormState<{
  month?: string[]
  hucha?: string[]
  invertido?: string[]
}>
