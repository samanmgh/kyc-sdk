import type { StyleConfig } from '../../types';

export interface PlaygroundConfig {
  apiKey: string;
  tenantId: number;
  styles?: StyleConfig;
  language?: 'en' | 'de';
  theme?: 'light' | 'dark';
}
