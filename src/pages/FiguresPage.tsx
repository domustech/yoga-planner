import type { CSSProperties } from 'react'
import { PoseIllustration } from '../components/PoseIllustration'
import { hasPoseImage, PoseVisual } from '../components/PoseVisual'
import { CATEGORY_MAP } from '../data/categories'
import { POSES } from '../data/poses'

/**
 * Página de revisão das ilustrações (rota /figuras, não aparece no menu).
 * Mostra a aquarela de cada postura (gerada, ou a imagem própria quando existe)
 * e, em miniatura, a figura esquemática usada nos cartões.
 */
export function FiguresPage() {
  const comImagem = POSES.filter((p) => hasPoseImage(p.id)).length
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Revisão das ilustrações</h1>
          <p className="muted">
            Ilustrações das posturas: {comImagem} de {POSES.length} têm imagem própria (etiqueta "imagem"); as restantes mostram a
            ilustração gerada pela app. As miniaturas são as figuras esquemáticas usadas nos cartões e no editor.
          </p>
        </div>
      </header>
      <div className="figures-grid figures-grid-wc">
        {POSES.map((p) => {
          const cat = CATEGORY_MAP[p.categorias[0]]
          const propria = hasPoseImage(p.id)
          return (
            <div key={p.id} className="figure-tile" style={{ '--cat': cat.cor } as CSSProperties}>
              <div className="figure-tile-img figure-tile-wc">
                <PoseIllustration pose={p} title={p.nome} />
                {propria && <span className="falta tem">imagem</span>}
                <span className="figure-tile-mini">
                  <PoseVisual pose={p} chao={false} />
                </span>
              </div>
              <strong>{p.nome}</strong>
              <em>{p.sanscrito}</em>
              <code>{p.id}</code>
            </div>
          )
        })}
      </div>
    </div>
  )
}
