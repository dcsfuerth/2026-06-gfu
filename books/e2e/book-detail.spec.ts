import { expect, test } from '@playwright/test';
import { mockBookApi } from './fixtures/books';

test.describe('Buch-Detail & Route-Guard', () => {
  test.beforeEach(async ({ page }) => {
    await mockBookApi(page);
  });

  test('zeigt die Detailseite für die erlaubte ISBN (123-456-789)', async ({ page }) => {
    await page.goto('/book/123-456-789');
    await expect(page).toHaveURL(/\/book\/123-456-789$/);
    await expect(page.getByRole('heading', { name: 'Angular 21' })).toBeVisible();
    await expect(page.getByText('123-456-789')).toBeVisible();
    await expect(page.getByText('19,99 €')).toBeVisible();
  });

  test('zeigt den Platzhalter, wenn kein Kommentar vorhanden ist', async ({ page }) => {
    await page.goto('/book/123-456-789');
    await expect(page.getByText('Kein Kommentar vorhanden.')).toBeVisible();
  });

  test('der bookGuard blockt eine nicht erlaubte ISBN', async ({ page }) => {
    await page.goto('/book/987-654-321');
    // canActivate gibt false zurück -> Navigation abgebrochen.
    // Die Detailseite (Überschrift "Angular 22") darf NICHT erscheinen,
    // und die URL verbleibt nicht auf der Buch-Route.
    await expect(page).not.toHaveURL(/\/book\/987-654-321$/);
    await expect(page.getByRole('heading', { name: 'Angular 22' })).toHaveCount(0);
  });

  test('der bookGuard erlaubt die Navigation per Klick aus der Liste (gültige ISBN)', async ({
    page,
  }) => {
    await page.goto('/books');
    await page.getByRole('link', { name: '123-456-789' }).click();
    await expect(page).toHaveURL(/\/book\/123-456-789$/);
    await expect(page.getByRole('heading', { name: 'Angular 21' })).toBeVisible();
  });

  test('"Zurück zur Liste" navigiert auf /books', async ({ page }) => {
    await page.goto('/book/123-456-789');
    await page.getByRole('button', { name: '← Zurück zur Liste' }).click();
    await expect(page).toHaveURL(/\/books$/);
  });
});
