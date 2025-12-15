import type { LanguageContextValue } from '@/types';

import { createContext } from 'react';

export const LanguageContext = createContext<LanguageContextValue | null>(null);
LanguageContext.displayName = 'LanguageContext';
