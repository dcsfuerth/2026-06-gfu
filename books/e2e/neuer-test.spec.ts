import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.getByText('📚BücherverwaltungStartBücherTaschenrechnerSpielwiese Subscription beenden 📚').click();
  await page.getByRole('link', { name: 'Start' }).click();
  await page.getByRole('link', { name: 'Bücher', exact: true }).click();
  await page.getByRole('link', { name: 'Bücher', exact: true }).click();
  await page.getByRole('link', { name: 'Bücher', exact: true }).click();
  await page.getByRole('textbox', { name: 'Bücher suchen' }).click();
  await page.getByRole('textbox', { name: 'Bücher suchen' }).fill('21');
  await page.getByRole('link', { name: '-456-789' }).click();
  await page.getByRole('button', { name: '← Zurück zur Liste' }).click();
});