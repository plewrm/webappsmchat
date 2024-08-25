import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig(() => {
  // const env = loadEnv(mode, process.cwd(), '')
  return {
    build: {
      target: 'esnext',
      rollupOptions: {}
    },
    define: {
      'process.env': process.env,
      VITE_GOOGLE_MAPS_API_KEY: JSON.stringify(process.env.VITE_GOOGLE_MAPS_API_KEY),
      VITE_WEB3AUTH_CLIENT_ID: JSON.stringify(process.env.VITE_WEB3AUTH_CLIENT_ID),
      VITE_WALLET_CONNECT_PROJECT_ID: JSON.stringify(process.env.VITE_WALLET_CONNECT_PROJECT_ID),
      VITE_HUDDLE_PROJECT_ID: JSON.stringify(process.env.VITE_HUDDLE_PROJECT_ID),
      'process.version': {},
      global: 'globalThis'
    },
    optimizeDeps: {
      exclude: ['chunk-6PILBWZX.js']
    },
    plugins: [react(), svgr({ svgrOptions: { icon: true } })]
  };
});
