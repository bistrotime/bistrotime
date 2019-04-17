const SriPlugin = require('webpack-subresource-integrity');
const merge = require('webpack-merge');
const Dotenv = require('dotenv-webpack');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new Dotenv({
      systemvars: true,
      silent: true,
    }),
    new SriPlugin({
      hashFuncNames: ['sha256', 'sha384'],
    }),
  ],
  output: {
    filename: '[name].[hash].bundle.js',
  },
});
