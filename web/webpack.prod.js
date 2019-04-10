const SriPlugin = require('webpack-subresource-integrity')
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new SriPlugin({
      hashFuncNames: ['sha256', 'sha384'],
    }),
  ],
  output: {
    filename: '[name].[hash].bundle.js',
  },
});
