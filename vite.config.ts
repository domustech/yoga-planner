import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

/**
 * Caminho base da app.
 * - desenvolvimento / build normal: "/"
 * - modo "pages" (npm run build:pages): "/yoga-planner/", o sub-caminho do GitHub Pages
 * - BASE_PATH no ambiente sobrepõe-se a ambos (para publicar noutro sítio).
 */
function resolveBase(mode: string): string {
  if (process.env.BASE_PATH) return process.env.BASE_PATH
  return mode === 'pages' ? '/yoga-planner/' : '/'
}

export default defineConfig(({ mode }) => ({
  base: resolveBase(mode),
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon-180.png'],
      manifest: {
        name: 'Yoga Planner',
        short_name: 'Yoga Planner',
        description: 'Planeamento e desenho de aulas de Hatha Yoga para instrutores.',
        lang: 'pt-PT',
        theme_color: '#6b5b95',
        background_color: '#f6f3ee',
        display: 'standalone',
        orientation: 'any',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Pré-carrega toda a app para funcionar offline depois da primeira visita.
        globPatterns: ['**/*.{js,css,html,svg,png,webmanifest}'],
      },
    }),
  ],
  server: { port: 5173 },
}))
