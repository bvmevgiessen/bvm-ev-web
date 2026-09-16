import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, loadEnv, type Plugin} from 'vite';

function safeJsonPlugin(): Plugin {
  return {
    name: 'safe-json-plugin',
    enforce: 'pre',
    load(id: string) {
      const cleanId = id.split('?')[0];
      if (cleanId.endsWith('.json')) {
        const isArrayExpected =
          cleanId.endsWith('events.json') ||
          cleanId.endsWith('blogs.json') ||
          cleanId.endsWith('latest_updates.json') ||
          cleanId.endsWith('news.json');
        const fallback = isArrayExpected ? '[]' : '{}';

        try {
          if (fs.existsSync(cleanId)) {
            const raw = fs.readFileSync(cleanId, 'utf-8');
            const trimmed = raw.trim();
            if (!trimmed) {
              console.warn(`[safe-json-plugin] Empty JSON in ${cleanId}, using fallback.`);
              return fallback;
            }
            try {
              JSON.parse(trimmed);
              return raw;
            } catch {
              console.warn(`[safe-json-plugin] Malformed JSON in ${cleanId}, using fallback.`);
              return fallback;
            }
          }
          return fallback;
        } catch {
          return fallback;
        }
      }
      return null;
    },
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: process.env.VITE_BASE_PATH || '/',
    plugins: [safeJsonPlugin(), react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || ''),
      'import.meta.env.VITE_FIREBASE_API_KEY': JSON.stringify(env.VITE_FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY || ''),
      'import.meta.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(env.VITE_FIREBASE_AUTH_DOMAIN || process.env.VITE_FIREBASE_AUTH_DOMAIN || ''),
      'import.meta.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(env.VITE_FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || ''),
      'import.meta.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify(env.VITE_FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET || ''),
      'import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || ''),
      'import.meta.env.VITE_FIREBASE_APP_ID': JSON.stringify(env.VITE_FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID || ''),
      'import.meta.env.VITE_FIREBASE_DATABASE_ID': JSON.stringify(env.VITE_FIREBASE_DATABASE_ID || process.env.VITE_FIREBASE_DATABASE_ID || ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      },
    },
    server: {
      host: true,
      allowedHosts: true,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});