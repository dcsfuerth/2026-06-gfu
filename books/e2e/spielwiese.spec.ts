import { expect, test } from '@playwright/test';

test.describe('Spielwiese (RxJS & Signals)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/spielwiese');
  });

  test('zeigt den Startwert des ReplaySubject', async ({ page }) => {
    await expect(page.getByText('Aktueller Zustand: Hallo Spielwiese')).toBeVisible();
  });

  test('der timer()-Observable zählt fortlaufend hoch', async ({ page }) => {
    const timerWert = page.getByTestId('timer-value');

    const ersterWert = Number(await timerWert.innerText());
    // timer(0, 500) erhöht alle 500 ms -> nach >1s muss der Wert gestiegen sein
    await expect
      .poll(async () => Number(await timerWert.innerText()), { timeout: 4_000 })
      .toBeGreaterThan(ersterWert);
  });

  test('"Senden" schiebt den Eingabetext in das Subject und leert das Feld', async ({ page }) => {
    const eingabe = page.getByLabel('Nachricht', { exact: true });
    const senden = page.getByRole('button', { name: 'Senden' });

    await expect(senden).toBeDisabled();
    await eingabe.fill('Hallo Test');
    await expect(senden).toBeEnabled();
    await senden.click();

    await expect(page.getByText('Aktueller Zustand: Hallo Test')).toBeVisible();
    await expect(eingabe).toHaveValue('');
    await expect(
      page.getByRole('list', { name: 'Letzte Nachrichten' }).getByRole('listitem'),
    ).toHaveCount(2);
  });

  test('der Signal-Zähler leitet Verdopplung und Parität ab', async ({ page }) => {
    const zaehler = page.getByTestId('counter-value');
    await expect(zaehler).toHaveText('0');

    await page.getByRole('button', { name: 'Zähler erhöhen' }).click();
    await page.getByRole('button', { name: 'Zähler erhöhen' }).click();
    await page.getByRole('button', { name: 'Zähler erhöhen' }).click();

    await expect(zaehler).toHaveText('3');
    await expect(page.getByText('ungerade')).toBeVisible();

    await page.getByRole('button', { name: 'Zurücksetzen' }).click();
    await expect(zaehler).toHaveText('0');
    await expect(page.getByText('gerade', { exact: true })).toBeVisible();
  });
});
