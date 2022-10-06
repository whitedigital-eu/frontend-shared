import { Ref } from 'vue'
import { IriString } from './Resource'
import { FormField } from '../models/FormFields'

export type FormData = Record<string, FormField>

export type FormDataRef = Ref<FormData>

export type FormLayout = string[][]

export type UseFormData = <T extends string>(
  iri: IriString<T, T> | null
) => {
  formData: FormDataRef
  formLayout?: FormLayout
}

export type RecordFormData<
  T,
  keys extends keyof T,
  otherKeys extends string = never
> = Record<keyof Pick<T, keys> | otherKeys, FormField>

export type FormState = 'edited' | 'loading' | 'success' | 'error' | null
