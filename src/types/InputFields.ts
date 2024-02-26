import { SelectOption } from '../models/FormFields'
import { Modify } from '../site-tree/Types/Shared'
import { RecursivePartial, TomSettings } from 'tom-select/src/types'
import { VueTelInputProps } from 'vue-tel-input'

export type InputField = {
  type: string
  name: string
  label: string
  value: string | string[] | boolean | null
  errors?: string[]
}

export type SimpleSelectConfig = Modify<
  RecursivePartial<TomSettings>,
  { options: SelectOption[] }
>

export type DataFetchingSelectConfig = {
  minSymbols?: number
  requestUrlGenerator: (searchValue: string) => string
  responseMapFunction: (resource: any) => SelectOption
  options?: SelectOption[]
  create?: boolean
}

export type LabelProps = {
  keyLabel?: string
  valueLabel?: string
  addField?: string
  formLabel?: string
}

export type MapProps = {
  googleApiKey?: string
  initialLat?: number
  initialLng?: number
}

export type PhoneNumberFieldConfig = {
  vueTelInputProps?: VueTelInputProps
}
