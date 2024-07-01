import { FormData } from '../types/FormData'
import { AnyFormField, isSelectField, SelectOption } from '../models/FormFields'
import { deepCloneClassInstance } from './Global'

const notSelectFieldError =
  'Trying to set config options of field which is not a select field!'

export const setSelectOptions = async <T extends FormData>(
  formData: T,
  fieldName: string,
  optionsPromise: Promise<SelectOption[]>,
) => {
  const field = formData[fieldName]
  if (isSelectField(field)) {
    field.setOptions(await optionsPromise)
  } else {
    console.error(notSelectFieldError)
  }
}

export const setSelectOptionsWithFirstAsValue = async <T extends FormData>(
  formData: T,
  fieldName: string,
  optionsPromise: Promise<SelectOption[]>,
) => {
  const field = formData[fieldName]

  if (!isSelectField(field)) {
    console.error(notSelectFieldError)
    return
  }

  const options = await optionsPromise
  field.setOptions(options)
  if (options.length) formData[fieldName].value = options[0].value
}

export const createTranslatableField = <
  T extends AnyFormField,
  AnyLocale extends string,
>(
  field: T,
  options: { availableLocales: Array<AnyLocale> | ReadonlyArray<AnyLocale> },
) => {
  return Object.fromEntries(
    options.availableLocales.map((locale) => [
      locale,
      deepCloneClassInstance(field),
    ]),
  ) as Record<AnyLocale, T>
}
