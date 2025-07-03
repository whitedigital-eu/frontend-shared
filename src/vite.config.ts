import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import mkcert from 'vite-plugin-mkcert'
import ckeditor5 from '@ckeditor/vite-plugin-ckeditor5'
import { fileURLToPath } from 'url'

// Get the path to the CKEditor 5 theme
const themePath = new URL('@ckeditor/ckeditor5-theme-lark', import.meta.url).pathname

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    vue(),
    mkcert(),
    ckeditor5({ theme: themePath }),
  ],
})
