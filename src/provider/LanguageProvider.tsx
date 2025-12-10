import { useState, type ReactNode } from 'react'
import enLang from '../translations/en.json'
import type {Language, Translation} from "../types";
import { LanguageContext } from "./context";

const translations: Record<Language, Translation> = {
  en: enLang,
}

export function LanguageProvider ({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')
  const [dictionary, setDictionary] = useState<Translation>(translations[language])

  const changeLanguage = (lang: Language) => {
    if (translations[lang]) {
      setLanguage(lang)
      setDictionary(translations[lang])
    }
  }

  return (
    <LanguageContext.Provider value={{ dictionary, language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

LanguageProvider.displayName = 'LanguageProvider';