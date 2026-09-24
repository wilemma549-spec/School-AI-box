import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage } from './types';
import { translations } from './translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const STORAGE_KEY_LANG = 'school_inbox_language_v1';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default is 'en' as requested ("Should be English template as design for uk")
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_LANG);
      if (stored === 'en' || stored === 'zh-HK' || stored === 'zh-CN') {
        return stored;
      }
    } catch (_) {}
    return 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
    } catch (_) {}
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const langDict = translations[language] || translations['en'];
    let text = langDict[key] || translations['en'][key] || key;

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
