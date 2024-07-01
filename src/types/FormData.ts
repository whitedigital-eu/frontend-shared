import { AnyFormField } from '../models/FormFields'

export type FormData = Record<
  string,
  AnyFormField | Record<string, AnyFormField>
>

export type FormState = 'edited' | 'loading' | 'success' | 'error' | null
