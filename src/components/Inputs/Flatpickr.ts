import { getVueCurrentLocale } from '../../helpers/Translations'
import locales from 'flatpickr/dist/l10n'
import flatpickr from 'flatpickr'

export const getDefaultFlatpickrConfig = () => {
  const vueLocale = getVueCurrentLocale()
  const locale =
    vueLocale && vueLocale in locales
      ? locales[vueLocale as keyof typeof locales]
      : 'default'

  return {
    altInput: true,
    dateFormat: 'Z',
    time_24hr: true,
    locale: locale as Partial<flatpickr.CustomLocale>,
    static: true,
  }
}
