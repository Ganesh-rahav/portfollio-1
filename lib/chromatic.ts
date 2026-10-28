/** Pure helpers for the hero name's chromatic hover effect — kept
 * dependency-free and testable, independent of the rAF loop that calls them. */

export const MASK_RADIUS_PX = 160;
export const MAX_OFFSET_PX = 10;
export const OFFSET_SPEED_FACTOR = 0.25;
export const LERP_FACTOR = 0.15;
export const ACTIVE_OPACITY = 0.9;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

/**
 * Offset magnitude (px) from the pointer's horizontal movement since the
 * last sample (px per pointermove, not a time-normalized velocity —
 * mouse speed varies far more in px/event than it does in px/ms),
 * clamped to MAX_OFFSET_PX.
 */
export function offsetFromSpeed(deltaXPx: number): number {
  return clamp(Math.abs(deltaXPx) * OFFSET_SPEED_FACTOR, 0, MAX_OFFSET_PX);
}

/**
 * The exact mask-image value for a chromatic layer — mirrors the CSS
 * fallback in styles/globals.css (`.chromatic-layer`'s mask-image rule) so
 * the two can't silently drift apart.
 */
export function chromaticMaskImage(radiusPx: number, cxPx: number, cyPx: number): string {
  return `radial-gradient(circle ${radiusPx}px at ${cxPx}px ${cyPx}px, #000 0, transparent 100%)`;
}

/** Radial falloff (1 at the cursor, 0 at/beyond the mask radius). */
export function radialFalloff(distancePx: number, radiusPx: number = MASK_RADIUS_PX): number {
  if (radiusPx <= 0) return 0;
  return clamp(1 - distancePx / radiusPx, 0, 1);
}
