/**
 * app.sizes.js
 * * TACTICAL UI SYSTEM - PRECISION SCALE
 * Optimized for high-density data visualization and command-center layouts.
 */

export const AppSizes = {
    // 4px Base Atomic System
    spacing: {
        none: '0',
        xs: '4px',    // Atomic unit
        sm: '8px',    // Standard gap
        md: '12px',   // Density-optimized gap (replaces 16px)
        lg: '16px',   // Major separation
        xl: '24px',   // Section breathing room
        xxl: '40px',  // Structural separation
        edge: '20px', // Standard screen padding for tactical alignment
    },

    // Tactical Typography (Small caps and condensed focus)
    font: {
        micro: '9px',   // Secondary labels/Status timestamps
        xs: '11px',     // Primary labels/System logs
        sm: '13px',     // Default UI text
        base: '14px',   // Header text/Input text
        lg: '18px',     // Subsection titles
        xl: '24px',     // Tactical H1
        status: '40px', // Massive data readouts (e.g., speed, count)
    },

    // Technical Iconography (Odd numbers avoided for pixel-perfect centering)
    icon: {
        micro: 12,
        sm: 16,
        md: 20,
        lg: 24,
        xl: 32,
    },

    // Command Center Architecture
    layout: {
        sidebarWidth: '280px',         // Optimal for technical labels
        sidebarCollapsedWidth: '68px', // Ultra-tight for maximized data view
        headerHeight: '56px',          // Shrunk to maximize vertical data real-estate
        navHUDHeight: '64px',          // Mobile Bottom Nav height
        maxContentWidth: '1800px',     // Ultra-wide monitor support
    },

    // Component Integrity
    borderRadius: {
        none: '0px',     // For true "Hard-Edge" military design
        sm: '2px',       // Subtle technical cut
        md: '4px',       // Standard component (Buttons/Inputs)
        lg: '8px',       // Panel corners
        xl: '12px',      // Mobile HUD corners (slightly softer for hand ergonomics)
        full: '9999px',
    },

    // Tactical Depth
    opacity: {
        ghost: 0.05,     // Grid lines
        muted: 0.4,      // Secondary info
        active: 0.8,     // High-priority text
        solid: 1,        // Critical alerts
    }
};