import { InitializeWidget } from './main';
import {
  resetWidgetState,
  dispatchStyleChange,
  watchHostThemeChanges,
  watchHostLanguageChanges,
} from './utils';

import type {
  SDK_Config,
  StyleConfig,
  InitResponse,
  ThemeChangeResponse,
  StyleChangeResponse,
  LanguageChangeResponse,
} from './types';

let widgetInstance: KYC_SDK | null = null;

export class KYC_SDK {
  static version = '0.0.1';

  private apiKey: string;
  private tenantId: number;
  private debug: boolean;
  private currentTheme: 'light' | 'dark' = 'dark';
  private currentLang: 'en' | 'de' = 'en';
  private styles: StyleConfig = {};
  private themeWatcherCleanup: (() => void) | null = null;
  private languageWatcherCleanup: (() => void) | null = null;

  constructor(options: SDK_Config) {
    this.apiKey = options.apiKey;
    this.tenantId = options.tenantId;
    this.debug = options.debug ?? false;
    this.currentTheme = options.theme ?? 'dark';
    this.currentLang = options.language ?? 'en';
    this.styles = options.styles ?? {};

    if (this.debug) this.log('KYC_SDK constructed', options);
  }

  public init(containerSelector?: string): Promise<InitResponse> {
    if (this.debug) this.log('KYC_SDK initialized');

    const config: SDK_Config = {
      apiKey: this.apiKey,
      tenantId: this.tenantId,
      debug: this.debug,
      theme: this.currentTheme,
      language: this.currentLang,
      styles: this.styles,
    };

    InitializeWidget(config, containerSelector);

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    widgetInstance = this;

    // Start watchers for reactive updates
    this.startThemeWatcher();
    this.startLanguageWatcher();

    return Promise.resolve({ ok: true });
  }

  private startThemeWatcher(): void {
    this.stopThemeWatcher();

    this.themeWatcherCleanup = watchHostThemeChanges((newTheme) => {
      if (this.debug) this.log('Host theme changed to', newTheme);
      this.changeTheme(newTheme);
    });

    if (this.debug) this.log('Theme watcher started');
  }

  private stopThemeWatcher(): void {
    if (this.themeWatcherCleanup) {
      this.themeWatcherCleanup();
      this.themeWatcherCleanup = null;
    }
  }

  private startLanguageWatcher(): void {
    this.stopLanguageWatcher();

    this.languageWatcherCleanup = watchHostLanguageChanges((newLang) => {
      if (this.debug) this.log('Host language changed to', newLang);
      this.changeLanguage(newLang);
    });

    if (this.debug) this.log('Language watcher started');
  }

  private stopLanguageWatcher(): void {
    if (this.languageWatcherCleanup) {
      this.languageWatcherCleanup();
      this.languageWatcherCleanup = null;
    }
  }

  public destroy(): void {
    this.stopThemeWatcher();
    this.stopLanguageWatcher();

    const inlineContainer = document.getElementById('widget-inline-container');
    if (inlineContainer) {
      inlineContainer.remove();
    }

    const iframe = document.getElementById('widget-iframe');
    if (iframe) {
      iframe.remove();
    }

    resetWidgetState();
    widgetInstance = null;

    if (this.debug) this.log('KYC_SDK destroyed');
  }

  public changeStyles(styles: StyleConfig): Promise<StyleChangeResponse> {
    this.styles = { ...this.styles, ...styles };

    dispatchStyleChange(this.styles);

    return Promise.resolve({
      success: true,
      styles: this.styles,
    });
  }

  public changeLanguage(lang: 'en' | 'de'): Promise<LanguageChangeResponse> {
    // Skip if language is already the same
    if (lang === this.currentLang) {
      return Promise.resolve({
        success: true,
        lang: this.currentLang,
      });
    }

    this.currentLang = lang;

    if (this.debug) this.log('Language changed to', lang);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('widget-language-change', {
          detail: { lang },
        })
      );
    }

    return Promise.resolve({
      success: true,
      lang: this.currentLang,
    });
  }

  public changeTheme(theme: 'light' | 'dark'): Promise<ThemeChangeResponse> {
    // Skip if theme is already the same
    if (theme === this.currentTheme) {
      return Promise.resolve({
        success: true,
        theme: this.currentTheme,
      });
    }

    this.currentTheme = theme;

    if (this.debug) this.log('Theme changed to', theme);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('widget-theme-change', {
          detail: { theme },
        })
      );
    }

    return Promise.resolve({
      success: true,
      theme: this.currentTheme,
    });
  }

  private log(...args: unknown[]): void {
    if (this.debug) {
      console.log('[KYC_SDK]', ...args);
    }
  }
}

export function getWidgetInstance(): KYC_SDK | null {
  return widgetInstance;
}

export default KYC_SDK;
