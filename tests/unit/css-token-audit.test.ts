import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { findMutedLargeViolations } from '@/lib/cssTokenAudit';

const globalsCssPath = path.resolve(__dirname, '../../styles/globals.css');

describe('muted-large token usage guard', () => {
  it('has no violations in the real stylesheet', () => {
    const css = readFileSync(globalsCssPath, 'utf8');
    expect(findMutedLargeViolations(css)).toEqual([]);
  });

  it('flags a literal font-size under 24px', () => {
    const violations = findMutedLargeViolations('.bad { color: var(--mut2); font-size: 18px; }');
    expect(violations).toHaveLength(1);
    expect(violations[0]?.selector).toContain('.bad');
  });

  it('flags a token that resolves below 24px at a breakpoint', () => {
    const css = `
      :root { --text-tagline: 22px; }
      @media (max-width: 760px) { :root { --text-tagline: 14px; } }
      .bad { color: var(--mut2); font-size: var(--text-tagline); }
    `;
    expect(findMutedLargeViolations(css)).toHaveLength(1);
  });

  it('flags usage with no font-size declared at all', () => {
    expect(findMutedLargeViolations('.bad { color: var(--mut2); }')).toHaveLength(1);
  });

  it('allows a literal font-size of 24px or more', () => {
    expect(findMutedLargeViolations('.ok { color: var(--mut2); font-size: 30px; }')).toEqual([]);
  });

  it('allows a token that stays 24px or more at every breakpoint', () => {
    const css = `
      :root { --text-step-title: 30px; }
      .ok { color: var(--mut2); font-size: var(--text-step-title); }
    `;
    expect(findMutedLargeViolations(css)).toEqual([]);
  });
});
