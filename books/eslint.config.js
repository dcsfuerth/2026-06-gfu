// @ts-check
const eslint = require('@eslint/js');
const { defineConfig, globalIgnores } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = defineConfig([
  globalIgnores([
    'dist/',
    '.angular/',
    '.features-gen/',
    'playwright-report/',
    'test-results/',
    'coverage/',
    'documentation/',
  ]),
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'books',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'books',
          style: 'kebab-case',
        },
      ],
      // Protokolliert wird ausschließlich über den Logger; direkte Konsolenausgaben
      // sind nur in der ConsoleSink erlaubt (siehe Ausnahme unten).
      'no-console': 'error',
    },
  },
  {
    // Vor dem Bootstrap gibt es noch keinen Logger.
    files: ['src/app/core/logging/console-sink.ts', 'src/main.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {},
  },
]);
