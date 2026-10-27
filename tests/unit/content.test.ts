import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { stats } from '@/content/stats';

const contentDir = path.resolve(__dirname, '../../content');

describe('content honesty rules', () => {
  it('has only verified stats', () => {
    expect(stats.every((stat) => stat.verified === true)).toBe(true);
  });

  it('never mentions Zero Day Crew in any content file', () => {
    const files = readdirSync(contentDir).filter((file) => file.endsWith('.ts'));
    expect(files.length).toBeGreaterThan(0);

    for (const file of files) {
      const text = readFileSync(path.join(contentDir, file), 'utf8');
      expect(text.toLowerCase()).not.toContain('zero day crew');
    }
  });
});
