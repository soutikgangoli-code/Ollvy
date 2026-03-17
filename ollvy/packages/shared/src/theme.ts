/**
 * Ollvy Design Tokens
 * Import these; do not hardcode hex values.
 * From §2 of ollvy_MASTER_v22.docx
 */

export const colors = {
  navy: '#1E3A5F',        // Primary brand — buttons, headings, tab active
  navyLight: '#2E5299',   // Hover states
  cream: '#FAFAF7',       // App background
  white: '#FFFFFF',       // Cards, inputs
  bodyText: '#1A1A2E',    // Primary text
  mutedText: '#6B7280',   // Secondary text, placeholders
  border: '#E5E7EB',      // Input borders, dividers
  stripe: '#EEF4FA',      // Alternating table rows
  green: '#1A7340',       // Success, completed status
  amber: '#D4700A',       // Warning, SLA approaching
  red: '#C0392B',         // Error, disputed status, destructive
  proGold: '#B8860B',     // Pro tier badge
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const font = {
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  h1: 34,
} as const;

// Type exports for TypeScript consumers
export type Colors = typeof colors;
export type Spacing = typeof spacing;
export type Radius = typeof radius;
export type Font = typeof font;
