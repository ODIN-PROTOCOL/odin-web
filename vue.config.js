/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack')

const path = require('path')

module.exports = {
  configureWebpack: {
    resolve: {
      fallback: {
        fs: false,
        path: false,
        os: false,
        stream: false,
        crypto: false,
        https: false,
        http: false,
        util: false,
        url: false,
      },
      alias: {
        '@': path.resolve(__dirname, 'src/'),
        '@provider': path.resolve(__dirname, 'provider/'),
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/styles/_mixins.scss";
          @import "@/styles/_variables.scss";
        `,
      },
    },
  },
}
