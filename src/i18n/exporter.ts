import { Exporter } from './exporter/Exporter'

const pattern = '../{serviss/resources,public/js,common}/**/*.?(ts|vue)'
const exporter = new Exporter(pattern)
exporter.saveTranslations('../../api/translations.json')
