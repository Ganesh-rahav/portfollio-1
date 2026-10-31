import { test, expect } from '@playwright/test';

test('homepage returns 200 and renders exactly one h1', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);

  const headings = page.locator('h1');
  await expect(headings).toHaveCount(1);
  // Not toHaveText: the hero's chromatic-aberration effect duplicates the
  // name into aria-hidden layers for the visual trail, which inflates
  // plain textContent. The accessible name correctly ignores those.
  await expect(headings).toHaveAccessibleName('Ganesh Rahav');
});
