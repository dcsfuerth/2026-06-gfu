import { expect, test, type Page } from '@playwright/test';

/** Liefert die Locator für die wichtigsten Bedienelemente des Rechners. */
function elements(page: Page) {
  return {
    x: page.getByLabel('Wert x'),
    y: page.getByLabel('Wert y'),
    add: page.getByRole('button', { name: '+' }),
    // Minuszeichen ist U+2212 (−), nicht der Bindestrich (-)
    subtract: page.getByRole('button', { name: '−' }),
    clear: page.getByRole('button', { name: 'C', exact: true }),
    result: page.locator('.calculator__result-value'),
  };
}

test.describe('Taschenrechner', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculator');
  });

  test('startet mit Ergebnis 0', async ({ page }) => {
    await expect(elements(page).result).toHaveText('0');
  });

  test('addiert zwei Werte', async ({ page }) => {
    const el = elements(page);
    await el.x.fill('5');
    await el.y.fill('3');
    await el.add.click();
    await expect(el.result).toHaveText('8');
  });

  test('subtrahiert zwei Werte', async ({ page }) => {
    const el = elements(page);
    await el.x.fill('10');
    await el.y.fill('4');
    await el.subtract.click();
    await expect(el.result).toHaveText('6');
  });

  test('rechnet mit Dezimalwerten', async ({ page }) => {
    const el = elements(page);
    await el.x.fill('2.5');
    await el.y.fill('1.5');
    await el.add.click();
    await expect(el.result).toHaveText('4');
  });

  test('behandelt leere Felder als 0', async ({ page }) => {
    const el = elements(page);
    await el.x.fill('7');
    // y bleibt leer
    await el.add.click();
    await expect(el.result).toHaveText('7');
  });

  test('C setzt Eingaben und Ergebnis zurück', async ({ page }) => {
    const el = elements(page);
    await el.x.fill('9');
    await el.y.fill('9');
    await el.add.click();
    await expect(el.result).toHaveText('18');

    await el.clear.click();
    await expect(el.result).toHaveText('0');
    await expect(el.x).toHaveValue('');
    await expect(el.y).toHaveValue('');
  });
});
