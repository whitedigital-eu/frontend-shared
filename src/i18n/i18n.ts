import {getUrlLocale, loadLocale} from "./Language";

export const setupI18n = async (i18nConfig: i18nConfig) => {
    const locale = getUrlLocale(true) as string
    const messages = await loadLocale(locale)

}