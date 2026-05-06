import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import de from './locales/de.json';

const LANGUAGE_KEY = '@PureDNS_language';

const resources = {
  en: {translation: en},
  de: {translation: de},
};

const getDeviceLanguage = () => {
  const locales = RNLocalize.getLocales();
  if (locales && locales.length > 0) {
    const lang = locales[0].languageCode;
    if (lang === 'de' || lang === 'en') {
      return lang;
    }
  }
  return 'en';
};

export const initI18n = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    const initialLanguage = savedLanguage || getDeviceLanguage();

    await i18n.use(initReactI18next).init({
      resources,
      lng: initialLanguage,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false, // React already safes from xss
      },
    });
  } catch (error) {
    console.error('Error initializing i18n:', error);
  }
};

export const changeLanguage = async (lng: string) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, lng);
    await i18n.changeLanguage(lng);
  } catch (error) {
    console.error('Error changing language:', error);
  }
};

export default i18n;
