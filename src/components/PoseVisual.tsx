import { POSE_IMAGES } from '../data/poseImages'
import type { Pose } from '../data/types'
import { PoseFigure } from './PoseFigure'

interface Props {
  pose: Pose
  className?: string
  chao?: boolean
  title?: string
}

/** URL da imagem própria de uma postura (undefined se não existir). */
export function poseImageUrl(poseId: string): string | undefined {
  const rel = POSE_IMAGES[poseId]
  return rel ? `${import.meta.env.BASE_URL}${rel}` : undefined
}

export function hasPoseImage(poseId: string): boolean {
  return poseId in POSE_IMAGES
}

/**
 * Figura esquemática ("boneco de linha") usada nos cartões, no editor,
 * na impressão e no wizard. A ilustração em aquarela fica para o detalhe
 * da postura (ver PoseIllustration).
 */
export function PoseVisual({ pose, className, chao, title }: Props) {
  return <PoseFigure figura={pose.figura} className={className} chao={chao} title={title} />
}
