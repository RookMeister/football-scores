module.exports = {
  devServer: {
    proxy: {
      '^/api': {
        target: process.env.API_URL,
        changeOrigin: true
      },
    }
  }
}