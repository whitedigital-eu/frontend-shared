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

export type TomSettingsTyped<T extends string> = Modify<
  RecursivePartial<TomSettings>,
  { options?: SelectOption<string, T>[] }
>

export type SelectConfig<T extends string = string> = Partial<{
  tomSelectSettings: TomSettingsTyped<T>
  readonly: boolean
  create: boolean
  allowDelete: boolean
}>

export type DataFetchingSelectConfig<T extends string = string> =
  SelectConfig<T> & {
    minSymbols?: number
    requestUrlGenerator: (searchValue: string) => string
    responseMapFunction: (resource: any) => SelectOption
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
  vueTelInputProps?: Partial<VueTelInputProps>
}

export type DateFieldConfig = { readonly?: boolean }
