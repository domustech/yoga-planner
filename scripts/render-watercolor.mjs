// Renderiza as aquarelas geradas para PNG (folhas de contacto ou uma imagem por postura).
// Uso: node scripts/render-watercolor.mjs <pasta-saida> [--por-postura]
import { mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import sharp from 'sharp'
import { createServer } from 'vite'

const out = resolve(process.argv[2] ?? 'dist/aquarelas')
const porPostura = process.argv.includes('--por-postura')
mkdirSync(out, { recursive: true })

const server = await createServer({
  configFile: 'vite.config.ts',
  server: { middlewareMode: true },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
  logLevel: 'error',
})
try {
  const { POSES, renderPoseSvg } = await server.ssrLoadModule('/scripts/wc-render-entry.tsx')
  if (porPostura) {
    for (const p of POSES) {
      const svg = renderPoseSvg(p)
      await sharp(Buffer.from(svg), { density: 192 }).resize(640, 640).png().toFile(join(out, `${p.id}.png`))
    }
    console.log(`${POSES.length} PNG em ${out}`)
  } else {
    const COLS = 4, ROWS = 4, CELL = 230, LABEL = 26
    const W = COLS * CELL, H = ROWS * (CELL + LABEL)
    const sheets = Math.ceil(POSES.length / (COLS * ROWS))
    for (let s = 0; s < sheets; s++) {
      const items = POSES.slice(s * COLS * ROWS, (s + 1) * COLS * ROWS)
      const inner = items.map((p, i) => {
        const x = (i % COLS) * CELL, y = Math.floor(i / COLS) * (CELL + LABEL)
        const svg = renderPoseSvg(p).replace(/<svg[^>]*viewBox="0 0 100 100"[^>]*>/, `<svg x="${x}" y="${y}" width="${CELL}" height="${CELL}" viewBox="0 0 100 100">`)
        const nome = p.nome.replace(/&/g, '&amp;').replace(/</g, '&lt;')
        return `${svg}<text x="${x + CELL / 2}" y="${y + CELL + 17}" font-family="Arial" font-size="12" text-anchor="middle" fill="#3a3630">${nome}</text>`
      }).join('')
      const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#fdfbf7"/>${inner}</svg>`
      const file = join(out, `folha-${String(s + 1).padStart(2, '0')}.png`)
      await sharp(Buffer.from(sheet), { density: 96 }).png().toFile(file)
      console.log('✓', file)
    }
  }
} finally {
  await server.close()
}
