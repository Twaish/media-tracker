import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  resources: {
    en: {
      translation: {
        titleHomePage: 'Home Page',
        titleCounterPage: 'Counter Page',
      },
    },
    'da-DK': {
      translation: {
        titleHomePage: 'Hjem Side',
        titleCounterPage: 'Tæller Side',
      },
    },
  },
})
