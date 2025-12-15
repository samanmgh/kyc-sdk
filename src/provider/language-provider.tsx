import { useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Language, Translation } from "../types";
import { LanguageContext } from "./context";
import { getTranslation } from '../utils/translation-fetcher';

interface LanguageProviderProps {
    children: ReactNode;
    initialLanguage?: Language;
}

export function LanguageProvider({
    children,
    initialLanguage = 'en'
}: LanguageProviderProps) {
    const [language, setLanguage] = useState<Language>(initialLanguage);
    const [dictionary, setDictionary] = useState<Translation>(() => getTranslation(initialLanguage));

    const changeLanguage = useCallback((lang: Language) => {
        if (lang === language) return;
        setLanguage(lang);
        setDictionary(getTranslation(lang));
    }, [language]);

    // Listen for external language change events from SDK
    useEffect(() => {
        const handleLanguageChange = (event: Event) => {
            const { lang } = (event as CustomEvent).detail;
            if (lang === 'en' || lang === 'de') {
                changeLanguage(lang);
            }
        };

        window.addEventListener('widget-language-change', handleLanguageChange);
        return () => {
            window.removeEventListener('widget-language-change', handleLanguageChange);
        };
    }, [changeLanguage]);

    return (
        <LanguageContext.Provider value={{
            dictionary,
            language,
            changeLanguage,
        }}>
            {children}
        </LanguageContext.Provider>
    );
}

LanguageProvider.displayName = 'LanguageProvider';
