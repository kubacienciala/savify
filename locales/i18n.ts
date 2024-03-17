import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import pl from './pl.json';

const resources = {
  en: {
    translation: en,
  },
  pl: {
    translation: pl,
  }
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  lng: 'pl',
  interpolation: {
    escapeValue: false,
  },
  fallbackLng: {
    default: ['pl'],
  },
  fallbackNS: ['translation'],
  debug: false,
});

export default i18n;
