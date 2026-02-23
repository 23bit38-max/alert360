/**
 * app.styles.js
 * 
 * Reusable layout and component styles.
 * Uses theme tokens only (no raw values).
 */

import { Theme } from './app.theme';

export const GlobalStyles = {
    // Page Layouts
    pageContainer: {
        backgroundColor: Theme.colors.background.app,
        minHeight: '100vh',
        padding: Theme.sizes.spacing.lg,
        color: Theme.colors.text.primary,
        backgroundImage: 'radial-gradient(circle at top right, rgba(16, 185, 129, 0.05), transparent 400px), radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.03), transparent 400px)',
    },

    // Components
    card: {
        backgroundColor: Theme.colors.background.surface,
        borderRadius: Theme.sizes.borderRadius.lg,
        padding: Theme.sizes.spacing.lg,
        border: `1px solid ${Theme.colors.background.border}`,
        boxShadow: Theme.shadows.md,
        transition: Theme.transitions.default,
        display: 'flex',
        flexDirection: 'column' as const,
    },

    header: {
        height: Theme.sizes.layout.headerHeight,
        backgroundColor: Theme.colors.background.sidebar,
        borderBottom: `1px solid ${Theme.colors.background.border}`,
        display: 'flex',
        alignItems: 'center',
        padding: `0 ${Theme.sizes.spacing.lg}`,
        position: 'sticky' as const,
        top: 0,
        zIndex: Theme.zIndex.header,
    },

    section: {
        marginBottom: Theme.sizes.spacing.xl,
        gap: Theme.sizes.spacing.md,
        display: 'flex',
        flexDirection: 'column' as const,
    },

    // Grid Templates
    dashboardGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: Theme.sizes.spacing.lg,
    },

    // Button Bases
    button: {
        base: {
            padding: `${Theme.sizes.spacing.sm} ${Theme.sizes.spacing.lg}`,
            borderRadius: Theme.sizes.borderRadius.md,
            fontSize: Theme.sizes.font.sm,
            fontWeight: '600',
            letterSpacing: '0.025em',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: 'none',
            gap: Theme.sizes.spacing.xs,
        },
        primary: {
            backgroundColor: Theme.colors.button.primary,
            color: Theme.colors.text.inverse,
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
        },
        secondary: {
            backgroundColor: Theme.colors.button.secondary,
            color: Theme.colors.text.primary,
            border: `1px solid ${Theme.colors.background.border}`,
        },
        ghost: {
            backgroundColor: 'transparent',
            color: Theme.colors.text.secondary,
        }
    }
};
