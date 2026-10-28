/**
 * Static guard for the muted-large token (`--mut2`): it only clears WCAG
 * at 3:1, which is only safe for text set at 24px or larger (see
 * styles/globals.css and tests/unit/contrast.test.ts). This scans raw
 * CSS text for any rule that colors text with `var(--mut2)` and checks
 * that the same rule also sets a qualifying font-size everywhere that
 * size is defined (base value and any media-query override).
 */

export type MutedLargeViolation = {
  selector: string;
  reason: string;
};

const RULE_PATTERN = /([^{}]+)\{([^{}]*)\}/g;
const FONT_SIZE_TOKEN_DEFINITION_PATTERN = /--(text-[a-z0-9-]+)\s*:\s*([\d.]+)px/gi;
const MUTED_LARGE_USAGE_PATTERN = /color\s*:\s*var\(--mut2\)/i;
const FONT_SIZE_DECLARATION_PATTERN = /font-size\s*:\s*([^;]+);/i;
const LITERAL_PX_PATTERN = /^([\d.]+)px$/;
const TOKEN_REFERENCE_PATTERN = /^var\(--(text-[a-z0-9-]+)\)$/;

const MIN_LARGE_TEXT_PX = 24;

/** Smallest px value a `--text-*` token resolves to across the whole file. */
function collectTokenMinSizes(css: string): Map<string, number> {
  const minSizes = new Map<string, number>();
  for (const match of css.matchAll(FONT_SIZE_TOKEN_DEFINITION_PATTERN)) {
    const name = match[1];
    const pxValue = match[2];
    if (!name || !pxValue) continue;

    const px = Number(pxValue);
    const current = minSizes.get(name);
    minSizes.set(name, current === undefined ? px : Math.min(current, px));
  }
  return minSizes;
}

export function findMutedLargeViolations(css: string): MutedLargeViolation[] {
  const tokenMinSizes = collectTokenMinSizes(css);
  const violations: MutedLargeViolation[] = [];

  for (const match of css.matchAll(RULE_PATTERN)) {
    const selector = match[1];
    const body = match[2];
    if (selector === undefined || body === undefined) continue;
    if (!MUTED_LARGE_USAGE_PATTERN.test(body)) continue;

    const trimmedSelector = selector.trim();
    const fontSizeMatch = body.match(FONT_SIZE_DECLARATION_PATTERN);
    const rawValue = fontSizeMatch?.[1]?.trim();

    if (!rawValue) {
      violations.push({
        selector: trimmedSelector,
        reason: 'uses the muted-large token but declares no font-size in the same rule',
      });
      continue;
    }

    const literalMatch = rawValue.match(LITERAL_PX_PATTERN);
    const literalPx = literalMatch?.[1];
    if (literalPx) {
      const px = Number(literalPx);
      if (px < MIN_LARGE_TEXT_PX) {
        violations.push({
          selector: trimmedSelector,
          reason: `font-size ${rawValue} is below ${MIN_LARGE_TEXT_PX}px`,
        });
      }
      continue;
    }

    const tokenMatch = rawValue.match(TOKEN_REFERENCE_PATTERN);
    const tokenName = tokenMatch?.[1];
    if (tokenName) {
      const minPx = tokenMinSizes.get(tokenName);
      if (minPx === undefined || minPx < MIN_LARGE_TEXT_PX) {
        violations.push({
          selector: trimmedSelector,
          reason: `font-size var(--${tokenName}) resolves below ${MIN_LARGE_TEXT_PX}px at some breakpoint`,
        });
      }
      continue;
    }

    violations.push({
      selector: trimmedSelector,
      reason: `font-size "${rawValue}" could not be verified as ${MIN_LARGE_TEXT_PX}px or larger`,
    });
  }

  return violations;
}
