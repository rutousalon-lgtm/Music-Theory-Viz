import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Correctly inject the API key from the build environment
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
});