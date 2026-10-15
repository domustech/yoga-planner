import { CATEGORY_MAP } from '../data/categories'
import { getPose } from '../data/poses'
import type { YogaClass } from '../data/types'
import { classDuration, formatDuration, phaseDuration } from '../lib/utils'

interface Props {
  aula: YogaClass
  showPhases?: boolean
}

/** Barra horizontal com a sequência da aula, colorida por categoria. */
export function ClassTimeline({ aula, showPhases }: Props) {
  const total = classDuration(aula)
  if (total === 0) return <div className="timeline timeline-empty">Ainda sem posturas</div>

  return (
    <div className="timeline">
      <div className="timeline-bar" role="img" aria-label="Sequência da aula">
        {aula.fases.map((f) =>
          f.itens.map((it) => {
            const pose = getPose(it.poseId)
            const cor = pose ? CATEGORY_MAP[pose.categorias[0]].cor : '#999'
            return (
              <span
                key={it.id}
                className="timeline-seg"
                style={{ flexGrow: it.duracao, background: cor }}
                title={`${pose?.nome ?? '?'} · ${formatDuration(it.duracao)}`}
              />
            )
          }),
        )}
      </div>
      {showPhases && (
        <div className="timeline-phases">
          {aula.fases.map((f) => {
            const d = phaseDuration(f)
            if (d === 0) return null
            return (
              <span key={f.id} className="timeline-phase" style={{ flexGrow: d }} title={`${f.nome} · ${formatDuration(d)}`}>
                <span className="timeline-phase-name">{f.nome}</span>
                <span className="timeline-phase-time">{formatDuration(d)}</span>
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}
