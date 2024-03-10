// import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [react({ jsxImportSource: '@welldone-software/why-did-you-render'} )],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
