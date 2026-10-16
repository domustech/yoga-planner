// Gera os prompts (em inglês) para criar as ilustrações em aquarela de todas as posturas
// num gerador de imagens, com um estilo e uma personagem consistentes.
//
// Uso: npm run imagens:prompts
// Saída: docs/imagens/prompts.md, prompts.csv e prompts.json
import { mkdirSync, writeFileSync } from 'node:fs'
import { createServer } from 'vite'
import { POSE_VISUALS } from './pose-visuals.mjs'

const STYLE =
  'Loose watercolor illustration on a plain white background, soft washes with visible brush strokes, a few light paint splatters, gentle paper texture, soft natural shadows, no outlines, muted natural palette.'
const CHARACTER =
  'The same woman in every image: slim, light-brown hair tied in a loose ponytail, olive-green sports top and light teal leggings, barefoot, calm expression.'
const RULES =
  'Anatomically correct pose with the right number of limbs, full body visible and centered, nothing cropped, no text, no watermark, no logo, no mat pattern, square format.'

const server = await createServer({
  configFile: 'vite.config.ts',
  server: { middlewareMode: true },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
  logLevel: 'error',
})
try {
  const { POSES } = await server.ssrLoadModule('/src/data/poses.ts')
  const linhas = []
  const emFalta = []
  for (const p of POSES) {
    const visual = POSE_VISUALS[p.id]
    if (!visual) emFalta.push(p.id)
    const nomeEn = p.ingles ? `${p.ingles} (${p.sanscrito})` : p.sanscrito
    const sujeito = p.tipo === 'mudra' && /close-up/.test(visual ?? '') ? 'Hand/face detail of a woman practicing yoga.' : 'A woman practicing yoga.'
    const prompt = [STYLE, sujeito, `Pose: ${nomeEn}: ${visual ?? p.nome}.`, CHARACTER, RULES].join(' ')
    linhas.push({ id: p.id, nome: p.nome, sanscrito: p.sanscrito, ficheiro: `${p.id}.png`, prompt })
  }

  mkdirSync('docs/imagens', { recursive: true })

  const md = [
    '# Prompts para as ilustrações em aquarela',
    '',
    `Gerado por \`npm run imagens:prompts\`. ${linhas.length} posturas.`,
    '',
    'Como usar: copie o prompt para o gerador de imagens (formato quadrado, 1024×1024 ou superior), guarde a imagem com o',
    'nome do ficheiro indicado numa pasta e importe com `npm run imagens:importar -- <pasta>`.',
    'Se o gerador aceitar uma imagem de referência de estilo, use sempre a mesma (ex.: `docs/imagens/referencia.png`).',
    '',
    '| # | Postura | Ficheiro | Prompt |',
    '|---|---------|----------|--------|',
    ...linhas.map((l, i) => `| ${i + 1} | ${l.nome} (${l.sanscrito}) | \`${l.ficheiro}\` | ${l.prompt} |`),
    '',
  ].join('\n')
  writeFileSync('docs/imagens/prompts.md', md)

  const csv = ['id;nome;ficheiro;prompt', ...linhas.map((l) => [l.id, l.nome, l.ficheiro, l.prompt].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(';'))].join('\n')
  writeFileSync('docs/imagens/prompts.csv', '﻿' + csv)
  writeFileSync('docs/imagens/prompts.json', JSON.stringify(linhas, null, 2))

  console.log(`Prompts gerados para ${linhas.length} posturas em docs/imagens/ (md, csv, json).`)
  if (emFalta.length) console.log('Sem descrição visual (usado o nome):', emFalta.join(', '))
} finally {
  await server.close()
}
