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

interface LabelProps {
  key_label?: string
  value_label?: string
  add_field?: string
  form_label?: string
}
interface MapProps {
  googleApi?: string
  initialLat?: number
  initialLng?: number
}

export { SimpleSelectConfig, DataFetchingSelectConfig, LabelProps, MapProps }
