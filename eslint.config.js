import eslintPluginNode from 'eslint-plugin-n';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig({
  files: ['**/*.js'],
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    globals: {
      ...globals.node,
    },
  },
  plugins: {
    node: eslintPluginNode,
  },
  rules: {
    'no-unused-vars': 'warn',
    'no-undef': 'error',
    'no-console': 'off',
  },
});

