// Entrada SSR para renderizar as ilustrações geradas de uma postura como SVG
// (usada por scripts/render-watercolor.mjs).
import { renderToStaticMarkup } from 'react-dom/server'
import { FlatFigure } from '../src/components/FlatFigure'
import { SilhouetteFigure } from '../src/components/SilhouetteFigure'
import { WatercolorFigure } from '../src/components/WatercolorFigure'
import { POSES } from '../src/data/poses'
import type { Pose } from '../src/data/types'

export { POSES }

export type Estilo = 'flat' | 'aquarela' | 'silhueta'

export function renderPoseSvg(pose: Pose, estilo: Estilo = 'flat'): string {
  const el =
    estilo === 'silhueta' ? <SilhouetteFigure pose={pose} /> : estilo === 'aquarela' ? <WatercolorFigure pose={pose} grain={false} /> : <FlatFigure pose={pose} />
  const svg = renderToStaticMarkup(el)
  // ids únicos por postura (o useId reinicia em cada render)
  const m = svg.match(/id="([A-Za-z0-9]+)-(edge|sil|near|c0)"/)
  return m ? svg.split(m[1]).join(`wc-${pose.id}`) : svg
}
