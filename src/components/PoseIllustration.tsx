import type { Pose } from '../data/types'
import { FlatFigure } from './FlatFigure'
import { poseImageUrl } from './PoseVisual'

interface Props {
  pose: Pose
  className?: string
  title?: string
}

/**
 * Ilustração da postura (detalhe da postura e página /figuras): a ilustração
 * editorial gerada pela app (FlatFigure) ou, quando existe, a imagem própria
 * em public/poses/<id>.webp.
 */
export function PoseIllustration({ pose, className, title }: Props) {
  const url = poseImageUrl(pose.id)
  if (url) {
    return <img className={`pose-img ${className ?? ''}`} src={url} alt={title ?? pose.nome} decoding="async" />
  }
  return <FlatFigure pose={pose} className={className} title={title} />
}
