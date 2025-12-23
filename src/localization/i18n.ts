import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import pkg from '@/../package.json'

const constants = {
  appName: pkg.productName,
}

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  resources: {
    en: {
      translation: {
        ...constants,
        titleHomePage: 'Home Page',
        titleCounterPage: 'Counter Page',
      },
    },
    'da-DK': {
      translation: {
        ...constants,
        titleHomePage: 'Hjem Side',
        titleCounterPage: 'Tæller Side',
      },
    },
  },
})
