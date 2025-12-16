import type { Translation } from '@/types';

import enLang from '@/translations/en.json';
import deLang from '@/translations/de.json';

const BUILT_IN_TRANSLATIONS: Record<'en' | 'de', Translation> = {
  en: enLang as Translation,
  de: deLang as Translation,
};

/**
 * Gets translation for a given language
 */
export function getTranslation(language: 'en' | 'de'): Translation {
  return BUILT_IN_TRANSLATIONS[language] || BUILT_IN_TRANSLATIONS.en;
}
