import { nextTick } from 'vue'
import { showGlobalError } from './FlashMessages'
import { TableConfig } from '../components/Table/createTableConfig'

export const resetFormDataErrors = <
  T extends Record<string, { errors?: string[] }>,
>(
  formData: T,
) => {
  for (const key in formData) formData[key].errors = []
}

const scrollFirstIncorrectFieldIntoView = (offsetTop = -100) => {
  nextTick(() => {
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

export const setFormDataErrors = <
  T extends Record<string, { errors?: string[] }>,
>(
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
        field.errors?.push(violation.message)
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
