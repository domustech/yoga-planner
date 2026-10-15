import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { ArrowLeft, BookOpen, Download, Plus, Printer } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ClassTimeline } from '../components/ClassTimeline'
import { LibraryPanel } from '../components/LibraryPanel'
import { PhaseSection } from '../components/PhaseSection'
import { PoseCard } from '../components/PoseCard'
import { PoseDetails } from '../components/PoseDetails'
import { LEVELS, LEVEL_LABEL } from '../data/categories'
import { getPose } from '../data/poses'
import type { Level } from '../data/types'
import { classDuration, downloadJson, formatDurationLong, slugify } from '../lib/utils'
import { useClassStore } from '../store/useClassStore'

type DragData =
  | { type: 'lib'; poseId: string }
  | { type: 'item'; itemId: string; faseId: string; index: number }
  | { type: 'phase'; faseId: string }

/** Prioriza itens sobre o contentor da fase quando o ponteiro está sobre ambos. */
const collisionDetection: CollisionDetection = (args) => {
  const within = pointerWithin(args)
  if (within.length > 0) {
    const item = within.find((c) => String(c.id).startsWith('item:'))
    return item ? [item] : [within[0]]
  }
  return rectIntersection(args)
}

export function ClassEditorPage() {
  const { id = '' } = useParams()
  const aula = useClassStore((s) => s.aulas.find((a) => a.id === id))
  const atualizarAula = useClassStore((s) => s.atualizarAula)
  const adicionarItem = useClassStore((s) => s.adicionarItem)
  const moverItem = useClassStore((s) => s.moverItem)
  const adicionarFase = useClassStore((s) => s.adicionarFase)

  const [activePhaseId, setActivePhaseId] = useState<string | null>(null)
  const [detailsId, setDetailsId] = useState<string | null>(null)
  const [dragPoseId, setDragPoseId] = useState<string | null>(null)
  const [libOpen, setLibOpen] = useState(false)
  const [novaFase, setNovaFase] = useState('')

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 220, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const closeDetails = useCallback(() => setDetailsId(null), [])

  if (!aula) {
    return (
      <div className="page">
        <p>Aula não encontrada.</p>
        <Link to="/" className="btn">
          <ArrowLeft size={16} /> Voltar às aulas
        </Link>
      </div>
    )
  }

  const activePhase = aula.fases.find((f) => f.id === activePhaseId) ?? aula.fases[0]
  const total = classDuration(aula)
  const alvoSeg = aula.duracaoAlvo * 60
  const pct = alvoSeg > 0 ? Math.min(100, (total / alvoSeg) * 100) : 0
  const excede = total > alvoSeg

  const addToActive = (poseId: string) => {
    if (!activePhase) {
      window.alert('Crie primeiro uma fase para adicionar posturas.')
      return
    }
    adicionarItem(aula.id, activePhase.id, poseId)
  }

  const onDragStart = (e: DragStartEvent) => {
    const d = e.active.data.current as DragData | undefined
    if (!d) return
    if (d.type === 'lib') setDragPoseId(d.poseId)
    if (d.type === 'item') {
      const item = aula.fases.flatMap((f) => f.itens).find((it) => it.id === d.itemId)
      setDragPoseId(item?.poseId ?? null)
    }
  }

  const onDragEnd = (e: DragEndEvent) => {
    setDragPoseId(null)
    const a = e.active.data.current as DragData | undefined
    const o = e.over?.data.current as DragData | undefined
    if (!a || !o) return

    if (a.type === 'lib') {
      if (o.type === 'phase') adicionarItem(aula.id, o.faseId, a.poseId)
      else if (o.type === 'item') adicionarItem(aula.id, o.faseId, a.poseId, o.index)
      return
    }
    if (a.type === 'item') {
      if (o.type === 'item') {
        if (o.itemId === a.itemId) return
        moverItem(aula.id, a.faseId, o.faseId, a.itemId, o.index)
      } else if (o.type === 'phase' && o.faseId !== a.faseId) {
        moverItem(aula.id, a.faseId, o.faseId, a.itemId, Number.MAX_SAFE_INTEGER)
      }
    }
  }

  const exportar = () => downloadJson(`${slugify(aula.nome) || 'aula'}.json`, aula)
  const dragPose = dragPoseId ? getPose(dragPoseId) : undefined

  return (
    <DndContext sensors={sensors} collisionDetection={collisionDetection} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={() => setDragPoseId(null)}>
      <div className="editor">
        <header className="editor-header">
          <Link to="/" className="icon-btn" title="Voltar às aulas" aria-label="Voltar às aulas">
            <ArrowLeft size={18} />
          </Link>
          <input
            className="editor-title"
            value={aula.nome}
            onChange={(e) => atualizarAula(aula.id, { nome: e.target.value })}
            aria-label="Nome da aula"
            placeholder="Nome da aula"
          />
          <select
            value={aula.nivel}
            onChange={(e) => atualizarAula(aula.id, { nivel: e.target.value as Level })}
            aria-label="Nível da aula"
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {LEVEL_LABEL[l]}
              </option>
            ))}
          </select>
          <label className="target">
            <span className="muted">Alvo</span>
            <input
              type="number"
              min={5}
              max={240}
              step={5}
              value={aula.duracaoAlvo}
              onChange={(e) => atualizarAula(aula.id, { duracaoAlvo: Math.max(5, Number(e.target.value) || 0) })}
              aria-label="Duração alvo em minutos"
            />
            <span className="muted">min</span>
          </label>
          <div className="editor-total" title="Duração total planeada vs. duração alvo">
            <span>
              <strong>{formatDurationLong(total)}</strong>{' '}
              <span className={`muted ${excede ? 'text-warn' : ''}`}>
                {excede ? `(+${formatDurationLong(total - alvoSeg)} acima do alvo)` : `de ${aula.duracaoAlvo} min`}
              </span>
            </span>
            <div className="progress">
              <span className={excede ? 'is-over' : ''} style={{ width: `${pct}%` }} />
            </div>
          </div>
          <div className="editor-actions">
            <Link className="btn" to={`/aula/${aula.id}/imprimir`}>
              <Printer size={16} /> Imprimir
            </Link>
            <button type="button" className="btn" onClick={exportar}>
              <Download size={16} /> Exportar
            </button>
          </div>
        </header>

        <div className="editor-sub">
          <input
            className="editor-theme"
            value={aula.tema ?? ''}
            onChange={(e) => atualizarAula(aula.id, { tema: e.target.value })}
            placeholder="Tema / intenção da aula (ex.: abertura do peito, enraizamento, calma…)"
            aria-label="Tema da aula"
          />
          <ClassTimeline aula={aula} showPhases />
        </div>

        <div className="editor-main">
          <div className="phases">
            {aula.fases.map((f, i) => (
              <PhaseSection
                key={f.id}
                aula={aula}
                fase={f}
                index={i}
                active={activePhase?.id === f.id}
                onActivate={() => setActivePhaseId(f.id)}
                onDetails={setDetailsId}
                onAddRequest={() => setLibOpen(true)}
              />
            ))}

            <form
              className="phase-new"
              onSubmit={(e) => {
                e.preventDefault()
                const nome = novaFase.trim()
                if (!nome) return
                adicionarFase(aula.id, nome)
                setNovaFase('')
              }}
            >
              <input
                value={novaFase}
                onChange={(e) => setNovaFase(e.target.value)}
                placeholder="Nova fase (ex.: Sequência de equilíbrio)"
                aria-label="Nome da nova fase"
              />
              <button type="submit" className="btn">
                <Plus size={16} /> Adicionar fase
              </button>
            </form>
          </div>

          <div className={`library-wrap ${libOpen ? 'is-open' : ''}`}>
            <LibraryPanel
              sugeridas={activePhase?.categoriasSugeridas}
              faseNome={activePhase?.nome}
              onAdd={addToActive}
              onDetails={setDetailsId}
              onClose={() => setLibOpen(false)}
            />
          </div>
        </div>

        <button type="button" className="fab" onClick={() => setLibOpen(true)}>
          <BookOpen size={18} /> Biblioteca
        </button>
      </div>

      <DragOverlay dropAnimation={null}>
        {dragPose && (
          <div className="drag-preview">
            <PoseCard pose={dragPose} compact />
          </div>
        )}
      </DragOverlay>

      <PoseDetails
        poseId={detailsId}
        onClose={closeDetails}
        onAdd={(pid) => {
          addToActive(pid)
          setDetailsId(null)
        }}
        addLabel={activePhase ? `Adicionar a "${activePhase.nome}"` : undefined}
      />
    </DndContext>
  )
}
