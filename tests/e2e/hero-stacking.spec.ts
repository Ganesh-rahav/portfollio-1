import { test, expect, type Page } from '@playwright/test';

const THEMES = ['dark', 'light'] as const;

async function setTheme(page: Page, theme: 'dark' | 'light') {
  await page.addInitScript((t) => {
    try {
      window.localStorage.setItem('theme', t);
    } catch {
      /* noop */
    }
  }, theme);
}

/** Does elementFromPoint at (x, y) resolve inside `selector`? */
async function topElementIsWithin(page: Page, x: number, y: number, selector: string) {
  return page.evaluate(
    ({ x, y, selector }) => {
      const top = document.elementFromPoint(x, y);
      return top !== null && top.closest(selector) !== null;
    },
    { x, y, selector },
  );
}

for (const theme of THEMES) {
  test(`hero never shows through sections below it (${theme})`, async ({ page }) => {
    await setTheme(page, theme);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);

    const heroHeight = await page
      .locator('#hero')
      .evaluate((el) => el.getBoundingClientRect().height);

    // Position 1: just past the hero — the top of #after-hero should now
    // be what's painted, not the hero.
    await page.evaluate((y) => window.scrollTo(0, y), heroHeight + 40);
    await page.waitForTimeout(150);
    const justPastHero = await topElementIsWithin(page, 640, 10, '.after-hero');
    expect(justPastHero).toBe(true);

    // Position 2: middle of About.
    const aboutMidY = await page.locator('#about').evaluate((el) => {
      const r = el.getBoundingClientRect();
      return window.scrollY + r.top + r.height / 2;
    });
    await page.evaluate((y) => window.scrollTo(0, y - 450), aboutMidY);
    await page.waitForTimeout(150);
    const middleOfAbout = await topElementIsWithin(page, 640, 450, '#about');
    expect(middleOfAbout).toBe(true);

    // Position 3: How I work in view.
    const howHeading = page.getByRole('heading', { name: 'Learn by building.' });
    await howHeading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);

    const headingBox = await howHeading.boundingBox();
    expect(headingBox).not.toBeNull();
    const hx = headingBox!.x + headingBox!.width / 2;
    const hy = headingBox!.y + headingBox!.height / 2;

    const topAtHeading = await page.evaluate(
      ({ x, y }) => document.elementFromPoint(x, y)?.textContent ?? null,
      { x: hx, y: hy },
    );
    expect(topAtHeading).toContain('Learn by building.');

    // The hero h1 must be fully covered — whatever's painted at its own
    // centre point must not be the hero itself.
    const heroH1Box = await page.locator('#hero h1').boundingBox();
    expect(heroH1Box).not.toBeNull();
    const heroCoveredAtOwnCenter = !(await topElementIsWithin(
      page,
      heroH1Box!.x + heroH1Box!.width / 2,
      heroH1Box!.y + heroH1Box!.height / 2,
      '#hero',
    ));
    expect(heroCoveredAtOwnCenter).toBe(true);
  });
}
