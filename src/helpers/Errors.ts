import { nextTick } from 'vue'
import { showGlobalError } from './FlashMessages'
import { TableConfig } from '../components/Table/createTableConfig'

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
      resetFormDataErrors((formData as any)[key])
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

export const setFormDataErrors = <T extends NestedObjectWithErrors>(
  e: any,
  formData: T,
) => {
  if (!e.response) {
    showGlobalError(e, { iconClasses: 'text-red-700' })
    return
  }
  console.info('Handling form error', e)
  if (e.response.status !== 422) return formData
  resetFormDataErrors(formData)

  const errorsWithoutFields: string[] = []

  if (e.response?.data.violations) {
    ;(
      e.response.data as {
        violations: Array<{ propertyPath: string; message: string }>
      }
    ).violations.forEach((violation) => {
      const field = formData[violation.propertyPath]
      if (field) {
        if (Array.isArray(field.errors)) {
          field.errors.push(violation.message)
        } else {
          const locale: string | undefined =
            e.response.config.headers['Accept-Language']
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
      showGlobalError(errorsWithoutFields.join('; '), {
        iconClasses: 'text-red-700',
      })
    }
  } else if (e.response?.data?.['hydra:description']) {
    showGlobalError(e.response?.data?.['hydra:description'], {
      iconClasses: 'text-red-700',
    })
  }
}

export const handleTableAjaxError = (
  error: any,
  apiErrorHandler?: TableConfig['tableErrorHandler'],
) => {
  const reader = error.body.getReader()

  new ReadableStream({
    start(controller) {
      function push() {
        reader.read().then(({ done, value }: { done: any; value: any }) => {
          if (done) {
            controller.close()
            return
          }
          controller.enqueue(value)
          const string = new TextDecoder().decode(value)
          const errorData = JSON.parse(string)
          if (errorData) {
            if (
              errorData['@context'] === '/api/contexts/Error' &&
              apiErrorHandler &&
              typeof apiErrorHandler === 'function'
            ) {
              apiErrorHandler(error.status, errorData)
            } else {
              showGlobalError(errorData.message)
            }
          }
          push()
        })
      }

      push()
    },
  })
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
