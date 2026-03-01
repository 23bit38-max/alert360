import { createContext } from 'react';
import { Theme } from '@/core/theme/app.theme';
import type { AppTheme } from '@/core/theme/app.theme';

export const ThemeContext = createContext<AppTheme>(Theme);
