import { expect, test } from '@playwright/test';

test.describe('404 / Wildcard-Route', () => {
  test('zeigt die Not-Found-Seite bei unbekannter URL', async ({ page }) => {
    await page.goto('/eine-route-die-es-nicht-gibt');
    await expect(page.getByRole('heading', { name: 'Seite nicht gefunden' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Zur Startseite' })).toHaveAttribute('href', '/');
    // Die URL bleibt erhalten (kein Redirect)
    await expect(page).toHaveURL(/\/eine-route-die-es-nicht-gibt$/);
    await expect(page).toHaveTitle(/Seite nicht gefunden/);
  });
});
