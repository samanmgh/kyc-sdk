/**
 * RTL (Right-to-Left) language detection utility
 * Automatically determines text direction based on language code
 */

// ISO 639-1 codes for RTL languages
const RTL_LANGUAGES = new Set([
  'ar',   // Arabic
  'arc',  // Aramaic
  'dv',   // Divehi
  'fa',   // Farsi/Persian
  'ha',   // Hausa
  'he',   // Hebrew
  'iw',   // Hebrew (old code)
  'khw',  // Khowar
  'ks',   // Kashmiri
  'ku',   // Kurdish
  'ps',   // Pashto
  'sd',   // Sindhi
  'ur',   // Urdu
  'yi',   // Yiddish
]);

/**
 * Determines text direction based on language code
 * @param lang - ISO 639-1 language code (e.g., 'en', 'ar', 'he', 'fa-IR')
 * @returns 'rtl' for right-to-left languages, 'ltr' otherwise
 */
export function getDirectionFromLanguage(lang: string): 'ltr' | 'rtl' {
  // Extract base language code (e.g., 'ar-SA' -> 'ar', 'fa-IR' -> 'fa')
  const baseLang = lang.split('-')[0].toLowerCase();
  return RTL_LANGUAGES.has(baseLang) ? 'rtl' : 'ltr';
}

/**
 * Checks if a language code represents an RTL language
 * @param lang - ISO 639-1 language code
 * @returns true if the language is RTL, false otherwise
 */
export function isRTLLanguage(lang: string): boolean {
  return getDirectionFromLanguage(lang) === 'rtl';
}
