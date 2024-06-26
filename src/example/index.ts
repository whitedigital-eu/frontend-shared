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
import 'vue3-toastify/dist/index.css'
import './css/app.css'
import { TranslationConfig } from '../types/TranslationTypes'
import { getUrlLocale, loadTranslations } from '../i18n/Language'
import { createPinia } from 'pinia'

dayjs.locale('lv')
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(isToday)
dayjs.extend(isYesterday)

const config: TranslationConfig = {
  translations: {},
  localeJsonUrl: `/api/translations/list/${getUrlLocale(['lv', 'en'], true)}`,
}

const pinia = createPinia()

const app = createApp(App).use(router).use(pinia)
globalComponents(app)

loadTranslations(config)
  .then((translationConfig) => {
    // app.use(translation, translationConfig)
    app.mount('#app')
  })
  .catch((e) => {
    console.warn('Could not load translations!', e)
    // app.use(translation, {
    //   translations: {},
    //   localeJsonUrl: '',
    // })
    app.mount('#app')
  })
