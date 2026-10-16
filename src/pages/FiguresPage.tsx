import type { CSSProperties } from 'react'
import { hasPoseImage, PoseVisual } from '../components/PoseVisual'
import { CATEGORY_MAP } from '../data/categories'
import { POSES } from '../data/poses'

/**
 * Página de revisão das ilustrações (rota /figuras, não aparece no menu).
 * Mostra a ilustração em aquarela quando existe e a figura esquemática quando não,
 * com a etiqueta "sem imagem" — útil para acompanhar a substituição das figuras.
 */
export function FiguresPage() {
  const comImagem = POSES.filter((p) => hasPoseImage(p.id)).length
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Revisão das ilustrações</h1>
          <p className="muted">
            {comImagem} de {POSES.length} posturas com ilustração em aquarela; as restantes usam a figura esquemática.
            Ver <code>docs/imagens/README.md</code> para gerar e importar imagens.
          </p>
        </div>
      </header>
      <div className="figures-grid">
        {POSES.map((p) => {
          const cat = CATEGORY_MAP[p.categorias[0]]
          const falta = !hasPoseImage(p.id)
          return (
            <div key={p.id} className={`figure-tile ${falta ? 'sem-imagem' : ''}`} style={{ '--cat': cat.cor } as CSSProperties}>
              <div className="figure-tile-img">
                <PoseVisual pose={p} title={p.nome} />
                {falta && <span className="falta">sem imagem</span>}
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
