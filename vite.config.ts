import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any request starting with /api/n8n will be forwarded to your local n8n
      '/api/n8n': {
        target: 'http://localhost:5678', // Or http://host.docker.internal:5678
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/n8n/, '/webhook')
      }
    }
  }
})