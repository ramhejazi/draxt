module.exports = {
    env: {
        commonjs: true,
        es6: true,
        node: true,
    },
    globals: {
        console: true,
    },
    extends: 'eslint:recommended',
    rules: {
        indent: ['error', 4],
        'no-console': 0,
        'linebreak-style': ['error', 'unix'],
        quotes: [1, 'single'],
    },
};
