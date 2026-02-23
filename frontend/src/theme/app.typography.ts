/**
 * app.typography.js
 * * TACTICAL TYPOGRAPHY SYSTEM
 * Engineered for rapid data scanning and mission-critical legibility.
 */
import type { CSSProperties } from 'react';
import { AppColors } from './app.colors';
import { AppSizes } from './app.sizes';

export const AppTypography: Record<string, CSSProperties> = {
    // Top-Level System Status (e.g., Dashboard titles)
    h1: {
        fontSize: AppSizes.font.xl, // Scaled down for professional density
        fontWeight: '900',
        lineHeight: '1.1',
        color: AppColors.text.primary,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.2em', // High tracking for "Authority" look
        fontFamily: 'Inter, system-ui, sans-serif',
    },

    // Viewport Headers (e.g., Card titles)
    h2: {
        fontSize: AppSizes.font.lg,
        fontWeight: '800',
        lineHeight: '1.2',
        color: AppColors.text.primary,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.1em',
    },

    // Tactical Readouts (The most important part: The actual DATA)
    data: {
        fontSize: AppSizes.font.base,
        fontWeight: '700',
        fontFamily: 'JetBrains Mono, Menlo, monospace', // Monospace for alignment
        color: AppColors.text.primary, // Data usually highlighted in system color
        letterSpacing: '-0.02em',
    },

    // Standard UI Text
    body: {
        fontSize: AppSizes.font.sm, // Smaller default for higher information density
        fontWeight: '400',
        lineHeight: '1.5',
        color: AppColors.text.secondary,
    },

    // Metadata Labels (e.g., "TIMESTAMP", "DEVICE_ID")
    label: {
        fontSize: AppSizes.font.micro,
        fontWeight: '900',
        lineHeight: '1',
        color: AppColors.text.muted,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.25em', // Ultra-wide for clear categorization
        opacity: 0.7,
    },

    // System Logs / Minor Details
    caption: {
        fontSize: AppSizes.font.micro,
        fontFamily: 'monospace',
        fontWeight: '400',
        lineHeight: '1.4',
        color: AppColors.text.muted,
    },

    // Navigation and Action Triggers
    button: {
        fontSize: AppSizes.font.xs,
        fontWeight: '800',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.15em',
        color: AppColors.text.primary,
    }
};