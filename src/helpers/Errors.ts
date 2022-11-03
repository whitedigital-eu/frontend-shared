import { nextTick } from 'vue'
import { showGlobalError } from './FlashMessages'
import { FormData } from '../types/FormData'
import { TableConfig } from '../components/Table/createTableConfig'

export const resetFormDataErrors = <T extends FormData>(formData: T) => {
  for (const key in formData) formData[key].errors = []
}

const scrollFirstIncorrectFieldIntoView = (offsetTop = -100) => {
  nextTick(() => {
    const firstFieldWithError = document.querySelector(
      '[data-has-error="true"]'
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

export const setFormDataErrors = <T extends FormData>(e: any, formData: T) => {
  if (!e.response) throw new Error(e)
  if (e.response.status !== 422) return formData
  resetFormDataErrors(formData)
  ;(
    e.response.data as {
      violations: Array<{ propertyPath: string; message: string }>
    }
  ).violations.forEach((violation) => {
    formData[violation.propertyPath]?.errors?.push(violation.message)
  })

  // scrollFirstIncorrectFieldIntoView()
}

export const handleTableAjaxError = (
  error: any,
  apiErrorHandler?: TableConfig['tableErrorHandler']
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
