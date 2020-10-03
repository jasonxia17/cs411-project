module.exports = {
  root: true,
  parser: '@typescript-eslint/parser', // the TypeScript parser we installed earlier
  parserOptions: {
    ecmaFeatures: { jsx: true } // Allows for the parsing of JSX
  },
  extends: [
    'eslint:recommended', // eslint default rules
    'plugin:@typescript-eslint/eslint-recommended', // eslint TypeScript rules (github.com/typescript-eslint/typescript-eslint)
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended', // eslint react rules (github.com/yannickcr/eslint-plugin-react)
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  rules: {
    'react/prop-types': 'off', // We turn off prop-types rule, as we will use TypeScript's types instead.
  },
  settings: {
    react: {
      "version": "detect",
    },
  },
};