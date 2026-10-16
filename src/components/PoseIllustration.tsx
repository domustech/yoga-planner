import type { Pose } from '../data/types'
import { poseImageUrl } from './PoseVisual'
import { WatercolorFigure } from './WatercolorFigure'

interface Props {
  pose: Pose
  className?: string
  title?: string
}

/**
 * Ilustração em aquarela da postura (detalhe da postura e página /figuras):
 * usa a imagem própria em public/poses/<id>.webp quando existe e, caso
 * contrário, a aquarela gerada a partir das articulações.
 */
export function PoseIllustration({ pose, className, title }: Props) {
  const url = poseImageUrl(pose.id)
  if (url) {
    return <img className={`pose-img ${className ?? ''}`} src={url} alt={title ?? pose.nome} decoding="async" />
  }
  return <WatercolorFigure pose={pose} className={className} title={title} />
}
