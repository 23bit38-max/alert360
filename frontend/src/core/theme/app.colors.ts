/**
 * app.colors.ts
 *
 * Alert360 Design System
 * Theme: Midnight Indigo-Blue (NO purple tones)
 * Professional, authoritative, emergency-grade dashboard
 */

export const AppColors = {
  /* =========================
     BASE BACKGROUNDS (PREMIUM DARK)
     ========================= */
  background: {
    app: "#0B0F1A",        // Midnight Charcoal
    sidebar: "#070B14",    // Deeper Midnight
    surface: "rgba(15, 23, 42, 0.9)", // High-opacity surface for legibility
    surfaceAlt: "rgba(15, 23, 42, 0.95)", // More opaque for active states
    elevated: "rgba(15, 23, 42, 0.98)",   // Near-solid for modals/popovers
    border: "rgba(255, 255, 255, 0.12)",
    overlay: "rgba(11, 15, 26, 0.9)",
  },

  /* =========================
     TEXT SYSTEM
     ========================= */
  text: {
    primary: "#F8FAFC",
    secondary: "#CBD5E1",
    muted: "#94A3B8",
    disabled: "#475569",
    inverse: "#0B0F1A",
  },

  /* =========================
     ACCENTS (ENTERPRISE GREEN & BLUE)
     ========================= */
  accent: {
    primary: "#10B981",    // Enterprise Green
    primaryHover: "#34D399",
    primaryActive: "#059669",
    secondary: "#3B82F6",  // Cool Blue
    secondaryHover: "#60A5FA",
    soft: "rgba(16, 185, 129, 0.12)",
    focusRing: "rgba(16, 185, 129, 0.45)",
  },

  /* =========================
     STATUS / SEVERITY (MUTED)
     ========================= */
  status: {
    critical: {
      main: "#EF4444",
      soft: "rgba(239, 68, 68, 0.08)",
      outline: "rgba(239, 68, 68, 0.2)",
    },
    warning: {
      main: "#F59E0B",
      soft: "rgba(245, 158, 11, 0.08)",
      outline: "rgba(245, 158, 11, 0.2)",
    },
    safe: {
      main: "#10B981",
      soft: "rgba(16, 185, 129, 0.08)",
      outline: "rgba(16, 185, 129, 0.2)",
    },
    info: {
      main: "#3B82F6",
      soft: "rgba(59, 130, 246, 0.08)",
      outline: "rgba(59, 130, 246, 0.2)",
    },
  },

  /* =========================
     BUTTONS & INTERACTION
     ========================= */
  button: {
    primary: "#10B981",
    primaryHover: "#059669",
    primaryActive: "#047857",

    secondary: "rgba(255, 255, 255, 0.08)",
    secondaryHover: "rgba(255, 255, 255, 0.12)",

    ghost: "transparent",
    ghostHover: "rgba(255, 255, 255, 0.06)",

    danger: "#EF4444",
    dangerHover: "#DC2626",

    disabled: "rgba(255, 255, 255, 0.04)",
  },

  /* =========================
     MAP & LIVE CAMERA
     ========================= */
  map: {
    accident: "#EF4444",
    risk: "#F59E0B",
    normal: "#10B981",
    route: "#3B82F6",
    cameraBorder: "rgba(255, 255, 255, 0.1)",
    overlay: "rgba(16, 185, 129, 0.1)",
    zoneHighlight: "rgba(16, 185, 129, 0.05)",
  },

  /* =========================
     CHARTS & DATA VISUALS
     ========================= */
  chart: {
    primary: "#10B981",
    secondary: "#3B82F6",
    alert: "#EF4444",
    warning: "#F59E0B",
    success: "#10B981",
    grid: "rgba(255, 255, 255, 0.04)",
    axis: "#64748B",
    muted: "rgba(255, 255, 255, 0.05)",
  },

  /* =========================
     NOTIFICATION CHANNELS
     ========================= */
  notification: {
    email: "#3B82F6",    // Blue
    sms: "#F59E0B",      // Amber
    whatsapp: "#10B981", // Green
    push: "#6366F1",     // Indigo
    slack: "#4A154B",    // Slack Purple (Keeping brand color)
    teams: "#4B53BC",    // Teams Blue
    webhook: "#10B981",  // Green
    voice: "#EF4444",    // Red
  },

  /* =========================
     UTILITY & GLASS
     ========================= */
  utility: {
    divider: "rgba(255, 255, 255, 0.08)",
    shadow: "rgba(0, 0, 0, 0.4)",
    glass: "rgba(15, 23, 42, 0.85)",
    glassBorder: "rgba(255, 255, 255, 0.12)",
    blur: "12px", // Strategy 4: Primary operational panels blur <= 12px
  },
};

