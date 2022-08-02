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
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Football Scores',
        short_name: 'Football Scores',
        theme_color: '',
        background_color: '',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/matches',
        icons: [
          {
            'src': '/icon-72x72.png',
            'sizes': '72x72',
            'type': 'image/png'
          },
          {
            'src': '/icon-96x96.png',
            'sizes': '96x96',
            'type': 'image/png'
          },
          {
            'src': '/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': '/icon-144x144.png',
            'sizes': '144x144',
            'type': 'image/png'
          },
          {
            'src': '/icon-152x152.png',
            'sizes': '152x152',
            'type': 'image/png'
          },
          {
            'src': '/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': '/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': '/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    }),
  ]
})
