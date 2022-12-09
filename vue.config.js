process.env.VUE_APP_IPV4 = require('address').ip();

module.exports = {
  configureWebpack: require('./webpack.config'),
  devServer: {
    port: process.env.PORT,
    disableHostCheck: true,
    proxy: {
      '/app_api/v1': {
        target: process.env.VUE_APP_API_HOST
      },
    }
  },
  pluginOptions: {
    lintStyleOnBuild: true,
    stylelint: {
      files: ['src/**/*.{vue,htm,html,css,sss,less,scss}'],
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use('style-px-loader')
      .loader('style-px-loader')
      .options({
        baseDpr: 1,
        precision: 2,
        viewportUnit: 'rpx',
      });

    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use('v-bind-loader')
      .loader('v-bind-loader');

    config.module
      .rule('compile')
      .test(/@dcloudio.+\.js$/)
      .use('uni-loader')
      .loader('uni-loader');

    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: process.env.UNI_PLATFORM === 'h5' ? 2000 : 1 }));
  }
};
