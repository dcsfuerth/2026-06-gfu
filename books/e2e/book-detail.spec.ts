import { expect, test } from '@playwright/test';
import { mockBookApi } from './fixtures/books';

test.describe('Buch-Detail & Route-Guard', () => {
  test.beforeEach(async ({ page }) => {
    await mockBookApi(page);
  });

  test('zeigt die Detailseite für eine gültige ISBN', async ({ page }) => {
    await page.goto('/book/123-456-789');
    await expect(page).toHaveURL(/\/book\/123-456-789$/);
    await expect(page.getByRole('heading', { name: 'Angular 21' })).toBeVisible();
    await expect(page.getByText('123-456-789')).toBeVisible();
    await expect(page.getByText('19,99 €')).toBeVisible();
    await expect(page.getByText('Angebot')).toBeVisible();
    await expect(page).toHaveTitle(/Buchdetails/);
  });

  test('zeigt den Platzhalter, wenn kein Kommentar vorhanden ist', async ({ page }) => {
    await page.goto('/book/123-456-789');
    await expect(page.getByText('Kein Kommentar vorhanden.')).toBeVisible();
  });

  test('zeigt den Kommentar, wenn vorhanden', async ({ page }) => {
    await page.goto('/book/987-654-321');
    await expect(page.getByRole('heading', { name: 'Angular 22' })).toBeVisible();
    await expect(page.getByText('Sehr empfehlenswert.')).toBeVisible();
  });

  test('der bookGuard leitet bei ungültiger ISBN auf die Liste um', async ({ page }) => {
    await page.goto('/book/keine-isbn');
    await expect(page).toHaveURL(/\/books$/);
    await expect(page.getByRole('heading', { name: 'Bücher' })).toBeVisible();
  });

  test('zeigt "Buch nicht gefunden" für eine unbekannte ISBN', async ({ page }) => {
    await page.goto('/book/000-000-000');
    await expect(page.getByRole('heading', { name: 'Buch nicht gefunden' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Zur Buchliste' })).toHaveAttribute(
      'href',
      '/books',
    );
  });

  test('die Navigation per Klick aus der Liste funktioniert', async ({ page }) => {
    await page.goto('/books');
    await page.getByRole('link', { name: 'Angular 21' }).click();
    await expect(page).toHaveURL(/\/book\/123-456-789$/);
    await expect(page.getByRole('heading', { name: 'Angular 21' })).toBeVisible();
  });

  test('"Zurück zur Liste" navigiert auf /books', async ({ page }) => {
    await page.goto('/book/123-456-789');
    await page.getByRole('link', { name: 'Zurück zur Liste' }).click();
    await expect(page).toHaveURL(/\/books$/);
  });
});
