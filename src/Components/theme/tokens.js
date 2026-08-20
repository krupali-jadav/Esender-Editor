// Aurora Studio design tokens. Single source of truth for color, radius and
// control sizing — consumed by themeConfig.js (antd) and globals.css (CSS vars).

export const lightTokens = {
  colorPrimary: "#20A6CE",
  colorPrimaryHover: "#1C93B6",
  colorPrimaryActive: "#177E9C",

  colorInfo: "#20A6CE",
  colorSuccess: "#16A66A",
  colorWarning: "#E59A17",
  colorError: "#DC4C64",

  colorBgLayout: "#F5F8FA",
  colorBgContainer: "#FFFFFF",
  colorBgElevated: "#FFFFFF",
  colorBgSpotlight: "#152A3C",

  colorText: "#171A2B",
  colorTextSecondary: "#667085",
  colorTextTertiary: "#98A2B3",

  colorBorder: "#E7E9F0",
  colorBorderSecondary: "#EEF0F4",

  borderRadius: 10,
  borderRadiusLG: 14,
  controlHeight: 42,
};

export const darkTokens = {
  colorPrimary: "#3DBEE4",
  colorPrimaryHover: "#5FCBEA",
  colorPrimaryActive: "#2BA9CF",

  colorInfo: "#3DBEE4",
  colorSuccess: "#34D399",
  colorWarning: "#FBBF24",
  colorError: "#FB7185",

  colorBgLayout: "#0A1622",
  colorBgContainer: "#0F2233",
  colorBgElevated: "#152A3C",
  colorBgSpotlight: "#F4F5F8",

  colorText: "#F4F5F8",
  colorTextSecondary: "#AAB1C1",
  colorTextTertiary: "#7C8599",

  colorBorder: "#273043",
  colorBorderSecondary: "#20283A",

  borderRadius: 10,
  borderRadiusLG: 14,
  controlHeight: 42,
};

// Brand accents that sit outside the antd token system (gradients, charts,
// decorative surfaces). Kept stable across light/dark.
// Brand accents derived from the ESENDER logo: a vivid sky-cyan paired with a
// deep navy. `violet` keeps its variable name for backwards compatibility but
// now carries the logo cyan so existing accent usages recolor to the brand.
export const brandColors = {
  violet: "#20A6CE",
  coral: "#FF6B6B",
  teal: "#14B8A6",
  blue: "#2C82C9",
  amber: "#E59A17",
  danger: "#DC4C64",
  ink: "#152A3C",
};

// Semantic status tones shared by StatusBadge across campaigns, domains,
// webhooks, contacts, etc. `tone` maps into TONE_STYLES in StatusBadge.jsx.
export const statusToneMap = {
  draft: "neutral",
  scheduled: "violet",
  running: "blue",
  sending: "cyan",
  completed: "success",
  paused: "warning",
  cancelled: "neutral",
  canceled: "neutral",
  failed: "error",
  error: "error",
  bounced: "error",
  verified: "success",
  active: "success",
  enabled: "success",
  pending: "warning",
  "pending verification": "warning",
  unverified: "warning",
  inactive: "neutral",
  disabled: "neutral",
  blocked: "error",
  unsubscribed: "neutral",
  subscribed: "success",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  "4xl": 48,
};

export const fontFamily = {
  body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  heading: "'Manrope', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  mono: "'JetBrains Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', monospace",
};

export const shadows = {
  sm: "0 1px 2px rgba(16, 24, 40, 0.04)",
  md: "0 8px 24px rgba(16, 24, 40, 0.08)",
  lg: "0 18px 48px rgba(16, 24, 40, 0.12)",
};
