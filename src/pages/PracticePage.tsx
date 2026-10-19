import { ArrowLeft, Check, Pause, Play, RotateCcw, SkipBack, SkipForward, Square, Volume2, VolumeX, Wind, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AlignmentList } from '../components/AlignmentList'
import { PoseVisual } from '../components/PoseVisual'
import { getAlinhamento } from '../data/alinhamento'
import { CATEGORY_MAP } from '../data/categories'
import { getPose } from '../data/poses'
import type { ClassItem, ClassPhase, Pose, YogaClass } from '../data/types'
import { desbloquearSom, SONS, vibrar } from '../lib/som'
import { classDuration, formatDuration, formatDurationLong } from '../lib/utils'
import { useClassStore } from '../store/useClassStore'
import { useSettingsStore } from '../store/useSettingsStore'
import './PracticePage.css'

/** Uma postura da aula, na ordem em que será praticada. */
interface Passo {
  fase: ClassPhase
  faseIndex: number
  item: ClassItem
  pose: Pose
}

type Estado = 'pronto' | 'a-decorrer' | 'pausa' | 'concluida'

const TICK_MS = 200
/** Nos últimos N segundos de cada contagem soa um bip por segundo. */
const SEGUNDOS_AVISO = 5

function passosDaAula(aula: YogaClass): Passo[] {
  return aula.fases.flatMap((fase, faseIndex) =>
    fase.itens.flatMap((item) => {
      const pose = getPose(item.poseId)
      return pose ? [{ fase, faseIndex, item, pose }] : []
    }),
  )
}

interface WakeSentinel {
  release(): Promise<void>
}

/** Mantém o ecrã aceso durante a prática (quando o browser o permite). */
async function pedirWakeLock(): Promise<WakeSentinel | null> {
  const nav = navigator as Navigator & { wakeLock?: { request(tipo: 'screen'): Promise<WakeSentinel> } }
  try {
    return (await nav.wakeLock?.request('screen')) ?? null
  } catch {
    return null
  }
}

function pedirEcraCompleto() {
  const el = document.documentElement
  if (!document.fullscreenElement && el.requestFullscreen) el.requestFullscreen().catch(() => {})
}

function sairEcraCompleto() {
  if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {})
}

/**
 * Modo de prática (rota /aula/:id/praticar): percorre as posturas da aula pela
 * ordem planeada, em ecrã completo, com a ilustração, as indicações de
 * alinhamento por baixo e um contador decrescente por postura. Antes de cada
 * postura há um tempo de preparação (Definições) e, nos últimos 5 segundos de
 * cada contagem, um bip por segundo.
 */
export function PracticePage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const aula = useClassStore((s) => s.aulas.find((a) => a.id === id))
  const passos = useMemo(() => (aula ? passosDaAula(aula) : []), [aula])

  const preparacaoSeg = useSettingsStore((s) => s.preparacaoSeg)
  const bips = useSettingsStore((s) => s.bips)
  const vibracao = useSettingsStore((s) => s.vibracao)
  const definir = useSettingsStore((s) => s.definir)
  const prepMs = Math.max(0, Math.round(preparacaoSeg)) * 1000

  const [estado, setEstado] = useState<Estado>('pronto')
  const [indice, setIndice] = useState(0)
  const [emPreparacao, setEmPreparacao] = useState(false)
  const [restante, setRestante] = useState(() => (passos[0]?.item.duracao ?? 0) * 1000)
  const [decorrido, setDecorrido] = useState(0)
  const ultimoTick = useRef(0)
  const ultimoBip = useRef<number | null>(null)
  const wakeLock = useRef<WakeSentinel | null>(null)

  const passo = passos[Math.min(indice, passos.length - 1)] as Passo | undefined
  const duracaoMs = (passo?.item.duracao ?? 0) * 1000
  /** Duração total da contagem em curso (preparação ou postura). */
  const totalMs = emPreparacao ? prepMs : duracaoMs

  const sinal = useCallback(
    (tipo: keyof typeof SONS, padraoVibracao: number | number[]) => {
      if (bips) SONS[tipo]()
      if (vibracao) vibrar(padraoVibracao)
    },
    [bips, vibracao],
  )

  /** Entra numa postura: com preparação (se definida) ou directamente na contagem. */
  const irPara = useCallback(
    (n: number) => {
      const alvo = Math.max(0, Math.min(passos.length - 1, n))
      setIndice(alvo)
      ultimoBip.current = null
      ultimoTick.current = Date.now()
      if (prepMs > 0) {
        setEmPreparacao(true)
        setRestante(prepMs)
      } else {
        setEmPreparacao(false)
        setRestante((passos[alvo]?.item.duracao ?? 0) * 1000)
      }
    },
    [passos, prepMs],
  )

  /** Termina a preparação e começa já a contagem da postura. */
  const comecarPostura = useCallback(() => {
    setEmPreparacao(false)
    setRestante(duracaoMs)
    ultimoBip.current = null
    ultimoTick.current = Date.now()
    sinal('inicioPostura', 120)
  }, [duracaoMs, sinal])

  const libertarWakeLock = useCallback(() => {
    wakeLock.current?.release().catch(() => {})
    wakeLock.current = null
  }, [])

  const iniciar = useCallback(() => {
    desbloquearSom() // dentro do gesto do utilizador, para o iOS permitir os bips
    pedirEcraCompleto()
    void pedirWakeLock().then((w) => (wakeLock.current = w))
    irPara(indice)
    setEstado('a-decorrer')
  }, [irPara, indice])

  const alternarPausa = useCallback(() => {
    setEstado((e) => {
      if (e === 'a-decorrer') return 'pausa'
      if (e === 'pausa') {
        ultimoTick.current = Date.now()
        return 'a-decorrer'
      }
      return e
    })
  }, [])

  const terminar = useCallback(() => {
    libertarWakeLock()
    setEstado('concluida')
  }, [libertarWakeLock])

  const recomecar = useCallback(() => {
    setDecorrido(0)
    desbloquearSom()
    void pedirWakeLock().then((w) => (wakeLock.current = w))
    irPara(0)
    setEstado('a-decorrer')
  }, [irPara])

  const sair = useCallback(() => {
    libertarWakeLock()
    sairEcraCompleto()
    navigate(aula ? `/aula/${aula.id}` : '/')
  }, [aula, libertarWakeLock, navigate])

  const anterior = useCallback(() => irPara(indice - 1), [irPara, indice])
  const seguinte = useCallback(() => {
    if (indice < passos.length - 1) irPara(indice + 1)
    else terminar()
  }, [irPara, indice, passos.length, terminar])

  // Relógio: desconta o tempo real passado entre ticks (robusto a separadores em segundo plano).
  useEffect(() => {
    if (estado !== 'a-decorrer') return
    ultimoTick.current = Date.now()
    const t = window.setInterval(() => {
      const agora = Date.now()
      const dt = agora - ultimoTick.current
      ultimoTick.current = agora
      setDecorrido((d) => d + dt)
      setRestante((r) => r - dt)
    }, TICK_MS)
    return () => window.clearInterval(t)
  }, [estado])

  // Fim de uma contagem: a preparação dá lugar à postura; a postura avança para a seguinte.
  useEffect(() => {
    if (estado !== 'a-decorrer' || restante > 0) return
    if (emPreparacao) {
      comecarPostura()
      return
    }
    if (duracaoMs <= 0) return // postura sem tempo: espera pelo botão
    if (indice < passos.length - 1) {
      sinal('fimPostura', [80, 60, 80])
      irPara(indice + 1)
    } else {
      sinal('fimAula', [120, 80, 120, 80, 240])
      terminar()
    }
  }, [restante, estado, emPreparacao, duracaoMs, indice, passos.length, comecarPostura, irPara, terminar, sinal])

  // Bip por segundo nos últimos segundos de cada contagem.
  useEffect(() => {
    if (estado !== 'a-decorrer' || totalMs <= 0) return
    const seg = Math.ceil(restante / 1000)
    if (seg >= 1 && seg <= SEGUNDOS_AVISO && seg < totalMs / 1000 && ultimoBip.current !== seg) {
      ultimoBip.current = seg
      sinal('contagem', 40)
    }
  }, [restante, estado, totalMs, sinal])

  // Teclado: espaço pausa/continua, setas mudam de postura, Esc termina.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return
      if (e.key === ' ') {
        e.preventDefault()
        if (estado === 'pronto') iniciar()
        else alternarPausa()
      } else if (e.key === 'ArrowRight' && estado !== 'pronto' && estado !== 'concluida') seguinte()
      else if (e.key === 'ArrowLeft' && estado !== 'pronto' && estado !== 'concluida') anterior()
      else if (e.key === 'Escape') {
        if (estado === 'a-decorrer' || estado === 'pausa') terminar()
        else sair()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [estado, iniciar, alternarPausa, seguinte, anterior, terminar, sair])

  // Voltar a pedir o wake lock quando o ecrã regressa (o sistema liberta-o ao mudar de app).
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'visible' && estado === 'a-decorrer' && !wakeLock.current) {
        void pedirWakeLock().then((w) => (wakeLock.current = w))
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [estado])

  // Ao sair da página, limpar ecrã completo e wake lock.
  useEffect(
    () => () => {
      libertarWakeLock()
      sairEcraCompleto()
    },
    [libertarWakeLock],
  )

  if (!aula) {
    return (
      <div className="practice practice-empty">
        <p>Aula não encontrada.</p>
        <Link to="/" className="btn">
          <ArrowLeft size={16} /> Voltar às aulas
        </Link>
      </div>
    )
  }

  if (!passo) {
    return (
      <div className="practice practice-empty">
        <p>Esta aula ainda não tem posturas para praticar.</p>
        <Link to={`/aula/${aula.id}`} className="btn">
          <ArrowLeft size={16} /> Voltar ao editor
        </Link>
      </div>
    )
  }

  const { pose, item, fase, faseIndex } = passo
  const cat = CATEGORY_MAP[pose.categorias[0]]
  const alinhamento = getAlinhamento(pose.id)
  const restanteSeg = Math.max(0, Math.ceil(restante / 1000))
  const pct = totalMs > 0 ? Math.min(100, Math.max(0, (1 - restante / totalMs) * 100)) : 0
  const segundoLado = !emPreparacao && pose.bilateral && duracaoMs > 0 && restante <= duracaoMs / 2
  const aTerminar = estado === 'a-decorrer' && totalMs > 0 && restanteSeg <= SEGUNDOS_AVISO
  const proximo = passos[indice + 1]
  const aDecorrer = estado === 'a-decorrer' || estado === 'pausa'
  const mostrarPrep = aDecorrer && emPreparacao

  let subtitulo = `de ${formatDuration(item.duracao)}`
  if (estado === 'pausa') subtitulo = 'Em pausa'
  else if (estado === 'pronto') subtitulo = prepMs > 0 ? `${preparacaoSeg} s de preparação antes de cada postura` : 'Pronto para começar'
  else if (mostrarPrep) subtitulo = `Preparação · depois ${formatDuration(item.duracao)}`
  else if (segundoLado) subtitulo = 'Trocar de lado'

  return (
    <div
      className={`practice ${estado === 'pausa' ? 'is-paused' : ''} ${mostrarPrep ? 'is-prep' : ''}`}
      style={{ '--cat': cat.cor } as CSSProperties}
    >
      <header className="practice-top">
        <button type="button" className="icon-btn" onClick={sair} aria-label="Sair da prática" title="Sair da prática">
          <X size={20} />
        </button>
        <div className="practice-crumb">
          <strong>{aula.nome || 'Aula sem nome'}</strong>
          <span>
            Fase {faseIndex + 1} · {fase.nome}
          </span>
        </div>
        <button
          type="button"
          className={`icon-btn practice-sound ${bips ? '' : 'is-off'}`}
          onClick={() => definir({ bips: !bips })}
          aria-pressed={bips}
          title={bips ? 'Desligar os bips' : 'Ligar os bips'}
          aria-label={bips ? 'Desligar os bips' : 'Ligar os bips'}
        >
          {bips ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
        <span className="practice-count" aria-label="Postura atual">
          {indice + 1} / {passos.length}
        </span>
      </header>

      {estado === 'concluida' ? (
        <section className="practice-done">
          <span className="practice-done-icon">
            <Check size={34} />
          </span>
          <h1>{indice >= passos.length - 1 && restante <= 0 ? 'Aula concluída' : 'Aula terminada'}</h1>
          <p className="muted">
            {indice + 1} de {passos.length} posturas · {formatDurationLong(Math.round(decorrido / 1000))} praticados de{' '}
            {formatDurationLong(classDuration(aula))} planeados
          </p>
          <div className="practice-done-actions">
            <button type="button" className="btn" onClick={recomecar}>
              <RotateCcw size={16} /> Recomeçar
            </button>
            <button type="button" className="btn primary" onClick={sair}>
              <ArrowLeft size={16} /> Voltar à aula
            </button>
          </div>
        </section>
      ) : (
        <>
          <main className="practice-main">
            <div className="practice-figure">
              <PoseVisual pose={pose} eager />
            </div>

            <div className="practice-status">
              <div className="practice-title">
                <h1>
                  {pose.nome}
                  {mostrarPrep && <span className="tag is-prep">Prepare-se</span>}
                  {!mostrarPrep && pose.bilateral && (
                    <span className={`tag ${segundoLado ? 'is-on' : ''}`}>{segundoLado ? '2.º lado' : '2 lados'}</span>
                  )}
                </h1>
                <p className="practice-sanskrit">{pose.sanscrito}</p>
              </div>
              <div className={`practice-timer ${aTerminar ? 'is-ending' : ''}`} role="timer" aria-live="off">
                <span className="practice-clock">{totalMs > 0 || estado === 'pronto' ? formatDuration(restanteSeg) : '—'}</span>
                <span className="practice-timer-sub">{subtitulo}</span>
                {mostrarPrep && estado === 'a-decorrer' && (
                  <button type="button" className="practice-skip" onClick={comecarPostura}>
                    Começar já
                  </button>
                )}
              </div>
              <div className="practice-progress" aria-hidden="true">
                <span style={{ width: `${pct}%` }} />
              </div>
            </div>

            <div className="practice-cues">
              {item.notas && <p className="practice-notes">{item.notas}</p>}
              {fase.notas && indice === passos.findIndex((p) => p.fase.id === fase.id) && (
                <p className="practice-phase-notes">{fase.notas}</p>
              )}
              {pose.respiracao && (
                <p className="practice-breath">
                  <Wind size={16} /> <span>{pose.respiracao}</span>
                </p>
              )}
              {alinhamento ? (
                <AlignmentList alinhamento={alinhamento} />
              ) : (
                <p className="muted">Sem indicações de alinhamento para esta prática.</p>
              )}
              {proximo && (
                <p className="practice-next">
                  A seguir: <strong>{proximo.pose.nome}</strong> · {formatDuration(proximo.item.duracao)}
                </p>
              )}
            </div>
          </main>

          <footer className="practice-controls">
            {estado === 'pronto' ? (
              <button type="button" className="practice-start" onClick={iniciar}>
                <Play size={22} /> Iniciar aula
              </button>
            ) : (
              <>
                <button type="button" className="practice-ctl" onClick={anterior} disabled={!aDecorrer} title="Postura anterior (←)">
                  <SkipBack size={22} />
                  <small>Anterior</small>
                </button>
                <button type="button" className="practice-ctl is-main" onClick={alternarPausa} title="Pausa / continuar (espaço)">
                  {estado === 'a-decorrer' ? <Pause size={28} /> : <Play size={28} />}
                  <small>{estado === 'a-decorrer' ? 'Pausa' : 'Continuar'}</small>
                </button>
                <button type="button" className="practice-ctl" onClick={seguinte} disabled={!aDecorrer} title="Postura seguinte (→)">
                  <SkipForward size={22} />
                  <small>Seguinte</small>
                </button>
                <button type="button" className="practice-ctl is-stop" onClick={terminar} title="Terminar a aula (Esc)">
                  <Square size={20} />
                  <small>Stop</small>
                </button>
              </>
            )}
          </footer>
        </>
      )}
    </div>
  )
}
