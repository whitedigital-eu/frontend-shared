import { nextTick } from 'vue'
import { showGlobalError } from './FlashMessages'
import { TableConfig } from '../components/Table/createTableConfig'
import { HTTPError } from 'ky'

type NestedObjectWithErrors = Record<
  string,
  { errors: string[] } | Record<string, { errors: string[] }>
>

export const resetFormDataErrors = <T extends NestedObjectWithErrors>(
  formData: T,
) => {
  for (const key in formData) {
    if (!formData[key] || typeof formData[key] !== 'object') {
      continue
    }

    if (Array.isArray(formData[key].errors)) {
      formData[key].errors = []
    } else {
      resetFormDataErrors(
        formData[key as keyof T] as Record<string, { errors: string[] }>,
      )
    }
  }
}

const scrollFirstIncorrectFieldIntoView = (offsetTop = -100) => {
  return nextTick(() => {
    const firstFieldWithError = document.querySelector(
      '[data-has-error="true"]',
    )

    if (firstFieldWithError) {
      window.scrollTo({
        top:
          window.scrollY +
          firstFieldWithError.getBoundingClientRect().top +
          offsetTop,
        behavior: 'smooth',
      })
    }
  })
}

export const setFormDataErrors = async <T extends NestedObjectWithErrors>(
  e: any,
  formData: T,
) => {
  if (!e.response) {
    showGlobalError(e)
    return
  }
  console.info('Handling form error', e)

  const data = (
    !('data' in e.response)
      ? await (e as HTTPError).response.json()
      : e.response?.data
        ? e.response.data
        : null
  ) as
    | { violations?: Array<{ propertyPath: string; message: string }> }
    | undefined

  const headers =
    'headers' in e.request
      ? e.request.headers
      : 'headers' in e.response
        ? e.response.headers
        : 'headers' in e.response.config
          ? e.response.config.headers
          : null
  const locale: string | undefined = headers
    ? headers instanceof Headers
      ? headers.get('accept-language')
      : headers['accept-language']
    : undefined

  if (e.response.status !== 422) return formData
  resetFormDataErrors(formData)

  const errorsWithoutFields: string[] = []

  if (data?.violations) {
    data.violations.forEach((violation) => {
      const field = formData[violation.propertyPath]
      if (field) {
        if (Array.isArray(field.errors)) {
          field.errors.push(violation.message)
        } else {
          if (!locale) {
            console.warn(
              'No language header set for request with entity translations!',
            )
            errorsWithoutFields.push(
              `${violation.propertyPath}: ${violation.message}`,
            )
            return
          }
          ;(field as Record<string, { errors: string[] }>)[locale].errors.push(
            violation.message,
          )
        }
      } else {
        errorsWithoutFields.push(
          `${violation.propertyPath}: ${violation.message}`,
        )
      }
    })
    if (errorsWithoutFields.length) {
      showGlobalError(errorsWithoutFields.join('; '))
    }
  } else if (e.response?.data?.['hydra:description']) {
    showGlobalError(e.response?.data?.['hydra:description'])
  }
}

export const handleTableAjaxError = async (
  error: HTTPError,
  apiErrorHandler?: TableConfig['tableErrorHandler'],
) => {
  const errorData = (await error.response.json()) as { '@context': string }

  if (errorData) {
    if (
      errorData['@context'] === '/api/contexts/Error' &&
      apiErrorHandler &&
      typeof apiErrorHandler === 'function'
    ) {
      apiErrorHandler(error.response.status, errorData)
    } else {
      showGlobalError(error.message)
    }
  }

  Promise.reject(error)
}

export type TableXhrErrRes = {
  body: ReadableStream
  bodyUsed: boolean
  headers: Headers
  ok: boolean
  redirected: boolean
  status: number
  statusText: string
  type: string
  url: string
}
