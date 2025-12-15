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

export interface SDK_Config {
    apiKey: string;
    tenantId: number;
    debug?: boolean;           // default: false
    theme?: 'light' | 'dark';  // default: 'dark'
    language?: 'en' | 'de';    // default: 'en'
    styles?: StyleConfig;
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
    theme?: 'light' | 'dark';
    language?: 'en' | 'de';

    // Style configuration
    styles?: StyleConfig;

    // Container selector (if provided, renders inline; otherwise iframe)
    container?: string;
}

export interface LanguageChangeResponse {
    success: boolean;
    lang: 'en' | 'de';
}

export interface ThemeChangeResponse {
    success: boolean;
    theme: 'light' | 'dark';
}

export interface InitResponse {
    ok: boolean;
}

export interface StyleChangeResponse {
    success: boolean;
    styles: StyleConfig;
}
