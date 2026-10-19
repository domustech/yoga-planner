// Renderiza as aquarelas geradas para PNG: folhas de contacto, uma imagem por postura,
// ou só algumas posturas.
// Uso: node scripts/render-watercolor.mjs <pasta-saida> [--por-postura] [--ids a,b,c] [--cols N] [--cell PX] [--estilo aquarela|silhueta]
import { mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import sharp from 'sharp'
import { createServer } from 'vite'

const args = process.argv.slice(2)
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def }
const out = resolve(args.find((a) => !a.startsWith('--') && !args[args.indexOf(a) - 1]?.startsWith('--')) ?? 'dist/aquarelas')
const porPostura = args.includes('--por-postura')
const ids = opt('--ids', '')?.split(',').filter(Boolean) ?? []
const COLS = Number(opt('--cols', 4))
const CELL = Number(opt('--cell', 230))
const ESTILO = opt('--estilo', 'flat')
mkdirSync(out, { recursive: true })

const server = await createServer({
  configFile: 'vite.config.ts',
  server: { middlewareMode: true },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
  logLevel: 'error',
})
try {
  const mod = await server.ssrLoadModule('/scripts/wc-render-entry.tsx')
  const poses = ids.length ? ids.map((id) => mod.POSES.find((p) => p.id === id)).filter(Boolean) : mod.POSES
  if (porPostura) {
    for (const p of poses) {
      await sharp(Buffer.from(mod.renderPoseSvg(p, ESTILO)), { density: 192 }).resize(640, 640).png().toFile(join(out, `${p.id}.png`))
    }
    console.log(`${poses.length} PNG em ${out}`)
  } else {
    const ROWS = ids.length ? Math.ceil(poses.length / COLS) : 4
    const LABEL = 26
    const W = COLS * CELL, H = ROWS * (CELL + LABEL)
    const perSheet = COLS * ROWS
    const sheets = Math.ceil(poses.length / perSheet)
    for (let s = 0; s < sheets; s++) {
      const items = poses.slice(s * perSheet, (s + 1) * perSheet)
      const inner = items.map((p, i) => {
        const x = (i % COLS) * CELL, y = Math.floor(i / COLS) * (CELL + LABEL)
        const svg = mod.renderPoseSvg(p, ESTILO).replace(/<svg[^>]*viewBox="0 0 100 100"[^>]*>/, `<svg x="${x}" y="${y}" width="${CELL}" height="${CELL}" viewBox="0 0 100 100">`)
        const nome = p.nome.replace(/&/g, '&amp;').replace(/</g, '&lt;')
        return `${svg}<text x="${x + CELL / 2}" y="${y + CELL + 17}" font-family="Arial" font-size="${Math.round(CELL / 18)}" text-anchor="middle" fill="#3a3630">${nome}</text>`
      }).join('')
      const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#fdfbf7"/>${inner}</svg>`
      const file = join(out, ids.length ? `validacao-${ESTILO}.png` : `folha-${String(s + 1).padStart(2, '0')}.png`)
      await sharp(Buffer.from(sheet), { density: 96 }).png().toFile(file)
      console.log('✓', file)
    }
  }
} finally {
  await server.close()
}
