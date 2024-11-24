export const getCompStyle = (
  el: Element | null | undefined,
  key: 'height' | 'width', // add keys as needed!
) => (el ? parseInt(window.getComputedStyle(el)[key]) : null)

export const observeEl = (obj: Element | undefined, callback: () => void) => {
  if (!obj || obj.nodeType !== 1) return
  if (window.MutationObserver) {
    const mutationObserver = new window.MutationObserver(callback)
    mutationObserver.observe(obj, { childList: true, subtree: true })
    return mutationObserver
  }
}
