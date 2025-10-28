import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/-2/', // Путь к репозиторию на GitHub Pages (имя репозитория)
})

