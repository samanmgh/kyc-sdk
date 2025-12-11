import type {
    SDK_Config,
    UserData,
    LanguageChangeResponse,
    ThemeChangeResponse,
    DebugChangeResponse,
    UserDataResponse,
    ConfigResponse,
    InitResponse
} from "./types";
import {InitializeWidget} from './main';

let widgetInstance: KYC_SDK | null = null;

export class KYC_SDK {
    static version = "0.0.1";

    private apiKey: string;
    private tenantId: number;
    private debug: boolean;
    private currentTheme: 'light' | 'dark' = 'light';
    private currentLang: 'en' | 'de' = 'en';
    private currentDir: 'ltr' | 'rtl' = 'ltr';

    constructor(options: SDK_Config) {
        this.apiKey = options.apiKey;
        this.tenantId = options.tenantId;
        this.debug = !!options.debug;

        if (this.debug) this.log("KYC_SDK constructed", options);
    }

    public init(containerSelector?: string): Promise<InitResponse> {
        this.log("KYC_SDK initialized", this.apiKey);

        const config: SDK_Config = {
            apiKey: this.apiKey,
            tenantId: this.tenantId,
            debug: this.debug
        };

        InitializeWidget(config, containerSelector);

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        widgetInstance = this;

        return Promise.resolve({ok: true});
    }

    public changeLanguage(lang: 'en' | 'de'): Promise<LanguageChangeResponse> {
        this.currentLang = lang;
        this.currentDir = 'ltr';

        this.log("Language changed to", lang);

        // Dispatch custom event to notify widget of language change
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('widget-language-change', {
                detail: {lang, dir: this.currentDir}
            }));
        }

        return Promise.resolve({
            success: true,
            lang: this.currentLang,
            dir: this.currentDir
        });
    }

    public changeTheme(theme: 'light' | 'dark'): Promise<ThemeChangeResponse> {
        this.currentTheme = theme;

        this.log("Theme changed to", theme);

        // Dispatch custom event to notify widget of theme change
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('widget-theme-change', {
                detail: {theme}
            }));
        }

        return Promise.resolve({
            success: true,
            theme: this.currentTheme
        });
    }

    public setDebug(enabled: boolean): Promise<DebugChangeResponse> {
        this.debug = enabled;

        this.log("Debug mode", enabled ? "enabled" : "disabled");

        // Dispatch custom event to notify widget of debug change
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('widget-debug-change', {
                detail: {debug: this.debug}
            }));
        }

        return Promise.resolve({
            success: true,
            debug: this.debug
        });
    }

    public sendUserData(userData: UserData): Promise<UserDataResponse> {
        this.log("User data received", userData);

        const userInfo = {
            ...userData,
        };

        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('widget-user-data', {
                detail: {userData: userInfo}
            }));
        }

        return Promise.resolve({
            success: true,
            userData: userInfo
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