import { InputField } from '../types/InputFields'
import { FormData } from '../types/FormData'
import { resetFormDataErrors } from './Errors'
import { AnyFormField } from '../models/FormFields'
import { cloneDeep } from 'lodash'

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

const getFillValue = (apiResponseData: unknown) => {
  const isExpandedResource =
    apiResponseData &&
    typeof apiResponseData === 'object' &&
    '@id' in apiResponseData

  return isExpandedResource ? apiResponseData['@id'] : apiResponseData
}

const fillNonTranslatableFields = <
  T extends FormData,
  U extends Record<string, unknown> | null | undefined,
>(
  formData: T,
  apiResponseData: U,
) => {
  for (const key in apiResponseData) {
    if (!(key in formData) || !('value' in formData[key])) {
      continue
    }

    formData[key].value = getFillValue(apiResponseData[key])
  }
}

const fillTranslatableFields = <
  T extends FormData,
  U extends Record<string, unknown> | null | undefined,
>(
  formData: T,
  locale: string,
  apiResponseData: U,
) => {
  for (const key in apiResponseData) {
    const item = formData[key]
    if (!item || 'value' in item || !(locale in item)) {
      continue
    }

    item[locale].value = getFillValue(apiResponseData[key])
  }
}

export const fillFormDataFrom = <
  T extends FormData,
  U extends Record<string, unknown>,
  V extends U | Record<string, U> | null | undefined,
>(
  formData: T,
  apiResponseData: V,
) => {
  if (
    typeof apiResponseData === 'object' &&
    apiResponseData !== null &&
    !('@id' in apiResponseData)
  ) {
    const data = apiResponseData as Record<string, U>
    let nonTranslatableDataFilled = false
    for (const locale in apiResponseData) {
      if (!nonTranslatableDataFilled) {
        fillNonTranslatableFields(formData, data[locale])
        nonTranslatableDataFilled = true
      }
      fillTranslatableFields(formData, locale, data[locale])
    }
  } else {
    fillNonTranslatableFields(formData, apiResponseData)
  }

  return formData
}

export const prepareFormData = <
  PostType extends Record<string, any>,
  T extends FormData,
>(
  formData: T,
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
    },
  )
}

export const camelToSnakeCase = (str: string) => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}
export const snakeToCamelCase = (str: string) =>
  str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace('-', '').replace('_', ''),
    )

// source: https://stackoverflow.com/questions/175739/how-can-i-check-if-a-string-is-a-valid-number
export const isNumericString = (maybeNumber: string) => {
  return !isNaN(parseFloat(maybeNumber))
}

export const createRandomNumber = (min = 1000, max = 10000) =>
  Math.floor(min + Math.random() * (max - min))

export const defaultReferenceInputTypes = [
  'simple-select',
  'data-fetching-select',
  'file-upload',
  'signature',
]

export const getFormFieldValues = <T extends FormData>(
  formData: T,
  referenceInputTypes = defaultReferenceInputTypes,
  propertiesToExclude: Array<keyof T> = [],
) => {
  const res = {} as {
    [K in keyof T]: T[K] extends { value: infer V } | undefined
      ? V
      : {
          [K2 in keyof T[K]]: T[K][K2] extends { value: infer V2 } ? V2 : never
        }
  }

  for (const key in formData) {
    if (propertiesToExclude.includes(key)) continue
    const field = formData[key]

    if ('value' in field) {
      let val = field.value
      if (
        referenceInputTypes.includes((field as AnyFormField).type) &&
        val === ''
      ) {
        val = null
      }
      res[key as keyof T] = val
    } else {
      res[key as keyof T] = {} as any
      for (const subKey in field) {
        const subField = field[subKey] as AnyFormField
        let val = subField.value
        if (referenceInputTypes.includes(subField.type) && val === '') {
          val = null
        }
        ;(res[key as keyof T] as any)[subKey] = val
      }
    }
  }

  return res
}

export const capitalizeFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1)

export const deepCloneClassInstance = <
  T extends object & { constructor: Function },
>(
  classInstance: T,
) => {
  const clonedObj = cloneDeep(classInstance)
  Object.setPrototypeOf(clonedObj, Object.getPrototypeOf(classInstance))
  return clonedObj as T
}
