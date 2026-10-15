import { Search, SlidersHorizontal, Sparkles, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ACESSORIOS, ACESSORIO_LABEL, CATEGORIES, CATEGORY_MAP, EFEITOS, LEVELS, LEVEL_LABEL } from '../data/categories'
import { CHAKRAS, CHAKRA_MAP } from '../data/chakras'
import { POSES } from '../data/poses'
import type { Acessorio, CategoryId, ChakraId, Efeito, ItemKind, Level, Pose } from '../data/types'
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

const TIPO_LABEL: Record<ItemKind, string> = {
  asana: 'Asanas',
  pranayama: 'Pranayama',
  mudra: 'Mudras e bandhas',
  pratica: 'Práticas',
}

/** Ordem dos grupos quando a lista é agrupada por tipo (prática com intenção). */
const TIPO_ORDEM: ItemKind[] = ['pranayama', 'mudra', 'asana', 'pratica']

export function LibraryPanel({ sugeridas, faseNome, onAdd, onDetails, draggable = true, onClose }: Props) {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<CatFilter>('todas')
  const [nivel, setNivel] = useState<Level | 'todos'>('todos')
  const [tipo, setTipo] = useState<ItemKind | 'todos'>('todos')
  const [efeito, setEfeito] = useState<Efeito | 'todos'>('todos')
  const [chakra, setChakra] = useState<ChakraId | 'todos'>('todos')
  const [acessorio, setAcessorio] = useState<Acessorio | 'todos'>('todos')

  const temSugeridas = !!sugeridas && sugeridas.length > 0
  const catEfetiva: CatFilter = cat === 'sugeridas' && !temSugeridas ? 'todas' : cat
  /** Filtros de intenção ativos: a lista é agrupada por tipo (pranayama, mudras, asanas, práticas). */
  const comIntencao = efeito !== 'todos' || chakra !== 'todos'
  const filtrosAtivos =
    (nivel !== 'todos' ? 1 : 0) +
    (tipo !== 'todos' ? 1 : 0) +
    (efeito !== 'todos' ? 1 : 0) +
    (chakra !== 'todos' ? 1 : 0) +
    (acessorio !== 'todos' ? 1 : 0)

  function limparFiltros() {
    setNivel('todos')
    setTipo('todos')
    setEfeito('todos')
    setChakra('todos')
    setAcessorio('todos')
  }

  const lista = useMemo(() => {
    const nq = normalizeText(q.trim())
    const base = POSES.filter((p) => {
      if (nivel !== 'todos' && p.nivel !== nivel) return false
      if (tipo !== 'todos' && p.tipo !== tipo) return false
      if (efeito !== 'todos' && p.efeito !== efeito) return false
      if (chakra !== 'todos' && !(p.chakras ?? []).includes(chakra)) return false
      if (acessorio !== 'todos' && !(p.variacoes ?? []).some((v) => (v.acessorios ?? []).includes(acessorio))) return false
      if (catEfetiva === 'sugeridas' && sugeridas && !p.categorias.some((c) => sugeridas.includes(c))) return false
      if (catEfetiva !== 'todas' && catEfetiva !== 'sugeridas' && !p.categorias.includes(catEfetiva)) return false
      if (nq) {
        const campos = [
          p.nome,
          p.sanscrito,
          p.ingles ?? '',
          ...p.categorias.map((c) => CATEGORY_MAP[c].nome),
          ...(p.chakras ?? []).map((c) => `${CHAKRA_MAP[c].nome} ${CHAKRA_MAP[c].nomePT}`),
          ...(p.efeitosSubtis ?? []),
          ...(p.variacoes ?? []).map((v) => v.nome),
        ]
        return campos.some((t) => normalizeText(t).includes(nq))
      }
      return true
    })
    if (!comIntencao) return base
    return [...base].sort((a, b) => TIPO_ORDEM.indexOf(a.tipo) - TIPO_ORDEM.indexOf(b.tipo))
  }, [q, catEfetiva, nivel, tipo, efeito, chakra, acessorio, sugeridas, comIntencao])

  const renderCard = (p: Pose) =>
    draggable ? (
      <DraggablePoseCard key={p.id} pose={p} onAdd={onAdd} onDetails={onDetails} addTitle={faseNome ? `Adicionar a "${faseNome}"` : undefined} />
    ) : (
      <PoseCard key={p.id} pose={p} onAdd={onAdd} onDetails={onDetails} />
    )

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
            placeholder="Pesquisar (nome, sânscrito, chakra, efeito…)"
          />
        </label>

        <div className="library-filters">
          <select value={tipo} onChange={(e) => setTipo(e.target.value as ItemKind | 'todos')} aria-label="Tipo">
            <option value="todos">Todos os tipos</option>
            {TIPO_ORDEM.map((t) => (
              <option key={t} value={t}>
                {TIPO_LABEL[t]}
              </option>
            ))}
          </select>
          <select value={nivel} onChange={(e) => setNivel(e.target.value as Level | 'todos')} aria-label="Nível">
            <option value="todos">Todos os níveis</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {LEVEL_LABEL[l]}
              </option>
            ))}
          </select>
          <select value={efeito} onChange={(e) => setEfeito(e.target.value as Efeito | 'todos')} aria-label="Efeito">
            <option value="todos">Qualquer efeito</option>
            {EFEITOS.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nome}
              </option>
            ))}
          </select>
          <select value={chakra} onChange={(e) => setChakra(e.target.value as ChakraId | 'todos')} aria-label="Chakra">
            <option value="todos">Qualquer chakra</option>
            {CHAKRAS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.ordem}. {c.nomePT} ({c.nome})
              </option>
            ))}
          </select>
          <select value={acessorio} onChange={(e) => setAcessorio(e.target.value as Acessorio | 'todos')} aria-label="Acessório">
            <option value="todos">Com ou sem acessórios</option>
            {ACESSORIOS.map((a) => (
              <option key={a} value={a}>
                Com {ACESSORIO_LABEL[a].toLowerCase()}
              </option>
            ))}
          </select>
          {filtrosAtivos > 0 && (
            <button type="button" className="chip chip-sm chip-neutral library-clear" onClick={limparFiltros} title="Limpar filtros">
              <SlidersHorizontal size={12} /> Limpar ({filtrosAtivos})
            </button>
          )}
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
        {comIntencao
          ? TIPO_ORDEM.map((t) => {
              const grupo = lista.filter((p) => p.tipo === t)
              if (grupo.length === 0) return null
              return (
                <div key={t} className="library-group">
                  <h3 className="library-group-title">
                    {TIPO_LABEL[t]} <span className="muted">({grupo.length})</span>
                  </h3>
                  {grupo.map(renderCard)}
                </div>
              )
            })
          : lista.map(renderCard)}
      </div>
    </aside>
  )
}
