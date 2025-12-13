import type { PlaygroundConfig } from '../types';

export const DEFAULT_CONFIG: PlaygroundConfig = {
  apiKey: "test-api-key-12345",
  tenantId: 123,
  style: {
    primary: "oklch(0.55 0.22 264)",
    radius: "0.625rem",
  },
  translation: {
    defaultLanguage: 'en',
    fallbackLanguage: 'en',
  },
  language: 'en',
};

export const INIT_DELAY_MS = 100;

export const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
] as const;

export const PRESET_COLORS = [
  { name: 'Blue', value: 'oklch(0.55 0.22 264)' },
  { name: 'Purple', value: 'oklch(0.55 0.22 300)' },
  { name: 'Green', value: 'oklch(0.55 0.19 145)' },
  { name: 'Orange', value: 'oklch(0.65 0.19 50)' },
  { name: 'Red', value: 'oklch(0.55 0.22 25)' },
  { name: 'Teal', value: 'oklch(0.55 0.15 180)' },
] as const;
