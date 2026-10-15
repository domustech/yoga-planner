import { HATHA_PHASE_TEMPLATE } from '../data/phases'
import { getPose } from '../data/poses'
import type { ClassItem, ClassPhase, Level, YogaClass } from '../data/types'
import { uid } from './utils'

export function createPhasesFromTemplate(): ClassPhase[] {
  return HATHA_PHASE_TEMPLATE.map((t) => ({
    id: uid(),
    nome: t.nome,
    categoriasSugeridas: t.categoriasSugeridas,
    itens: [],
    notas: t.notas,
  }))
}

/** Cria um item de aula a partir de uma postura, com a duração sugerida. */
export function createItem(poseId: string, duracao?: number): ClassItem {
  const pose = getPose(poseId)
  const base = pose?.duracaoSugerida ?? 60
  const total = duracao ?? (pose?.bilateral ? base * 2 : base)
  return { id: uid(), poseId, duracao: total }
}

export function createEmptyClass(nome = 'Nova aula', nivel: Level = 'iniciante', duracaoAlvo = 60): YogaClass {
  const now = new Date().toISOString()
  return {
    id: uid(),
    nome,
    nivel,
    duracaoAlvo,
    fases: createPhasesFromTemplate(),
    criadoEm: now,
    atualizadoEm: now,
  }
}

/** Aula de exemplo (Hatha, 60 min, iniciantes) para demonstrar a aplicação. */
export function createSampleClass(): YogaClass {
  const aula = createEmptyClass('Hatha suave — 60 min', 'iniciante', 60)
  aula.descricao = 'Aula de exemplo com a estrutura clássica de Hatha Yoga. Edite à vontade.'
  aula.tema = 'Enraizamento e abertura do peito'

  const fill: Record<string, string[]> = {
    Centramento: ['chegada-intencao', 'mantra-om'],
    Pranayama: ['respiracao-abdominal', 'nadi-shodhana'],
    Aquecimento: ['rotacoes-pescoco', 'rotacoes-ombros', 'marjaryasana-bitilasana', 'balasana'],
    'Saudação ao Sol': ['surya-namaskar', 'surya-namaskar'],
    'Posturas em pé': ['tadasana', 'virabhadrasana-1', 'virabhadrasana-2', 'trikonasana', 'vrksasana'],
    'Posturas no chão': ['dandasana', 'paschimottanasana', 'baddha-konasana', 'bhujangasana', 'setu-bandhasana', 'supta-matsyendrasana'],
    Inversões: ['viparita-karani'],
    'Relaxamento final': ['savasana'],
    'Meditação e encerramento': ['meditacao-respiracao', 'encerramento'],
  }

  for (const fase of aula.fases) {
    const ids = fill[fase.nome] ?? []
    fase.itens = ids.map((id) => createItem(id))
  }
  return aula
}
