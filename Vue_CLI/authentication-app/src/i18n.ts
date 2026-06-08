import { createI18n } from 'vue-i18n'

import uzLat from '@/locales/uzLat.json'
import uzCyrl from '@/locales/uzCyrl.json'
import ru from '@/locales/ru.json'

const messages = {
  uzLat,
  uzCyrl,
  ru,
}

// Use a broad messages type so locales with slightly different keys don't cause
// a type incompatibility error during build. Individual locale keys can
// differ but we still want the project to compile.
export type MessageSchema = Record<string, any>

// Create the i18n instance without strict per-locale typing to avoid
// "Two different types with this name exist" errors when some locales are
// missing a few keys.
const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('lang') || 'uzLat',
  fallbackLocale: 'uzLat',
  messages,
});


export default i18n
