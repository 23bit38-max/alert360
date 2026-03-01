/**
 * app.theme.js
 * 
 * Composite theme object for the Alert360 Dashboard.
 * No hardcoded colors allowed; references AppColors only.
 */

import { AppColors } from '@/core/theme/app.colors';
import { AppSizes } from '@/core/theme/app.sizes';
import { AppTypography } from '@/core/theme/app.typography';

export const Theme = {
    colors: AppColors,
    sizes: AppSizes,
    typography: AppTypography,

    // Design Effects
    shadows: {
        sm: '0 1px 3px rgba(0, 0, 0, 0.4)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
        lg: '0 12px 24px -6px rgba(0, 0, 0, 0.6), 0 4px 12px -4px rgba(0, 0, 0, 0.4)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.6)',
    },

    transitions: {
        default: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        slow: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        fast: 'all 0.1s ease-in-out',
    },

    zIndex: {
        hide: -1,
        base: 0,
        navigation: 10,
        menu: 20,
        header: 30,
        sidebar: 40,
        modal: 50,
        toast: 60,
        tooltip: 70,
    }
};

export type AppTheme = typeof Theme;
