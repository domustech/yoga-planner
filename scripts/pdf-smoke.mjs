// Gera um PDF de exemplo (aula de demonstração) para rever o layout.
// Uso: npm run pdf:smoke [caminho/para/saida.pdf]
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { createServer } from 'vite'

const out = resolve(process.argv[2] ?? 'dist/aula-exemplo.pdf')
const server = await createServer({
  configFile: 'vite.config.ts',
  server: { middlewareMode: true },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
  logLevel: 'error',
})
try {
  const { buildClassPdf } = await server.ssrLoadModule('/src/lib/pdf/classPdf.ts')
  const { createSampleClass } = await server.ssrLoadModule('/src/lib/classFactory.ts')
  const aula = createSampleClass()
  // notas em alguns itens para testar o layout dos cartões
  aula.fases[0].itens[0].notas = 'Convidar a fechar os olhos e sentir os pontos de apoio.'
  aula.fases[4].itens[1].notas = 'Variante com bloco sob a mão. 5 respirações por lado, foco na expiração longa e no apoio do pé de trás.'
  const doc = buildClassPdf(aula)
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, Buffer.from(doc.output('arraybuffer')))
  console.log('PDF gerado:', out, '| páginas:', doc.getNumberOfPages())
} finally {
  await server.close()
}
