import { InputField } from '../types/InputFields'
import { FormData } from '../types/FormData'
import { resetFormDataErrors } from './Errors'

export const getQueryParam = (key: string) => {
  const searchParams = new URLSearchParams(window.location.search)
  return searchParams.get(key)
}

export const setQueryParam = (key: string, value: string) => {
  const params = new URLSearchParams(window.location.search)
  params.set(key, value)
  const newUrl =
    window.location.protocol +
    '//' +
    window.location.host +
    window.location.pathname +
    '?' +
    params.toString()
  window.history.pushState({ path: newUrl }, '', newUrl)
}

export const fillFormDataFrom = <T extends FormData>(
  formData: T,
  apiResponseData: any
) => {
  for (const key in apiResponseData) {
    if (key in formData) formData[key].value = apiResponseData[key]
  }
  return formData
}

export const prepareFormData = <
  PostType extends Record<string, any>,
  T extends FormData
>(
  formData: T
) => {
  resetFormDataErrors(formData)

  const data: Partial<Record<keyof PostType, null | string | number>> = {}

  for (const key in formData) {
    const item = formData[key]
    data[key] = item.value === '' ? null : item.value
  }

  return data
}

export const clearFormData = (formData: { [key: string]: InputField }) => {
  for (const key in formData) {
    if (Array.isArray(formData[key].value)) formData[key].value = []
    else formData[key].value = ''
  }
}

export const isIriString = (string: string) => {
  const parts = string.split('/')
  return parts[0] === '' && parts[1] === 'api' && parts.length >= 3
}

export const areStringArraysEqual = (a: string[], b: string[]) =>
  a.length === b.length && a.every((value, index) => value === b[index])

export const syntaxHighlight = (object: any) => {
  let json = JSON.stringify(object, null, 4)
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match: any) => {
      let cls = 'number'
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key'
        } else {
          cls = 'string'
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean'
      } else if (/null/.test(match)) {
        cls = 'null'
      }
      return '<span class="' + cls + '">' + match + '</span>'
    }
  )
}

export const camelToSnakeCase = (str: string) => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}
export const snakeToCamelCase = (str: string) =>
  str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace('-', '').replace('_', '')
    )

// source: https://stackoverflow.com/questions/175739/how-can-i-check-if-a-string-is-a-valid-number
export const isNumericString = (maybeNumber: string) => {
  return !isNaN(parseFloat(maybeNumber))
}
