import type { CSSProperties } from 'react'
import { PoseFigure } from '../components/PoseFigure'
import { CATEGORY_MAP } from '../data/categories'
import { POSES } from '../data/poses'

/**
 * Página de revisão das figuras (rota /figuras, não aparece no menu).
 * Útil para rever/afinar as ilustrações esquemáticas de todas as posturas.
 */
export function FiguresPage() {
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Revisão das figuras</h1>
          <p className="muted">{POSES.length} figuras esquemáticas geradas a partir das articulações.</p>
        </div>
      </header>
      <div className="figures-grid">
        {POSES.map((p) => {
          const cat = CATEGORY_MAP[p.categorias[0]]
          return (
            <div key={p.id} className="figure-tile" style={{ '--cat': cat.cor } as CSSProperties}>
              <div className="figure-tile-img">
                <PoseFigure figura={p.figura} title={p.nome} />
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
