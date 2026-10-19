import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Copy, GripVertical, Info, X } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import { getAlinhamento } from '../data/alinhamento'
import { CATEGORY_MAP } from '../data/categories'
import { getPose } from '../data/poses'
import type { ClassItem, ClassPhase } from '../data/types'
import { useClassStore } from '../store/useClassStore'
import { AlignmentList } from './AlignmentList'
import { DurationControl } from './DurationControl'
import { PoseThumb } from './PoseThumb'

interface Props {
  aulaId: string
  faseId: string
  item: ClassItem
  index: number
  fases: ClassPhase[]
  onDetails: (poseId: string) => void
}

export function ClassItemRow({ aulaId, faseId, item, index, fases, onDetails }: Props) {
  const pose = getPose(item.poseId)
  const atualizarItem = useClassStore((s) => s.atualizarItem)
  const removerItem = useClassStore((s) => s.removerItem)
  const duplicarItem = useClassStore((s) => s.duplicarItem)
  const moverItem = useClassStore((s) => s.moverItem)
  const [open, setOpen] = useState(false)

  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: `item:${item.id}`,
    data: { type: 'item', itemId: item.id, faseId, index },
  })

  if (!pose) {
    return (
      <li className="item item-missing">
        <span>Postura desconhecida ({item.poseId})</span>
        <button type="button" className="icon-btn danger" onClick={() => removerItem(aulaId, faseId, item.id)} aria-label="Remover">
          <X size={16} />
        </button>
      </li>
    )
  }

  const cat = CATEGORY_MAP[pose.categorias[0]]
  const alinhamento = getAlinhamento(pose.id)
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    '--cat': cat.cor,
  } as CSSProperties

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`item ${isDragging ? 'is-dragging' : ''} ${open ? 'is-open' : ''}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="item-row">
        <button
          type="button"
          ref={setActivatorNodeRef}
          className="drag-handle"
          {...attributes}
          {...listeners}
          aria-label="Arrastar para reordenar"
          title="Arrastar para reordenar ou mover para outra fase"
        >
          <GripVertical size={16} />
        </button>

        <div className="item-figure">
          <PoseThumb pose={pose} />
        </div>

        <button type="button" className="item-body" onClick={() => setOpen((o) => !o)} title="Notas e opções">
          <span className="item-name">
            {pose.nome}
            {pose.bilateral && <span className="tag">2 lados</span>}
          </span>
          <span className="item-sanskrit">{pose.sanscrito}</span>
          {item.notas && !open && <span className="item-notes-preview">{item.notas}</span>}
        </button>

        <DurationControl value={item.duracao} onChange={(d) => atualizarItem(aulaId, faseId, item.id, { duracao: d })} />

        <div className="item-actions">
          <button type="button" className="icon-btn" title="Detalhes da postura" onClick={() => onDetails(pose.id)}>
            <Info size={16} />
          </button>
          <button type="button" className="icon-btn" title="Duplicar" onClick={() => duplicarItem(aulaId, faseId, item.id)}>
            <Copy size={16} />
          </button>
          <button type="button" className="icon-btn danger" title="Remover" onClick={() => removerItem(aulaId, faseId, item.id)}>
            <X size={16} />
          </button>
        </div>
      </div>

      {open && (
        <div className="item-details">
          <label className="field">
            <span>Notas / instruções</span>
            <textarea
              value={item.notas ?? ''}
              onChange={(e) => atualizarItem(aulaId, faseId, item.id, { notas: e.target.value })}
              placeholder="Ex.: variante com bloco, 5 respirações por lado, foco na expiração…"
              rows={2}
            />
          </label>
          <label className="field field-inline">
            <span>Mover para a fase</span>
            <select
              value={faseId}
              onChange={(e) => {
                const destino = e.target.value
                if (destino !== faseId) moverItem(aulaId, faseId, destino, item.id, Number.MAX_SAFE_INTEGER)
              }}
            >
              {fases.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nome}
                </option>
              ))}
            </select>
          </label>
          {pose.respiracao && (
            <p className="hint">
              <strong>Respiração:</strong> {pose.respiracao}
            </p>
          )}
          {alinhamento && (
            <details className="item-align">
              <summary>Alinhamento: o que assegurar</summary>
              <AlignmentList alinhamento={alinhamento} compact />
            </details>
          )}
        </div>
      )}
    </li>
  )
}
