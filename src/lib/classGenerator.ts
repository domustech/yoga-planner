import { HATHA_PHASE_TEMPLATE } from '../data/phases'
import { POSES, getPose } from '../data/poses'
import type { Acessorio, CategoryId, ChakraId, ClassItem, ClassPhase, Efeito, Level, Pose, YogaClass } from '../data/types'
import { uid } from './utils'

// ---------------------------------------------------------------------------
// Gerador automático de aulas (wizard "Criar aula automática")
// ---------------------------------------------------------------------------

export type TipoAula = 'classica' | 'suave' | 'dinamica' | 'restaurativa' | 'interior'

export type Foco = 'ancas' | 'coluna' | 'flexibilidade' | 'pernas' | 'equilibrio' | 'core' | 'torcoes'

export const DURACOES = [30, 45, 60, 75, 90] as const
export type Duracao = (typeof DURACOES)[number]

export interface WizardAnswers {
  tipo: TipoAula
  duracao: Duracao
  nivel: Level
  /** 'auto' = efeito natural do tipo de aula. */
  efeito: Efeito | 'auto'
  focos: Foco[]
  chakras: ChakraId[]
  incluir: {
    saudacao: boolean
    inversoes: boolean
    mudras: boolean
    yogaNidra: boolean
  }
  acessorios: Acessorio[]
  nome?: string
}

/** Nomes das fases (índices do HATHA_PHASE_TEMPLATE). */
const F = {
  centramento: 0,
  pranayama: 1,
  aquecimento: 2,
  saudacao: 3,
  emPe: 4,
  chao: 5,
  inversoes: 6,
  relaxamento: 7,
  meditacao: 8,
} as const

export interface TipoAulaInfo {
  id: TipoAula
  nome: string
  descricao: string
  efeito: Efeito
  /** Peso (%) de cada fase, pela ordem do HATHA_PHASE_TEMPLATE. */
  pesos: number[]
  defaults: Pick<WizardAnswers, 'nivel' | 'incluir'>
}

export const TIPOS_AULA: TipoAulaInfo[] = [
  {
    id: 'classica',
    nome: 'Hatha clássica',
    descricao: 'Estrutura completa: pranayama, saudação ao sol, posturas em pé e no chão, inversões e relaxamento.',
    efeito: 'equilibrante',
    pesos: [5, 8, 10, 10, 17, 22, 8, 14, 6],
    defaults: { nivel: 'intermedio', incluir: { saudacao: true, inversoes: true, mudras: false, yogaNidra: false } },
  },
  {
    id: 'suave',
    nome: 'Hatha suave',
    descricao: 'Ritmo lento, mais tempo no chão e no relaxamento. Boa para iniciantes e fins de dia.',
    efeito: 'calmante',
    pesos: [6, 9, 12, 5, 12, 26, 6, 17, 7],
    defaults: { nivel: 'iniciante', incluir: { saudacao: true, inversoes: true, mudras: false, yogaNidra: false } },
  },
  {
    id: 'dinamica',
    nome: 'Hatha dinâmica',
    descricao: 'Mais saudações ao sol, posturas em pé e trabalho de core. Aquece e energiza.',
    efeito: 'energizante',
    pesos: [4, 6, 10, 16, 24, 20, 7, 9, 4],
    defaults: { nivel: 'intermedio', incluir: { saudacao: true, inversoes: true, mudras: false, yogaNidra: false } },
  },
  {
    id: 'restaurativa',
    nome: 'Restaurativa',
    descricao: 'Posturas passivas com apoios, permanências longas, pernas elevadas e relaxamento profundo.',
    efeito: 'calmante',
    pesos: [7, 10, 12, 0, 0, 36, 7, 22, 6],
    defaults: { nivel: 'iniciante', incluir: { saudacao: false, inversoes: true, mudras: false, yogaNidra: true } },
  },
  {
    id: 'interior',
    nome: 'Pranayama e meditação',
    descricao: 'Corpo preparado com suavidade; o centro da aula é a respiração, os mudras e a meditação.',
    efeito: 'calmante',
    pesos: [8, 25, 10, 0, 6, 16, 0, 15, 20],
    defaults: { nivel: 'iniciante', incluir: { saudacao: false, inversoes: false, mudras: true, yogaNidra: false } },
  },
]

export const TIPO_MAP: Record<TipoAula, TipoAulaInfo> = Object.fromEntries(TIPOS_AULA.map((t) => [t.id, t])) as Record<
  TipoAula,
  TipoAulaInfo
>

export interface FocoInfo {
  id: Foco
  nome: string
  descricao: string
  categorias: CategoryId[]
}

export const FOCOS: FocoInfo[] = [
  { id: 'ancas', nome: 'Ancas', descricao: 'Abertura e mobilidade da bacia', categorias: ['ancas'] },
  { id: 'coluna', nome: 'Coluna e peito', descricao: 'Extensões, abertura do peito', categorias: ['extensao'] },
  { id: 'flexibilidade', nome: 'Cadeia posterior', descricao: 'Flexões à frente, isquiotibiais', categorias: ['flexao'] },
  { id: 'pernas', nome: 'Pernas e força', descricao: 'Posturas de pé, enraizamento', categorias: ['em-pe'] },
  { id: 'equilibrio', nome: 'Equilíbrio', descricao: 'Foco e estabilidade', categorias: ['equilibrio'] },
  { id: 'core', nome: 'Core', descricao: 'Abdómen e centro', categorias: ['core'] },
  { id: 'torcoes', nome: 'Torções', descricao: 'Rotação da coluna, digestão', categorias: ['torcao'] },
]

export const FOCO_MAP: Record<Foco, FocoInfo> = Object.fromEntries(FOCOS.map((f) => [f.id, f])) as Record<Foco, FocoInfo>

export function defaultAnswers(tipo: TipoAula = 'classica'): WizardAnswers {
  const t = TIPO_MAP[tipo]
  return {
    tipo,
    duracao: 60,
    nivel: t.defaults.nivel,
    efeito: 'auto',
    focos: [],
    chakras: [],
    incluir: { ...t.defaults.incluir },
    acessorios: [],
  }
}

/** Aplica os valores por omissão de um tipo mantendo o resto das respostas. */
export function applyTipo(answers: WizardAnswers, tipo: TipoAula): WizardAnswers {
  const t = TIPO_MAP[tipo]
  return { ...answers, tipo, nivel: t.defaults.nivel, incluir: { ...t.defaults.incluir } }
}

export function efeitoEfetivo(a: WizardAnswers): Efeito {
  return a.efeito === 'auto' ? TIPO_MAP[a.tipo].efeito : a.efeito
}

// ---------------------------------------------------------------------------
// Utilitários
// ---------------------------------------------------------------------------

/** Gerador pseudo-aleatório determinístico (mulberry32). */
function rng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const LEVEL_ORDER: Record<Level, number> = { iniciante: 0, intermedio: 1, avancado: 2 }

function nivelPermitido(pose: Pose, nivel: Level): boolean {
  return LEVEL_ORDER[pose.nivel] <= LEVEL_ORDER[nivel]
}

/** Duração total de um item (ambos os lados se bilateral). */
function duracaoItem(pose: Pose): number {
  return pose.bilateral ? pose.duracaoSugerida * 2 : pose.duracaoSugerida
}

function round15(s: number): number {
  return Math.max(15, Math.round(s / 15) * 15)
}

interface Ctx {
  a: WizardAnswers
  efeito: Efeito
  rand: () => number
  usados: Set<string>
  focoCats: Set<CategoryId>
}

/** Pontuação de adequação de uma postura às respostas (maior = melhor). */
function score(ctx: Ctx, pose: Pose, phaseCats: CategoryId[]): number {
  let s = 0
  // efeito
  if (pose.efeito === ctx.efeito) s += 3
  else if (pose.efeito === 'equilibrante' || ctx.efeito === 'equilibrante') s += 1
  // chakras
  if (ctx.a.chakras.length && pose.chakras?.length) {
    if (ctx.a.chakras.includes(pose.chakras[0])) s += 3
    else if (pose.chakras.some((c) => ctx.a.chakras.includes(c))) s += 1.5
  }
  // foco corporal
  if (ctx.focoCats.size && pose.categorias.some((c) => ctx.focoCats.has(c))) s += 2.5
  // nível: preferir posturas do nível escolhido (sem excluir as mais fáceis)
  const diff = LEVEL_ORDER[ctx.a.nivel] - LEVEL_ORDER[pose.nivel]
  s += diff === 0 ? 2 : diff === 1 ? 1 : 0
  // categoria principal coincide com a fase
  if (phaseCats.includes(pose.categorias[0])) s += 1
  // variedade
  s += ctx.rand() * 1.5
  return s
}

function pool(ctx: Ctx, filtro: (p: Pose) => boolean): Pose[] {
  return POSES.filter((p) => !ctx.usados.has(p.id) && nivelPermitido(p, ctx.a.nivel) && filtro(p))
}

function melhor(ctx: Ctx, candidatos: Pose[], phaseCats: CategoryId[]): Pose | undefined {
  let best: Pose | undefined
  let bestScore = -Infinity
  for (const p of candidatos) {
    const s = score(ctx, p, phaseCats)
    if (s > bestScore) {
      best = p
      bestScore = s
    }
  }
  return best
}

function item(ctx: Ctx, pose: Pose, duracao?: number, notas?: string): ClassItem {
  ctx.usados.add(pose.id)
  return { id: uid(), poseId: pose.id, duracao: duracao ?? duracaoItem(pose), notas }
}

function fixo(ctx: Ctx, id: string, duracao?: number): ClassItem | null {
  const pose = getPose(id)
  if (!pose) return null
  return item(ctx, pose, duracao)
}

/** Nota com a variação que usa um dos acessórios escolhidos. */
function notaAcessorio(ctx: Ctx, pose: Pose): string | undefined {
  if (!ctx.a.acessorios.length || !pose.variacoes) return undefined
  const v = pose.variacoes.find((v) => v.acessorios?.some((ac) => ctx.a.acessorios.includes(ac)))
  return v ? `${v.nome}: ${v.descricao}` : undefined
}

/**
 * Preenche uma fase escolhendo posturas por pontuação até o tempo sugerido
 * atingir ~90 % do orçamento; `slots` define a ordem de sub-categorias a
 * alternar (para variedade e sequência lógica).
 */
function preencher(
  ctx: Ctx,
  itens: ClassItem[],
  orcamento: number,
  phaseCats: CategoryId[],
  slots: Array<(p: Pose) => boolean>,
  maxItens = 12,
): void {
  const soma = () => itens.reduce((acc, it) => acc + it.duracao, 0)
  let vazios = 0
  let i = 0
  while (soma() < orcamento * 0.9 && itens.length < maxItens && vazios < slots.length) {
    const filtro = slots[i % slots.length]
    i++
    const pose = melhor(ctx, pool(ctx, filtro), phaseCats)
    if (!pose) {
      vazios++
      continue
    }
    vazios = 0
    itens.push(item(ctx, pose, undefined, notaAcessorio(ctx, pose)))
  }
}

/** Ajusta as durações da fase para somarem exatamente `orcamento` (múltiplos de 15 s). */
function ajustar(itens: ClassItem[], orcamento: number, fixos: Set<string> = new Set()): void {
  if (!itens.length) return
  const livres = itens.filter((it) => !fixos.has(it.id))
  const somaFixos = itens.filter((it) => fixos.has(it.id)).reduce((acc, it) => acc + it.duracao, 0)
  const alvo = Math.max(0, orcamento - somaFixos)
  const somaLivres = livres.reduce((acc, it) => acc + it.duracao, 0)
  if (livres.length && somaLivres > 0) {
    const fator = Math.min(2, Math.max(0.5, alvo / somaLivres))
    for (const it of livres) it.duracao = round15(it.duracao * fator)
  }
  // corrige o resto no item livre mais longo (ou no último)
  const soma = itens.reduce((acc, it) => acc + it.duracao, 0)
  const resto = orcamento - soma
  const alvoItem = (livres.length ? livres : itens).reduce((m, it) => (it.duracao > m.duracao ? it : m))
  alvoItem.duracao = Math.max(15, alvoItem.duracao + resto)
}

const cat = (c: CategoryId) => (p: Pose) => p.tipo === 'asana' && p.categorias.includes(c)
const catPrimaria = (c: CategoryId) => (p: Pose) => p.tipo === 'asana' && p.categorias[0] === c

/** Contra-posturas de recurso quando a postura não define `contraPostura`. */
const CONTRA_FALLBACK: Record<string, string[]> = {
  sarvangasana: ['matsyasana', 'bhujangasana'],
  halasana: ['matsyasana', 'bhujangasana'],
  sirsasana: ['balasana', 'shashankasana'],
  'adho-mukha-vrksasana': ['balasana', 'uttanasana'],
  'pincha-mayurasana': ['balasana'],
  'urdhva-dhanurasana': ['pavanamuktasana', 'balasana'],
  dhanurasana: ['balasana', 'pavanamuktasana'],
  ustrasana: ['balasana', 'shashankasana'],
  bhujangasana: ['balasana'],
  salabhasana: ['balasana', 'pavanamuktasana'],
  matsyasana: ['pavanamuktasana'],
}

/** Contra-posturas genéricas para qualquer extensão da coluna. */
const CONTRA_EXTENSAO = ['balasana', 'shashankasana', 'pavanamuktasana', 'apanasana', 'supta-matsyendrasana']

/** Primeira contra-postura disponível (definida na postura ou de recurso), ainda não usada e permitida pelo nível. */
function contraPostura(ctx: Ctx, pose: Pose): Pose | undefined {
  const ids = [
    ...(pose.contraPostura ?? []),
    ...(CONTRA_FALLBACK[pose.id] ?? []),
    ...(pose.categorias[0] === 'extensao' ? CONTRA_EXTENSAO : []),
  ]
  for (const id of ids) {
    const p = getPose(id)
    if (p && !ctx.usados.has(id) && nivelPermitido(p, ctx.a.nivel)) return p
  }
  return undefined
}

/** Ordem canónica das posturas no chão: base → ancas → flexões → core → extensões → torções → deitadas. */
const ORDEM_CHAO: CategoryId[] = ['sentadas', 'ancas', 'flexao', 'core', 'extensao', 'torcao', 'deitadas']

function ordenarPorCategoria(itens: ClassItem[], ordem: CategoryId[]): void {
  const rank = (it: ClassItem) => {
    const c = getPose(it.poseId)?.categorias[0]
    const i = c ? ordem.indexOf(c) : -1
    return i < 0 ? ordem.length : i
  }
  // ordenação estável
  const indexed = itens.map((it, i) => ({ it, i, r: rank(it) }))
  indexed.sort((x, y) => x.r - y.r || x.i - y.i)
  itens.splice(0, itens.length, ...indexed.map((x) => x.it))
}

// ---------------------------------------------------------------------------
// Gerador
// ---------------------------------------------------------------------------

export function gerarAula(a: WizardAnswers, seed = 1): YogaClass {
  const tipo = TIPO_MAP[a.tipo]
  const efeito = efeitoEfetivo(a)
  const ctx: Ctx = {
    a,
    efeito,
    rand: rng(seed * 7919 + a.duracao * 31 + LEVEL_ORDER[a.nivel]),
    usados: new Set(),
    focoCats: new Set(a.focos.flatMap((f) => FOCO_MAP[f].categorias)),
  }

  // pesos das fases, com as opções do utilizador
  const pesos = [...tipo.pesos]
  if (!a.incluir.saudacao) pesos[F.saudacao] = 0
  if (!a.incluir.inversoes) pesos[F.inversoes] = 0
  if (a.nivel === 'iniciante' && a.duracao <= 30) pesos[F.inversoes] = 0
  const somaPesos = pesos.reduce((x, y) => x + y, 0)
  const totalSeg = a.duracao * 60
  const orcamentos = pesos.map((p) => (p > 0 ? round15((p / somaPesos) * totalSeg) : 0))
  // garantir que a soma bate certo: resto para o relaxamento
  const diff = totalSeg - orcamentos.reduce((x, y) => x + y, 0)
  orcamentos[F.relaxamento] += diff

  const fases: ClassPhase[] = []
  /** Tempo de fases que ficaram vazias; é entregue ao relaxamento. */
  let sobra = 0

  HATHA_PHASE_TEMPLATE.forEach((tpl, idx) => {
    let orc = orcamentos[idx]
    if (idx === F.relaxamento) {
      orc += sobra
      sobra = 0
    }
    if (orc <= 0) return
    const itens: ClassItem[] = []
    const fixos = new Set<string>()
    const cats = tpl.categoriasSugeridas

    switch (idx) {
      case F.centramento: {
        const c = fixo(ctx, 'chegada-intencao')
        if (c) itens.push(c)
        if (orc >= 240) {
          const om = fixo(ctx, 'mantra-om')
          if (om) itens.push(om)
        }
        break
      }
      case F.pranayama: {
        if (a.incluir.mudras) {
          const m = melhor(ctx, pool(ctx, (p) => p.tipo === 'mudra' && p.categorias.includes('pranayama')), cats)
          if (m) itens.push(item(ctx, m, Math.min(duracaoItem(m), 60)))
        }
        if (a.nivel === 'iniciante') {
          const base = fixo(ctx, 'respiracao-abdominal')
          if (base) itens.push(base)
        }
        preencher(ctx, itens, orc, cats, [(p) => p.tipo === 'pranayama'], 4)
        break
      }
      case F.aquecimento: {
        preencher(ctx, itens, orc, cats, [cat('aquecimento')], 6)
        break
      }
      case F.saudacao: {
        const sn = getPose('surya-namaskar')
        if (sn) {
          const porRonda = a.nivel === 'iniciante' ? 150 : sn.duracaoSugerida
          const rondas = Math.max(1, Math.min(8, Math.round(orc / porRonda)))
          for (let r = 0; r < rondas; r++) {
            const it = item(ctx, sn, porRonda, r === 0 ? `${rondas} ${rondas === 1 ? 'ronda' : 'rondas'} — ritmo adaptado ao grupo` : undefined)
            itens.push(it)
          }
        }
        break
      }
      case F.emPe: {
        const slots = [catPrimaria('em-pe'), catPrimaria('em-pe'), catPrimaria('equilibrio')]
        if (a.focos.includes('equilibrio')) slots.push(catPrimaria('equilibrio'))
        preencher(ctx, itens, orc, cats, slots, 8)
        // Montanha primeiro (se existir), equilíbrios no fim da fase
        ordenarPorCategoria(itens, ['em-pe', 'equilibrio'])
        const tad = itens.findIndex((it) => it.poseId === 'tadasana')
        if (tad > 0) itens.unshift(...itens.splice(tad, 1))
        break
      }
      case F.chao: {
        const restaurativa = a.tipo === 'restaurativa'
        // no chão nunca se usam inversões (ficam para a fase própria)
        const semInv = (f: (p: Pose) => boolean) => (p: Pose) => f(p) && p.categorias[0] !== 'inversao'
        const slots: Array<(p: Pose) => boolean> = restaurativa
          ? [cat('deitadas'), cat('ancas'), cat('flexao'), cat('deitadas'), cat('torcao')].map(semInv)
          : [catPrimaria('ancas'), catPrimaria('flexao'), catPrimaria('core'), catPrimaria('extensao'), catPrimaria('torcao'), catPrimaria('deitadas')]
        // focos reforçam as respetivas sub-categorias
        for (const f of a.focos) for (const c of FOCO_MAP[f].categorias) if (cats.includes(c)) slots.push(catPrimaria(c))
        if (a.tipo === 'interior') slots.unshift(catPrimaria('sentadas'))
        preencher(ctx, itens, orc, cats, slots, restaurativa ? 7 : 10)
        ordenarPorCategoria(itens, ORDEM_CHAO)
        // contra-postura depois da última extensão
        const ultimaExt = [...itens].reverse().find((it) => getPose(it.poseId)?.categorias[0] === 'extensao')
        if (ultimaExt) {
          const pose = getPose(ultimaExt.poseId)
          const contra = pose ? (contraPostura(ctx, pose) ?? (ctx.usados.has('balasana') ? undefined : getPose('balasana'))) : undefined
          if (contra && nivelPermitido(contra, a.nivel)) {
            const pos = itens.indexOf(ultimaExt)
            itens.splice(pos + 1, 0, item(ctx, contra, Math.min(duracaoItem(contra), 60), 'Contra-postura'))
          }
        }
        break
      }
      case F.inversoes: {
        const nivelMax = a.tipo === 'restaurativa' || a.tipo === 'suave' ? 'iniciante' : a.nivel
        const candidatos = pool(ctx, (p) => p.tipo === 'asana' && p.categorias[0] === 'inversao' && LEVEL_ORDER[p.nivel] <= LEVEL_ORDER[nivelMax])
        const inv = melhor(ctx, candidatos, cats)
        if (inv) {
          itens.push(item(ctx, inv, undefined, notaAcessorio(ctx, inv)))
          const contra = contraPostura(ctx, inv)
          if (contra) itens.push(item(ctx, contra, Math.min(duracaoItem(contra), 60), 'Contra-postura'))
        }
        break
      }
      case F.relaxamento: {
        if (a.incluir.yogaNidra) {
          const yn = fixo(ctx, 'yoga-nidra', orc)
          if (yn) itens.push(yn)
        } else {
          if (orc >= 12 * 60) {
            const prep = melhor(ctx, pool(ctx, (p) => p.tipo === 'asana' && p.categorias.includes('relaxamento') && p.id !== 'savasana'), cats)
            if (prep) itens.push(item(ctx, prep, 120))
          }
          const sv = fixo(ctx, 'savasana')
          if (sv) itens.push(sv)
        }
        break
      }
      case F.meditacao: {
        if (a.incluir.mudras) {
          const m = melhor(ctx, pool(ctx, (p) => p.tipo === 'mudra' && p.categorias.includes('meditacao')), cats)
          if (m) itens.push(item(ctx, m, Math.min(duracaoItem(m), 60)))
        }
        const med = fixo(ctx, 'meditacao-respiracao')
        if (med) itens.push(med)
        const enc = fixo(ctx, 'encerramento', 60)
        if (enc) {
          itens.push(enc)
          fixos.add(enc.id)
        }
        break
      }
    }

    if (!itens.length) {
      sobra += orc
      return
    }
    ajustar(itens, orc, fixos)

    fases.push({
      id: uid(),
      nome: tpl.nome,
      categoriasSugeridas: tpl.categoriasSugeridas,
      itens,
      notas: tpl.notas,
    })
  })

  const now = new Date().toISOString()
  const efeitoNome = { calmante: 'calmante', energizante: 'energizante', equilibrante: 'equilibrante' }[efeito]
  const temaPartes = [
    ...a.focos.map((f) => FOCO_MAP[f].nome.toLowerCase()),
    ...a.chakras.map((c) => c.charAt(0).toUpperCase() + c.slice(1)),
  ]
  return {
    id: uid(),
    nome: a.nome?.trim() || `${tipo.nome} · ${a.duracao} min`,
    nivel: a.nivel,
    duracaoAlvo: a.duracao,
    tema: temaPartes.length ? temaPartes.join(', ') : `Prática ${efeitoNome}`,
    descricao: `Aula gerada automaticamente (${tipo.nome.toLowerCase()}, ${a.duracao} min, efeito ${efeitoNome}). Ajuste as posturas e durações à vontade.`,
    fases,
    criadoEm: now,
    atualizadoEm: now,
  }
}
