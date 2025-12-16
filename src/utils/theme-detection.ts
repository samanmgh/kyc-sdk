type Theme = 'light' | 'dark';
type Language = 'en' | 'de';

/**
 * Watches for theme changes in the host application
 * Monitors: document class changes, data-theme/data-mode attributes
 */
export function watchHostThemeChanges(callback: (theme: Theme) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  let currentTheme: Theme | null = null;

  const detectTheme = (): Theme | null => {
    const docClasses = document.documentElement.classList;
    if (docClasses.contains('dark')) return 'dark';
    if (docClasses.contains('light')) return 'light';

    const dataTheme = document.documentElement.getAttribute('data-theme');
    if (dataTheme === 'dark' || dataTheme === 'light') return dataTheme;

    const dataMode = document.documentElement.getAttribute('data-mode');
    if (dataMode === 'dark' || dataMode === 'light') return dataMode;

    const bodyClasses = document.body?.classList;
    if (bodyClasses?.contains('dark')) return 'dark';
    if (bodyClasses?.contains('light')) return 'light';

    return null;
  };

  currentTheme = detectTheme();

  // Watch for class and attribute changes on document element
  const observer = new MutationObserver(() => {
    const newTheme = detectTheme();
    // Only call callback if theme actually changed
    if (newTheme && newTheme !== currentTheme) {
      currentTheme = newTheme;
      callback(newTheme);
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'data-theme', 'data-mode'],
  });

  if (document.body) {
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }

  return () => {
    observer.disconnect();
  };
}

/**
 * Watches for language changes in the host application
 * Monitors: lang attribute on document element
 */
export function watchHostLanguageChanges(callback: (lang: Language) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  let currentLang: Language | null = null;

  const initialLang = document.documentElement.getAttribute('lang');
  if (initialLang === 'en' || initialLang === 'de') {
    currentLang = initialLang;
  }

  const observer = new MutationObserver(() => {
    const lang = document.documentElement.getAttribute('lang');

    if ((lang === 'en' || lang === 'de') && lang !== currentLang) {
      currentLang = lang;
      callback(lang);
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['lang'],
  });

  return () => {
    observer.disconnect();
  };
}
