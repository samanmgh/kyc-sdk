declare module '@vero-compliance/kyc-sdk' {
  export interface StyleConfig {
    primary?: string;
    radius?: string;
    background?: string;
    foreground?: string;
    border?: string;
    secondary?: string;
    muted?: string;
    destructive?: string;
  }

  export interface SDK_Config {
    apiKey: string;
    tenantId: number;
    theme?: 'light' | 'dark';
    language?: 'en' | 'de';
    debug?: boolean;
    styles?: StyleConfig;
  }

  export interface InitResponse {
    ok: boolean;
  }

  export interface ThemeChangeResponse {
    success: boolean;
    theme: 'light' | 'dark';
  }

  export interface StyleChangeResponse {
    success: boolean;
    styles: StyleConfig;
  }

  export interface LanguageChangeResponse {
    success: boolean;
    lang: 'en' | 'de';
  }

  export default class KYC_SDK {
    static version: string;

    constructor(options: SDK_Config);

    init(containerSelector?: string): Promise<InitResponse>;
    destroy(): void;
    changeStyles(styles: StyleConfig): Promise<StyleChangeResponse>;
    changeLanguage(lang: 'en' | 'de'): Promise<LanguageChangeResponse>;
    changeTheme(theme: 'light' | 'dark'): Promise<ThemeChangeResponse>;
  }
}
