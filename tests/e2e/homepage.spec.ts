import { test, expect } from '@playwright/test';

test('homepage returns 200 and renders exactly one h1', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);

  const headings = page.locator('h1');
  await expect(headings).toHaveCount(1);
  await expect(headings).toHaveText('Ganesh Rahav');
});
