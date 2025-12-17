import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import Widget from './Widget';
import { setEventBridgeCleanup } from './utils/cleanup';
import { ThemeProvider, LanguageProvider } from './provider';
import { setupEventBridge } from './initialization/event-bridge';
import { setupIframeStyles } from './initialization/style-manager';
import { isWidgetInitialized, markWidgetInitialized } from './utils';
import { showIframe, createIframe } from './initialization/iframe-manager';

import type { SDK_Config } from './types';
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

function setupIframeContent(iframe: HTMLIFrameElement, config: SDK_Config): void {
  const iframeDoc = iframe.contentWindow?.document;
  if (!iframeDoc) return;

  const { styles, theme = 'dark', language = 'en' } = config;

  const compiledCSS = getCompiledCSS();
  setupIframeStyles(iframeDoc, { theme, styles, compiledCSS });

  if (theme === 'dark') {
    iframeDoc.documentElement.classList.add('dark');
  }

  const cleanup = setupEventBridge({ iframe, iframeDoc, theme });
  setEventBridgeCleanup(cleanup);

  const container = iframeDoc.createElement('div');
  container.id = 'widget-container';
  iframeDoc.body.appendChild(container);

  const root = createRoot(container);
  root.render(
    <StrictMode>
      <LanguageProvider initialLanguage={language}>
        <ThemeProvider config={{ debug: config.debug }} initialTheme={theme}>
          <Widget />
        </ThemeProvider>
      </LanguageProvider>
    </StrictMode>
  );

  showIframe(iframe);
}

export function InitializeWidget(config: SDK_Config): void {
  if (isWidgetInitialized()) {
    console.warn('[KYC_SDK] Widget already initialized. Skipping duplicate initialization.');
    return;
  }

  markWidgetInitialized();

  const { apiKey, tenantId } = config;

  if (!localStorage.getItem('apiKey')) {
    localStorage.setItem('apiKey', apiKey);
  }
  if (!localStorage.getItem('tenantId')) {
    sessionStorage.setItem('tenantId', String(tenantId));
  }

  const iframe = createIframe({
    id: 'widget-iframe',
    onLoad: () => setupIframeContent(iframe, config),
  });

  if (iframe.contentDocument?.readyState === 'complete') {
    setupIframeContent(iframe, config);
  }
}
