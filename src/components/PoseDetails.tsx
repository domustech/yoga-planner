import { AlertTriangle, Clock, Lightbulb, Plus, Ruler, Sparkles, Wind, X } from 'lucide-react'
import { useEffect } from 'react'
import type { CSSProperties } from 'react'
import { getAlinhamento } from '../data/alinhamento'
import { ACESSORIO_LABEL, CATEGORY_MAP, EFEITO_MAP, LEVEL_LABEL } from '../data/categories'
import { CHAKRA_MAP } from '../data/chakras'
import { getPose } from '../data/poses'
import { formatDuration } from '../lib/utils'
import { AlignmentList } from './AlignmentList'
import { CategoryChip } from './CategoryChip'
import { PoseVisual } from './PoseVisual'

interface Props {
  poseId: string | null
  onClose: () => void
  onAdd?: (poseId: string) => void
  addLabel?: string
}

export function PoseDetails({ poseId, onClose, onAdd, addLabel }: Props) {
  useEffect(() => {
    if (!poseId) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [poseId, onClose])

  const pose = poseId ? getPose(poseId) : undefined
  if (!pose) return null
  const cat = CATEGORY_MAP[pose.categorias[0]]
  const efeito = pose.efeito ? EFEITO_MAP[pose.efeito] : undefined
  const alinhamento = getAlinhamento(pose.id)

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pose-details-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="icon-btn modal-close" onClick={onClose} aria-label="Fechar">
          <X size={18} />
        </button>

        <div className="modal-figure" style={{ color: cat.cor }}>
          <PoseVisual pose={pose} title={pose.nome} />
        </div>

        <div className="modal-body">
          <h2 id="pose-details-title">{pose.nome}</h2>
          <p className="modal-sanskrit">
            {pose.sanscrito}
            {pose.ingles && <span className="muted"> · {pose.ingles}</span>}
          </p>

          <div className="modal-meta">
            {pose.categorias.map((c) => (
              <CategoryChip key={c} id={c} small />
            ))}
            <span className={`level level-${pose.nivel}`}>{LEVEL_LABEL[pose.nivel]}</span>
            <span className="meta-time">
              <Clock size={13} /> {formatDuration(pose.duracaoSugerida)}
              {pose.bilateral && ' por lado'}
            </span>
          </div>

          {(efeito || (pose.chakras && pose.chakras.length > 0)) && (
            <div className="modal-meta modal-subtle-meta">
              {efeito && (
                <span className="efeito-tag" style={{ '--ef': efeito.cor } as CSSProperties} title={efeito.descricao}>
                  {efeito.nome}
                </span>
              )}
              {pose.chakras?.map((c) => {
                const ch = CHAKRA_MAP[c]
                return (
                  <span key={c} className="chakra-tag" style={{ '--ch': ch.cor } as CSSProperties} title={ch.qualidades}>
                    <span className="chakra-dot" />
                    {ch.nome} · {ch.nomePT}
                  </span>
                )
              })}
            </div>
          )}

          {pose.respiracao && (
            <p className="modal-row">
              <Wind size={16} /> <span><strong>Respiração:</strong> {pose.respiracao}</span>
            </p>
          )}

          {alinhamento && (
            <section className="modal-align">
              <h3>
                <Ruler size={14} /> Alinhamento — o que a postura deve assegurar
              </h3>
              <AlignmentList alinhamento={alinhamento} />
            </section>
          )}

          <div className="modal-cols">
            <section>
              <h3>Benefícios</h3>
              <ul>
                {pose.beneficios.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </section>
            {pose.contraindicacoes && pose.contraindicacoes.length > 0 && (
              <section>
                <h3>
                  <AlertTriangle size={14} /> Precauções
                </h3>
                <ul>
                  {pose.contraindicacoes.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {pose.efeitosSubtis && pose.efeitosSubtis.length > 0 && (
            <section className="modal-tips modal-subtle">
              <h3>
                <Sparkles size={14} /> Efeitos subtis
              </h3>
              <ul>
                {pose.efeitosSubtis.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </section>
          )}

          {pose.dicas && pose.dicas.length > 0 && (
            <section className="modal-tips">
              <h3>
                <Lightbulb size={14} /> Dicas de instrução
              </h3>
              <ul>
                {pose.dicas.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </section>
          )}

          {pose.variacoes && pose.variacoes.length > 0 && (
            <section className="modal-tips">
              <h3>Variações e acessórios</h3>
              <ul className="variacoes">
                {pose.variacoes.map((v) => (
                  <li key={v.nome}>
                    <strong>{v.nome}</strong>
                    {v.acessorios?.map((a) => (
                      <span key={a} className="acessorio-tag">
                        {ACESSORIO_LABEL[a]}
                      </span>
                    ))}
                    <div className="muted">{v.descricao}</div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {onAdd && (
            <div className="modal-actions">
              <button type="button" className="btn primary" onClick={() => onAdd(pose.id)}>
                <Plus size={16} /> {addLabel ?? 'Adicionar à aula'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
