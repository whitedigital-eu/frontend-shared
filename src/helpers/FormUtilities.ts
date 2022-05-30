import { FormData } from '../Types/FormData'
import { SelectOption } from '../Models/SelectOption'

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
