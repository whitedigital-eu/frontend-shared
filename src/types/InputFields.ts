import { SelectOption } from '../models/FormFields'
import { AxiosInstance } from 'axios'

export type InputField = {
  type: string
  name: string
  label: string
  value: string | string[] | boolean | null
  errors?: string[]
}

export type SimpleSelectConfig = {
  options: SelectOption[]
  create?: boolean
}

export type DataFetchingSelectConfig = {
  minSymbols?: number
  requestUrlGenerator: (searchValue: string) => string
  responseMapFunction: (resource: any) => SelectOption
  options?: SelectOption[]
  create?: boolean
}

export type FileUploadConfig = {
  axiosInstance: AxiosInstance
  hostUrl: string
  setPublic?: boolean
  endpointUrl?: string
  allowDownload?: boolean
  allowDelete?: boolean
  allowEdit?: boolean
  dropzoneOptions?: Dropzone.DropzoneOptions
  readonly?: boolean
  beforeUploadedFileDeletion?:
    | (<T extends string>(fileIri: T) => Promise<any>)
    | null
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
