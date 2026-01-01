import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  root: __dirname,
  plugins: [react()],
  resolve: {
    alias: {
      '@guillotinaweb/react-gmi': path.resolve(__dirname, '../src/guillo-gmi'),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    proxy: {
      '/db': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // Guillotina API endpoints específics
      '/@search': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/@canido': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/@types': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/@vocabularies': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
  preview: {
    port: 4173,
  },
})
