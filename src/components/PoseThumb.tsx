import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import type { Pose } from '../data/types'
import { PoseVisual, poseImageUrl } from './PoseVisual'

interface Props {
  pose: Pose
  className?: string
}

const PEEK_SIZE = 300
const MARGIN = 10

interface PeekPos {
  left: number
  top: number
}

/** Só em dispositivos com rato (ou trackpad); no toque não há hover. */
function podeHover(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

/**
 * Miniatura da postura que, ao passar o rato por cima, mostra uma
 * pré-visualização ampliada ao lado, sem abrir o detalhe. Não interfere
 * com o arrastar (fecha ao premir o botão) nem com o toque.
 */
export function PoseThumb({ pose, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const timer = useRef<number | null>(null)
  const [pos, setPos] = useState<PeekPos | null>(null)

  const fechar = () => {
    if (timer.current) {
      window.clearTimeout(timer.current)
      timer.current = null
    }
    setPos(null)
  }

  const abrir = () => {
    if (!podeHover() || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const total = PEEK_SIZE + 16 // padding do painel
    const altura = total + 44 // legenda
    let left = r.right + MARGIN
    if (left + total > window.innerWidth - MARGIN) left = r.left - MARGIN - total
    if (left < MARGIN) left = Math.max(MARGIN, Math.min(window.innerWidth - total - MARGIN, r.left))
    let top = r.top + r.height / 2 - altura / 2
    top = Math.max(MARGIN, Math.min(window.innerHeight - altura - MARGIN, top))
    setPos({ left, top })
  }

  useEffect(() => {
    if (!pos) return
    const onScroll = () => fechar()
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    }
  }, [pos])

  useEffect(() => () => fechar(), [])

  const url = poseImageUrl(pose.id)

  return (
    <span
      ref={ref}
      className={`pose-thumb ${className ?? ''}`}
      onMouseEnter={() => {
        if (!podeHover()) return
        if (timer.current) window.clearTimeout(timer.current)
        timer.current = window.setTimeout(abrir, 160)
      }}
      onMouseLeave={fechar}
      onMouseDown={fechar}
      onDragStart={fechar}
    >
      <PoseVisual pose={pose} chao={false} />
      {pos &&
        createPortal(
          <div className="pose-peek" style={{ left: pos.left, top: pos.top, width: PEEK_SIZE + 16 } as CSSProperties} role="presentation">
            {url ? <img src={url} alt="" draggable={false} /> : <PoseVisual pose={pose} />}
            <span className="pose-peek-name">
              {pose.nome}
              <em>{pose.sanscrito}</em>
            </span>
          </div>,
          document.body,
        )}
    </span>
  )
}
