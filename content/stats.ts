/**
 * Stats shown in copy must be confirmed, sourced facts — see the
 * "Honesty rules" in CLAUDE.md and docs/decisions-v2.md. A Stat with
 * `verified: false` must never ship; tests/unit/content.test.ts enforces
 * this.
 */

export type Stat = {
  id: string;
  label: string;
  value: string;
  verified: true;
  source: string;
};

export const stats: Stat[] = [
  {
    id: 'cold-calls',
    label: 'Daily habit',
    value: '10+ cold calls a day',
    verified: true,
    source: 'docs/decisions-v2.md — "Verified facts allowed in copy"',
  },
];
