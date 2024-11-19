import {
  DatepickerValue,
  DecimalValue,
  RangeDatepickerValue,
  TextValue,
} from './ValueTypes'
import { DecimalFieldConfig, TextFieldConfig } from '../../models/FormFields'
import { DateFieldConfig, DateRangeFieldConfig } from '../../types/InputFields'

export type DecimalProps = {
  modelValue?: DecimalValue
  label?: string | null
  config?: DecimalFieldConfig
}

export type CheckboxProps = {
  modelValue?: boolean
  readonly?: boolean
  label?: string | null
  readonlyLabelClasses?: string | string[] | Record<string, unknown>
}

export type TextProps = {
  modelValue?: TextValue
  label?: string | null
  config?: TextFieldConfig
}

export type SliderProps = {
  modelValue?: number
  readonly?: boolean
  label?: string | null
}

export type DatepickerProps = {
  modelValue?: DatepickerValue
  label?: string | null
  config?: DateFieldConfig
}

export type RangeDatepickerProps = {
  modelValue?: RangeDatepickerValue
  label?: string | null
  config?: DateRangeFieldConfig
}
