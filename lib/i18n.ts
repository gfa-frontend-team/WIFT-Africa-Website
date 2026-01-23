import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'sw', 'fr', 'ar', 'ha', 'zu'],
    ns: ['common'],
    defaultNS: 'common',
    
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'app_lang'
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    }
  });

export default i18n;
