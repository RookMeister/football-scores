import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve as pathResolve } from 'path';

export default defineConfig({
  base: '/',
  server: {
    host: true,
    port: Number(process.env.WEB_PORT) || 3000,
    proxy: {
      '^/api': {
        target: process.env.API_URL || 'https://footballscores.ru',
        changeOrigin: true
      },
    },
    watch: {
      ignored: [
        '!**/node_modules/**'
      ]
    },
    hmr: {},
  },
  resolve:{
    alias:{
      '@web' : pathResolve(__dirname, './src')
    },
  },
  plugins: [vue()]
})
