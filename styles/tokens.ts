/**
 * Mirrors the color custom properties declared in styles/globals.css.
 * Tailwind v4's config lives in CSS, so there is no JS export to import
 * from — this module exists purely so tests/unit/contrast.test.ts can
 * check WCAG ratios without parsing CSS. Keep the two files in sync by
 * hand; a mismatch here would make the contrast test lie about what
 * actually ships.
 */

export type ThemeTokens = {
  bg: string;
  surface: string;
  line: string;
  text: string;
  muted: string;
  /** Reserved for text set at 24px or larger — see globals.css. */
  mutedLarge: string;
  accent: string;
  buttonFill: string;
  buttonText: string;
};

export const themeTokens: Record<'dark' | 'light', ThemeTokens> = {
  dark: {
    bg: '#0C120F',
    surface: '#141C18',
    line: '#27322C',
    text: '#F2F4F3',
    muted: '#A3ADA7',
    mutedLarge: '#8A948E',
    accent: '#9BE0BB',
    buttonFill: '#9BE0BB',
    buttonText: '#0C120F',
  },
  light: {
    bg: '#ECEFED',
    surface: '#F6F8F7',
    line: '#CBD2CE',
    text: '#0C120F',
    muted: '#4E5953',
    mutedLarge: '#667169',
    accent: '#17724A',
    buttonFill: '#0C120F',
    buttonText: '#EAF5EE',
  },
};

/** The hero is always dark, regardless of the active theme. */
export const heroTokens = {
  bg: '#0C120F',
  text: '#F2F4F3',
  chipFill: '#9BE0BB',
  chipText: '#0C120F',
} as const;
