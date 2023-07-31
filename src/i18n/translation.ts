import { App } from 'vue'
import { TranslationConfig } from '../types/TranslationTypes'
import { useTranslation } from './Stores/useTranslation'
import { MD5 } from 'crypto-js'

export default {
  install: (app: App, config: TranslationConfig) => {
    const trans = useTranslation()
    trans.setTranslations(config.translations)

    // Add the t function to the app's global properties
    app.config.globalProperties.$t = trans.t
  },
}

export const hashText = (
  domain: string,
  text: string,
  context: string
): string => {
  return MD5(domain + text + context).toString()
}
