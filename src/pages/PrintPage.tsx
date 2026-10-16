import { ArrowLeft, Printer } from 'lucide-react'
import type { CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ClassTimeline } from '../components/ClassTimeline'
import { ExportPdfButton } from '../components/ExportPdfButton'
import { PoseFigure } from '../components/PoseFigure'
import { CATEGORY_MAP, LEVEL_LABEL } from '../data/categories'
import { getPose } from '../data/poses'
import { classDuration, classItemCount, formatDuration, formatDurationLong, phaseDuration } from '../lib/utils'
import { useClassStore } from '../store/useClassStore'

export function PrintPage() {
  const { id = '' } = useParams()
  const aula = useClassStore((s) => s.aulas.find((a) => a.id === id))

  if (!aula) {
    return (
      <div className="page">
        <p>Aula não encontrada.</p>
        <Link to="/" className="btn">
          <ArrowLeft size={16} /> Voltar
        </Link>
      </div>
    )
  }

  const total = classDuration(aula)

  return (
    <div className="print-page">
      <div className="print-toolbar no-print">
        <Link to={`/aula/${aula.id}`} className="btn">
          <ArrowLeft size={16} /> Voltar ao editor
        </Link>
        <div className="print-toolbar-actions">
          <ExportPdfButton aula={aula} label="Descarregar PDF" />
          <button type="button" className="btn primary" onClick={() => window.print()}>
            <Printer size={16} /> Imprimir
          </button>
        </div>
      </div>

      <header className="print-header">
        <h1>{aula.nome}</h1>
        <p className="print-meta">
          {LEVEL_LABEL[aula.nivel]} · {formatDurationLong(total)} (alvo {aula.duracaoAlvo} min) · {classItemCount(aula)} posturas
        </p>
        {aula.tema && (
          <p>
            <strong>Tema:</strong> {aula.tema}
          </p>
        )}
        {aula.descricao && <p className="muted">{aula.descricao}</p>}
        <ClassTimeline aula={aula} showPhases />
      </header>

      {aula.fases.map((f, i) => {
        if (f.itens.length === 0 && !f.notas) return null
        return (
          <section key={f.id} className="print-phase">
            <h2>
              <span className="phase-index">{i + 1}</span> {f.nome}
              <span className="muted print-phase-time">{formatDuration(phaseDuration(f))}</span>
            </h2>
            {f.notas && <p className="print-notes">{f.notas}</p>}
            <div className="print-grid">
              {f.itens.map((it) => {
                const pose = getPose(it.poseId)
                if (!pose) return null
                const cat = CATEGORY_MAP[pose.categorias[0]]
                return (
                  <div key={it.id} className="print-card" style={{ '--cat': cat.cor } as CSSProperties}>
                    <div className="print-card-figure">
                      <PoseFigure figura={pose.figura} />
                    </div>
                    <strong>{pose.nome}</strong>
                    <em>{pose.sanscrito}</em>
                    <span className="print-card-time">
                      {formatDuration(it.duracao)}
                      {pose.bilateral && ' · 2 lados'}
                    </span>
                    {it.notas && <p className="print-card-notes">{it.notas}</p>}
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}

      <footer className="print-footer muted">Yoga Planner · {new Date().toLocaleDateString('pt-PT')}</footer>
    </div>
  )
}
