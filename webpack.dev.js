const path = require('path');
const baseWebpackConfig = require('./webpack.base.js')
const merge = require('webpack-merge');

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    host: 'localhost', 
    port: 9999, 
    compress: true, 
    open: false,  
    overlay: { 
       errors: true 
    },
    hot: true,
    historyApiFallback: true,
    // 服务器代理
    proxy: { 
      // 轮播图片 
      '/musichall': {
        target: `https://c.y.qq.com`,
        changeOrigin: true,
        pathRewrite: {
          // "^/api": '/'
        },
        logLevel: 'debug'
      },  
      // 热门歌曲推荐
      '/cgi-bin': {
        target: `https://u.y.qq.com`,
        changeOrigin: true
      },
      // 歌手列表 | 歌曲列表
      '/v8': {
        target: 'https://c.y.qq.com',
        changeOrigin: true
      },
      // 歌曲播放源 
      '/cgi-bin':{
        target: 'https://u.y.qq.com',
        changeOrigin: true,
        headers: {
          referer: 'https://u.y.qq.com/',
          host: 'u.y.qq.com'  
        }
      },
      // 请求 热门搜索 
      '/splcloud':{
        target: 'https://c.y.qq.com',
        changeOrigin: true,
        headers: {
          referer: 'https://c.y.qq.com/',
          host: 'c.y.qq.com'  
        }
      },
      // 请求搜索内容  
      '/soso':{
        target: 'https://c.y.qq.com',
        changeOrigin: true,
        headers: {
          referer: 'https://c.y.qq.com/',
          host: 'c.y.qq.com'  
        }
      },
      // 请求歌词内容 
      '/lyric':{
        target: 'https://c.y.qq.com',
        changeOrigin: true,
        headers: {
          referer: 'https://c.y.qq.com/',
          host: 'c.y.qq.com'  
        }
      },
      // 请求热门列表歌曲
      '/qzone':{
        target: 'https://c.y.qq.com',
        changeOrigin: true,
        headers: {
          referer: 'https://c.y.qq.com/',
          host: 'c.y.qq.com'  
        }
      },
      // 请求排行列表数据 | 请求排行每一列表歌曲数据 
      '/v8':{
        target: 'https://c.y.qq.com',
        changeOrigin: true,
        headers: {
          referer: 'https://c.y.qq.com/',
          host: 'c.y.qq.com'  
        }
      }
    }
  }
})