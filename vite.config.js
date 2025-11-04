import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Корневой путь для custom domain
  define: {
    // Встраиваем время сборки в код
    'import.meta.env.VITE_BUILD_TIME': JSON.stringify(new Date().toISOString())
  }
})

