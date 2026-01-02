"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import enTranslations from "@/data/translations/en.json";
import esTranslations from "@/data/translations/es.json";

type Language = "en" | "es";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<string, Record<string, any>> = {
  en: enTranslations,
  es: esTranslations,
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load language from localStorage
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("language") as Language;
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "es")) {
        setLanguageState(savedLanguage);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
    }
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split(".");
    let value: any = translations[language];
    
    // Try to get value from current language
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    
    // If not found, fallback to English
    if (value === undefined) {
      value = translations["en"];
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) return key;
      }
    }
    
    let result = typeof value === "string" ? value : key;
    
    // Replace parameters in the string
    if (params) {
      Object.keys(params).forEach((paramKey) => {
        const paramValue = params[paramKey];
        result = result.replace(new RegExp(`{{${paramKey}}}`, "g"), String(paramValue));
      });
    }
    
    return result;
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

