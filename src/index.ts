import type {
  SDK_Config,
  KYCConfig,
  StyleConfig,
  TranslationConfig,
  UserData,
  LanguageChangeResponse,
  ThemeChangeResponse,
  DebugChangeResponse,
  UserDataResponse,
  ConfigResponse,
  InitResponse,
  CustomCSSChangeResponse,
} from "./types";
import { InitializeWidget } from "./main";
import { resetWidgetState } from "./utils/widget-state";
import { dispatchStyleChange, dispatchCustomCSSChange } from "./utils/style-injection";
import { getDirectionFromLanguage } from "./utils/rtl-detection";
import { detectHostTheme, watchHostThemeChanges } from "./utils/theme-detection";

let widgetInstance: KYC_SDK | null = null;

export interface StyleChangeResponse {
  success: boolean;
  styles: StyleConfig;
}

export class KYC_SDK {
  static version = "0.0.1";

  private apiKey: string;
  private tenantId: number;
  private debug: boolean;
  private currentTheme: "light" | "dark" = "light";
  private currentLang: string = "en";
  private currentDir: "ltr" | "rtl" = "ltr";
  private styles: StyleConfig = {};
  private customCSS: string = "";
  private translationConfig: TranslationConfig = {};
  private themeWatcherCleanup: (() => void) | null = null;
  private autoSyncTheme: boolean = true;

  constructor(options: SDK_Config) {
    this.apiKey = options.apiKey;
    this.tenantId = options.tenantId;
    this.debug = !!options.debug;
    this.styles = options.style || {};
    this.customCSS = options.customCSS || "";
    this.translationConfig = options.translation || {};
    this.currentLang = options.translation?.defaultLanguage || "en";
    this.currentDir = getDirectionFromLanguage(this.currentLang);
    this.autoSyncTheme = options.autoSyncTheme !== false;
    this.currentTheme = detectHostTheme();

    if (this.debug) this.log("KYC_SDK constructed", options, "detected theme:", this.currentTheme);
  }

  public init(containerSelector?: string): Promise<InitResponse> {
    this.log("KYC_SDK initialized", this.apiKey);

    const config: SDK_Config = {
      apiKey: this.apiKey,
      tenantId: this.tenantId,
      debug: this.debug,
      style: this.styles,
      customCSS: this.customCSS,
      translation: this.translationConfig,
    };

    InitializeWidget(config, containerSelector);

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    widgetInstance = this;

    if (this.autoSyncTheme) {
      this.startThemeWatcher();
    }

    return Promise.resolve({ ok: true });
  }

  private startThemeWatcher(): void {
    this.stopThemeWatcher();

    this.themeWatcherCleanup = watchHostThemeChanges(newTheme => {
      this.log("Host theme changed to", newTheme);
      this.changeTheme(newTheme);
    });

    this.log("Theme watcher started");
  }

  private stopThemeWatcher(): void {
    if (this.themeWatcherCleanup) {
      this.themeWatcherCleanup();
      this.themeWatcherCleanup = null;
      this.log("Theme watcher stopped");
    }
  }

  public setAutoSyncTheme(enabled: boolean): void {
    this.autoSyncTheme = enabled;
    if (enabled) {
      this.startThemeWatcher();
    } else {
      this.stopThemeWatcher();
    }
    this.log("Auto sync theme", enabled ? "enabled" : "disabled");
  }

  public destroy(): void {
    this.stopThemeWatcher();

    const inlineContainer = document.getElementById("widget-inline-container");
    if (inlineContainer) {
      inlineContainer.remove();
    }

    const iframe = document.getElementById("widget-iframe");
    if (iframe) {
      iframe.remove();
    }

    resetWidgetState();
    widgetInstance = null;

    this.log("KYC_SDK destroyed");
  }

  public changeStyles(styles: StyleConfig): Promise<StyleChangeResponse> {
    this.styles = { ...this.styles, ...styles };

    dispatchStyleChange(this.styles);

    return Promise.resolve({
      success: true,
      styles: this.styles,
    });
  }

  public changeCustomCSS(css: string): Promise<CustomCSSChangeResponse> {
    this.customCSS = css;

    this.log("Custom CSS changed");

    dispatchCustomCSSChange(css);

    return Promise.resolve({
      success: true,
      css: this.customCSS,
    });
  }

  public changeLanguage(lang: string): Promise<LanguageChangeResponse> {
    this.currentLang = lang;
    this.currentDir = getDirectionFromLanguage(lang);

    this.log("Language changed to", lang, "dir:", this.currentDir);

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("widget-language-change", {
          detail: { lang, dir: this.currentDir },
        })
      );
    }

    return Promise.resolve({
      success: true,
      lang: this.currentLang,
      dir: this.currentDir,
    });
  }

  public changeTheme(theme: "light" | "dark"): Promise<ThemeChangeResponse> {
    this.currentTheme = theme;

    this.log("Theme changed to", theme);

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("widget-theme-change", {
          detail: { theme },
        })
      );
    }

    return Promise.resolve({
      success: true,
      theme: this.currentTheme,
    });
  }

  public setDebug(enabled: boolean): Promise<DebugChangeResponse> {
    this.debug = enabled;

    this.log("Debug mode", enabled ? "enabled" : "disabled");

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("widget-debug-change", {
          detail: { debug: this.debug },
        })
      );
    }

    return Promise.resolve({
      success: true,
      debug: this.debug,
    });
  }

  public sendUserData(userData: UserData): Promise<UserDataResponse> {
    this.log("User data received", userData);

    const userInfo = {
      ...userData,
    };

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("widget-user-data", {
          detail: { userData: userInfo },
        })
      );
    }

    return Promise.resolve({
      success: true,
      userData: userInfo,
    });
  }

  public getConfig(): Promise<ConfigResponse> {
    return Promise.resolve({
      theme: this.currentTheme,
      lang: this.currentLang,
      dir: this.currentDir,
      debug: this.debug,
    });
  }

  private log(...args: unknown[]): void {
    if (this.debug) {
      console.log("[KYC_SDK]", ...args);
    }
  }
}

export function getWidgetInstance(): KYC_SDK | null {
  return widgetInstance;
}

export async function createKYCWidget(config: KYCConfig): Promise<KYC_SDK> {
  const sdk = new KYC_SDK({
    apiKey: config.apiKey,
    tenantId: config.tenantId,
    debug: config.debug,
    style: config.style,
    customCSS: config.customCSS,
    translation: config.translation,
    autoSyncTheme: config.autoSyncTheme,
  });

  await sdk.init(config.container);

  return sdk;
}

export default KYC_SDK;

export type {
  StyleConfig,
  TranslationConfig,
  UserData,
  SDK_Config,
  KYCConfig,
  LanguageChangeResponse,
  ThemeChangeResponse,
  DebugChangeResponse,
  UserDataResponse,
  ConfigResponse,
  InitResponse,
  CustomCSSChangeResponse,
} from "./types";
