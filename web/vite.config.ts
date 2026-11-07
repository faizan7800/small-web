import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Port 3000 matches the API CORS origin (WEB_ORIGIN=http://localhost:3000).
// If you run this app on 5173 instead, change the API WEB_ORIGIN to
// http://localhost:5173 and restart the API.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
  },
})
