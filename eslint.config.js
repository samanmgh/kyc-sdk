import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import tseslint from 'typescript-eslint'
import perfectionist from 'eslint-plugin-perfectionist'
import unusedImports from 'eslint-plugin-unused-imports'
import prettier from 'eslint-plugin-prettier'
import {defineConfig, globalIgnores} from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', '**/*.d.ts']),
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['**/*.d.ts'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      react.configs.flat.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        sourceType: 'module',
        ecmaFeatures: {jsx: true},
        project: [
          './tsconfig.app.json',
          './tsconfig.node.json',
        ],
      },
    },
    plugins: {
      'perfectionist': perfectionist,
      'unused-imports': unusedImports,
      'prettier': prettier,
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      // general
      'no-alert': 0,
      'camelcase': 0,
      'no-console': 0,
      'no-unused-vars': 0,
      'no-nested-ternary': 0,
      'no-param-reassign': 0,
      'no-underscore-dangle': 0,
      'no-restricted-exports': 0,
      'no-promise-executor-return': 0,
      'import/prefer-default-export': 0,
      'prefer-destructuring': [1, {object: true, array: false}],
      // typescript
      '@typescript-eslint/naming-convention': 0,
      '@typescript-eslint/no-use-before-define': 0,
      '@typescript-eslint/consistent-type-exports': 1,
      '@typescript-eslint/consistent-type-imports': 1,
      '@typescript-eslint/no-unused-vars': [1, {args: 'none'}],
      '@typescript-eslint/no-explicit-any': [
        'warn',
        {
          fixToUnknown: true,
          ignoreRestArgs: true
        }
      ],
      // react
      'react/prop-types': 'off',
      'react/no-children-prop': 0,
      'react/react-in-jsx-scope': 0,
      'react/no-array-index-key': 0,
      'react/require-default-props': 0,
      'react/jsx-props-no-spreading': 0,
      'react/function-component-definition': 0,
      'react/jsx-no-duplicate-props': [1, {ignoreCase: false}],
      'react/jsx-no-useless-fragment': [1, {allowExpressions: true}],
      'react/no-unstable-nested-components': [1, {allowAsProps: true}],
      // jsx-a11y
      'jsx-a11y/anchor-is-valid': 0,
      'jsx-a11y/control-has-associated-label': 0,
      // unused imports
      'unused-imports/no-unused-imports': 1,
      'unused-imports/no-unused-vars': [
        0,
        {vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_'},
      ],
      // perfectionist - fixed internalPattern
      'perfectionist/sort-exports': [1, {order: 'asc', type: 'line-length'}],
      'perfectionist/sort-named-imports': [1, {order: 'asc', type: 'line-length'}],
      'perfectionist/sort-named-exports': [1, {order: 'asc', type: 'line-length'}],
      'perfectionist/sort-imports': [
        1,
        {
          order: 'asc',
          type: 'line-length',
          newlinesBetween: 'always',
          groups: [
            'style',
            'type',
            ['builtin', 'external'],
            'custom-mui',
            'custom-routes',
            'custom-hooks',
            'custom-utils',
            'internal',
            'custom-components',
            'custom-sections',
            'custom-auth',
            'custom-types',
            ['parent', 'sibling', 'index'],
            ['parent-type', 'sibling-type', 'index-type'],
            'object',
            'unknown',
          ],
          customGroups: {
            value: {
              'custom-mui': '^@mui/.*',
              'custom-auth': '^src/auth/.*',
              'custom-hooks': '^src/hooks/.*',
              'custom-utils': '^src/utils/.*',
              'custom-types': '^src/types/.*',
              'custom-routes': '^src/routes/.*',
              'custom-sections': '^src/sections/.*',
              'custom-components': '^src/components/.*',
            },
          },
          internalPattern: ['src/.*'], // Fixed: regex pattern instead of glob
        },
      ],
      // prettier
      'prettier/prettier': 1,
    },
  },
])