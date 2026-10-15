import type { PoseFigure as Fig, Pt } from '../data/types'

interface Props {
  figura: Fig
  /** Cor das linhas da figura (por omissão: currentColor). */
  cor?: string
  className?: string
  /** Mostra a linha do chão / tapete. */
  chao?: boolean
  title?: string
}

const HEAD_R = 5.5
const LIMB_W = 4.2
const TORSO_W = 5

function pts(points: Pt[]): string {
  return points.map(([x, y]) => `${x},${y}`).join(' ')
}

function torsoPath(neck: Pt, pelvis: Pt, spine?: Pt): string {
  if (!spine) return `M ${neck[0]} ${neck[1]} L ${pelvis[0]} ${pelvis[1]}`
  // Curva quadrática que passa perto do ponto intermédio da coluna.
  const cx = 2 * spine[0] - (neck[0] + pelvis[0]) / 2
  const cy = 2 * spine[1] - (neck[1] + pelvis[1]) / 2
  return `M ${neck[0]} ${neck[1]} Q ${cx} ${cy} ${pelvis[0]} ${pelvis[1]}`
}

/** Desloca ligeiramente um membro para desenhar o membro "de trás" em vista lateral. */
function shift<T extends Pt[]>(points: T, dx: number, dy: number): T {
  return points.map(([x, y]) => [x + dx, y + dy]) as T
}

/**
 * Renderiza uma figura esquemática (pictograma) de uma postura a partir das
 * articulações definidas em `figura`. ViewBox fixo 0 0 100 100.
 */
export function PoseFigure({ figura, cor = 'currentColor', className, chao = true, title }: Props) {
  const { head, neck, pelvis, spine, view } = figura

  const arms = figura.arms.length === 1 && view === 'side'
    ? [{ p: shift(figura.arms[0], -1.6, 1.4), far: true }, { p: figura.arms[0], far: false }]
    : figura.arms.map((p) => ({ p, far: false }))

  const legs = figura.legs.length === 1 && view === 'side'
    ? [{ p: shift(figura.legs[0], -1.6, 1.4), far: true }, { p: figura.legs[0], far: false }]
    : figura.legs.map((p) => ({ p, far: false }))

  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={title}>
      {title && <title>{title}</title>}
      {chao && view !== 'top' && (
        <line x1="6" y1="90.5" x2="94" y2="90.5" stroke={cor} strokeWidth="1.2" strokeLinecap="round" opacity="0.25" />
      )}
      {chao && view === 'top' && (
        <rect x="6" y="30" width="88" height="60" rx="4" fill={cor} opacity="0.08" />
      )}

      <g stroke={cor} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* membros de trás (mais claros) */}
        {legs.filter((l) => l.far).map((l, i) => (
          <polyline key={`fl${i}`} points={pts(l.p)} strokeWidth={LIMB_W} opacity="0.4" />
        ))}
        {arms.filter((a) => a.far).map((a, i) => (
          <polyline key={`fa${i}`} points={pts(a.p)} strokeWidth={LIMB_W} opacity="0.4" />
        ))}

        {/* tronco */}
        <path d={torsoPath(neck, pelvis, spine)} strokeWidth={TORSO_W} />

        {/* pernas da frente */}
        {legs.filter((l) => !l.far).map((l, i) => (
          <polyline key={`l${i}`} points={pts(l.p)} strokeWidth={LIMB_W} />
        ))}

        {/* cabeça */}
        <circle cx={head[0]} cy={head[1]} r={HEAD_R} fill={cor} stroke="none" />

        {/* braços da frente (por cima do tronco) */}
        {arms.filter((a) => !a.far).map((a, i) => (
          <polyline key={`a${i}`} points={pts(a.p)} strokeWidth={LIMB_W} />
        ))}
      </g>
    </svg>
  )
}
