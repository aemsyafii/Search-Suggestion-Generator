import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Search-Suggestion-Generator/',
  plugins: [react()],
  server: {
    port: 3000
  }
});
