import React, { useEffect } from 'react';
import { Theme } from './app.theme';
import { ThemeContext } from './ThemeContext';


/**
 * ThemeProvider
 * 
 * Injecting theme tokens into CSS variables for use with Tailwind
 * and providing a React context for JS-level access.
 * Optimizes the app for long-monitor control room environments.
 */
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        const root = document.documentElement;

        // Helper to inject nested objects
        const injectVariables = (obj: Record<string, unknown>, prefix: string) => {
            Object.entries(obj).forEach(([key, value]) => {
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    // If it's a status object or similar nested structure
                    const valObj = value as Record<string, unknown>;
                    if ('main' in valObj && 'soft' in valObj) {
                        root.style.setProperty(`--${prefix}-${key}`, String(valObj.main));
                        root.style.setProperty(`--${prefix}-${key}-soft`, String(valObj.soft));
                    } else {
                        injectVariables(valObj, `${prefix}-${key}`);
                    }
                } else {
                    root.style.setProperty(`--${prefix}-${key}`, String(value));
                }
            });
        };

        injectVariables(Theme.colors, 'app');
        injectVariables(Theme.sizes.spacing, 'app-spacing');
        injectVariables(Theme.sizes.borderRadius, 'app-radius');

    }, []);

    return (
        <ThemeContext.Provider value={Theme}>
            {children}
        </ThemeContext.Provider>
    );
};
