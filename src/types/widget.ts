export interface StyleConfig {
    primary?: string;      // Primary color (OKLCH or hex)
    radius?: string;       // Border radius (e.g., "0.5rem")
    background?: string;   // Background color
    foreground?: string;   // Text color
    border?: string;       // Border color
    secondary?: string;    // Secondary color
    muted?: string;        // Muted color
    destructive?: string;  // Destructive/error color
}

export interface TranslationConfig {
    endpoint?: string;         // Base URL for fetching translations
    defaultLanguage?: string;  // Default language code
    fallbackLanguage?: string; // Fallback if requested language not found
}

export interface SDK_Config {
    apiKey: string;
    tenantId: number;
    debug?: boolean;
    style?: StyleConfig;
    translation?: TranslationConfig;
    customCSS?: string;  // Raw CSS string to inject for custom styling
    autoSyncTheme?: boolean;  // Auto-sync theme with host app changes (default: true)
}

/**
 * Unified configuration interface for the KYC SDK
 * Use with createKYCWidget() initializer function
 */
export interface KYCConfig {
    // Required
    apiKey: string;
    tenantId: number;

    // Optional
    debug?: boolean;

    // Style configuration
    style?: StyleConfig;
    customCSS?: string;  // Raw CSS string to inject

    // Translation configuration
    translation?: TranslationConfig;

    // Container selector (if provided, renders inline; otherwise iframe)
    container?: string;

    // Auto-sync theme with host app changes (default: true)
    autoSyncTheme?: boolean;
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
    lang: string;
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
    lang: string;
    dir: 'ltr' | 'rtl';
    debug: boolean;
}

export interface InitResponse {
    ok: boolean;
}

export interface CustomCSSChangeResponse {
    success: boolean;
    css: string;
}

export interface SDKWidget {
    init(config: SDK_Config): Promise<InitResponse>;

    changeLanguage(lang: string): Promise<LanguageChangeResponse>;

    changeTheme(theme: 'light' | 'dark'): Promise<ThemeChangeResponse>;

    setDebug(enabled: boolean): Promise<DebugChangeResponse>;

    sendUserData(userData: UserData): Promise<UserDataResponse>;

    getConfig(): Promise<ConfigResponse>;

    lang?: string;
    theme: 'light' | 'dark';
    dir: 'ltr' | 'rtl';
}