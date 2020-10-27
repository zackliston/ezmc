/* eslint-disable import/no-extraneous-dependencies */
const lint = require('mocha-eslint');

const options = {
  formatter: 'compact',
  slow: 10000,
  timeout: 60000
};
const paths = ['index.js'];

lint(paths, options);
