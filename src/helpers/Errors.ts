import { nextTick } from 'vue'
import { showGlobalError } from './FlashMessages'
import { FormData } from '../Types/FormData'

export const resetFormDataErrors = (formData: FormData) => {
  for (const key in formData) formData[key].errors = []
  return formData
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

export const setFormDataErrors = (e, formData: FormData) => {
  if (!e.response) throw new Error(e)
  if (e.response.status !== 422) return formData
  formData = resetFormDataErrors(formData)
  e.response.data.violations.forEach((violation) => {
    formData[violation.propertyPath].errors?.push(violation.message)
  })

  // scrollFirstIncorrectFieldIntoView()

  return formData
}

export const handleTableAjaxError = (error: any) => {
  const reader = error.body.getReader()

  return new ReadableStream({
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
            showGlobalError(errorData.message)
          }
          push()
        })
      }

      push()
    },
  })
}
