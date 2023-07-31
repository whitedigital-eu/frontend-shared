//@ts-ignore
import StartToastifyInstance from 'toastify-js/src/toastify-es'
//@ts-ignore
import dom from '@left4code/tw-starter/dist/js/dom'

const createToastifyConfig = (
  element: Node,
): StartToastifyInstance.Options => ({
  node: element,
  duration: 5000,
  newWindow: true,
  close: true,
  gravity: 'top',
  position: 'right',
  stopOnFocus: true,
})

const createToastifyElement = (innerElement: string, dataTest = '') =>
  dom(`
        <div
          id="failed-notification-content"
          class="toastify-content flex"
          data-test="${dataTest}"
        >${innerElement}</div>
    `)[0]

const getSuccessMessage = (methodName: string) => {
  return (
    {
      post: 'Ieraksts izveidots!',
      put: 'Izmaiņas saglabātas!',
      patch: 'Izmaiņas saglabātas!',
      delete: 'Ieraksts dzēsts!',
    }[methodName] ?? ''
  )
}

export const showGlobalError = (description: string) => {
  const element = createToastifyElement(
    `
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-circle text-danger text-danger wd-error-message"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
        <div class="ml-4 mr-4">
            <div class="font-medium">${description}</div>
        </div>
    `,
    'error-popup',
  )

  StartToastifyInstance(createToastifyConfig(element)).showToast()
}

type ToastifyInstance = {
  showToast(): void
  hideToast(): void
}

let activeSuccessToast: ToastifyInstance | null = null

export const showSuccessMessage = (successMessage: string) => {
  const successElement = createToastifyElement(
    `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide block mx-auto"><path class="text-success" d="M22 11.08V12a10 10 0 11-5.93-9.14"></path><polyline class="text-success" points="22 4 12 14.01 9 11.01"></polyline></svg>
        <div class="ml-4 mr-4">
            <div class="font-medium">${successMessage}</div>
        </div>
    `,
    'success-popup',
  )

  if (activeSuccessToast) activeSuccessToast.hideToast()

  activeSuccessToast = StartToastifyInstance(
    createToastifyConfig(successElement),
  ) as ToastifyInstance

  activeSuccessToast.showToast()
}

export const showWriteRequestSuccess = (methodName: string) => {
  const successMessage = getSuccessMessage(methodName)
  showSuccessMessage(successMessage)
}
