import { InitializeWidget } from './main';
import { cleanupEventBridge } from './utils/cleanup';
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

class KYC_SDK {
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

  public init(): Promise<InitResponse> {
    const config: SDK_Config = {
      apiKey: this.apiKey,
      tenantId: this.tenantId,
      debug: this.debug,
      theme: this.currentTheme,
      language: this.currentLang,
      styles: this.styles,
    };

    InitializeWidget(config);

    this.startThemeWatcher();
    this.startLanguageWatcher();

    if (this.debug) this.log('KYC_SDK initialized');

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

    cleanupEventBridge();

    const iframe = document.getElementById('widget-iframe');
    if (iframe) {
      iframe.remove();
    }

    resetWidgetState();

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

export default KYC_SDK;
