import { FormData } from '../Types/FormData'

export const setSelectOptions = async (
  formData: FormData,
  fieldName: string,
  optionsPromise: Promise<any>
): Promise<any> => {
  formData[fieldName].config.options = await optionsPromise
}
export const setSelectOptionsWithFirstAsValue = async (
  formData: FormData,
  fieldName: string,
  optionsPromise: Promise<any>
): Promise<any> => {
  const options = await optionsPromise
  formData[fieldName].config.options = options
  if (options.length) formData[fieldName].value = options[0].value
}
