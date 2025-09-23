import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '26.85.125.221',          // equivale a 0.0.0.0 → accesible en LAN
    port: 5173,
    strictPort: true,
    // Si el HMR no reconecta desde otros dispositivos, descomenta y pon tu IP:
    // hmr: {
    //   host: '192.168.1.123', // ← tu IP local
    //   port: 5173
    // }
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: true,
  },
})
