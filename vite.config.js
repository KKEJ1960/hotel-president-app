import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false, // désactivé en production
  },
  server: {
    host: true,
    port: 5174,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
