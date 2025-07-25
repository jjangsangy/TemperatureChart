module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    plugins: [
        '@typescript-eslint'
    ],
    env: {
        browser: true,
        es2021: true
    },
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
};