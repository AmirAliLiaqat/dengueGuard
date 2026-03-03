import React, { createContext, useState, useContext, useEffect } from 'react';
import { I18nManager } from 'react-native';
import { en } from '../i18n/en';
import { ur } from '../i18n/ur';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const translations = {
    en,
    ur,
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    // Note: Full RTL layout shift usually requires app restart
    // If we want to force RTL for Urdu:
    // I18nManager.forceRTL(lang === 'ur');
  };

  const isRTL = language === 'ur';

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
