import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa'
import { resolve as pathResolve } from 'path';

export default defineConfig({
  base: '/',
  server: {
    host: true,
    port: Number(process.env.WEB_PORT),
    proxy: {
      '^/api': {
        target: process.env.API_URL,
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
  plugins: [
    vue(),
    VitePWA({
      manifest: {
        name: 'Football Scores',
        short_name: 'FS',
        description: 'Football Scores',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    }),
  ]
})
