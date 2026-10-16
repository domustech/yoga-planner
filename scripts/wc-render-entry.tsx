// Entrada SSR para renderizar a aquarela de uma postura como SVG (usada por scripts/render-watercolor.mjs).
import { renderToStaticMarkup } from 'react-dom/server'
import { WatercolorFigure } from '../src/components/WatercolorFigure'
import { POSES } from '../src/data/poses'
import type { Pose } from '../src/data/types'

export { POSES }

export function renderPoseSvg(pose: Pose): string {
  const svg = renderToStaticMarkup(<WatercolorFigure pose={pose} />)
  // ids únicos por postura (o useId reinicia em cada render)
  const m = svg.match(/id="([A-Za-z0-9]+)-edge"/)
  return m ? svg.split(m[1]).join(`wc-${pose.id}`) : svg
}
