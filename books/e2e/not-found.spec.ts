import { expect, test } from '@playwright/test';

test.describe('404 / Wildcard-Route', () => {
  test('zeigt die Not-Found-Komponente bei unbekannter URL', async ({ page }) => {
    await page.goto('/eine-route-die-es-nicht-gibt');
    await expect(page.getByText('not-found works!')).toBeVisible();
    // Die URL bleibt erhalten (kein Redirect)
    await expect(page).toHaveURL(/\/eine-route-die-es-nicht-gibt$/);
  });
});
