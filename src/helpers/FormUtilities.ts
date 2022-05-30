import { FormData } from '../types/FormData'
import { SelectOption } from '../models/SelectOption'

export const setSelectOptions = async (
  formData: FormData,
  fieldName: string,
  optionsPromise: Promise<SelectOption[]>
) => {
  formData[fieldName].config.options = await optionsPromise
}
export const setSelectOptionsWithFirstAsValue = async (
  formData: FormData,
  fieldName: string,
  optionsPromise: Promise<SelectOption[]>
) => {
  const options = await optionsPromise
  formData[fieldName].config.options = options
  if (options.length) formData[fieldName].value = options[0].value
}
