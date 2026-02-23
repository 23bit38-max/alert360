import { createContext } from 'react';
import { Theme } from './app.theme';
import type { AppTheme } from './app.theme';

export const ThemeContext = createContext<AppTheme>(Theme);
