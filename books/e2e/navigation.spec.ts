import { expect, test } from '@playwright/test';
import { mockBookApi } from './fixtures/books';

test.describe('App-Shell & Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await mockBookApi(page);
    await page.goto('/');
  });

  test('zeigt den Marken-Titel im Header', async ({ page }) => {
    const brand = page.getByRole('link', { name: /Bücherverwaltung/ });
    await expect(brand).toBeVisible();
    await expect(brand).toHaveAttribute('href', '/');
  });

  test('enthält alle vier Hauptnavigations-Links', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Hauptnavigation' });
    await expect(nav.getByRole('link', { name: 'Start' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Bücher' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Taschenrechner' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Spielwiese' })).toBeVisible();
  });

  test('navigiert über die Links zu allen Routen', async ({ page }) => {
    await page.getByRole('link', { name: 'Bücher', exact: true }).click();
    await expect(page).toHaveURL(/\/books$/);
    await expect(page.getByRole('heading', { name: 'Bücher' })).toBeVisible();

    await page.getByRole('link', { name: 'Taschenrechner' }).click();
    await expect(page).toHaveURL(/\/calculator$/);
    await expect(page.getByRole('heading', { name: 'Taschenrechner' })).toBeVisible();

    await page.getByRole('link', { name: 'Spielwiese' }).click();
    await expect(page).toHaveURL(/\/spielwiese$/);
    await expect(page.getByText('spielwiese works!')).toBeVisible();

    await page.getByRole('link', { name: 'Start', exact: true }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('markiert den aktiven Link mit der Active-Klasse', async ({ page }) => {
    const buecherLink = page.getByRole('link', { name: 'Bücher', exact: true });
    await buecherLink.click();
    await expect(buecherLink).toHaveClass(/nav__link--active/);
  });

  test('der "Subscription beenden"-Button ist bedienbar', async ({ page }) => {
    const stopBtn = page.getByRole('button', { name: 'Subscription beenden' });
    await expect(stopBtn).toBeVisible();
    await stopBtn.click();
    // Nach dem Beenden bleibt die App benutzbar (kein Absturz).
    await expect(page.getByRole('link', { name: 'Bücher', exact: true })).toBeVisible();
  });
});
