module.exports = {
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
