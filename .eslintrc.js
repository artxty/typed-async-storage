module.exports = {
  plugins: ['jest'],
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
    'jest/globals': true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
  },
};
