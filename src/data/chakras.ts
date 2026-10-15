import type { ChakraId } from './types'

/**
 * Os sete chakras principais (centros energéticos) da tradição do Hatha Yoga.
 * Usados para anotar posturas e práticas e para filtrar a biblioteca
 * (ex.: prática virada para a calma e para o chakra do coração).
 */
export interface Chakra {
  id: ChakraId
  /** Nome em sânscrito (transliterado) */
  nome: string
  /** Nome em português */
  nomePT: string
  ordem: number
  localizacao: string
  elemento: string
  /** Mantra-semente (bija) */
  bija: string
  cor: string
  /** Qualidades quando equilibrado */
  qualidades: string
  /** Sinais de desequilíbrio (excesso ou carência) */
  desequilibrio: string
  /** Práticas que o trabalham (orientação geral) */
  praticas: string
  /** Tema de conversa / reflexão para a aula */
  reflexao: string
}

export const CHAKRAS: Chakra[] = [
  {
    id: 'muladhara',
    nome: 'Muladhara',
    nomePT: 'Raiz',
    ordem: 1,
    localizacao: 'Base da coluna, períneo',
    elemento: 'Terra',
    bija: 'LAM',
    cor: '#c0392b',
    qualidades: 'Segurança, enraizamento, estabilidade, vitalidade básica, confiança no corpo.',
    desequilibrio: 'Medo, insegurança, dispersão, cansaço crónico; ou rigidez e apego excessivo.',
    praticas: 'Posturas de pé e de enraizamento (Tadasana, Guerreiros, Malasana), Mula Bandha, respiração abdominal, Apana Mudra.',
    reflexao: 'O que me dá segurança? Sentir os pés no chão antes de qualquer movimento.',
  },
  {
    id: 'svadhisthana',
    nome: 'Svadhisthana',
    nomePT: 'Sacral',
    ordem: 2,
    localizacao: 'Abaixo do umbigo, sacro',
    elemento: 'Água',
    bija: 'VAM',
    cor: '#e67e22',
    qualidades: 'Criatividade, prazer saudável, fluidez emocional, adaptabilidade.',
    desequilibrio: 'Rigidez emocional, culpa, apatia; ou dependência e excesso.',
    praticas: 'Abertura de ancas (Baddha Konasana, Pombo, Malasana), círculos de ancas, movimento fluido, Ashwini Mudra.',
    reflexao: 'Deixar fluir: onde é que resisto ao movimento da vida?',
  },
  {
    id: 'manipura',
    nome: 'Manipura',
    nomePT: 'Plexo solar',
    ordem: 3,
    localizacao: 'Umbigo, plexo solar',
    elemento: 'Fogo',
    bija: 'RAM',
    cor: '#e4b400',
    qualidades: 'Vontade, poder pessoal, autoconfiança, boa digestão (agni), disciplina.',
    desequilibrio: 'Insegurança, falta de vontade, digestão fraca; ou raiva, controlo e orgulho.',
    praticas: 'Torções, Navasana, Prancha, Saudação ao Sol, Kapalabhati, Bhastrika, Uddiyana Bandha.',
    reflexao: 'Agir com firmeza sem dureza — tapas com gentileza.',
  },
  {
    id: 'anahata',
    nome: 'Anahata',
    nomePT: 'Coração',
    ordem: 4,
    localizacao: 'Centro do peito',
    elemento: 'Ar',
    bija: 'YAM',
    cor: '#27ae60',
    qualidades: 'Amor, compaixão, aceitação, gratidão, equilíbrio entre dar e receber.',
    desequilibrio: 'Tristeza, isolamento, mágoa, ciúme; ou dependência afetiva.',
    praticas: 'Extensões (Ustrasana, Ponte, Peixe, Cobra), Ujjayi, Bhramari, Hridaya e Padma Mudra, meditação do coração (metta).',
    reflexao: 'Amizade para com os felizes, compaixão para com os que sofrem (Yoga Sutra I.33).',
  },
  {
    id: 'vishuddha',
    nome: 'Vishuddha',
    nomePT: 'Garganta',
    ordem: 5,
    localizacao: 'Garganta',
    elemento: 'Éter (espaço)',
    bija: 'HAM',
    cor: '#2980b9',
    qualidades: 'Expressão, verdade (satya), comunicação clara, escuta, criatividade verbal.',
    desequilibrio: 'Dificuldade em expressar-se, timidez, tensão cervical; ou falar em excesso.',
    praticas: 'Sarvangasana, Halasana, Peixe, Leão, Jalandhara Bandha, Ujjayi, OM e mantras, Bhramari.',
    reflexao: 'Dizer a verdade com bondade: o que preciso de expressar?',
  },
  {
    id: 'ajna',
    nome: 'Ajna',
    nomePT: 'Terceiro olho',
    ordem: 6,
    localizacao: 'Entre as sobrancelhas',
    elemento: 'Luz / mente',
    bija: 'OM',
    cor: '#5b4b8a',
    qualidades: 'Intuição, clareza, concentração, discernimento (viveka), visão de conjunto.',
    desequilibrio: 'Confusão, dispersão, dores de cabeça, dificuldade de concentração; ou excesso de análise.',
    praticas: 'Nadi Shodhana, Shambhavi Mudra, Trataka, Balasana (testa no chão), meditação, Bhramari.',
    reflexao: 'Ver com clareza: observar antes de reagir.',
  },
  {
    id: 'sahasrara',
    nome: 'Sahasrara',
    nomePT: 'Coroa',
    ordem: 7,
    localizacao: 'Topo da cabeça',
    elemento: 'Consciência',
    bija: 'Silêncio (OM)',
    cor: '#8e44ad',
    qualidades: 'Unidade, consciência pura, serenidade, sentido de ligação a algo maior.',
    desequilibrio: 'Sensação de desligamento ou de vazio; ou fuga da vida prática.',
    praticas: 'Sirsasana, Savasana, Yoga Nidra, meditação silenciosa, Padmasana, Dhyana Mudra.',
    reflexao: 'Purnam — a plenitude já está aqui; nada a acrescentar.',
  },
]

export const CHAKRA_MAP: Record<ChakraId, Chakra> = Object.fromEntries(CHAKRAS.map((c) => [c.id, c])) as Record<
  ChakraId,
  Chakra
>
