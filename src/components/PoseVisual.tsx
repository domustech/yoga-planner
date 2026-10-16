import { POSE_IMAGES } from '../data/poseImages'
import type { Pose } from '../data/types'
import { PoseFigure } from './PoseFigure'

interface Props {
  pose: Pose
  className?: string
  /** Só se aplica à figura esquemática. */
  chao?: boolean
  title?: string
}

/** URL da ilustração de uma postura (undefined se ainda não existir). */
export function poseImageUrl(poseId: string): string | undefined {
  const rel = POSE_IMAGES[poseId]
  return rel ? `${import.meta.env.BASE_URL}${rel}` : undefined
}

export function hasPoseImage(poseId: string): boolean {
  return poseId in POSE_IMAGES
}

/**
 * Mostra a ilustração em aquarela da postura quando existe
 * (public/poses/<id>.webp) e, caso contrário, a figura esquemática.
 */
export function PoseVisual({ pose, className, chao, title }: Props) {
  const url = poseImageUrl(pose.id)
  if (url) {
    return <img className={`pose-img ${className ?? ''}`} src={url} alt={title ?? pose.nome} loading="lazy" decoding="async" />
  }
  return <PoseFigure figura={pose.figura} className={className} chao={chao} title={title} />
}
