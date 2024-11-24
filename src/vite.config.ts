import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import mkcert from 'vite-plugin-mkcert'
import ckeditor5 from '@ckeditor/vite-plugin-ckeditor5'

// https://vitejs.dev/config/
module.exports = defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    vue(),
    mkcert(),
    ckeditor5({ theme: require.resolve('@ckeditor/ckeditor5-theme-lark') }),
  ],
})
