import type { Acessorio, Category, CategoryId, Efeito, Level } from './types'

export const CATEGORIES: Category[] = [
  { id: 'centramento', nome: 'Centramento', descricao: 'Chegada, intenção, presença e silêncio inicial.', cor: '#b3a1cb' },
  { id: 'pranayama', nome: 'Pranayama', descricao: 'Técnicas de respiração consciente.', cor: '#8fb5cc' },
  { id: 'aquecimento', nome: 'Aquecimento', descricao: 'Mobilização articular e preparação do corpo.', cor: '#e8b282' },
  { id: 'saudacao', nome: 'Saudação ao Sol', descricao: 'Posturas da sequência Surya Namaskar.', cor: '#e8c98a' },
  { id: 'em-pe', nome: 'Em pé', descricao: 'Posturas de pé — força, estabilidade e enraizamento.', cor: '#8bb892' },
  { id: 'equilibrio', nome: 'Equilíbrio', descricao: 'Posturas de equilíbrio — foco e concentração.', cor: '#7fb3a6' },
  { id: 'sentadas', nome: 'Sentadas', descricao: 'Posturas sentadas e de base.', cor: '#cda58a' },
  { id: 'flexao', nome: 'Flexões à frente', descricao: 'Alongamento da cadeia posterior; introspeção.', cor: '#a7bf87' },
  { id: 'extensao', nome: 'Extensões', descricao: 'Abertura do peito e extensão da coluna.', cor: '#e39a92' },
  { id: 'torcao', nome: 'Torções', descricao: 'Rotação da coluna; desintoxicação e mobilidade.', cor: '#c59ac0' },
  { id: 'ancas', nome: 'Abertura de ancas', descricao: 'Mobilidade e libertação da zona pélvica.', cor: '#d89fae' },
  { id: 'core', nome: 'Core', descricao: 'Fortalecimento abdominal e estabilidade central.', cor: '#e5a676' },
  { id: 'inversao', nome: 'Inversões', descricao: 'Posturas invertidas; circulação e nova perspetiva.', cor: '#90a9cb' },
  { id: 'deitadas', nome: 'Deitadas', descricao: 'Posturas em decúbito dorsal ou ventral.', cor: '#aab4bc' },
  { id: 'relaxamento', nome: 'Relaxamento', descricao: 'Integração e descanso profundo.', cor: '#9ea9cf' },
  { id: 'meditacao', nome: 'Meditação', descricao: 'Concentração, observação e encerramento.', cor: '#b09cc8' },
  { id: 'mudra', nome: 'Mudras e bandhas', descricao: 'Gestos e fechos energéticos que dirigem o prana.', cor: '#d2b46e' },
]

export const CATEGORY_MAP: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, Category>

export const LEVEL_LABEL: Record<Level, string> = {
  iniciante: 'Iniciante',
  intermedio: 'Intermédio',
  avancado: 'Avançado',
}

export const LEVELS: Level[] = ['iniciante', 'intermedio', 'avancado']

export interface EfeitoInfo {
  id: Efeito
  nome: string
  descricao: string
  cor: string
}

/** Efeito predominante da prática (tradição: langhana / brahmana / samana). */
export const EFEITOS: EfeitoInfo[] = [
  { id: 'calmante', nome: 'Calmante', descricao: 'Langhana — acalma, interioriza, reduz a agitação.', cor: '#8fb0cc' },
  { id: 'energizante', nome: 'Energizante', descricao: 'Brahmana — aquece, desperta, expande.', cor: '#e39a6b' },
  { id: 'equilibrante', nome: 'Equilibrante', descricao: 'Samana — harmoniza e estabiliza.', cor: '#86b08f' },
]

export const EFEITO_MAP: Record<Efeito, EfeitoInfo> = Object.fromEntries(EFEITOS.map((e) => [e.id, e])) as Record<
  Efeito,
  EfeitoInfo
>

export const ACESSORIO_LABEL: Record<Acessorio, string> = {
  cinto: 'Cinto',
  bastao: 'Bastão',
  bloco: 'Bloco',
  manta: 'Manta',
  almofada: 'Almofada',
  parede: 'Parede',
  cadeira: 'Cadeira',
}

export const ACESSORIOS: Acessorio[] = ['cinto', 'bastao', 'bloco', 'manta', 'almofada', 'parede', 'cadeira']
