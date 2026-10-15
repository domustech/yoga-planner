import { Search, Sparkles, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CATEGORIES, CATEGORY_MAP, LEVELS, LEVEL_LABEL } from '../data/categories'
import { POSES } from '../data/poses'
import type { CategoryId, Level } from '../data/types'
import { DraggablePoseCard, PoseCard } from './PoseCard'

interface Props {
  /** Categorias sugeridas pela fase ativa (filtro rápido). */
  sugeridas?: CategoryId[]
  faseNome?: string
  onAdd?: (poseId: string) => void
  onDetails: (poseId: string) => void
  draggable?: boolean
  onClose?: () => void
}

type CatFilter = CategoryId | 'todas' | 'sugeridas'

export function normalizeText(t: string): string {
  return t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

export function LibraryPanel({ sugeridas, faseNome, onAdd, onDetails, draggable = true, onClose }: Props) {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<CatFilter>('todas')
  const [nivel, setNivel] = useState<Level | 'todos'>('todos')

  const temSugeridas = !!sugeridas && sugeridas.length > 0
  const catEfetiva: CatFilter = cat === 'sugeridas' && !temSugeridas ? 'todas' : cat

  const lista = useMemo(() => {
    const nq = normalizeText(q.trim())
    return POSES.filter((p) => {
      if (nivel !== 'todos' && p.nivel !== nivel) return false
      if (catEfetiva === 'sugeridas' && sugeridas && !p.categorias.some((c) => sugeridas.includes(c))) return false
      if (catEfetiva !== 'todas' && catEfetiva !== 'sugeridas' && !p.categorias.includes(catEfetiva)) return false
      if (nq) {
        const campos = [p.nome, p.sanscrito, p.ingles ?? '', ...p.categorias.map((c) => CATEGORY_MAP[c].nome)]
        return campos.some((t) => normalizeText(t).includes(nq))
      }
      return true
    })
  }, [q, catEfetiva, nivel, sugeridas])

  return (
    <aside className="library" aria-label="Biblioteca de posturas">
      <div className="library-head">
        <div className="library-title">
          <h2>Biblioteca</h2>
          <span className="muted">{lista.length} de {POSES.length}</span>
          {onClose && (
            <button type="button" className="icon-btn library-close" onClick={onClose} aria-label="Fechar biblioteca">
              <X size={18} />
            </button>
          )}
        </div>

        <label className="search">
          <Search size={16} />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Pesquisar (português, sânscrito, inglês)…"
          />
        </label>

        <div className="library-filters">
          <select value={nivel} onChange={(e) => setNivel(e.target.value as Level | 'todos')} aria-label="Nível">
            <option value="todos">Todos os níveis</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {LEVEL_LABEL[l]}
              </option>
            ))}
          </select>
        </div>

        <div className="chips-scroll">
          {temSugeridas && (
            <button
              type="button"
              className={`chip chip-sm chip-suggest ${catEfetiva === 'sugeridas' ? 'is-active' : ''}`}
              onClick={() => setCat('sugeridas')}
              title={`Categorias sugeridas para a fase "${faseNome ?? ''}"`}
            >
              <Sparkles size={12} /> Sugeridas{faseNome ? `: ${faseNome}` : ''}
            </button>
          )}
          <button
            type="button"
            className={`chip chip-sm chip-neutral ${catEfetiva === 'todas' ? 'is-active' : ''}`}
            onClick={() => setCat('todas')}
          >
            Todas
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`chip chip-sm is-clickable ${catEfetiva === c.id ? 'is-active' : ''}`}
              style={{ '--cat': c.cor } as React.CSSProperties}
              onClick={() => setCat(c.id)}
              title={c.descricao}
            >
              <span className="chip-dot" />
              {c.nome}
            </button>
          ))}
        </div>
      </div>

      <div className="library-list">
        {lista.length === 0 && <p className="muted library-empty">Nenhuma postura corresponde aos filtros.</p>}
        {lista.map((p) =>
          draggable ? (
            <DraggablePoseCard key={p.id} pose={p} onAdd={onAdd} onDetails={onDetails} addTitle={faseNome ? `Adicionar a "${faseNome}"` : undefined} />
          ) : (
            <PoseCard key={p.id} pose={p} onAdd={onAdd} onDetails={onDetails} />
          ),
        )}
      </div>
    </aside>
  )
}
