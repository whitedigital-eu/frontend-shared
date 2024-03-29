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
  apiResponseData: any,
) => {
  for (const key in apiResponseData) {
    if (key in formData) formData[key].value = apiResponseData[key]
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
]

export const getFormFieldValues = <
  T extends Record<string, { value: any; type: string }>,
>(
  formData: T,
  referenceInputTypes = defaultReferenceInputTypes,
  propertiesToExclude: Array<keyof T> = [],
) => {
  const res = {} as {
    [K in keyof T]: T[K] extends { name: string; value: infer V } ? V : never
  }

  for (const key in formData) {
    if (propertiesToExclude.includes(key)) continue
    let val = formData[key].value as any

    if (referenceInputTypes.includes(formData[key].type) && val === '') {
      val = null
    }

    res[key as keyof T] = val
  }

  return res
}

export const isMobile = () => {
  /* eslint-disable */
  let check = false;
  (function (a) {
    if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
            a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            a.substr(0, 4)
        )
    ) {
      check = true;
    }
    //@ts-ignore
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}