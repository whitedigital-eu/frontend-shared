import { useI18n } from 'vue-i18n'
import defaultTranslations from '../default-translations.json'

export const tabulatorLanguages = {
  lv: {
    pagination: {
      page_size: 'Ierakstu skaits lapā',
      first_title: 'Pirmā lapa',
      last_title: 'Pēdējā lapa',
      prev: 'Iepriekšējais',
      prev_title: 'Iepriekšējā lapa',
      next: 'Nākamais',
      next_title: 'Nākamā lapa',
    },
  },
}

export const dropzoneTranslations = {
  dictDefaultMessage: 'Lai augšupielādētu failus, nometiet tos šeit',
  dictFileTooBig:
    'Faila izmērs ({{filesize}}MB) pārsniedz maksimālo atļauto ({{maxFilesize}}MB)!',
  dictInvalidFileType: 'Šāda tipa failus nedrīkst augšupielādēt.',
  dictResponseError: 'Serveris atbildēja ar kodu {{statusCode}}.',
  dictCancelUpload: 'Atcelt augšupielādi',
  dictUploadCanceled: 'Augšupielāde atcelta.',
  dictCancelUploadConfirmation:
    'Vai tiešām vēlaties atcelt šī faila augšupielādi?',
  dictRemoveFile: 'Noņemt failu',
  dictMaxFilesExceeded: 'Nav atļauts ielādēt vairāk failus.',
  dictFileSizeUnits: { tb: 'TB', gb: 'GB', mb: 'MB', kb: 'KB', b: 'B' },
}

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
  }, obj) as unknown as string
}

/** some projects do not use i18n - fall back to latvian language texts in that case */
export const useI18nWithFallback = () => {
  try {
    return useI18n()
  } catch (e) {
    console.info(
      'This project does not have i18n installed, falling back to default translations',
    )

    return {
      t: (domainKey: string) =>
        getObjectValueByPath(defaultTranslations, domainKey),
    }
  }
}

const FALLBACK_LOCALE = 'lv'
export const getVueCurrentLocale = () => {
  try {
    const { locale } = useI18n()
    return locale.value
  } catch (e) {
    return FALLBACK_LOCALE
  }
}
