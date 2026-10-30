import { expect, test } from '@playwright/test';
import { mockBookApi } from './fixtures/books';

test.describe('App-Shell & Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await mockBookApi(page);
    await page.goto('/');
  });

  test('zeigt den Marken-Titel im Header', async ({ page }) => {
    const brand = page.getByRole('banner').getByRole('link', { name: 'Bücherverwaltung' });
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

  test('navigiert über die Links zu allen Routen und setzt den Seitentitel', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Hauptnavigation' });

    await nav.getByRole('link', { name: 'Bücher', exact: true }).click();
    await expect(page).toHaveURL(/\/books$/);
    await expect(page.getByRole('heading', { name: 'Bücher' })).toBeVisible();
    await expect(page).toHaveTitle('Bücher · Bücherverwaltung');

    await nav.getByRole('link', { name: 'Taschenrechner' }).click();
    await expect(page).toHaveURL(/\/calculator$/);
    await expect(page.getByRole('heading', { name: 'Taschenrechner' })).toBeVisible();

    await nav.getByRole('link', { name: 'Spielwiese' }).click();
    await expect(page).toHaveURL(/\/spielwiese$/);
    await expect(page.getByRole('heading', { name: 'Spielwiese' })).toBeVisible();

    await nav.getByRole('link', { name: 'Start', exact: true }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page).toHaveTitle('Start · Bücherverwaltung');
  });

  test('markiert den aktiven Link mit Active-Klasse und aria-current', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Hauptnavigation' });
    const buecherLink = nav.getByRole('link', { name: 'Bücher', exact: true });
    await buecherLink.click();
    await expect(buecherLink).toHaveClass(/nav__link--active/);
    await expect(buecherLink).toHaveAttribute('aria-current', 'page');
    await expect(nav.getByRole('link', { name: 'Start', exact: true })).not.toHaveClass(
      /nav__link--active/,
    );
  });

  test('zeigt die Angular-Version im Footer', async ({ page }) => {
    await expect(page.getByRole('contentinfo')).toContainText(/Angular \d+\.\d+\.\d+/);
  });
});
