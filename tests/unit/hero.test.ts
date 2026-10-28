import { describe, expect, it } from 'vitest';
import {
  clamp,
  heroMaskImage,
  lerp,
  REVEAL_RADIUS_PX,
  scrollFadeOpacity,
  targetRadius,
} from '@/lib/hero';

describe('lerp', () => {
  it('returns start at factor 0 and end at factor 1', () => {
    expect(lerp(0, 100, 0)).toBe(0);
    expect(lerp(0, 100, 1)).toBe(100);
  });

  it('moves partway toward the target', () => {
    expect(lerp(0, 100, 0.15)).toBeCloseTo(15);
  });

  it('converges to the target after repeated iterations', () => {
    let value = 0;
    for (let i = 0; i < 100; i++) {
      value = lerp(value, 210, 0.15);
    }
    expect(value).toBeCloseTo(210, 3);
  });
});

describe('clamp', () => {
  it('passes values already in range through unchanged', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('clamps below the minimum', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('clamps above the maximum', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

describe('targetRadius', () => {
  it('is the full reveal radius when the pointer is inside', () => {
    expect(targetRadius(true)).toBe(REVEAL_RADIUS_PX);
  });

  it('is 0 when the pointer is outside', () => {
    expect(targetRadius(false)).toBe(0);
  });
});

describe('heroMaskImage', () => {
  it('formats the exact gradient used in styles/globals.css', () => {
    expect(heroMaskImage(210, 100, 50)).toBe(
      'radial-gradient(circle 210px at 100px 50px, #000 0, #000 52%, transparent 100%)',
    );
  });

  it('formats a zero radius (fully hidden) the same way', () => {
    expect(heroMaskImage(0, 0, 0)).toBe(
      'radial-gradient(circle 0px at 0px 0px, #000 0, #000 52%, transparent 100%)',
    );
  });
});

describe('scrollFadeOpacity', () => {
  it('is fully opaque at the top of the page', () => {
    expect(scrollFadeOpacity(0, 900)).toBe(1);
  });

  it('is 0.4 once scrolled a full hero height', () => {
    expect(scrollFadeOpacity(900, 900)).toBeCloseTo(0.4);
  });

  it('interpolates partway through the scroll', () => {
    expect(scrollFadeOpacity(450, 900)).toBeCloseTo(0.7);
  });

  it('clamps at 0.4 beyond a full hero height', () => {
    expect(scrollFadeOpacity(5000, 900)).toBeCloseTo(0.4);
  });

  it('does not divide by zero when hero height is 0', () => {
    expect(scrollFadeOpacity(100, 0)).toBe(1);
  });
});
