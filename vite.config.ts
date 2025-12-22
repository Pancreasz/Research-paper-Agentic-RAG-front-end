import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <--- IMPORT THIS

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <--- ADD THIS
  ],
  server: {
    proxy: {
      '/api/n8n': {
        target: 'http://localhost:5678',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/n8n/, '/webhook')
      }
    }
  }
})