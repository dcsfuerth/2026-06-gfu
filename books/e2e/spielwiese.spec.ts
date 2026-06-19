import { expect, test } from '@playwright/test';

test.describe('Spielwiese (RxJS-Demos)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/spielwiese');
  });

  test('zeigt den letzten Wert des ReplaySubject', async ({ page }) => {
    // Im Konstruktor wird zuletzt 'na klar3' emittiert -> async-Pipe zeigt diesen Wert
    await expect(page.getByText('Aktueller Zustand: na klar3')).toBeVisible();
  });

  test('der timer()-Observable zählt fortlaufend hoch', async ({ page }) => {
    const timerWert = page.locator('main p').nth(1);

    const ersterWert = Number(await timerWert.innerText());
    // timer(0, 500) erhöht alle 500 ms -> nach >1s muss der Wert gestiegen sein
    await expect.poll(async () => Number(await timerWert.innerText()), {
      timeout: 4_000,
    }).toBeGreaterThan(ersterWert);
  });

  test('"Senden" schiebt den Eingabetext in das Subject', async ({ page }) => {
    const eingabe = page.getByRole('textbox');
    await eingabe.fill('Hallo Test');
    await page.getByRole('button', { name: 'Senden' }).click();
    await expect(page.getByText('Aktueller Zustand: Hallo Test')).toBeVisible();
  });
});
