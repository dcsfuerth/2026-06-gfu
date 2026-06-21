import { expect, test } from '@playwright/test';
import { mockBookApi } from './fixtures/books';

test.describe('Buchliste', () => {
  test.beforeEach(async ({ page }) => {
    await mockBookApi(page);
    await page.goto('/books');
    // Warten, bis die (gemockten) Daten gerendert sind
    await expect(page.getByRole('row')).toHaveCount(3); // 1 Kopf + 2 Datenzeilen
  });

  test('zeigt alle Bücher in der Tabelle', async ({ page }) => {
    // getByText trifft den Zellentext (nicht das alt-Attribut des Covers)
    await expect(page.getByText('Angular 21', { exact: true })).toBeVisible();
    await expect(page.getByText('Angular 22', { exact: true })).toBeVisible();
  });

  test('formatiert Preise im deutschen Währungsformat', async ({ page }) => {
    await expect(page.getByText('19,99 €')).toBeVisible();
    await expect(page.getByText('29,90 €')).toBeVisible();
  });

  test('markiert günstige Bücher (< 20 €) mit der Rabatt-Klasse', async ({ page }) => {
    const guenstig = page.locator('.price-discount');
    await expect(guenstig).toHaveCount(1);
    await expect(guenstig).toHaveText(/19,99/);
  });

  test('verlinkt die ISBN auf die Detailseite', async ({ page }) => {
    const link = page.getByRole('link', { name: '123-456-789' });
    await expect(link).toHaveAttribute('href', '/book/123-456-789');
  });

  test.describe('Suche/Filter', () => {
    test('filtert die Liste nach Titel', async ({ page }) => {
      await page.getByLabel('Bücher suchen').fill('22');
      await expect(page.getByText('Angular 22', { exact: true })).toBeVisible();
      await expect(page.getByText('Angular 21', { exact: true })).toHaveCount(0);
      await expect(page.getByText('Gefiltert nach „22"')).toBeVisible();
    });

    test('ist case-insensitive', async ({ page }) => {
      await page.getByLabel('Bücher suchen').fill('angular');
      await expect(page.getByRole('row')).toHaveCount(3);
    });

    test('zeigt bei fehlendem Treffer keine Datenzeilen', async ({ page }) => {
      await page.getByLabel('Bücher suchen').fill('Vue');
      await expect(page.getByRole('cell', { name: /Angular/ })).toHaveCount(0);
    });
  });

  test.describe('Cover ein-/ausblenden', () => {
    test('blendet die Cover-Spalte aus und wieder ein', async ({ page }) => {
      const toggle = page.getByRole('button', { name: 'Cover ein/ausblenden' });

      await expect(page.getByRole('columnheader', { name: 'Cover' })).toBeVisible();
      await toggle.click();
      await expect(page.getByRole('columnheader', { name: 'Cover' })).toHaveCount(0);
      await toggle.click();
      await expect(page.getByRole('columnheader', { name: 'Cover' })).toBeVisible();
    });
  });

  test.describe('Rating (Sternebewertung)', () => {
    test('erhöht die Bewertung beim Klick auf "Bewertung erhöhen"', async ({ page }) => {
      const ersteZeile = page.getByRole('row').nth(1);
      const sterne = ersteZeile.getByLabel(/von 5 Sternen/);
      await expect(sterne).toHaveAttribute('aria-label', '3.5 von 5 Sternen');

      await ersteZeile.getByRole('button', { name: 'Bewertung erhöhen' }).click();
      await expect(sterne).toHaveAttribute('aria-label', '3.6 von 5 Sternen');
    });

    test('verringert die Bewertung beim Klick auf "Bewertung verringern"', async ({ page }) => {
      const ersteZeile = page.getByRole('row').nth(1);
      const sterne = ersteZeile.getByLabel(/von 5 Sternen/);

      await ersteZeile.getByRole('button', { name: 'Bewertung verringern' }).click();
      await expect(sterne).toHaveAttribute('aria-label', '3.4 von 5 Sternen');
    });
  });

  test.describe('Löschen', () => {
    test('protokolliert das Löschen (UI-Stub, entfernt keine Zeile)', async ({ page }) => {
      const logs: string[] = [];
      page.on('console', (msg) => logs.push(msg.text()));

      await page.getByRole('row').nth(1).getByRole('button', { name: 'Löschen' }).click();

      await expect.poll(() => logs.some((l) => l.includes('Lösche Buch mit ISBN'))).toBe(true);
      // Die Implementierung löscht (noch) nicht wirklich -> weiterhin 2 Datenzeilen
      await expect(page.getByRole('row')).toHaveCount(3);
    });
  });
});

test.describe('Buchliste – Leerzustand', () => {
  test('zeigt eine Hinweismeldung, wenn keine Bücher vorhanden sind', async ({ page }) => {
    await mockBookApi(page, []);
    await page.goto('/books');
    await expect(page.getByText('Leider noch keine Bücher vorhanden.')).toBeVisible();
  });
});
