import { useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Language, Translation, TranslationConfig } from "../types";
import { LanguageContext } from "./context";
import { fetchTranslation } from '../utils/translation-fetcher';
import enLang from '../translations/en.json';

interface LanguageProviderProps {
    children: ReactNode;
    translationConfig?: TranslationConfig;
    initialLanguage?: Language;
}

export function LanguageProvider({
    children,
    translationConfig,
    initialLanguage = 'en'
}: LanguageProviderProps) {
    const [language, setLanguage] = useState<Language>(initialLanguage);
    const [dictionary, setDictionary] = useState<Translation>(enLang as Translation);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load initial/default language
    useEffect(() => {
        const loadInitialLanguage = async () => {
            setIsLoading(true);
            const result = await fetchTranslation(initialLanguage, translationConfig);
            setDictionary(result.translation);
            if (result.error) setError(result.error);
            setIsLoading(false);
        };
        loadInitialLanguage();
    }, [initialLanguage, translationConfig]);

    const changeLanguage = useCallback(async (lang: Language) => {
        if (lang === language) return;

        setIsLoading(true);
        setError(null);

        const result = await fetchTranslation(lang, translationConfig);

        setLanguage(lang);
        setDictionary(result.translation);
        if (result.error) setError(result.error);
        setIsLoading(false);
    }, [language, translationConfig]);

    // Listen for external language change events from SDK
    useEffect(() => {
        const handleLanguageChange = async (event: Event) => {
            const { lang } = (event as CustomEvent).detail;
            await changeLanguage(lang);
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
            isLoading,
            error
        }}>
            {children}
        </LanguageContext.Provider>
    );
}

LanguageProvider.displayName = 'LanguageProvider';
