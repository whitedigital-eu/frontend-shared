import { DecimalValue } from './ValueTypes'

export type DecimalProps = {
  modelValue?: DecimalValue
  label?: string | null
  readonly?: boolean
  maxDecimals?: number | null
}

export type CheckboxProps = {
  modelValue?: boolean
  readonly?: boolean
  label?: string | null
}
