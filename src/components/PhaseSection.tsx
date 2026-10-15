import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { ArrowDown, ArrowUp, Clock, Plus, StickyNote, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { ClassPhase, YogaClass } from '../data/types'
import { formatDuration, phaseDuration } from '../lib/utils'
import { useClassStore } from '../store/useClassStore'
import { CategoryChip } from './CategoryChip'
import { ClassItemRow } from './ClassItemRow'

interface Props {
  aula: YogaClass
  fase: ClassPhase
  index: number
  active: boolean
  onActivate: () => void
  onDetails: (poseId: string) => void
  onAddRequest: () => void
}

export function PhaseSection({ aula, fase, index, active, onActivate, onDetails, onAddRequest }: Props) {
  const atualizarFase = useClassStore((s) => s.atualizarFase)
  const removerFase = useClassStore((s) => s.removerFase)
  const moverFase = useClassStore((s) => s.moverFase)
  const [editNotes, setEditNotes] = useState(false)

  const { setNodeRef, isOver } = useDroppable({
    id: `phase:${fase.id}`,
    data: { type: 'phase', faseId: fase.id },
  })

  const total = phaseDuration(fase)
  const vazia = fase.itens.length === 0

  const remover = () => {
    if (vazia || window.confirm(`Remover a fase "${fase.nome}" e as suas ${fase.itens.length} posturas?`)) {
      removerFase(aula.id, fase.id)
    }
  }

  return (
    <section
      ref={setNodeRef}
      className={`phase ${active ? 'is-active' : ''} ${isOver ? 'is-over' : ''}`}
      onClick={onActivate}
      aria-label={`Fase ${index + 1}: ${fase.nome}`}
    >
      <header className="phase-header">
        <span className="phase-index">{index + 1}</span>
        <input
          className="phase-name"
          value={fase.nome}
          onChange={(e) => atualizarFase(aula.id, fase.id, { nome: e.target.value })}
          aria-label="Nome da fase"
        />
        <span className="phase-total" title="Duração da fase">
          <Clock size={14} /> {formatDuration(total)}
        </span>
        <div className="phase-actions">
          <button
            type="button"
            className="icon-btn"
            title="Mover fase para cima"
            disabled={index === 0}
            onClick={(e) => {
              e.stopPropagation()
              moverFase(aula.id, fase.id, -1)
            }}
          >
            <ArrowUp size={15} />
          </button>
          <button
            type="button"
            className="icon-btn"
            title="Mover fase para baixo"
            disabled={index === aula.fases.length - 1}
            onClick={(e) => {
              e.stopPropagation()
              moverFase(aula.id, fase.id, 1)
            }}
          >
            <ArrowDown size={15} />
          </button>
          <button
            type="button"
            className={`icon-btn ${editNotes || fase.notas ? 'is-on' : ''}`}
            title="Notas da fase"
            onClick={(e) => {
              e.stopPropagation()
              setEditNotes((v) => !v)
            }}
          >
            <StickyNote size={15} />
          </button>
          <button
            type="button"
            className="icon-btn danger"
            title="Remover fase"
            onClick={(e) => {
              e.stopPropagation()
              remover()
            }}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </header>

      {fase.categoriasSugeridas.length > 0 && (
        <div className="phase-cats" title="Categorias sugeridas para esta fase">
          {fase.categoriasSugeridas.map((c) => (
            <CategoryChip key={c} id={c} small />
          ))}
        </div>
      )}

      {(editNotes || fase.notas) && (
        <textarea
          className="phase-notes"
          value={fase.notas ?? ''}
          onChange={(e) => atualizarFase(aula.id, fase.id, { notas: e.target.value })}
          placeholder="Notas da fase (objetivo, indicações, música…)"
          rows={2}
        />
      )}

      <SortableContext items={fase.itens.map((it) => `item:${it.id}`)} strategy={verticalListSortingStrategy}>
        <ul className="item-list">
          {fase.itens.map((item, i) => (
            <ClassItemRow
              key={item.id}
              aulaId={aula.id}
              faseId={fase.id}
              item={item}
              index={i}
              fases={aula.fases}
              onDetails={onDetails}
            />
          ))}
        </ul>
      </SortableContext>

      <button
        type="button"
        className={`phase-add ${vazia ? 'is-empty' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          onActivate()
          onAddRequest()
        }}
      >
        <Plus size={16} />
        {vazia ? 'Arraste posturas da biblioteca para aqui, ou clique para adicionar' : 'Adicionar postura'}
      </button>
    </section>
  )
}
