import { TranslationConfig } from '../types/TranslationTypes'
import axios from 'axios'

export const AVAILABLE_LOCALES = ['en', 'lv'] as const

export const getUrlLocale = (
  noNull = false
): typeof noNull extends true ? string : string | null => {
  const path = window.location.pathname
  const slug = path.split('/')[1]
  if (AVAILABLE_LOCALES.includes(slug as (typeof AVAILABLE_LOCALES)[number])) {
    return slug
  }
  return noNull ? AVAILABLE_LOCALES[0] : null
}

export const switchLocale = (
  locale: (typeof AVAILABLE_LOCALES)[number],
  goToHomepage = false
) => {
  if (!AVAILABLE_LOCALES.includes(locale)) return

  if (goToHomepage) {
    location.href = `/${locale}`
    return
  }

  if (!getUrlLocale()) {
    location.href = `/${locale}${window.location.pathname}`
    return
  }

  location.href = `/${locale}${window.location.pathname.replace(
    `/${getUrlLocale()}`,
    ''
  )}`
}

export const loadTranslations = (
  config: TranslationConfig
): Promise<TranslationConfig> => {
  return axios
    .get(config.localeJsonUrl, {
      headers: { accept: 'application/ld+json' },
    })
    .then((response) => {
      config.translations = response.data.translations
      return config
    })
}
