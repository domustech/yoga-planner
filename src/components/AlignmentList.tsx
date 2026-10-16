import { AlertTriangle } from 'lucide-react'
import { PARTE_LABEL, PARTES_ORDEM } from '../data/alinhamento'
import type { Alinhamento } from '../data/types'

interface Props {
  alinhamento: Alinhamento
  /** Versão mais compacta (dentro do item da aula). */
  compact?: boolean
}

/** Lista "o que a postura deve assegurar", parte a parte, e erros comuns. */
export function AlignmentList({ alinhamento, compact }: Props) {
  const partes = PARTES_ORDEM.filter((p) => alinhamento.partes[p])
  return (
    <div className={`align ${compact ? 'is-compact' : ''}`}>
      <dl className="align-list">
        {partes.map((p) => (
          <div key={p} className="align-row">
            <dt>{PARTE_LABEL[p]}</dt>
            <dd>{alinhamento.partes[p]}</dd>
          </div>
        ))}
      </dl>
      {alinhamento.erros && alinhamento.erros.length > 0 && (
        <div className="align-erros">
          <strong>
            <AlertTriangle size={13} /> Erros comuns
          </strong>
          <ul>
            {alinhamento.erros.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}
      {(alinhamento.entrada || alinhamento.saida) && (
        <p className="align-entrada">
          {alinhamento.entrada && (
            <>
              <strong>Entrar:</strong> {alinhamento.entrada}{' '}
            </>
          )}
          {alinhamento.saida && (
            <>
              <strong>Sair:</strong> {alinhamento.saida}
            </>
          )}
        </p>
      )}
    </div>
  )
}
