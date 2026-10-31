import { describe, expect, it } from 'vitest';
import {
  clamp,
  displace,
  generatePoints,
  lerp,
  limbFactor,
  project,
  pushFromPointer,
  type SpherePoint,
} from '@/lib/orb';

describe('generatePoints', () => {
  it('returns exactly n points', () => {
    expect(generatePoints(2600)).toHaveLength(2600);
    expect(generatePoints(10)).toHaveLength(10);
    expect(generatePoints(0)).toHaveLength(0);
  });

  it('keeps theta within [0, PI] and phi within [0, 2*PI)', () => {
    for (const point of generatePoints(500)) {
      expect(point.theta).toBeGreaterThanOrEqual(0);
      expect(point.theta).toBeLessThanOrEqual(Math.PI);
      expect(point.phi).toBeGreaterThanOrEqual(0);
      expect(point.phi).toBeLessThan(Math.PI * 2);
    }
  });

  it('places every point on (or touching) the unit sphere before displacement', () => {
    for (const point of generatePoints(500)) {
      const x = Math.sin(point.theta) * Math.cos(point.phi);
      const y = Math.cos(point.theta);
      const z = Math.sin(point.theta) * Math.sin(point.phi);
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      expect(magnitude).toBeCloseTo(1, 5);
    }
  });
});

describe('displace', () => {
  it('stays close to 1 (bounded organic wobble)', () => {
    const points = generatePoints(200);
    for (const point of points) {
      for (const t of [0, 1.3, 7.9]) {
        const r = displace(point, t);
        expect(r).toBeGreaterThan(0.7);
        expect(r).toBeLessThan(1.3);
      }
    }
  });
});

describe('project', () => {
  it('keeps the projection within the point radius for any rotation/tilt', () => {
    const points = generatePoints(300);
    for (const point of points) {
      const radius = displace(point, 2.1);
      const projected = project(point, radius, 1.47, 0.5);
      // x/y are an orthographic projection of a sphere of this radius,
      // so neither component can exceed the radius itself.
      expect(Math.abs(projected.x)).toBeLessThanOrEqual(radius + 1e-9);
      expect(Math.abs(projected.y)).toBeLessThanOrEqual(radius + 1e-9);
    }
  });

  it('a canvas-space projection (center + x*canvasRadius) stays inside the canvas', () => {
    const canvasSize = 400;
    const center = canvasSize / 2;
    const canvasRadius = canvasSize * 0.36;
    const points = generatePoints(300);

    for (const point of points) {
      const radius = displace(point, 4.4);
      const projected = project(point, radius, 0.3, 0.5);
      const px = center + projected.x * canvasRadius;
      const py = center + projected.y * canvasRadius;
      expect(px).toBeGreaterThanOrEqual(0);
      expect(px).toBeLessThanOrEqual(canvasSize);
      expect(py).toBeGreaterThanOrEqual(0);
      expect(py).toBeLessThanOrEqual(canvasSize);
    }
  });
});

describe('limbFactor', () => {
  it('is 1 exactly on the limb (z = 0)', () => {
    expect(limbFactor(0, 1)).toBe(1);
  });

  it('is 0 at the front or back pole (|z| = radius)', () => {
    expect(limbFactor(1, 1)).toBeCloseTo(0);
    expect(limbFactor(-1, 1)).toBeCloseTo(0);
  });

  it('is 0 when radius is 0', () => {
    expect(limbFactor(0, 0)).toBe(0);
  });
});

describe('pushFromPointer', () => {
  it('is zero exactly at and beyond the influence radius', () => {
    expect(pushFromPointer(90, 0, 0, 0, 90, 14)).toEqual({ dx: 0, dy: 0 });
    expect(pushFromPointer(200, 0, 0, 0, 90, 14)).toEqual({ dx: 0, dy: 0 });
  });

  it('is zero when the point is exactly on the pointer', () => {
    expect(pushFromPointer(5, 5, 5, 5, 90, 14)).toEqual({ dx: 0, dy: 0 });
  });

  it('is bounded by maxPush for any distance inside the radius', () => {
    for (const dist of [1, 10, 30, 60, 89]) {
      const { dx, dy } = pushFromPointer(dist, 0, 0, 0, 90, 14);
      const magnitude = Math.sqrt(dx * dx + dy * dy);
      expect(magnitude).toBeLessThanOrEqual(14 + 1e-9);
    }
  });

  it('grows as the point gets closer to the pointer (smooth falloff)', () => {
    const far = pushFromPointer(80, 0, 0, 0, 90, 14);
    const near = pushFromPointer(10, 0, 0, 0, 90, 14);
    const farMag = Math.sqrt(far.dx ** 2 + far.dy ** 2);
    const nearMag = Math.sqrt(near.dx ** 2 + near.dy ** 2);
    expect(nearMag).toBeGreaterThan(farMag);
  });

  it('points outward, away from the pointer', () => {
    const { dx, dy } = pushFromPointer(10, 0, 0, 0, 90, 14);
    expect(dx).toBeGreaterThan(0);
    expect(dy).toBe(0);
  });
});

describe('lerp / clamp (shared helpers)', () => {
  it('lerp interpolates linearly', () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
  });

  it('clamp bounds a value', () => {
    expect(clamp(-1, 0, 1)).toBe(0);
    expect(clamp(2, 0, 1)).toBe(1);
  });
});

describe('determinism', () => {
  it('generatePoints is deterministic for the same n', () => {
    const a = generatePoints(100);
    const b = generatePoints(100);
    expect(a).toEqual(b);
  });

  it('a sample point matches a hand-checked value', () => {
    const [first] = generatePoints(1) as [SpherePoint];
    expect(first.theta).toBeCloseTo(Math.PI / 2, 5);
    expect(first.phi).toBe(0);
  });
});
