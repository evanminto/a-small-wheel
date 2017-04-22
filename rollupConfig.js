import json from 'rollup-plugin-json';

export default {
  entry: 'src/index.js',
  plugins: [ json() ],
  format: 'iife'
};