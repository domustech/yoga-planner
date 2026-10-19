/**
 * Sinais sonoros do modo de prática (Web Audio, sem ficheiros).
 * No iOS o áudio só fica disponível depois de um gesto do utilizador:
 * chamar `desbloquearSom()` no clique de "Iniciar aula".
 */

let ctx: AudioContext | null = null

function contexto(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    try {
      ctx = new AC()
    } catch {
      return null
    }
  }
  if (ctx.state === 'suspended') void ctx.resume().catch(() => {})
  return ctx
}

/** Chamar dentro de um clique/toque: cria o contexto e toca um buffer silencioso. */
export function desbloquearSom() {
  const c = contexto()
  if (!c) return
  try {
    const s = c.createBufferSource()
    s.buffer = c.createBuffer(1, 1, 22050)
    s.connect(c.destination)
    s.start(0)
  } catch {
    /* ignorar */
  }
}

/** Um bip sinusoidal curto, com ataque e decaimento suaves. */
export function tocarBip(freq = 880, dur = 0.1, vol = 0.25) {
  const c = contexto()
  if (!c) return
  try {
    const t = c.currentTime
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = 'sine'
    o.frequency.value = freq
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g)
    g.connect(c.destination)
    o.start(t)
    o.stop(t + dur + 0.05)
  } catch {
    /* ignorar */
  }
}

/** Sinais usados na prática. */
export const SONS = {
  /** Um bip por segundo nos últimos 5 segundos. */
  contagem: () => tocarBip(880, 0.1, 0.25),
  /** Fim da preparação: a postura começa. */
  inicioPostura: () => tocarBip(1175, 0.22, 0.3),
  /** Fim da postura (duas notas). */
  fimPostura: () => {
    tocarBip(1320, 0.16, 0.3)
    window.setTimeout(() => tocarBip(1320, 0.3, 0.3), 200)
  },
  /** Fim da aula (três notas ascendentes). */
  fimAula: () => {
    tocarBip(988, 0.18, 0.3)
    window.setTimeout(() => tocarBip(1319, 0.18, 0.3), 220)
    window.setTimeout(() => tocarBip(1568, 0.5, 0.3), 440)
  },
}

/** Vibração (Android); o iOS não suporta a partir do browser. */
export function vibrar(padrao: number | number[]) {
  try {
    navigator.vibrate?.(padrao)
  } catch {
    /* ignorar */
  }
}
