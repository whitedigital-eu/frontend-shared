import { getVueCurrentLocale } from '../../helpers/Translations'
import locales from 'flatpickr/dist/l10n'

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
    locale,
    static: true,
  }
}
