const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackObfuscator = require('webpack-obfuscator');

const { NODE_ENV, UNI_PLATFORM } = process.env;

module.exports = {
  watchOptions: {
    ignored: /node_modules/
  },
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, 'loader')]
  },
  resolve: {
    alias: {
      '@': path.resolve('src'),
    },
  },
  optimization: {
    minimizer: [
      // 只处理 common 文件下的js代码混淆，目前发现page，component页面对应s混淆会报错，故过滤
      process.env.NODE_ENV === 'production' && new WebpackObfuscator({
        rotateStringArray: true
      }, ['pages/**/*.js', 'components/**/*.js']),
      new TerserPlugin({
        sourceMap: true,
        terserOptions: {
          output: {
            comments: false,  // 删除注释
            beautify: UNI_PLATFORM === 'mp-weixin' && NODE_ENV === 'development',  // 微信使用开发者工具的压缩，这里不压缩，方便调试
            indent_level: 2,  // 缩进 2
          },
        },
        extractComments: false,
      })
    ].filter(Boolean)
  }
};
