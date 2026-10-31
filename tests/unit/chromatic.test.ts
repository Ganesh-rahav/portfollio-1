import { describe, expect, it } from 'vitest';
import {
  chromaticMaskImage,
  clamp,
  lerp,
  MASK_RADIUS_PX,
  MAX_OFFSET_PX,
  offsetFromSpeed,
  radialFalloff,
} from '@/lib/chromatic';

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

describe('lerp', () => {
  it('returns start at factor 0 and end at factor 1', () => {
    expect(lerp(0, 100, 0)).toBe(0);
    expect(lerp(0, 100, 1)).toBe(100);
  });

  it('converges to the target after repeated iterations at 0.15', () => {
    let value = 0;
    for (let i = 0; i < 100; i++) {
      value = lerp(value, 10, 0.15);
    }
    expect(value).toBeCloseTo(10, 3);
  });
});

describe('offsetFromSpeed', () => {
  it('is zero for a stationary pointer', () => {
    expect(offsetFromSpeed(0)).toBe(0);
  });

  it('scales with speed by the 0.25 factor', () => {
    expect(offsetFromSpeed(4)).toBeCloseTo(1);
    expect(offsetFromSpeed(20)).toBeCloseTo(5);
  });

  it('is direction-independent (uses magnitude)', () => {
    expect(offsetFromSpeed(-4)).toBeCloseTo(1);
  });

  it('clamps at MAX_OFFSET_PX for fast pointers', () => {
    expect(offsetFromSpeed(1000)).toBe(MAX_OFFSET_PX);
  });
});

describe('chromaticMaskImage', () => {
  it('formats the exact gradient used in styles/globals.css', () => {
    expect(chromaticMaskImage(160, 100, 50)).toBe(
      'radial-gradient(circle 160px at 100px 50px, #000 0, transparent 100%)',
    );
  });
});

describe('radialFalloff', () => {
  it('is 1 at the cursor', () => {
    expect(radialFalloff(0, MASK_RADIUS_PX)).toBe(1);
  });

  it('is 0 at the mask radius', () => {
    expect(radialFalloff(MASK_RADIUS_PX, MASK_RADIUS_PX)).toBe(0);
  });

  it('is 0 beyond the mask radius', () => {
    expect(radialFalloff(MASK_RADIUS_PX * 2, MASK_RADIUS_PX)).toBe(0);
  });

  it('interpolates halfway through the radius', () => {
    expect(radialFalloff(MASK_RADIUS_PX / 2, MASK_RADIUS_PX)).toBeCloseTo(0.5);
  });

  it('does not divide by zero when the radius is 0', () => {
    expect(radialFalloff(10, 0)).toBe(0);
  });
});
