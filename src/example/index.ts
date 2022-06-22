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

const app = createApp(App).use(router)

globalComponents(app)

app.mount('#app')
