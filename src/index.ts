import type {
  SDK_Config,
  StyleConfig,
  TranslationConfig,
  UserData,
  LanguageChangeResponse,
  ThemeChangeResponse,
  DebugChangeResponse,
  UserDataResponse,
  ConfigResponse,
  InitResponse,
} from "./types";
import { InitializeWidget } from "./main";
import { dispatchStyleChange } from "./utils/style-injection";

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
  private translationConfig: TranslationConfig = {};

  constructor(options: SDK_Config) {
    this.apiKey = options.apiKey;
    this.tenantId = options.tenantId;
    this.debug = !!options.debug;
    this.styles = options.style || {};
    this.translationConfig = options.translation || {};
    this.currentLang = options.translation?.defaultLanguage || "en";

    if (this.debug) this.log("KYC_SDK constructed", options);
  }

  public init(containerSelector?: string): Promise<InitResponse> {
    this.log("KYC_SDK initialized", this.apiKey);

    const config: SDK_Config = {
      apiKey: this.apiKey,
      tenantId: this.tenantId,
      debug: this.debug,
      style: this.styles,
      translation: this.translationConfig,
    };

    InitializeWidget(config, containerSelector);

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    widgetInstance = this;

    return Promise.resolve({ ok: true });
  }

  public changeStyles(styles: StyleConfig): Promise<StyleChangeResponse> {
    this.styles = { ...this.styles, ...styles };

    dispatchStyleChange(this.styles);

    return Promise.resolve({
      success: true,
      styles: this.styles,
    });
  }

  public changeLanguage(lang: string): Promise<LanguageChangeResponse> {
    this.currentLang = lang;
    this.currentDir = "ltr";

    this.log("Language changed to", lang);

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

export default KYC_SDK;

export type {
  StyleConfig,
  TranslationConfig,
  UserData,
  SDK_Config,
  LanguageChangeResponse,
  ThemeChangeResponse,
  DebugChangeResponse,
  UserDataResponse,
  ConfigResponse,
  InitResponse,
} from "./types";
