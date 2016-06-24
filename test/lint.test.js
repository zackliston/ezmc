const lint = require('mocha-eslint');

const options = {};
const paths = [
  'lib',
  'index.js'
];

lint(paths, options);
