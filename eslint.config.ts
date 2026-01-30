import configLove from 'eslint-config-love'
import configPrettier from 'eslint-config-prettier'
import globals from 'globals'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ['dist/*', 'node_modules'] },
  { languageOptions: { globals: { ...globals.node } } },
  configPrettier,
  {
    languageOptions: { ...globals },
    files: ['**/*.ts'],
    ...configLove,
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },
  {
    rules: {
      semi: ['warn', 'single'],
    },
  },
]
