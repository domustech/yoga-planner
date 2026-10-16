// Testa o gerador automático de aulas em todas as combinações de tipo/duração/nível.
// Uso: npm run gen:smoke
import { createServer } from 'vite'

const server = await createServer({
  configFile: 'vite.config.ts',
  server: { middlewareMode: true },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
  logLevel: 'error',
})
try {
  const gen = await server.ssrLoadModule('/src/lib/classGenerator.ts')
  const { getPose } = await server.ssrLoadModule('/src/data/poses.ts')
  const ORDER = { iniciante: 0, intermedio: 1, avancado: 2 }
  const problemas = []
  let n = 0
  for (const tipo of gen.TIPOS_AULA.map((t) => t.id)) {
    for (const duracao of gen.DURACOES) {
      for (const nivel of ['iniciante', 'intermedio', 'avancado']) {
        for (const seed of [1, 2]) {
          const a = { ...gen.defaultAnswers(tipo), duracao, nivel }
          const aula = gen.gerarAula(a, seed)
          n++
          const total = aula.fases.flatMap((f) => f.itens).reduce((s, it) => s + it.duracao, 0)
          const tag = `${tipo}/${duracao}/${nivel}/s${seed}`
          if (total !== duracao * 60) problemas.push(`${tag}: total ${total}s != ${duracao * 60}s`)
          const vistos = new Set()
          for (const f of aula.fases) {
            if (f.itens.length === 0) problemas.push(`${tag}: fase "${f.nome}" vazia`)
            for (const it of f.itens) {
              const p = getPose(it.poseId)
              if (!p) {
                problemas.push(`${tag}: postura desconhecida ${it.poseId}`)
                continue
              }
              if (ORDER[p.nivel] > ORDER[nivel]) problemas.push(`${tag}: ${p.id} (${p.nivel}) acima do nível`)
              if (it.duracao < 15) problemas.push(`${tag}: ${p.id} duração ${it.duracao}s`)
              if (p.id !== 'surya-namaskar' && vistos.has(p.id)) problemas.push(`${tag}: ${p.id} repetida`)
              vistos.add(p.id)
            }
          }
        }
      }
    }
  }
  console.log(`aulas geradas: ${n}; problemas: ${problemas.length}`)
  for (const p of problemas.slice(0, 30)) console.log(' -', p)

  // exemplo legível
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  const exemplo = gen.gerarAula(
    {
      ...gen.defaultAnswers('classica'),
      duracao: 60,
      nivel: 'intermedio',
      focos: ['ancas'],
      chakras: ['anahata'],
      acessorios: ['cinto', 'bloco'],
    },
    1,
  )
  console.log(`\n${exemplo.nome} — ${exemplo.tema}`)
  for (const f of exemplo.fases) {
    const d = f.itens.reduce((s, it) => s + it.duracao, 0)
    console.log(`\n[${f.nome}] ${fmt(d)}`)
    for (const it of f.itens) {
      const p = getPose(it.poseId)
      const nota = it.notas ? `  [${it.notas.slice(0, 60)}]` : ''
      console.log(`  - ${p.nome} (${p.nivel}, ${p.efeito}) ${fmt(it.duracao)}${nota}`)
    }
  }
  if (problemas.length) process.exitCode = 1
} finally {
  await server.close()
}
