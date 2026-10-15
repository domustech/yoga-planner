import { useState } from 'react'
import { LibraryPanel } from '../components/LibraryPanel'
import { PoseDetails } from '../components/PoseDetails'
import { CATEGORIES } from '../data/categories'
import { POSES } from '../data/poses'

export function LibraryPage() {
  const [detailsId, setDetailsId] = useState<string | null>(null)
  return (
    <div className="page page-library">
      <header className="page-header">
        <div>
          <h1>Biblioteca de posturas</h1>
          <p className="muted">
            {POSES.length} posturas e práticas de Hatha Yoga em {CATEGORIES.length} categorias. Clique numa postura para ver
            detalhes, benefícios e precauções.
          </p>
        </div>
      </header>
      <LibraryPanel draggable={false} onDetails={setDetailsId} />
      <PoseDetails poseId={detailsId} onClose={() => setDetailsId(null)} />
    </div>
  )
}
