module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'next'
  ],
  ignorePatterns: ['.next', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'prettier'],
  rules: {
    'react/react-in-tsx-scope': ['off'],
    'react/tsx-uses-react': ['off'],
    'prettier/prettier': ['off'],
    'react/no-unescaped-entities': ['off'],
    'react-refresh/only-export-components': ['off']
  }
};
