import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/** Preferências do utilizador (guardadas neste dispositivo). */
export interface Definicoes {
  /** Segundos de preparação antes de começar a contagem de cada postura (0 = sem preparação). */
  preparacaoSeg: number
  /** Sinais sonoros: bip por segundo nos últimos 5 s e sinais de início/fim. */
  bips: boolean
  /** Vibração nos mesmos momentos (Android). */
  vibracao: boolean
}

interface SettingsState extends Definicoes {
  definir: (parcial: Partial<Definicoes>) => void
  repor: () => void
}

export const DEFINICOES_OMISSAO: Definicoes = {
  preparacaoSeg: 10,
  bips: true,
  vibracao: true,
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFINICOES_OMISSAO,
      definir: (parcial) => set(parcial),
      repor: () => set(DEFINICOES_OMISSAO),
    }),
    { name: 'yoga-planner:definicoes', version: 1 },
  ),
)
