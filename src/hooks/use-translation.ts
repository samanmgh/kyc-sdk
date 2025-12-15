import type { Translation } from '@/types';

import { useLanguage } from './index';

export const useTranslation = () => {
  const { dictionary } = useLanguage();

  const t = (key: string, params?: Record<string, string>): string => {
    const translation =
      (key.split('.').reduce((acc: Translation | string, part: string) => {
        if (typeof acc === 'string') return acc;
        return acc[part];
      }, dictionary) as string) || key;

    if (params) {
      return translation.replace(/\{(\w+)}/g, (match, placeholder) => {
        return params[placeholder] !== undefined ? params[placeholder] : match;
      });
    }

    return translation;
  };

  return { t };
};
