import { FormData } from '../types/FormData'
import { SelectOption } from '../models/SelectOption'
import { isSelectField } from '../models/FormFields'

const notSelectFieldError =
  'Trying to set config options of field which is not a select field!'

export const setSelectOptions = async (
  formData: FormData,
  fieldName: string,
  optionsPromise: Promise<SelectOption[]>
) => {
  const field = formData[fieldName]
  if (isSelectField(field)) {
    field.config.options = await optionsPromise
  } else {
    console.error(notSelectFieldError)
  }
}
export const setSelectOptionsWithFirstAsValue = async (
  formData: FormData,
  fieldName: string,
  optionsPromise: Promise<SelectOption[]>
) => {
  const options = await optionsPromise
  const field = formData[fieldName]

  if (isSelectField(field)) {
    field.config.options = options
  } else {
    console.error(notSelectFieldError)
  }

  if (options.length) formData[fieldName].value = options[0].value
}
