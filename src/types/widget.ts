export interface SDK_Config {
    apiKey: string;
    tenantId: number;
    debug?: boolean;
}

export interface UserData {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    userRefId: string;

    [key: string]: unknown;
}

export interface LanguageChangeResponse {
    success: boolean;
    lang: 'en' | 'de';
    dir: 'ltr' | 'rtl';
}

export interface ThemeChangeResponse {
    success: boolean;
    theme: 'light' | 'dark';
}

export interface DebugChangeResponse {
    success: boolean;
    debug: boolean;
}

export interface UserDataResponse {
    success: boolean;
    userData: {
        firstName: string;
        lastName: string;
        userRefId: string;
        email?: string;
        phone?: string;
        [key: string]: unknown;
    };
}

export interface ConfigResponse {
    theme: 'light' | 'dark';
    lang: 'en' | 'de';
    dir: 'ltr' | 'rtl';
    debug: boolean;
}

export interface InitResponse {
    ok: boolean;
}

export interface SDKWidget {
    init(config: SDK_Config): Promise<InitResponse>;

    changeLanguage(lang: 'en' | 'de'): Promise<LanguageChangeResponse>;

    changeTheme(theme: 'light' | 'dark'): Promise<ThemeChangeResponse>;

    setDebug(enabled: boolean): Promise<DebugChangeResponse>;

    sendUserData(userData: UserData): Promise<UserDataResponse>;

    getConfig(): Promise<ConfigResponse>;

    lang?: 'en' | 'de';
    theme: 'light' | 'dark';
    dir: 'ltr' | 'rtl';
}