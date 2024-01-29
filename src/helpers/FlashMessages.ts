//@ts-ignore
import StartToastifyInstance from 'toastify-js/src/toastify-es'
//@ts-ignore
import dom from '@left4code/tw-starter/dist/js/dom'
import { CheckCircle, createElement, XCircle } from "lucide";

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

const createIcon = (icon: typeof CheckCircle, classes: string) => {
  const iconEl = createElement(icon)
  iconEl.setAttribute('height', '24')
  iconEl.setAttribute('width', '24')
  iconEl.setAttribute('class', `lucide block mx-auto ${classes}`)
  iconEl.setAttribute('stroke', 'currentColor')
  iconEl.setAttribute('stroke-width', '2')
  return iconEl
}

export const showGlobalError = (description: string, options?: { iconClasses?: string }) => {
  const element = createToastifyElement(
    `
        ${createIcon(XCircle, options?.iconClasses ?? 'text-danger').outerHTML}
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

export const showSuccessMessage = (successMessage: string, options?: { iconClasses?: string }) => {
  const successElement = createToastifyElement(
      `
        ${createIcon(CheckCircle, options?.iconClasses ?? 'text-success').outerHTML}
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

export const showWriteRequestSuccess = (methodName: string, options?: { iconClasses?: string }) => {
  const successMessage = getSuccessMessage(methodName)
  showSuccessMessage(successMessage, options)
}
