// ---------------------------------------------------------------------------
// Modelo de dados — Yoga Planner
// ---------------------------------------------------------------------------

/** Ponto 2D no sistema de coordenadas da figura (viewBox 0 0 100 100). */
export type Pt = [number, number]

/** Vista da figura: lateral (perfil), frontal, ou vista de cima (deitado). */
export type FigureView = 'side' | 'front' | 'top'

/**
 * Figura esquemática de uma postura, definida por articulações.
 * O renderizador (PoseFigure) desenha a cabeça, tronco, braços e pernas
 * a partir destes pontos. Isto permite ter ilustrações consistentes para
 * todas as posturas sem depender de ficheiros de imagem externos.
 */
export interface PoseFigure {
  view: FigureView
  /** Centro da cabeça */
  head: Pt
  /** Base do pescoço / linha dos ombros */
  neck: Pt
  /** Ponto intermédio da coluna (opcional) — permite curvar o tronco */
  spine?: Pt
  /** Centro da bacia */
  pelvis: Pt
  /** Braços: [ombro, cotovelo, pulso]. Um braço só => desenhado em duplicado (vista lateral). */
  arms: [Pt, Pt, Pt][]
  /** Pernas: [anca, joelho, tornozelo, ponta do pé]. */
  legs: [Pt, Pt, Pt, Pt][]
}

/** Categorias de posturas / práticas (Hatha Yoga). */
export type CategoryId =
  | 'centramento'
  | 'pranayama'
  | 'aquecimento'
  | 'saudacao'
  | 'em-pe'
  | 'equilibrio'
  | 'sentadas'
  | 'flexao'
  | 'extensao'
  | 'torcao'
  | 'ancas'
  | 'core'
  | 'inversao'
  | 'deitadas'
  | 'relaxamento'
  | 'meditacao'

export interface Category {
  id: CategoryId
  nome: string
  descricao: string
  cor: string
}

export type Level = 'iniciante' | 'intermedio' | 'avancado'

export type ItemKind = 'asana' | 'pranayama' | 'pratica'

export interface Pose {
  id: string
  /** Nome em português */
  nome: string
  /** Nome em sânscrito (transliterado) */
  sanscrito: string
  /** Nome em inglês (útil para pesquisa e material internacional) */
  ingles?: string
  tipo: ItemKind
  /** Primeira categoria = categoria principal (cor, agrupamento). */
  categorias: CategoryId[]
  nivel: Level
  /** Postura assimétrica — deve ser feita para ambos os lados. */
  bilateral?: boolean
  /** Duração sugerida em segundos (por lado, se bilateral). */
  duracaoSugerida: number
  /** Respiração sugerida durante a postura */
  respiracao?: string
  beneficios: string[]
  contraindicacoes?: string[]
  /** Posturas de preparação / contra-posturas sugeridas (ids) */
  preparacao?: string[]
  contraPostura?: string[]
  /** Dicas de alinhamento / instrução */
  dicas?: string[]
  figura: PoseFigure
}

/** Um item colocado numa fase da aula. */
export interface ClassItem {
  id: string
  poseId: string
  /** Duração em segundos (total, já contando ambos os lados se aplicável). */
  duracao: number
  notas?: string
}

export interface ClassPhase {
  id: string
  nome: string
  /** Categorias sugeridas para esta fase (para filtrar a biblioteca). */
  categoriasSugeridas: CategoryId[]
  itens: ClassItem[]
  notas?: string
}

export interface YogaClass {
  id: string
  nome: string
  descricao?: string
  nivel: Level
  /** Duração alvo em minutos */
  duracaoAlvo: number
  /** Tema / intenção da aula */
  tema?: string
  fases: ClassPhase[]
  criadoEm: string
  atualizadoEm: string
}
