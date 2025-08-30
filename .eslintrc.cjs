module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/vue3-recommended',
        'plugin:prettier/recommended',
        '@vue/eslint-config-prettier',
        '@vue/eslint-config-standard',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
}
