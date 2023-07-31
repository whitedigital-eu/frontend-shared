import defaultTranslations from './default-translations.json'

const getObjectValueByPath = <T extends Record<string, any>>(
  obj: T,
  path: string,
) => {
  return path.split('.').reduce((o, k) => o[k], obj)
}

export const translateWithFallback = ($t?: (...args: any[]) => string) => {
  return (domainKey: string) => {
    return (
      $t?.(domainKey) ?? getObjectValueByPath(defaultTranslations, domainKey)
    )
  }
}
