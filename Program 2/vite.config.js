import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for Program 2 - Blood Donor Registry
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false
  }
});
