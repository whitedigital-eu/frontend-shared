import { nextTick } from 'vue'
//@ts-ignore
import { showGlobalError } from './FlashMessages'

export const handleError = async (error) => {
  const status = error.response ? error.response.status : error.status
  if (status === 403) {
    // handle lack of permission
  } else if (status === 401) {
    // await loadCurrentUser()
    // router.push({ name: DEFAULT_ROUTES.guest })
  } else if (status === 500) {
  }

  return Promise.reject(error)
}

export const handleAndShowError = async (
  error,
  shouldShowError: (error: any) => boolean
) => {
  if (shouldShowError(error)) getErrors(error.response.data)
  return handleError(error)
}

export const getErrors = (error) => {
  if (error) {
    showGlobalError(error['hydra:description'])
    return true
  }
  return null
}

export const resetFormDataErrors = (formData) => {
  for (const key in formData) formData[key].errors = []
  return formData
}

const scrollFirstIncorrectFieldIntoView = () => {
  nextTick(() => {
    const firstFieldWithError = document.querySelector(
      '[data-has-error="true"]'
    )

    if (firstFieldWithError) {
      window.scrollTo({
        top:
          window.scrollY +
          firstFieldWithError.getBoundingClientRect().top -
          100,
        behavior: 'smooth',
      })
    }
  })
}

export const setFormDataErrors = (e, formData) => {
  if (!e.response) throw new Error(e)
  if (e.response.status !== 422) return formData
  formData = resetFormDataErrors(formData)
  e.response.data.violations.forEach((violation) => {
    formData[violation.propertyPath].errors.push(violation.message)
  })

  // scrollFirstIncorrectFieldIntoView()

  return formData
}

export const handleTableAjaxError = (error: any) => {
  handleError(error)

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
