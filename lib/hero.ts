/** Pure helpers for the hero cursor reveal — kept dependency-free and
 * testable, independent of the rAF loop that calls them. */

export const REVEAL_RADIUS_PX = 210;
export const LERP_FACTOR = 0.15;

export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Target reveal radius for the current pointer state. */
export function targetRadius(isPointerInside: boolean): number {
  return isPointerInside ? REVEAL_RADIUS_PX : 0;
}

/**
 * The exact mask-image value for the photo layer — mirrors the CSS
 * fallback in styles/globals.css (`.hero-photo`'s mask-image rule) so
 * the two can't silently drift apart; this is what's under test, not
 * what sets the live style (that's the CSS custom properties).
 */
export function heroMaskImage(radiusPx: number, xPx: number, yPx: number): string {
  return `radial-gradient(circle ${radiusPx}px at ${xPx}px ${yPx}px, #000 0, #000 52%, transparent 100%)`;
}

/** Hero opacity as it scrolls out of view — 1 at the top, down to 0.4. */
export function scrollFadeOpacity(scrollY: number, heroHeight: number): number {
  if (heroHeight <= 0) return 1;
  const progress = clamp(scrollY / heroHeight, 0, 1);
  return lerp(1, 0.4, progress);
}
