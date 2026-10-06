import type { PrimitiveTokens } from "@/types/pdf-themes";

/** Default primitive design scales shared by all theme presets. */
export const defaultPrimitives: PrimitiveTokens = {
  borderRadius: {
    full: 9999,
    lg: 8,
    md: 4,
    none: 0,
    sm: 2,
  },
  fontWeights: {
    bold: 700,
    medium: 500,
    regular: 400,
    semibold: 600,
  },
  letterSpacing: {
    normal: 0,
    tight: -0.025,
    wide: 0.025,
    wider: 0.05,
  },
  lineHeights: {
    normal: 1.4,
    relaxed: 1.6,
    tight: 1.2,
  },
  spacing: {
    0: 0,
    0.5: 2,
    1: 4,
    10: 40,
    12: 48,
    16: 64,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
  },
  typography: {
    "2xl": 28,
    "3xl": 36,
    base: 15,
    lg: 18,
    sm: 12,
    xl: 22,
    xs: 10,
  },
};
