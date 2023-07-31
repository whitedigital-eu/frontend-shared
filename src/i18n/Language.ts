import { createI18n } from 'vue-i18n'
import axios from 'axios'

export const AVAILABLE_LOCALES = ['en', 'lv'] as const
export const DEFAULT_LOCALE = 'lv'

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

export const setupI18n = async () => {
  const locale = getUrlLocale(true) as string
  const messages = await loadLocale(locale)

  return createI18n({
    legacy: false,
    locale: locale,
    fallbackLocale: 'en',
    messages,
  })
}

export const loadLocale = async (locale: string) => {
  //TODO this could be better
  const response = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/api/translations/list/${locale}`,
    {
      headers: { accept: 'application/ld+json' },
    }
  )

  return {
    [locale]: response.data.translations,
  }
}
