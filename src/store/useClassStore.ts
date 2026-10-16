import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CategoryId, ClassItem, ClassPhase, YogaClass } from '../data/types'
import { createEmptyClass, createItem, createSampleClass } from '../lib/classFactory'
import { uid } from '../lib/utils'

interface ClassState {
  aulas: YogaClass[]
  /** true depois da primeira inicialização (para não recriar o exemplo). */
  inicializado: boolean

  inicializar: () => void
  criarAula: (nome?: string) => string
  duplicarAula: (id: string) => string | undefined
  apagarAula: (id: string) => void
  atualizarAula: (id: string, patch: Partial<Omit<YogaClass, 'id' | 'fases'>>) => void
  importarAula: (aula: YogaClass) => string
  /** Adiciona uma aula já construída (ex.: gerada pelo wizard) e devolve o id. */
  adicionarAula: (aula: YogaClass) => string

  adicionarFase: (aulaId: string, nome: string, categorias?: CategoryId[]) => void
  atualizarFase: (aulaId: string, faseId: string, patch: Partial<Omit<ClassPhase, 'id' | 'itens'>>) => void
  removerFase: (aulaId: string, faseId: string) => void
  moverFase: (aulaId: string, faseId: string, direcao: -1 | 1) => void

  adicionarItem: (aulaId: string, faseId: string, poseId: string, index?: number) => void
  atualizarItem: (aulaId: string, faseId: string, itemId: string, patch: Partial<Omit<ClassItem, 'id'>>) => void
  duplicarItem: (aulaId: string, faseId: string, itemId: string) => void
  removerItem: (aulaId: string, faseId: string, itemId: string) => void
  /** Move um item (dentro da mesma fase ou para outra fase) para a posição `toIndex`. */
  moverItem: (aulaId: string, deFaseId: string, paraFaseId: string, itemId: string, toIndex: number) => void
}

function touch(aula: YogaClass): YogaClass {
  return { ...aula, atualizadoEm: new Date().toISOString() }
}

function updateClass(aulas: YogaClass[], id: string, fn: (a: YogaClass) => YogaClass): YogaClass[] {
  return aulas.map((a) => (a.id === id ? touch(fn(a)) : a))
}

function updatePhase(aula: YogaClass, faseId: string, fn: (f: ClassPhase) => ClassPhase): YogaClass {
  return { ...aula, fases: aula.fases.map((f) => (f.id === faseId ? fn(f) : f)) }
}

export const useClassStore = create<ClassState>()(
  persist(
    (set, get) => ({
      aulas: [],
      inicializado: false,

      inicializar: () => {
        if (get().inicializado) return
        set({ aulas: [createSampleClass()], inicializado: true })
      },

      criarAula: (nome) => {
        const aula = createEmptyClass(nome)
        set((s) => ({ aulas: [aula, ...s.aulas] }))
        return aula.id
      },

      duplicarAula: (id) => {
        const original = get().aulas.find((a) => a.id === id)
        if (!original) return undefined
        const now = new Date().toISOString()
        const copia: YogaClass = {
          ...original,
          id: uid(),
          nome: `${original.nome} (cópia)`,
          criadoEm: now,
          atualizadoEm: now,
          fases: original.fases.map((f) => ({
            ...f,
            id: uid(),
            itens: f.itens.map((it) => ({ ...it, id: uid() })),
          })),
        }
        set((s) => ({ aulas: [copia, ...s.aulas] }))
        return copia.id
      },

      apagarAula: (id) => set((s) => ({ aulas: s.aulas.filter((a) => a.id !== id) })),

      atualizarAula: (id, patch) =>
        set((s) => ({ aulas: updateClass(s.aulas, id, (a) => ({ ...a, ...patch })) })),

      importarAula: (aula) => {
        const now = new Date().toISOString()
        const nova: YogaClass = {
          ...aula,
          id: uid(),
          criadoEm: aula.criadoEm ?? now,
          atualizadoEm: now,
          fases: (aula.fases ?? []).map((f) => ({
            ...f,
            id: uid(),
            itens: (f.itens ?? []).map((it) => ({ ...it, id: uid() })),
          })),
        }
        set((s) => ({ aulas: [nova, ...s.aulas] }))
        return nova.id
      },

      adicionarAula: (aula) => {
        set((s) => ({ aulas: [aula, ...s.aulas] }))
        return aula.id
      },

      adicionarFase: (aulaId, nome, categorias = []) =>
        set((s) => ({
          aulas: updateClass(s.aulas, aulaId, (a) => ({
            ...a,
            fases: [...a.fases, { id: uid(), nome, categoriasSugeridas: categorias, itens: [] }],
          })),
        })),

      atualizarFase: (aulaId, faseId, patch) =>
        set((s) => ({
          aulas: updateClass(s.aulas, aulaId, (a) => updatePhase(a, faseId, (f) => ({ ...f, ...patch }))),
        })),

      removerFase: (aulaId, faseId) =>
        set((s) => ({
          aulas: updateClass(s.aulas, aulaId, (a) => ({ ...a, fases: a.fases.filter((f) => f.id !== faseId) })),
        })),

      moverFase: (aulaId, faseId, direcao) =>
        set((s) => ({
          aulas: updateClass(s.aulas, aulaId, (a) => {
            const idx = a.fases.findIndex((f) => f.id === faseId)
            const to = idx + direcao
            if (idx < 0 || to < 0 || to >= a.fases.length) return a
            const fases = [...a.fases]
            const [f] = fases.splice(idx, 1)
            fases.splice(to, 0, f)
            return { ...a, fases }
          }),
        })),

      adicionarItem: (aulaId, faseId, poseId, index) =>
        set((s) => ({
          aulas: updateClass(s.aulas, aulaId, (a) =>
            updatePhase(a, faseId, (f) => {
              const itens = [...f.itens]
              const item = createItem(poseId)
              itens.splice(index ?? itens.length, 0, item)
              return { ...f, itens }
            }),
          ),
        })),

      atualizarItem: (aulaId, faseId, itemId, patch) =>
        set((s) => ({
          aulas: updateClass(s.aulas, aulaId, (a) =>
            updatePhase(a, faseId, (f) => ({
              ...f,
              itens: f.itens.map((it) => (it.id === itemId ? { ...it, ...patch } : it)),
            })),
          ),
        })),

      duplicarItem: (aulaId, faseId, itemId) =>
        set((s) => ({
          aulas: updateClass(s.aulas, aulaId, (a) =>
            updatePhase(a, faseId, (f) => {
              const idx = f.itens.findIndex((it) => it.id === itemId)
              if (idx < 0) return f
              const itens = [...f.itens]
              itens.splice(idx + 1, 0, { ...f.itens[idx], id: uid() })
              return { ...f, itens }
            }),
          ),
        })),

      removerItem: (aulaId, faseId, itemId) =>
        set((s) => ({
          aulas: updateClass(s.aulas, aulaId, (a) =>
            updatePhase(a, faseId, (f) => ({ ...f, itens: f.itens.filter((it) => it.id !== itemId) })),
          ),
        })),

      moverItem: (aulaId, deFaseId, paraFaseId, itemId, toIndex) =>
        set((s) => ({
          aulas: updateClass(s.aulas, aulaId, (a) => {
            const de = a.fases.find((f) => f.id === deFaseId)
            const item = de?.itens.find((it) => it.id === itemId)
            if (!de || !item) return a
            return {
              ...a,
              fases: a.fases.map((f) => {
                if (f.id === deFaseId && f.id === paraFaseId) {
                  // Semântica "arrayMove": o item passa a ocupar a posição do item sobre o qual foi largado.
                  const itens = f.itens.filter((it) => it.id !== itemId)
                  const target = Math.max(0, Math.min(toIndex, itens.length))
                  itens.splice(target, 0, item)
                  return { ...f, itens }
                }
                if (f.id === deFaseId) return { ...f, itens: f.itens.filter((it) => it.id !== itemId) }
                if (f.id === paraFaseId) {
                  const itens = [...f.itens]
                  itens.splice(Math.max(0, Math.min(toIndex, itens.length)), 0, item)
                  return { ...f, itens }
                }
                return f
              }),
            }
          }),
        })),
    }),
    { name: 'yoga-planner:aulas', version: 1 },
  ),
)
