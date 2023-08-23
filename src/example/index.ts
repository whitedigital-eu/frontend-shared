import { createApp } from 'vue'
import App from './App.vue'
import dayjs from 'dayjs'
import 'dayjs/locale/lv'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isToday from 'dayjs/plugin/isToday'
import isYesterday from 'dayjs/plugin/isYesterday'
import router from './router'
import globalComponents from './global-components/'

dayjs.locale('lv')
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(isToday)
dayjs.extend(isYesterday)

import './css/app.css'
import translation from '../i18n/translation'
import { TranslationConfig } from '../types/TranslationTypes'
import { getUrlLocale, loadTranslations } from '../i18n/Language'
import { createPinia } from 'pinia'

const config: TranslationConfig = {
  translations: {},
  localeJsonUrl: `/api/translations/list/${getUrlLocale(['lv', 'en'], true)}`,
}

const pinia = createPinia()

loadTranslations(config).then((translationConfig) => {
  const app = createApp(App)
    .use(router)
    .use(pinia)
    .use(translation, translationConfig)
  globalComponents(app)

  app.mount('#app')
})
