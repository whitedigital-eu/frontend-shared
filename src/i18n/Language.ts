import { TranslationConfig } from '../types/TranslationTypes'
import ky from 'ky'

export const getUrlLocale = (
  availableLocales: string[],
  noNull = false,
): typeof noNull extends true ? string : string | null => {
  const path = window.location.pathname
  const slug = path.split('/')[1]
  if (availableLocales.includes(slug as (typeof availableLocales)[number])) {
    return slug
  }
  return noNull ? availableLocales[0] : null
}

export const switchLocale = (
  availableLocales: string[],
  locale: (typeof availableLocales)[number],
  goToHomepage = false,
) => {
  if (!availableLocales.includes(locale)) return

  if (goToHomepage) {
    location.href = `/${locale}`
    return
  }

  if (!getUrlLocale(availableLocales)) {
    location.href = `/${locale}${window.location.pathname}`
    return
  }

  location.href = `/${locale}${window.location.pathname.replace(
    `/${getUrlLocale(availableLocales)}`,
    '',
  )}`
}

export const loadTranslations = (
  config: TranslationConfig,
): Promise<TranslationConfig> =>
  ky
    .get(config.localeJsonUrl, { headers: { accept: 'application/ld+json' } })
    .then((res) => res.json())
    .then((data) => {
      config.translations = (
        data as { translations: Record<string, string> }
      ).translations
      return config
    })
