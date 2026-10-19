import { POSE_IMAGES } from '../data/poseImages'
import type { Pose } from '../data/types'
import { PoseFigure } from './PoseFigure'

interface Props {
  pose: Pose
  className?: string
  /** Só se aplica à figura esquemática de recurso. */
  chao?: boolean
  title?: string
  /** Carregar de imediato (impressão); por omissão as imagens carregam quando entram no ecrã. */
  eager?: boolean
}

/** URL da ilustração de uma postura (undefined se não existir). */
export function poseImageUrl(poseId: string): string | undefined {
  const rel = POSE_IMAGES[poseId]
  return rel ? `${import.meta.env.BASE_URL}${rel}` : undefined
}

export function hasPoseImage(poseId: string): boolean {
  return poseId in POSE_IMAGES
}

/**
 * Imagem da postura em qualquer tamanho (cartões, itens da aula, wizard,
 * impressão). Usa a ilustração em public/poses/<id>.webp; só se ela não
 * existir recorre à figura esquemática.
 */
export function PoseVisual({ pose, className, chao, title, eager }: Props) {
  const url = poseImageUrl(pose.id)
  if (url) {
    return (
      <img
        className={`pose-img ${className ?? ''}`}
        src={url}
        alt={title ?? pose.nome}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
      />
    )
  }
  return <PoseFigure figura={pose.figura} className={className} chao={chao} title={title} />
}
