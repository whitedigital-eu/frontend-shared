import { Ref } from 'vue'
import { AnyResourcePost, IriString, ResourceString } from './Resource'

export interface FormField {
  type: string
  name: string
  label: string
  value: string | string[] | boolean | null
  errors?: string[]
  readonly?: boolean
  config?: any
}

export type FormData = { [key: string]: FormField }

export type FormDataRef = Ref<FormData>

export type FormLayout = string[][]

export type UseFormData = (iri: IriString<ResourceString> | null) => {
  formData: FormDataRef
  formLayout?: FormLayout
}

export type SelectOption = { text: string; value: string }

export type RecordFormData<
  T extends AnyResourcePost,
  keys extends keyof T,
  otherKeys extends string = never
> = Record<keyof Pick<T, keys> | otherKeys, FormField>

export type FormState = 'edited' | 'loading' | 'success' | 'error' | null
