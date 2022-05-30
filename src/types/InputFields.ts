import { SelectOption } from '../models/SelectOption'

export interface InputField {
  type: string
  name: string
  label: string
  value: string | string[] | boolean | null
  errors?: string[]
}

interface SimpleSelectConfig {
  options: SelectOption[]
  create?: boolean
}

interface DataFetchingSelectConfig {
  minSymbols?: number
  requestUrlGenerator: (searchValue: string) => string
  responseMapFunction: (resource: any) => SelectOption
  options?: SelectOption[]
  create?: boolean
}

export { SimpleSelectConfig, DataFetchingSelectConfig }
