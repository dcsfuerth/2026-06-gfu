import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { Then, test } from './fixtures';

/**
 * Prüft die aktuelle Seite mit axe-core gegen WCAG 2.1 A/AA.
 * Verstöße werden lesbar aufbereitet, damit der Report direkt zeigt, was zu tun ist.
 */
Then('ist die Seite barrierefrei', async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  if (results.violations.length > 0) {
    await test.info().attach('axe-violations', {
      body: JSON.stringify(results.violations, null, 2),
      contentType: 'application/json',
    });
  }

  const summary = results.violations.map(
    (v) =>
      `${v.id} (${v.impact}): ${v.help}\n  ${v.nodes.map((n) => n.target.join(' ')).join('\n  ')}`,
  );
  expect(summary, summary.join('\n')).toEqual([]);
});
