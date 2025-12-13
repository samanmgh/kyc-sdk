import type { Translation, TranslationConfig } from '../types';
import enLang from '../translations/en.json';
import deLang from '../translations/de.json';

// Built-in translations as fallback
const BUILT_IN_TRANSLATIONS: Record<string, Translation> = {
    en: enLang as Translation,
    de: deLang as Translation,
};

export interface FetchTranslationResult {
    translation: Translation;
    source: 'remote' | 'builtin' | 'fallback';
    error?: string;
}

/**
 * Fetches translation for a given language
 * @param language - Language code to fetch
 * @param config - Translation configuration with endpoint info
 * @returns Promise with translation result
 */
export async function fetchTranslation(
    language: string,
    config?: TranslationConfig
): Promise<FetchTranslationResult> {
    const fallbackLang = config?.fallbackLanguage || 'en';

    // If endpoint provided, try remote fetch first
    if (config?.endpoint) {
        try {
            const url = `${config.endpoint}/${language}.json`;
            const response = await fetch(url);

            if (response.ok) {
                const translation = await response.json();
                return { translation, source: 'remote' };
            }

            // If remote fails for requested language, try fallback language remotely
            if (language !== fallbackLang) {
                const fallbackUrl = `${config.endpoint}/${fallbackLang}.json`;
                const fallbackResponse = await fetch(fallbackUrl);
                if (fallbackResponse.ok) {
                    const translation = await fallbackResponse.json();
                    return {
                        translation,
                        source: 'remote',
                        error: `Language "${language}" not found, using fallback "${fallbackLang}"`
                    };
                }
            }
        } catch (error) {
            console.warn(`[KYC SDK] Failed to fetch translations from endpoint:`, error);
            // Fall through to built-in translations
        }
    }

    // Use built-in translations
    if (BUILT_IN_TRANSLATIONS[language]) {
        return { translation: BUILT_IN_TRANSLATIONS[language], source: 'builtin' };
    }

    // Fallback to default language
    if (BUILT_IN_TRANSLATIONS[fallbackLang]) {
        return {
            translation: BUILT_IN_TRANSLATIONS[fallbackLang],
            source: 'fallback',
            error: `Language "${language}" not available, using fallback "${fallbackLang}"`
        };
    }

    // Ultimate fallback to English
    return {
        translation: BUILT_IN_TRANSLATIONS.en,
        source: 'fallback',
        error: 'No translations available, using English defaults'
    };
}

/**
 * Register a built-in translation
 * This allows dynamically adding translations at runtime
 */
export function registerBuiltInTranslation(language: string, translation: Translation): void {
    BUILT_IN_TRANSLATIONS[language] = translation;
}

/**
 * Get list of available built-in languages
 */
export function getAvailableLanguages(): string[] {
    return Object.keys(BUILT_IN_TRANSLATIONS);
}
