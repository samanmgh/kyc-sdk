import type { StyleConfig, TranslationConfig } from '../../types';

export interface PlaygroundConfig {
  apiKey: string;
  tenantId: number;
  style?: StyleConfig;
  translation?: TranslationConfig;
  language?: string;
  theme?: 'light' | 'dark';
  customCSS?: string;
}
