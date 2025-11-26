import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
   plugins: [react()],
   server: {
      port: 3000,
      proxy: {
         '/api': {
            target: 'http://localhost:5000',
            changeOrigin: true,
            secure: false
         }
      }
   }
   ,
   optimizeDeps: {
      esbuildOptions: {
         loader: { '.js': 'jsx' }
      }
   }
   ,
   esbuild: {
      // esbuild.transform expects a single loader string; set to 'jsx'
      // restrict transforms to JS/TS files so CSS is not handed to esbuild
      loader: 'jsx',
      include: /src\/.*\.(jsx|tsx|js|ts)$/
   }
})
