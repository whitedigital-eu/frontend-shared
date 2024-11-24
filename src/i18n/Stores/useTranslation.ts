import { defineStore } from 'pinia'
import { hashText } from '../translation'

type StateType = {
  debug: boolean
  translations: { [key: string]: string }
}
export const useTranslation = defineStore('wd-translation', {
  state: (): StateType => ({ debug: false, translations: {} }),
  getters: {
    t:
      (state) =>
      (domain: string, text: string, context = '') => {
        if (state.debug) return debugText(domain, text, context)

        const hash = hashText(domain, text, context)
        return state.translations[hash] ?? debugText(domain, text, context)
      },
  },
  actions: {
    setTranslations(translations: { [key: string]: string }) {
      this.translations = translations
    },
  },
})

const noText = (domain: string, text: string, context: string): string => {
  if (context === '') return `${domain}.${text}`
  return `${domain}.${text}.${context}`
}
const debugText = (domain: string, text: string, context: string): string =>
  `\`${noText(domain, text, context)}\``
