import defaultTranslations from './default-translations.json'

const getObjectValueByPath = <T extends Record<string, any>>(
  obj: T,
  path: string,
) => {
  let shouldSkip = false
  return path.split('.').reduce((o, k) => {
    if (shouldSkip) return o
    if (!(k in o)) {
      console.error(
        'Could not find default translation with key fragment: ',
        k,
        'Searched in object: ',
        o,
      )
      shouldSkip = true
      return k
    }
    return o[k]
  }, obj)
}

export const translateWithFallback = ($t?: (...args: any[]) => string) => {
  return (domainKey: string) => {
    return (
      $t?.(domainKey) ?? getObjectValueByPath(defaultTranslations, domainKey)
    )
  }
}
