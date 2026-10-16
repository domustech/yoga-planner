import type { Alinhamento, ParteCorpo } from '../types'
import { ALINHAMENTO_ASANAS } from './asanas'
import { ALINHAMENTO_PRATICAS } from './praticas'

/** Alinhamento de todas as posturas e práticas, por id. */
export const ALINHAMENTO: Record<string, Alinhamento> = { ...ALINHAMENTO_ASANAS, ...ALINHAMENTO_PRATICAS }

export function getAlinhamento(poseId: string): Alinhamento | undefined {
  return ALINHAMENTO[poseId]
}

/** Ordem de apresentação das partes do corpo (de baixo para cima, depois atenção). */
export const PARTES_ORDEM: ParteCorpo[] = [
  'pes',
  'pernas',
  'joelhos',
  'ancas',
  'coluna',
  'peito',
  'ombros',
  'bracos',
  'maos',
  'cabeca',
  'olhar',
  'respiracao',
  'atencao',
]

export const PARTE_LABEL: Record<ParteCorpo, string> = {
  pes: 'Pés',
  pernas: 'Pernas',
  joelhos: 'Joelhos',
  ancas: 'Ancas e bacia',
  coluna: 'Coluna',
  peito: 'Peito',
  ombros: 'Ombros',
  bracos: 'Braços',
  maos: 'Mãos',
  cabeca: 'Cabeça e pescoço',
  olhar: 'Olhar',
  respiracao: 'Respiração',
  atencao: 'Atenção',
}
