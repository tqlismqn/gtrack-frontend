// @ts-check
const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const globals = require('globals');

const ensureConfigArray = (config) => {
  if (!config) {
    return [];
  }
  return Array.isArray(config) ? config : [config];
};

const addFiles = (files) => (config) => ({
  ...config,
  files: [...new Set([...(config.files ?? []), ...files])]
});

const typescriptFiles = ['**/*.ts', '**/*.tsx'];
const typescriptRecommended = ensureConfigArray(tseslint.configs?.recommended).map(
  addFiles(typescriptFiles)
);
const typescriptStylistic = ensureConfigArray(tseslint.configs?.stylistic).map(
  addFiles(typescriptFiles)
);

const angularFlatRecommended = ensureConfigArray(
  angular.configs?.['flat/recommended'] ?? angular.configs?.tsRecommended
).map(addFiles(['**/*.ts']));
const angularTemplateRecommended = ensureConfigArray(angular.configs?.templateRecommended).map(
  addFiles(['**/*.html'])
);
const angularTemplateAccessibility = ensureConfigArray(
  angular.configs?.templateAccessibility
).map(addFiles(['**/*.html']));

/** @type {import('@typescript-eslint/utils/ts-eslint').FlatConfig.ConfigArray} */
module.exports = tseslint.config(
  // Глобальные игноры
  { ignores: ['dist/**', 'coverage/**', 'tmp/**', '.angular/**'] },

  // Базовые JS правила + глобалы браузера/ноды
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } }
  },
  js.configs.recommended,

  // TypeScript (type-aware)
  ...typescriptRecommended,
  ...typescriptStylistic,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        // Быстрый и стабильный способ для больших воркспейсов
        projectService: true,
        tsconfigRootDir: __dirname
      }
    },
    rules: {
      // примеры мягких ограничений — можно подстроить под команду
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/consistent-indexed-object-style': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-constant-binary-expression': 'off',
      '@angular-eslint/prefer-inject': 'off',
      '@angular-eslint/prefer-standalone': 'off'
    }
  },

  // Angular TypeScript правила (компоненты/сервисы)
  ...angularFlatRecommended,

  // Angular Templates (HTML): рекомендации + доступность
  ...angularTemplateRecommended,
  ...angularTemplateAccessibility,

  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/prefer-inject': 'off',
      '@angular-eslint/prefer-standalone': 'off'
    }
  }
);
