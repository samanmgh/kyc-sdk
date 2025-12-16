import themeStyles from './styles/theme.scss?raw';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import Widget from './Widget';
import { ThemeProvider, LanguageProvider } from './provider';
import {
  injectFallbackCSS,
  injectCustomStyles,
  isWidgetInitialized,
  markWidgetInitialized,
} from './utils';

import type { SDK_Config, StyleConfig } from './types';
import './index.css';

declare global {
  interface Window {
    __KYC_SDK_CSS__?: string;
  }
}

function getCompiledCSS(): string {
  if (typeof window !== 'undefined' && window.__KYC_SDK_CSS__) {
    return window.__KYC_SDK_CSS__;
  }
  return '';
}

function generateFallbackCSS(theme: 'light' | 'dark'): string {
  // Generate CSS custom properties for the theme
  const lightTheme = `
    :host, :root {
      --background: oklch(100% 0 0);
      --foreground: oklch(20% 0 0);
      --primary: oklch(55% 0.22 264);
      --primary-foreground: oklch(100% 0 0);
      --secondary: oklch(50% 0.02 264);
      --secondary-foreground: oklch(100% 0 0);
      --muted: oklch(97% 0 0);
      --muted-foreground: oklch(50% 0.02 264);
      --destructive: oklch(57.7% 0.245 27.325);
      --destructive-foreground: oklch(100% 0 0);
      --border: oklch(90% 0 0);
      --ring: oklch(55% 0.22 264);
      --radius: 0.625rem;
    }
  `;

  const darkTheme = `
    :host, :root {
      --background: oklch(20% 0 0);
      --foreground: oklch(97% 0 0);
      --primary: oklch(55% 0.22 264);
      --primary-foreground: oklch(100% 0 0);
      --secondary: oklch(30% 0 0);
      --secondary-foreground: oklch(97% 0 0);
      --muted: oklch(30% 0 0);
      --muted-foreground: oklch(65% 0.02 264);
      --destructive: oklch(57.7% 0.245 27.325);
      --destructive-foreground: oklch(97% 0 0);
      --border: oklch(32% 0 0);
      --ring: oklch(55% 0.22 264);
      --radius: 0.625rem;
    }
  `;

  return theme === 'dark' ? darkTheme : lightTheme;
}

function generateCustomStylesCSS(styles: StyleConfig): string {
  const cssVars: string[] = [];

  if (styles.primary) cssVars.push(`--primary: ${styles.primary};`);
  if (styles.radius) cssVars.push(`--radius: ${styles.radius};`);
  if (styles.background) cssVars.push(`--background: ${styles.background};`);
  if (styles.foreground) cssVars.push(`--foreground: ${styles.foreground};`);
  if (styles.border) cssVars.push(`--border: ${styles.border};`);
  if (styles.secondary) cssVars.push(`--secondary: ${styles.secondary};`);
  if (styles.muted) cssVars.push(`--muted: ${styles.muted};`);
  if (styles.destructive) cssVars.push(`--destructive: ${styles.destructive};`);

  if (cssVars.length === 0) return '';

  return `:host, :root { ${cssVars.join(' ')} }`;
}

function copyStylesToIframe(iframeDoc: Document): void {
  const parentStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
  parentStyles.forEach((style) => {
    if (style.tagName === 'STYLE') {
      const newStyle = iframeDoc.createElement('style');
      newStyle.textContent = style.textContent;
      iframeDoc.head.appendChild(newStyle);
    } else if (style.tagName === 'LINK') {
      const link = style as HTMLLinkElement;
      const newLink = iframeDoc.createElement('link');
      newLink.rel = 'stylesheet';
      newLink.href = link.href;
      iframeDoc.head.appendChild(newLink);
    }
  });
}

export function InitializeWidget(config: SDK_Config, containerSelector?: string) {
  if (isWidgetInitialized()) {
    console.warn('[KYC_SDK] Widget already initialized. Skipping duplicate initialization.');
    return;
  }

  markWidgetInitialized();

  const { apiKey, tenantId, styles, theme, language } = config;

  if (!localStorage.getItem('apiKey')) {
    localStorage.setItem('apiKey', apiKey);
  }

  if (!localStorage.getItem('tenantId')) {
    sessionStorage.setItem('tenantId', String(tenantId));
  }

  const targetContainer = containerSelector ? document.querySelector(containerSelector) : null;

  if (containerSelector && !targetContainer) {
    console.error(
      `[KYC_SDK] Container element "${containerSelector}" not found. Make sure the element exists in the DOM before initializing the SDK.`
    );
    throw new Error(`Container element "${containerSelector}" not found`);
  }

  if (targetContainer) {
    // Create shadow host
    const shadowHost = document.createElement('div');
    shadowHost.id = 'widget-shadow-host';
    shadowHost.style.width = '100%';
    shadowHost.style.height = '100%';
    shadowHost.style.minHeight = '600px';

    // Attach shadow DOM for style isolation
    const shadowRoot = shadowHost.attachShadow({ mode: 'open' });

    // Create container inside shadow DOM
    const inlineContainer = document.createElement('div');
    inlineContainer.id = 'widget-inline-container';
    inlineContainer.style.width = '100%';
    inlineContainer.style.height = '100%';
    inlineContainer.style.minHeight = '600px';

    // Inject compiled CSS into shadow DOM
    const compiledCSS = getCompiledCSS();
    if (compiledCSS) {
      const mainStyle = document.createElement('style');
      mainStyle.id = 'kyc-sdk-main-styles';
      mainStyle.textContent = compiledCSS;
      shadowRoot.appendChild(mainStyle);
    }

    // Inject theme styles into shadow DOM
    const themeStyle = document.createElement('style');
    themeStyle.id = 'kyc-sdk-theme-styles';
    themeStyle.textContent = themeStyles;
    shadowRoot.appendChild(themeStyle);

    // Inject fallback CSS for theme
    const initialTheme = theme || 'dark';
    const fallbackStyle = document.createElement('style');
    fallbackStyle.id = 'kyc-sdk-fallback-styles';
    fallbackStyle.textContent = generateFallbackCSS(initialTheme);
    shadowRoot.appendChild(fallbackStyle);

    // Apply dark class to container if needed
    if (initialTheme === 'dark') {
      inlineContainer.classList.add('dark');
    }

    if (styles) {
      const customStyle = document.createElement('style');
      customStyle.id = 'kyc-sdk-custom-styles';
      customStyle.textContent = generateCustomStylesCSS(styles);
      shadowRoot.appendChild(customStyle);
    }

    shadowRoot.appendChild(inlineContainer);
    targetContainer.appendChild(shadowHost);

    const handleStyleChange = (event: Event) => {
      const { styles: newStyles } = (event as CustomEvent).detail;
      const customStyle = shadowRoot.getElementById('kyc-sdk-custom-styles') as HTMLStyleElement;
      if (customStyle) {
        customStyle.textContent = generateCustomStylesCSS(newStyles);
      } else {
        const newCustomStyle = document.createElement('style');
        newCustomStyle.id = 'kyc-sdk-custom-styles';
        newCustomStyle.textContent = generateCustomStylesCSS(newStyles);
        shadowRoot.appendChild(newCustomStyle);
      }
    };
    window.addEventListener('widget-style-change', handleStyleChange);

    const handleThemeChange = (event: Event) => {
      const { theme: newTheme } = (event as CustomEvent).detail;
      const fallbackStyle = shadowRoot.getElementById(
        'kyc-sdk-fallback-styles'
      ) as HTMLStyleElement;
      if (fallbackStyle) {
        fallbackStyle.textContent = generateFallbackCSS(newTheme);
      }

      if (newTheme === 'dark') {
        inlineContainer.classList.add('dark');
      } else {
        inlineContainer.classList.remove('dark');
      }
    };
    window.addEventListener('widget-theme-change', handleThemeChange);

    const root = createRoot(inlineContainer);
    root.render(
      <StrictMode>
        <LanguageProvider initialLanguage={language || 'en'}>
          <ThemeProvider config={{ debug: config.debug }} initialTheme={theme || 'dark'}>
            <Widget />
          </ThemeProvider>
        </LanguageProvider>
      </StrictMode>
    );
    return;
  }

  let iframe = document.getElementById('widget-iframe') as HTMLIFrameElement;
  const initialTheme = theme || 'dark';

  const setupIframe = () => {
    const iframeDoc = iframe.contentWindow?.document;
    if (!iframeDoc) return;

    if (!localStorage.getItem('apiKey')) {
      localStorage.setItem('apiKey', apiKey);
    }

    if (localStorage.getItem('tenantId')) {
      sessionStorage.setItem('tenantId', String(tenantId));
    }

    const compiledCSS = getCompiledCSS();
    if (compiledCSS) {
      const mainStyle = iframeDoc.createElement('style');
      mainStyle.id = 'kyc-sdk-main-styles';
      mainStyle.textContent = compiledCSS;
      iframeDoc.head.appendChild(mainStyle);
    } else {
      copyStylesToIframe(iframeDoc);
    }

    const themeStyle = iframeDoc.createElement('style');
    themeStyle.textContent = themeStyles;
    iframeDoc.head.appendChild(themeStyle);

    injectFallbackCSS(initialTheme, iframeDoc);

    if (initialTheme === 'dark') {
      iframeDoc.documentElement.classList.add('dark');
    }

    if (styles) {
      injectCustomStyles(styles, iframeDoc);
    }

    const BRIDGED_EVENTS = ['widget-theme-change', 'widget-language-change', 'widget-style-change'];

    BRIDGED_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, (event: Event) => {
        iframe.contentWindow?.dispatchEvent(
          new CustomEvent(eventName, { detail: (event as CustomEvent).detail })
        );
      });
    });

    const handleStyleChange = (event: Event) => {
      const { styles: newStyles } = (event as CustomEvent).detail;
      injectCustomStyles(newStyles, iframeDoc);
    };
    iframe.contentWindow?.addEventListener('widget-style-change', handleStyleChange);

    const handleThemeChange = (event: Event) => {
      const { theme: newTheme } = (event as CustomEvent).detail;
      injectFallbackCSS(newTheme, iframeDoc);

      if (newTheme === 'dark') {
        iframeDoc.documentElement.classList.add('dark');
      } else {
        iframeDoc.documentElement.classList.remove('dark');
      }
    };
    iframe.contentWindow?.addEventListener('widget-theme-change', handleThemeChange);

    const container = iframeDoc.createElement('div');
    container.id = 'widget-container';
    iframeDoc.body.appendChild(container);

    const root = createRoot(container);
    root.render(
      <StrictMode>
        <LanguageProvider initialLanguage={language || 'en'}>
          <ThemeProvider config={{ debug: config.debug }} initialTheme={initialTheme}>
            <Widget />
          </ThemeProvider>
        </LanguageProvider>
      </StrictMode>
    );

    setTimeout(() => {
      iframe.style.display = 'flex';
      iframe.style.justifyContent = 'center';
      iframe.style.alignItems = 'center';
      iframe.style.width = '100vw';
      iframe.style.height = '100vh';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.right = 'auto';
      iframe.style.bottom = 'auto';
    }, 100);
  };

  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = 'widget-iframe';
    iframe.src = 'about:blank';
    iframe.style.touchAction = 'none';
    iframe.style.position = 'fixed';
    iframe.style.display = 'none';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.border = 'none';
    iframe.style.zIndex = '2000';
    iframe.style.overflow = 'hidden';
    iframe.style.background = 'none transparent';
    iframe.style.backgroundColor = 'transparent';
    iframe.style.colorScheme = 'none';
    iframe.style.transition = 'all 0.3s ease-in-out';
    iframe.style.willChange = 'width, height, transform';
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('allowtransparency', 'true');
    iframe.setAttribute('allowfullscreen', 'true');

    iframe.addEventListener('load', setupIframe);
    document.body.appendChild(iframe);
  } else {
    if (iframe.contentDocument?.readyState === 'complete') {
      setupIframe();
    } else {
      iframe.addEventListener('load', setupIframe);
    }
  }
}
