// Importa ilustrações das posturas para public/poses/<id>.webp e regenera o manifesto
// src/data/poseImages.ts.
//
// Uso: npm run imagens:importar -- <pasta-com-imagens>
// A pasta deve conter ficheiros chamados <id-da-postura>.png|jpg|jpeg|webp
// (o id é o da postura em src/data/poses.ts, ex.: trikonasana.png).
// Ficheiros com nomes que não correspondam a nenhuma postura são ignorados (e listados).
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, parse, resolve } from 'node:path'
import sharp from 'sharp'

const SIZE = 720
const PAD = 16
const OUT_DIR = 'public/poses'
const MANIFEST = 'src/data/poseImages.ts'

const ids = new Set([...readFileSync('src/data/poses.ts', 'utf8').matchAll(/^ {4}id: '([a-z0-9-]+)'/gm)].map((m) => m[1]))

const pasta = process.argv[2] ? resolve(process.argv[2]) : null
mkdirSync(OUT_DIR, { recursive: true })

let importados = 0
const ignorados = []
if (pasta) {
  if (!existsSync(pasta)) {
    console.error('Pasta não encontrada:', pasta)
    process.exit(1)
  }
  const ficheiros = readdirSync(pasta).filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
  for (const f of ficheiros) {
    const id = parse(f).name.toLowerCase().trim()
    if (!ids.has(id)) {
      ignorados.push(f)
      continue
    }
    const destino = join(OUT_DIR, `${id}.webp`)
    // cor de fundo = pixel do canto superior esquerdo (branco, creme, etc.)
    const base = sharp(join(pasta, f)).flatten({ background: '#ffffff' })
    const { data, info } = await base.clone().raw().toBuffer({ resolveWithObject: true })
    const bg = { r: data[0], g: data[1], b: data[2] }
    void info
    // recorta as margens dessa cor, encaixa num quadrado com margem e o mesmo fundo, WebP
    await base
      .trim({ threshold: 14 })
      .resize(SIZE - 2 * PAD, SIZE - 2 * PAD, { fit: 'contain', background: bg })
      .extend({ top: PAD, bottom: PAD, left: PAD, right: PAD, background: bg })
      .webp({ quality: 84 })
      .toFile(destino)
    importados++
    console.log('✓', f, '→', destino)
  }
}

// manifesto a partir do que existe em public/poses
const existentes = readdirSync(OUT_DIR)
  .filter((f) => f.endsWith('.webp'))
  .map((f) => parse(f).name)
  .filter((id) => ids.has(id))
  .sort()

const conteudo = [
  '// Gerado por scripts/import-pose-images.mjs — não editar à mão.',
  '/** Posturas com ilustração em public/poses/<id>.webp (id → caminho relativo à base). */',
  'export const POSE_IMAGES: Record<string, string> = {',
  ...existentes.map((id) => `  '${id}': 'poses/${id}.webp',`),
  '}',
  '',
].join('\n')
writeFileSync(MANIFEST, conteudo)

console.log(`\nImportadas agora: ${importados}. Com ilustração: ${existentes.length} de ${ids.size} posturas.`)
if (ignorados.length) console.log('Ignorados (nome não corresponde a nenhuma postura):', ignorados.join(', '))
const semImagem = [...ids].filter((id) => !existentes.includes(id))
if (semImagem.length) console.log(`Sem ilustração (${semImagem.length}):`, semImagem.join(', '))
