/**
 * theme/index.js
 * * Unified entry point for the Alert360 Design System.
 */

import { Theme } from './app.theme';
import { GlobalStyles } from './app.styles';
import { AppSizes } from './app.sizes';
import { AppTypography } from './app.typography';
import { ThemeProvider } from './ThemeProvider';
import { useTheme } from './useTheme';

// Export individual tokens for direct import
export { 
    Theme, 
    GlobalStyles, 
    AppSizes, 
    AppTypography, 
    ThemeProvider, 
    useTheme 
};

// Also export as a combined design system object
export const Alert360DesignSystem = {
    tokens: Theme,
    styles: GlobalStyles,
    metrics: AppSizes,
    type: AppTypography
};