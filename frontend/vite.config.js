import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
<<<<<<< HEAD
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // TODO: Change this to your local backend URL and port
        changeOrigin: true,
        secure: false,
      }
    }
  }
=======
  plugins: [react()],
>>>>>>> d1009882834a549e4c2a650b5afe51864f428f02
})
