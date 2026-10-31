/** Pure math for the About section's dot-sphere orb — no DOM, no canvas,
 * fully testable in isolation. The canvas-driving code lives in
 * components/about/DotOrb.tsx and only calls these functions. */

export type SpherePoint = {
  /** Polar angle, 0 (top pole) .. PI (bottom pole). */
  theta: number;
  /** Azimuthal angle, 0 .. 2*PI. */
  phi: number;
};

export type ProjectedPoint = {
  /** Normalized 2D x, roughly within [-maxRadius, maxRadius]. */
  x: number;
  /** Normalized 2D y, roughly within [-maxRadius, maxRadius]. */
  y: number;
  /** Depth after tilt: positive faces the viewer, negative faces away. */
  z: number;
};

export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/** Fibonacci-sphere distribution: `n` points spread evenly over a unit sphere. */
export function generatePoints(n: number): SpherePoint[] {
  const points: SpherePoint[] = [];
  for (let i = 0; i < n; i++) {
    const y = n <= 1 ? 0 : 1 - (2 * i) / (n - 1);
    const theta = Math.acos(clamp(y, -1, 1));
    const phi = (GOLDEN_ANGLE * i) % (Math.PI * 2);
    points.push({ theta, phi });
  }
  return points;
}

/** Organic radius displacement around 1.0 for a point at time `t`. */
export function displace(point: SpherePoint, t: number): number {
  const { theta, phi } = point;
  return (
    1 +
    0.07 * Math.sin(5 * theta + 3 * phi + t) +
    0.05 * Math.sin(6 * phi + 2 * theta + t * 0.7) +
    0.03 * Math.sin(11 * theta + t * 0.5) * Math.sin(4 * phi)
  );
}

/**
 * Orthographic projection of a (displaced) sphere point after rotating
 * about the vertical axis and tilting about the horizontal axis.
 * x/y are normalized to the point's own radius; z is signed depth
 * (positive = facing the viewer) used for front/back and limb shading.
 */
export function project(
  point: SpherePoint,
  radius: number,
  rotation: number,
  tilt: number,
): ProjectedPoint {
  const { theta, phi } = point;
  const x = radius * Math.sin(theta) * Math.cos(phi + rotation);
  const yBeforeTilt = radius * Math.cos(theta);
  const zBeforeTilt = radius * Math.sin(theta) * Math.sin(phi + rotation);

  const cosT = Math.cos(tilt);
  const sinT = Math.sin(tilt);
  const y = yBeforeTilt * cosT - zBeforeTilt * sinT;
  const z = yBeforeTilt * sinT + zBeforeTilt * cosT;

  return { x, y, z };
}

/** How close a projected point is to the sphere's visible limb (edge),
 * 1 = exactly on the limb, 0 = dead centre (front or back facing). */
export function limbFactor(z: number, radius: number): number {
  if (radius <= 0) return 0;
  return 1 - clamp(Math.abs(z) / radius, 0, 1);
}

/** Outward push vector from the pointer, zero beyond `influenceRadius`
 * and bounded by `maxPush`, with a smooth (linear) falloff. */
export function pushFromPointer(
  pointX: number,
  pointY: number,
  pointerX: number,
  pointerY: number,
  influenceRadius: number,
  maxPush: number,
): { dx: number; dy: number } {
  const dx = pointX - pointerX;
  const dy = pointY - pointerY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist >= influenceRadius || dist === 0) {
    return { dx: 0, dy: 0 };
  }
  const falloff = 1 - dist / influenceRadius;
  const magnitude = maxPush * falloff;
  return { dx: (dx / dist) * magnitude, dy: (dy / dist) * magnitude };
}
