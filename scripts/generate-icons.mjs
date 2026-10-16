// Gera os ícones PNG da app (PWA / iOS) a partir de um SVG.
// Uso: npm run icons
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'

const FIGURE = `
  <g fill="none" stroke="#fff" stroke-width="30" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="256" cy="136" r="42" fill="#fff" stroke="none"/>
    <path d="M256 194 V298"/>
    <path d="M256 212 L198 268 L166 326"/>
    <path d="M256 212 L314 268 L346 326"/>
    <path d="M256 298 L146 344 L270 384"/>
    <path d="M256 298 L366 344 L242 384"/>
  </g>`

const svg = (rounded) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="${rounded ? 112 : 0}" fill="#6b5b95"/>${FIGURE}
</svg>`

await mkdir('public/icons', { recursive: true })
const square = Buffer.from(svg(false))
const targets = [
  ['public/icons/icon-192.png', 192],
  ['public/icons/icon-512.png', 512],
  ['public/icons/maskable-512.png', 512],
  ['public/apple-touch-icon-180.png', 180],
]
for (const [file, size] of targets) {
  await sharp(square, { density: 144 }).resize(size, size).png().toFile(file)
  console.log('✓', file)
}
await writeFile('public/favicon.svg', svg(true))
console.log('✓ public/favicon.svg')
