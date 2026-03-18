import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { en } from '../i18n/en';
import { ur } from '../i18n/ur';
import { de } from '../i18n/de';
import { fr } from '../i18n/fr';
import { zh } from '../i18n/zh';
import { ps } from '../i18n/ps';
import { ja } from '../i18n/ja';
import { ko } from '../i18n/ko';
import { tr } from '../i18n/tr';
import { fa } from '../i18n/fa';
import { hi } from '../i18n/hi';
import { bn } from '../i18n/bn';

const LanguageContext = createContext();

const LANGUAGE_STORAGE_KEY = 'app_language_v1';
const RTL_LANGS = new Set(['ur', 'fa', 'ps']);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const translations = useMemo(
    () => ({
      en,
      ur,
      de,
      fr,
      zh,
      ps,
      ja,
      ko,
      tr,
      fa,
      hi,
      bn,
    }),
    []
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (!mounted) return;
        if (saved && translations[saved]) {
          setLanguage(saved);
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, [translations]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  const changeLanguage = async (lang) => {
    if (!translations[lang]) return;
    setLanguage(lang);
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {
      // ignore
    }
    // Note: Full RTL layout shift usually requires app restart in RN.
    // We only update per-screen layout via `isRTL` for now.
    // If you decide to fully force RTL:
    // I18nManager.forceRTL(RTL_LANGS.has(lang));
  };

  const isRTL = RTL_LANGS.has(language);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
