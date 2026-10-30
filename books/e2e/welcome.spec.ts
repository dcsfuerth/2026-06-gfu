import { expect, test } from '@playwright/test';

test.describe('Welcome / Startseite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('zeigt die Begrüßungs-Überschrift', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Willkommen in der Bücherverwaltung!' }),
    ).toBeVisible();
  });

  test('zeigt den erläuternden Text', async ({ page }) => {
    await expect(page.getByText(/Verwalte deine Bücher/)).toBeVisible();
  });

  test('verlinkt auf die drei Bereiche', async ({ page }) => {
    const main = page.getByRole('main');
    await expect(main.getByRole('link', { name: 'Zu den Büchern' })).toHaveAttribute(
      'href',
      '/books',
    );
    await expect(main.getByRole('link', { name: /Taschenrechner/ })).toHaveAttribute(
      'href',
      '/calculator',
    );
    await expect(main.getByRole('link', { name: /Spielwiese/ })).toHaveAttribute(
      'href',
      '/spielwiese',
    );
  });
});
