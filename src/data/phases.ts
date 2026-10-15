import type { CategoryId } from './types'

export interface PhaseTemplate {
  nome: string
  categoriasSugeridas: CategoryId[]
  /** Percentagem aproximada da duração total da aula. */
  pesoDuracao: number
  notas?: string
}

/** Estrutura clássica de uma aula de Hatha Yoga. */
export const HATHA_PHASE_TEMPLATE: PhaseTemplate[] = [
  {
    nome: 'Centramento',
    categoriasSugeridas: ['centramento', 'meditacao', 'sentadas'],
    pesoDuracao: 5,
    notas: 'Chegada ao tapete, intenção da prática, observação da respiração.',
  },
  { nome: 'Pranayama', categoriasSugeridas: ['pranayama', 'mudra'], pesoDuracao: 8 },
  {
    nome: 'Aquecimento',
    categoriasSugeridas: ['aquecimento', 'sentadas', 'deitadas'],
    pesoDuracao: 10,
    notas: 'Mobilização articular: pescoço, ombros, coluna, ancas, tornozelos.',
  },
  { nome: 'Saudação ao Sol', categoriasSugeridas: ['saudacao', 'em-pe'], pesoDuracao: 10 },
  { nome: 'Posturas em pé', categoriasSugeridas: ['em-pe', 'equilibrio'], pesoDuracao: 17 },
  {
    nome: 'Posturas no chão',
    categoriasSugeridas: ['sentadas', 'flexao', 'extensao', 'torcao', 'ancas', 'core', 'deitadas'],
    pesoDuracao: 22,
  },
  { nome: 'Inversões', categoriasSugeridas: ['inversao'], pesoDuracao: 8 },
  { nome: 'Relaxamento final', categoriasSugeridas: ['relaxamento', 'deitadas'], pesoDuracao: 14 },
  {
    nome: 'Meditação e encerramento',
    categoriasSugeridas: ['meditacao', 'centramento', 'pranayama', 'mudra'],
    pesoDuracao: 6,
  },
]
