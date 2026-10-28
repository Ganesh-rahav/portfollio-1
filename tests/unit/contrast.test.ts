import { describe, expect, it } from 'vitest';
import { contrastRatio } from '@/lib/contrast';
import { themeTokens, heroTokens } from '@/styles/tokens';

const STRICT_MIN = 4.5;
const LARGE_TEXT_MIN = 3;

describe('color token contrast (WCAG)', () => {
  for (const themeName of ['dark', 'light'] as const) {
    const tokens = themeTokens[themeName];

    it(`${themeName}: text clears ${STRICT_MIN}:1 on bg and surface`, () => {
      expect(contrastRatio(tokens.text, tokens.bg)).toBeGreaterThanOrEqual(STRICT_MIN);
      expect(contrastRatio(tokens.text, tokens.surface)).toBeGreaterThanOrEqual(STRICT_MIN);
    });

    it(`${themeName}: muted (body-sized text) clears ${STRICT_MIN}:1 on bg and surface`, () => {
      expect(contrastRatio(tokens.muted, tokens.bg)).toBeGreaterThanOrEqual(STRICT_MIN);
      expect(contrastRatio(tokens.muted, tokens.surface)).toBeGreaterThanOrEqual(STRICT_MIN);
    });

    it(`${themeName}: muted-large clears only the relaxed ${LARGE_TEXT_MIN}:1 (24px+ text only)`, () => {
      expect(contrastRatio(tokens.mutedLarge, tokens.bg)).toBeGreaterThanOrEqual(LARGE_TEXT_MIN);
    });

    it(`${themeName}: button text clears ${STRICT_MIN}:1 on the button fill`, () => {
      expect(contrastRatio(tokens.buttonText, tokens.buttonFill)).toBeGreaterThanOrEqual(
        STRICT_MIN,
      );
    });

    it(`${themeName}: accent clears ${STRICT_MIN}:1 on bg`, () => {
      expect(contrastRatio(tokens.accent, tokens.bg)).toBeGreaterThanOrEqual(STRICT_MIN);
    });
  }

  it('hero (fixed dark): text clears 4.5:1 on bg', () => {
    expect(contrastRatio(heroTokens.text, heroTokens.bg)).toBeGreaterThanOrEqual(STRICT_MIN);
  });

  it('hero (fixed dark): chip text clears 4.5:1 on the chip fill', () => {
    expect(contrastRatio(heroTokens.chipText, heroTokens.chipFill)).toBeGreaterThanOrEqual(
      STRICT_MIN,
    );
  });
});
