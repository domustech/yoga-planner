import type { Acessorio, Category, CategoryId, Efeito, Level } from './types'

export const CATEGORIES: Category[] = [
  { id: 'centramento', nome: 'Centramento', descricao: 'Chegada, intenção, presença e silêncio inicial.', cor: '#8e7cc3' },
  { id: 'pranayama', nome: 'Pranayama', descricao: 'Técnicas de respiração consciente.', cor: '#5b9bd5' },
  { id: 'aquecimento', nome: 'Aquecimento', descricao: 'Mobilização articular e preparação do corpo.', cor: '#f0a04b' },
  { id: 'saudacao', nome: 'Saudação ao Sol', descricao: 'Posturas da sequência Surya Namaskar.', cor: '#f2c14e' },
  { id: 'em-pe', nome: 'Em pé', descricao: 'Posturas de pé — força, estabilidade e enraizamento.', cor: '#4caf7d' },
  { id: 'equilibrio', nome: 'Equilíbrio', descricao: 'Posturas de equilíbrio — foco e concentração.', cor: '#2e9e8f' },
  { id: 'sentadas', nome: 'Sentadas', descricao: 'Posturas sentadas e de base.', cor: '#c98b6b' },
  { id: 'flexao', nome: 'Flexões à frente', descricao: 'Alongamento da cadeia posterior; introspeção.', cor: '#7fa65b' },
  { id: 'extensao', nome: 'Extensões', descricao: 'Abertura do peito e extensão da coluna.', cor: '#e5746a' },
  { id: 'torcao', nome: 'Torções', descricao: 'Rotação da coluna; desintoxicação e mobilidade.', cor: '#b56fb0' },
  { id: 'ancas', nome: 'Abertura de ancas', descricao: 'Mobilidade e libertação da zona pélvica.', cor: '#d98cb3' },
  { id: 'core', nome: 'Core', descricao: 'Fortalecimento abdominal e estabilidade central.', cor: '#e09a3a' },
  { id: 'inversao', nome: 'Inversões', descricao: 'Posturas invertidas; circulação e nova perspetiva.', cor: '#4f86c6' },
  { id: 'deitadas', nome: 'Deitadas', descricao: 'Posturas em decúbito dorsal ou ventral.', cor: '#9aa7b8' },
  { id: 'relaxamento', nome: 'Relaxamento', descricao: 'Integração e descanso profundo.', cor: '#6b7fb3' },
  { id: 'meditacao', nome: 'Meditação', descricao: 'Concentração, observação e encerramento.', cor: '#7c6aa6' },
  { id: 'mudra', nome: 'Mudras e bandhas', descricao: 'Gestos e fechos energéticos que dirigem o prana.', cor: '#c9a227' },
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
  { id: 'calmante', nome: 'Calmante', descricao: 'Langhana — acalma, interioriza, reduz a agitação.', cor: '#5b8fb9' },
  { id: 'energizante', nome: 'Energizante', descricao: 'Brahmana — aquece, desperta, expande.', cor: '#e08a3c' },
  { id: 'equilibrante', nome: 'Equilibrante', descricao: 'Samana — harmoniza e estabiliza.', cor: '#5fa07a' },
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
