import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import prettierConfig from 'eslint-config-prettier';
import sveltePlugin from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';

const customRules = {
  curly: ['error', 'all'],
  'brace-style': ['error', '1tbs', { allowSingleLine: false }],
  'no-var': 'error',
  'prefer-const': 'error',
  '@typescript-eslint/no-explicit-any': 'warn',
};

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...sveltePlugin.configs['flat/recommended'],
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    ignores: ['dist/', 'node_modules/', 'src/app.js'],
  },
  prettierConfig,
  {
    rules: customRules,
  },
);
