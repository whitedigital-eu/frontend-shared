import { SelectOption } from '../models/FormFields'
import { Modify } from '../site-tree/Types/Shared'
import {
  RecursivePartial,
  TomSettings,
} from 'whitedigital-eu-tom-select/src/types'
import { VueTelInputProps } from 'vue-tel-input'
import { DropzoneOptions } from 'dropzone'
import { KyInstance } from 'ky'

export type InputField = {
  type: string
  name: string
  label: string
  value: string | string[] | boolean | null
  errors?: string[]
}

export type TomSettingsTyped<T extends string | number> = Modify<
  RecursivePartial<TomSettings>,
  { options?: SelectOption<string, T>[] }
>

export type SelectConfig<T extends string | number = string | number> =
  Partial<{
    tomSelectSettings: TomSettingsTyped<T>
    readonly: boolean
    allowDelete: boolean
    openInstantly: boolean
    dynamicDropDown: boolean
    dynamicDropDownMargin: number
  }>

export type DataFetchingSelectConfig<
  T extends string | number = string | number,
> = SelectConfig<T> & {
  minSymbols?: number
  loadOptionsFunction: (_searchValue: string) => Promise<SelectOption[]>
}

export type FileUploadConfig = {
  kyInstance: KyInstance
  hostUrl: string
  setPublic?: boolean
  endpointUrl?: string
  allowDownload?: boolean
  allowDelete?: boolean
  allowEdit?: boolean
  dropzoneOptions?: DropzoneOptions
  readonly?: boolean
  beforeUploadedFileDeletion?: ((fileIri: any) => Promise<any>) | null
}

export type SignatureConfig = {
  editMode?: boolean
  readonly?: boolean
}

export type LabelProps = {
  keyLabel: string
  valueLabel: string
  addField: string
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

export type DateFieldConfig = {
  readonly?: boolean
  flatpickrConfig?: Partial<import('flatpickr/dist/types/options').BaseOptions>
}

export type DateRangeFieldConfig = {
  readonly?: boolean
  flatpickrConfig?: Partial<import('flatpickr/dist/types/options').BaseOptions>
}
