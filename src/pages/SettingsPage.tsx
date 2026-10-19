import { Bell, RotateCcw, Timer, Volume2 } from 'lucide-react'
import { desbloquearSom, SONS, vibrar } from '../lib/som'
import { DEFINICOES_OMISSAO, useSettingsStore } from '../store/useSettingsStore'

const PREP_RAPIDOS = [0, 5, 10, 15, 20, 30, 45, 60]

/** Página de definições (rota /definicoes): preferências do modo de prática. */
export function SettingsPage() {
  const preparacaoSeg = useSettingsStore((s) => s.preparacaoSeg)
  const bips = useSettingsStore((s) => s.bips)
  const vibracao = useSettingsStore((s) => s.vibracao)
  const definir = useSettingsStore((s) => s.definir)
  const repor = useSettingsStore((s) => s.repor)

  const testarSom = () => {
    desbloquearSom()
    SONS.contagem()
    window.setTimeout(SONS.contagem, 1000)
    window.setTimeout(SONS.inicioPostura, 2000)
    if (vibracao) vibrar([40, 960, 40, 960, 120])
  }

  const alterado =
    preparacaoSeg !== DEFINICOES_OMISSAO.preparacaoSeg || bips !== DEFINICOES_OMISSAO.bips || vibracao !== DEFINICOES_OMISSAO.vibracao

  return (
    <div className="page settings">
      <header className="page-header">
        <div>
          <h1>Definições</h1>
          <p className="muted">Preferências do modo de prática (botão Praticar). Ficam guardadas neste dispositivo.</p>
        </div>
      </header>

      <section className="settings-card">
        <h2>
          <Timer size={16} /> Tempo de preparação
        </h2>
        <p className="muted">
          Antes de começar a contagem de cada postura, a app dá este tempo para entrar na posição. A ilustração e as
          indicações já estão visíveis durante a preparação, e nos últimos 5 segundos soa um bip por segundo.
        </p>
        <div className="settings-chips" role="radiogroup" aria-label="Tempo de preparação">
          {PREP_RAPIDOS.map((v) => (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={preparacaoSeg === v}
              className={`chip chip-sm is-clickable ${preparacaoSeg === v ? 'is-active' : ''}`}
              onClick={() => definir({ preparacaoSeg: v })}
            >
              {v === 0 ? 'Sem preparação' : `${v} s`}
            </button>
          ))}
        </div>
        <label className="field field-inline">
          <span>Outro valor (segundos)</span>
          <input
            type="number"
            min={0}
            max={300}
            step={5}
            value={preparacaoSeg}
            onChange={(e) => definir({ preparacaoSeg: Math.max(0, Math.min(300, Math.round(Number(e.target.value) || 0))) })}
          />
        </label>
      </section>

      <section className="settings-card">
        <h2>
          <Bell size={16} /> Sinais
        </h2>
        <label className="switch-row">
          <span>
            <strong>Sinais sonoros (bips)</strong>
            <small>Um bip por segundo nos últimos 5 segundos de cada postura e da preparação, e um sinal no início e no fim de cada postura.</small>
          </span>
          <input type="checkbox" role="switch" checked={bips} onChange={(e) => definir({ bips: e.target.checked })} />
        </label>
        <label className="switch-row">
          <span>
            <strong>Vibração</strong>
            <small>Nos mesmos momentos, em telemóveis Android. O iPhone não vibra a partir do browser.</small>
          </span>
          <input type="checkbox" role="switch" checked={vibracao} onChange={(e) => definir({ vibracao: e.target.checked })} />
        </label>
        <div className="settings-actions">
          <button type="button" className="btn" onClick={testarSom}>
            <Volume2 size={16} /> Testar som
          </button>
        </div>
        <p className="hint">
          No iPhone, o interruptor de silêncio e o volume afectam estes sinais: durante a aula mantenha o som ligado e o
          ecrã desbloqueado (a app pede para o manter aceso).
        </p>
      </section>

      {alterado && (
        <button type="button" className="btn" onClick={repor}>
          <RotateCcw size={16} /> Repor valores de origem
        </button>
      )}
    </div>
  )
}
