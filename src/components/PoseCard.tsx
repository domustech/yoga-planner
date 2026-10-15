import { useDraggable } from '@dnd-kit/core'
import { Clock, Info, Plus } from 'lucide-react'
import type { CSSProperties } from 'react'
import { CATEGORY_MAP, EFEITO_MAP, LEVEL_LABEL } from '../data/categories'
import { CHAKRA_MAP } from '../data/chakras'
import type { Pose } from '../data/types'
import { formatDuration } from '../lib/utils'
import { CategoryChip } from './CategoryChip'
import { PoseFigure } from './PoseFigure'

interface Props {
  pose: Pose
  onDetails?: (poseId: string) => void
  onAdd?: (poseId: string) => void
  addTitle?: string
  /** Props de arrasto (vindas de useDraggable) */
  dragRef?: (el: HTMLElement | null) => void
  dragProps?: Record<string, unknown>
  isDragging?: boolean
  compact?: boolean
}

export function PoseCard({ pose, onDetails, onAdd, addTitle, dragRef, dragProps, isDragging, compact }: Props) {
  const cat = CATEGORY_MAP[pose.categorias[0]]
  const style = { '--cat': cat.cor } as CSSProperties
  return (
    <article
      ref={dragRef}
      className={`pose-card ${isDragging ? 'is-dragging' : ''} ${compact ? 'is-compact' : ''} ${dragProps ? 'is-draggable' : ''}`}
      style={style}
      {...dragProps}
    >
      <div className="pose-card-figure">
        <PoseFigure figura={pose.figura} title={pose.nome} />
      </div>
      <div className="pose-card-body">
        <strong className="pose-card-name">{pose.nome}</strong>
        <em className="pose-card-sanskrit">{pose.sanscrito}</em>
        {!compact && (
          <div className="pose-card-meta">
            <CategoryChip id={pose.categorias[0]} small />
            <span className={`level level-${pose.nivel}`}>{LEVEL_LABEL[pose.nivel]}</span>
            <span className="meta-time">
              <Clock size={12} /> {formatDuration(pose.duracaoSugerida)}
              {pose.bilateral && <small> ×2</small>}
            </span>
            {pose.efeito && (
              <span className="efeito-tag" style={{ '--ef': EFEITO_MAP[pose.efeito].cor } as CSSProperties} title={EFEITO_MAP[pose.efeito].descricao}>
                {EFEITO_MAP[pose.efeito].nome}
              </span>
            )}
            {pose.chakras && pose.chakras.length > 0 && (
              <span className="chakra-dots" title={pose.chakras.map((c) => CHAKRA_MAP[c].nomePT).join(', ')}>
                {pose.chakras.map((c) => (
                  <span key={c} className="chakra-dot" style={{ '--ch': CHAKRA_MAP[c].cor } as CSSProperties} />
                ))}
              </span>
            )}
          </div>
        )}
      </div>
      {(onDetails || onAdd) && (
        <div className="pose-card-actions" onPointerDown={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
          {onDetails && (
            <button type="button" className="icon-btn" onClick={() => onDetails(pose.id)} title="Ver detalhes">
              <Info size={16} />
            </button>
          )}
          {onAdd && (
            <button
              type="button"
              className="icon-btn primary"
              onClick={() => onAdd(pose.id)}
              title={addTitle ?? 'Adicionar à fase selecionada'}
            >
              <Plus size={16} />
            </button>
          )}
        </div>
      )}
    </article>
  )
}

/** Cartão arrastável (para a biblioteca dentro do editor). */
export function DraggablePoseCard(props: Omit<Props, 'dragRef' | 'dragProps' | 'isDragging'>) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `lib:${props.pose.id}`,
    data: { type: 'lib', poseId: props.pose.id },
  })
  return (
    <PoseCard
      {...props}
      dragRef={setNodeRef}
      dragProps={{ ...attributes, ...listeners }}
      isDragging={isDragging}
    />
  )
}
