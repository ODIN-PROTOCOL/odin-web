/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path')

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/'),
        '@provider': path.resolve(__dirname, 'provider/'),
      },
    },
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
