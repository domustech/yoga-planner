import { ArrowLeft, ArrowRight, Check, RefreshCw, Wand2, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { ACESSORIOS, ACESSORIO_LABEL, CATEGORY_MAP, EFEITOS, EFEITO_MAP, LEVELS, LEVEL_LABEL } from '../data/categories'
import { CHAKRAS } from '../data/chakras'
import { getPose } from '../data/poses'
import type { Acessorio, ChakraId, Level, YogaClass } from '../data/types'
import {
  DURACOES,
  FOCOS,
  TIPOS_AULA,
  TIPO_MAP,
  applyTipo,
  defaultAnswers,
  efeitoEfetivo,
  gerarAula,
  type Duracao,
  type Foco,
  type WizardAnswers,
} from '../lib/classGenerator'
import { classDuration, classItemCount, formatDuration, formatDurationLong, phaseDuration } from '../lib/utils'
import { ClassTimeline } from './ClassTimeline'
import { PoseThumb } from './PoseThumb'
import './ClassWizard.css'

interface Props {
  open: boolean
  onClose: () => void
  onCreate: (aula: YogaClass) => void
}

const STEPS = ['Tipo', 'Duração e nível', 'Efeito', 'Foco', 'Opções', 'Pré-visualização']

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

interface OptionProps {
  active: boolean
  onClick: () => void
  children: ReactNode
  style?: CSSProperties
  title?: string
}

function Option({ active, onClick, children, style, title }: OptionProps) {
  return (
    <button type="button" className={`wiz-option ${active ? 'is-active' : ''}`} onClick={onClick} style={style} title={title} aria-pressed={active}>
      {children}
    </button>
  )
}

export function ClassWizard({ open, onClose, onCreate }: Props) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<WizardAnswers>(() => defaultAnswers())
  const [seed, setSeed] = useState(1)
  const [nome, setNome] = useState('')

  useEffect(() => {
    if (open) {
      setStep(0)
      setAnswers(defaultAnswers())
      setSeed(1)
      setNome('')
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const last = STEPS.length - 1
  const preview = useMemo(
    () => (open && step === last ? gerarAula({ ...answers, nome }, seed) : null),
    [open, step, last, answers, nome, seed],
  )

  const patch = useCallback((p: Partial<WizardAnswers>) => setAnswers((a) => ({ ...a, ...p })), [])

  if (!open) return null

  const tipo = TIPO_MAP[answers.tipo]
  const efeito = efeitoEfetivo(answers)

  const next = () => setStep((s) => Math.min(last, s + 1))
  const prev = () => setStep((s) => Math.max(0, s - 1))

  return (
    <div className="modal-backdrop is-wizard" onClick={onClose} role="presentation">
      <div className="wizard" role="dialog" aria-modal="true" aria-labelledby="wizard-title" onClick={(e) => e.stopPropagation()}>
        <header className="wizard-head">
          <h2 id="wizard-title">
            <Wand2 size={20} /> Criar aula automática
          </h2>
          <span className="muted wizard-count">
            Passo {step + 1} de {STEPS.length}
          </span>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </header>

        <ol className="wizard-steps" aria-label="Passos">
          {STEPS.map((s, i) => (
            <li key={s} className={`wizard-step ${i === step ? 'is-active' : ''} ${i < step ? 'is-done' : ''}`}>
              <span className="dot">{i < step ? <Check size={12} /> : i + 1}</span>
              <span className="wizard-step-name">{s}</span>
            </li>
          ))}
        </ol>

        <div className="wizard-body">
          {step === 0 && (
            <>
              <h3>Que tipo de aula quer dar?</h3>
              <p className="lead">O tipo define a estrutura das fases e o ritmo. Pode afinar tudo nos passos seguintes.</p>
              <div className="wiz-grid">
                {TIPOS_AULA.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`wiz-card ${answers.tipo === t.id ? 'is-active' : ''}`}
                    onClick={() => setAnswers((a) => applyTipo(a, t.id))}
                    aria-pressed={answers.tipo === t.id}
                  >
                    <strong>{t.nome}</strong>
                    <span>{t.descricao}</span>
                    <small className="efeito-tag" style={{ '--ef': EFEITO_MAP[t.efeito].cor } as CSSProperties}>
                      {EFEITO_MAP[t.efeito].nome}
                    </small>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h3>Duração e nível</h3>
              <p className="lead">A duração distribui-se pelas fases segundo o tipo escolhido ({tipo.nome.toLowerCase()}).</p>
              <div className="wiz-section">
                <h4>Duração</h4>
                <div className="wiz-options">
                  {DURACOES.map((d) => (
                    <Option key={d} active={answers.duracao === d} onClick={() => patch({ duracao: d as Duracao })}>
                      {d} min
                    </Option>
                  ))}
                </div>
              </div>
              <div className="wiz-section">
                <h4>Nível dos alunos</h4>
                <div className="wiz-options">
                  {LEVELS.map((l) => (
                    <Option key={l} active={answers.nivel === l} onClick={() => patch({ nivel: l as Level })}>
                      {LEVEL_LABEL[l]}
                    </Option>
                  ))}
                </div>
                <p className="hint" style={{ marginTop: 8 }}>
                  Só entram posturas até ao nível escolhido; o gerador dá preferência às posturas desse nível.
                </p>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h3>Que efeito pretende?</h3>
              <p className="lead">O efeito orienta a escolha dos pranayamas e das posturas.</p>
              <div className="wiz-grid">
                <button
                  type="button"
                  className={`wiz-card ${answers.efeito === 'auto' ? 'is-active' : ''}`}
                  onClick={() => patch({ efeito: 'auto' })}
                  aria-pressed={answers.efeito === 'auto'}
                >
                  <strong>Automático</strong>
                  <span>
                    Segundo o tipo de aula: <b>{EFEITO_MAP[tipo.efeito].nome.toLowerCase()}</b>.
                  </span>
                </button>
                {EFEITOS.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    className={`wiz-card ${answers.efeito === e.id ? 'is-active' : ''}`}
                    onClick={() => patch({ efeito: e.id })}
                    aria-pressed={answers.efeito === e.id}
                    style={{ '--ef': e.cor } as CSSProperties}
                  >
                    <strong>
                      <span className="chip-dot" style={{ background: e.cor }} /> {e.nome}
                    </strong>
                    <span>{e.descricao}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h3>Foco da aula</h3>
              <p className="lead">Opcional. Sem seleção, a aula fica equilibrada entre as categorias.</p>
              <div className="wiz-section">
                <h4>Foco corporal</h4>
                <div className="wiz-options">
                  {FOCOS.map((f) => (
                    <Option key={f.id} active={answers.focos.includes(f.id)} onClick={() => patch({ focos: toggle(answers.focos, f.id as Foco) })} title={f.descricao}>
                      {f.nome}
                    </Option>
                  ))}
                </div>
              </div>
              <div className="wiz-section">
                <h4>Chakras</h4>
                <div className="wiz-options">
                  {CHAKRAS.map((c) => (
                    <Option
                      key={c.id}
                      active={answers.chakras.includes(c.id)}
                      onClick={() => patch({ chakras: toggle(answers.chakras, c.id as ChakraId) })}
                      style={{ '--cat': c.cor } as CSSProperties}
                      title={c.qualidades}
                    >
                      <span className="chip-dot" style={{ background: c.cor }} />
                      {c.nome} · {c.nomePT}
                    </Option>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h3>Opções</h3>
              <p className="lead">Ajuste o que a aula inclui e os acessórios disponíveis na sala.</p>
              <div className="wiz-toggles">
                {(
                  [
                    ['saudacao', 'Saudação ao Sol', 'Rondas de Surya Namaskar depois do aquecimento'],
                    ['inversoes', 'Inversões', 'Uma inversão adequada ao nível, com contra-postura'],
                    ['mudras', 'Mudras', 'Um mudra no pranayama e outro na meditação'],
                    ['yogaNidra', 'Yoga Nidra', 'Relaxamento guiado em vez de Savasana simples'],
                  ] as const
                ).map(([key, titulo, desc]) => (
                  <label key={key} className="wiz-toggle">
                    <input
                      type="checkbox"
                      checked={answers.incluir[key]}
                      onChange={(e) => patch({ incluir: { ...answers.incluir, [key]: e.target.checked } })}
                    />
                    <span>
                      <strong>{titulo}</strong>
                      <span>{desc}</span>
                    </span>
                  </label>
                ))}
              </div>
              <div className="wiz-section">
                <h4>Acessórios disponíveis</h4>
                <div className="wiz-options">
                  {ACESSORIOS.map((ac) => (
                    <Option key={ac} active={answers.acessorios.includes(ac)} onClick={() => patch({ acessorios: toggle(answers.acessorios, ac as Acessorio) })}>
                      {ACESSORIO_LABEL[ac]}
                    </Option>
                  ))}
                </div>
                <p className="hint" style={{ marginTop: 8 }}>
                  Quando uma postura tem uma variação com um acessório escolhido, essa variação fica nas notas da postura.
                </p>
              </div>
            </>
          )}

          {step === last && preview && (
            <>
              <h3>Pré-visualização</h3>
              <p className="lead">Reveja a proposta. Pode pedir outra sugestão ou criar a aula e afiná-la no editor.</p>
              <input
                className="wiz-preview-name"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder={preview.nome}
                aria-label="Nome da aula"
              />
              <p className="wiz-preview-meta">
                {LEVEL_LABEL[preview.nivel]} · {formatDurationLong(classDuration(preview))} · {classItemCount(preview)} posturas · efeito{' '}
                {EFEITO_MAP[efeito].nome.toLowerCase()}
                {preview.tema && <> · {preview.tema}</>}
              </p>
              <ClassTimeline aula={preview} showPhases />
              {preview.fases.map((f, i) => (
                <section key={f.id} className="wiz-phase">
                  <div className="wiz-phase-head">
                    <span>
                      {i + 1}. {f.nome}
                    </span>
                    <span className="muted">{formatDuration(phaseDuration(f))}</span>
                  </div>
                  <div className="wiz-items">
                    {f.itens.map((it) => {
                      const pose = getPose(it.poseId)
                      if (!pose) return null
                      const cor = CATEGORY_MAP[pose.categorias[0]].cor
                      return (
                        <span key={it.id} className="wiz-item" style={{ '--cat': cor } as CSSProperties} title={it.notas ?? pose.sanscrito}>
                          <span className="fig">
                            <PoseThumb pose={pose} />
                          </span>
                          {pose.nome}
                          <time>{formatDuration(it.duracao)}</time>
                        </span>
                      )
                    })}
                  </div>
                </section>
              ))}
            </>
          )}
        </div>

        <footer className="wizard-foot">
          <button type="button" className="btn" onClick={prev} disabled={step === 0}>
            <ArrowLeft size={16} /> Anterior
          </button>
          <div className="wizard-foot-right">
            {step < last ? (
              <button type="button" className="btn primary" onClick={next}>
                Seguinte <ArrowRight size={16} />
              </button>
            ) : (
              <>
                <button type="button" className="btn" onClick={() => setSeed((s) => s + 1)} title="Gerar outra combinação de posturas">
                  <RefreshCw size={16} /> Outra sugestão
                </button>
                <button type="button" className="btn primary" onClick={() => preview && onCreate(preview)}>
                  <Check size={16} /> Criar aula
                </button>
              </>
            )}
          </div>
        </footer>
      </div>
    </div>
  )
}
