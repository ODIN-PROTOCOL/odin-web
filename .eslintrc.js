module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint',
    'prettier',
  ],
  parserOptions: {
    xecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
  },
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
  },
  rules: {
    'prettier/prettier': [
      'warn',
      {
        vueIndentScriptAndStyle: false,
        printWidth: 80,
        trailingComma: 'all',
        endOfLine: 'auto',
      },
    ],
    'vue/name-property-casing': [2, 'kebab-case'],
    'arrow-parens': 0,
    'no-debugger': 1,
    'no-console': [
      1,
      {
        allow: ['warn', 'error'],
      },
    ],
    'no-warning-comments': [
      1,
      {
        terms: ['hardcoded'],
        location: 'anywhere',
      },
    ],
    'no-return-await': 0,
    'object-curly-spacing': ['error', 'always'],
    'no-var': 'error',
    'comma-dangle': [1, 'always-multiline'],
    'linebreak-style': ['error', 'unix'],
    '@typescript-eslint/no-non-null-assertion': 'off',
    'vue/multi-word-component-names': 0,
  },
}
