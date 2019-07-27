// production 
const baseWebpackConfig = require('./webpack.base.js');
const merge = require('webpack-merge');
module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  // 把第三方库打包出来
  optimization: {
    splitChunks: {
      chunks: "all"
    }
  },
  devtool : 'source-map'
})