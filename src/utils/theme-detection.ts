/**
 * Theme detection utility
 * Detects the current theme from the host application
 */

type Theme = 'light' | 'dark';

/**
 * Detects the current theme from the document
 * Checks multiple sources in order of priority:
 * 1. Document element class (dark/light)
 * 2. Document element data-theme attribute
 * 3. Document element data-mode attribute
 * 4. Body class (dark/light)
 * 5. System preference (prefers-color-scheme)
 */
export function detectHostTheme(): Theme {
  if (typeof window === 'undefined') return 'light';

  // Check document element class
  const docClasses = document.documentElement.classList;
  if (docClasses.contains('dark')) return 'dark';
  if (docClasses.contains('light')) return 'light';

  // Check data-theme attribute (common in Next.js themes)
  const dataTheme = document.documentElement.getAttribute('data-theme');
  if (dataTheme === 'dark') return 'dark';
  if (dataTheme === 'light') return 'light';

  // Check data-mode attribute
  const dataMode = document.documentElement.getAttribute('data-mode');
  if (dataMode === 'dark') return 'dark';
  if (dataMode === 'light') return 'light';

  // Check body class
  const bodyClasses = document.body?.classList;
  if (bodyClasses?.contains('dark')) return 'dark';
  if (bodyClasses?.contains('light')) return 'light';

  // Check color-scheme style property
  const colorScheme = getComputedStyle(document.documentElement).colorScheme;
  if (colorScheme === 'dark') return 'dark';
  if (colorScheme === 'light') return 'light';

  // Fallback to system preference
  return getSystemTheme();
}

/**
 * Gets the system color scheme preference
 */
export function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Watches for theme changes in the host application
 * Monitors: document class changes, data-theme/data-mode attributes, and system preference
 * @param callback - Function to call when theme changes
 * @returns Cleanup function to stop watching
 */
export function watchHostThemeChanges(callback: (theme: Theme) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  let currentTheme = detectHostTheme();

  // Watch for class and attribute changes on document element
  const observer = new MutationObserver(() => {
    const newTheme = detectHostTheme();
    if (newTheme !== currentTheme) {
      currentTheme = newTheme;
      callback(newTheme);
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'data-theme', 'data-mode', 'style'],
  });

  // Also watch body for class changes
  if (document.body) {
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }

  // Watch for system preference changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleMediaChange = () => {
    const newTheme = detectHostTheme();
    if (newTheme !== currentTheme) {
      currentTheme = newTheme;
      callback(newTheme);
    }
  };

  mediaQuery.addEventListener('change', handleMediaChange);

  // Return cleanup function
  return () => {
    observer.disconnect();
    mediaQuery.removeEventListener('change', handleMediaChange);
  };
}
