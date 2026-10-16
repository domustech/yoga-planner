import { useId } from 'react'
import { CATEGORY_MAP } from '../data/categories'
import type { Pose, PoseFigure, Pt } from '../data/types'

// ---------------------------------------------------------------------------
// Ilustração em aquarela gerada a partir das articulações da postura.
// A mesma personagem em todas as posturas: cabelo castanho apanhado em rabo
// de cavalo, top verde-sálvia, leggings verde-água, vista de costas (frontal)
// ou de perfil. Texturas de aguarela via filtros SVG (bordas irregulares,
// manchas, salpicos e grão de papel). ViewBox fixo 0 0 100 100.
// ---------------------------------------------------------------------------

const SKIN = '#dfa884'
const SKIN_DARK = '#c48b65'
const SKIN_LIGHT = '#f3cdb0'
const TOP = '#83976d'
const TOP_DARK = '#647858'
const LEGS = '#a2bdb3'
const LEGS_DARK = '#7b988f'
const LEGS_LIGHT = '#cfdfd9'
const HAIR = '#876546'
const HAIR_LIGHT = '#b48f66'
const TIE = '#c9787f'
const SHADOW = '#8a9084'
const SPLASH = ['#83976d', '#a2bdb3', '#d9a0b0', '#e9b784', '#dfa884', '#b8a4c9', '#c9787f']

type V = Pt
const add = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1]]
const sub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1]]
const mul = (a: V, k: number): V => [a[0] * k, a[1] * k]
const len = (a: V) => Math.hypot(a[0], a[1])
const norm = (a: V): V => {
  const l = len(a) || 1
  return [a[0] / l, a[1] / l]
}
const perp = (a: V): V => [-a[1], a[0]]
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const f = (n: number) => n.toFixed(2)
const pt = (p: V) => `${f(p[0])},${f(p[1])}`

function hashStr(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function mixHex(a: string, b: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(a)
  const [r2, g2, b2] = hexToRgb(b)
  const c = (x: number, y: number) => Math.round(x + (y - x) * t).toString(16).padStart(2, '0')
  return `#${c(r1, r2)}${c(g1, g2)}${c(b1, b2)}`
}

/** Pontos ao longo da coluna (curva quadrática se houver `spine`). */
function spineSamples(neck: V, pelvis: V, spine: V | undefined, n: number): V[] {
  const out: V[] = []
  const cx = spine ? 2 * spine[0] - (neck[0] + pelvis[0]) / 2 : 0
  const cy = spine ? 2 * spine[1] - (neck[1] + pelvis[1]) / 2 : 0
  for (let i = 0; i <= n; i++) {
    const t = i / n
    if (!spine) out.push([lerp(neck[0], pelvis[0], t), lerp(neck[1], pelvis[1], t)])
    else {
      const mt = 1 - t
      out.push([mt * mt * neck[0] + 2 * mt * t * cx + t * t * pelvis[0], mt * mt * neck[1] + 2 * mt * t * cy + t * t * pelvis[1]])
    }
  }
  return out
}

/** Caminho fechado de uma "fita" em torno de uma polilinha, com largura variável. */
function ribbon(pts: V[], width: (t: number) => number): string {
  const n = pts.length
  const left: V[] = []
  const right: V[] = []
  for (let i = 0; i < n; i++) {
    const t = n > 1 ? i / (n - 1) : 0
    const prev = pts[Math.max(0, i - 1)]
    const next = pts[Math.min(n - 1, i + 1)]
    const nv = perp(norm(sub(next, prev)))
    const w = width(t) / 2
    left.push(add(pts[i], mul(nv, w)))
    right.push(sub(pts[i], mul(nv, w)))
  }
  return `M ${left.map(pt).join(' L ')} L ${right.reverse().map(pt).join(' L ')} Z`
}

/** Fita ao longo de uma curva quadrática (para o rabo de cavalo). */
function quadRibbon(p0: V, p1: V, p2: V, w0: number, w1: number): string {
  const pts: V[] = []
  for (let i = 0; i <= 10; i++) {
    const t = i / 10
    const mt = 1 - t
    pts.push([mt * mt * p0[0] + 2 * mt * t * p1[0] + t * t * p2[0], mt * mt * p0[1] + 2 * mt * t * p1[1] + t * t * p2[1]])
  }
  return ribbon(pts, (t) => lerp(w0, w1, t))
}

/** Correções manuais da orientação (1 = virada para a direita, -1 = para a esquerda). */
const FACING_OVERRIDE: Record<string, 1 | -1> = {
  ustrasana: -1, // ajoelhada, pés para trás: a frente é para a esquerda
  sarvangasana: 1, // o rosto olha para o peito/pernas
  sirsasana: -1,
}

/**
 * Para onde a frente do corpo está virada (vista lateral): 1 = direita, -1 = esquerda.
 * Tronco mais horizontal (deitado, prancha, flexões profundas): a cabeça está à frente.
 * Tronco mais vertical (de pé, sentado, ajoelhado): os joelhos apontam para a frente;
 * em caso de empate, as pontas dos pés; por fim, a cabeça em relação ao pescoço.
 */
function facingOf(fig: PoseFigure, id: string): 1 | -1 {
  if (FACING_OVERRIDE[id]) return FACING_OVERRIDE[id]
  if (fig.view !== 'side') return 1
  const tdx = fig.neck[0] - fig.pelvis[0]
  const tdy = fig.neck[1] - fig.pelvis[1]
  if (Math.abs(tdx) > Math.abs(tdy)) {
    const dx = fig.head[0] - fig.pelvis[0]
    return dx >= 0 ? 1 : -1
  }
  const knees = fig.legs.reduce((s, l) => s + (l[1][0] - l[0][0]), 0)
  if (Math.abs(knees) > 3) return knees > 0 ? 1 : -1
  const toes = fig.legs.reduce((s, l) => s + (l[3][0] - l[2][0]), 0)
  if (Math.abs(toes) > 1.5) return toes > 0 ? 1 : -1
  const dx = fig.head[0] - fig.neck[0]
  if (Math.abs(dx) > 1) return dx > 0 ? 1 : -1
  return -1
}

function shift<T extends V[]>(points: T, dx: number, dy: number): T {
  return points.map(([x, y]) => [x + dx, y + dy]) as T
}

interface LimbProps {
  pts: V[]
  widths: number[]
  color: string
  light: string
  opacity?: number
}

/** Membro desenhado como segmentos grossos de pontas redondas, com um brilho interior. */
function Limb({ pts, widths, color, light, opacity = 1 }: LimbProps) {
  const segs = []
  for (let i = 1; i < pts.length; i++) {
    const w = widths[Math.min(i - 1, widths.length - 1)]
    segs.push(
      <line key={`s${i}`} x1={pts[i - 1][0]} y1={pts[i - 1][1]} x2={pts[i][0]} y2={pts[i][1]} stroke={color} strokeWidth={w} strokeLinecap="round" opacity={opacity} />,
    )
    segs.push(
      <line
        key={`h${i}`}
        x1={pts[i - 1][0] - 0.5}
        y1={pts[i - 1][1] - 0.5}
        x2={pts[i][0] - 0.5}
        y2={pts[i][1] - 0.5}
        stroke={light}
        strokeWidth={w * 0.32}
        strokeLinecap="round"
        opacity={0.4 * opacity}
      />,
    )
  }
  return <>{segs}</>
}

interface Props {
  pose: Pose
  className?: string
  title?: string
}

export function WatercolorFigure({ pose, className, title }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const fig = pose.figura
  const rand = mulberry(hashStr(pose.id))
  const seed = hashStr(pose.id) % 1000
  const facing = facingOf(fig, pose.id)
  const side = fig.view === 'side'
  const top = fig.view === 'top'
  const wash = mixHex(CATEGORY_MAP[pose.categorias[0]].cor, '#ffffff', 0.55)

  // --- geometria do tronco --------------------------------------------------
  const N = 20
  const spine = spineSamples(fig.neck, fig.pelvis, fig.spine, N)
  const wS = side ? 8.5 : 15
  const wH = side ? 9.5 : 13
  const width = (t: number) => lerp(wS, wH, t) * (1 - (side ? 0.1 : 0.16) * Math.sin(Math.PI * t))
  const seg = (a: number, b: number) => spine.slice(a, b + 1)
  // top: 0–0.55 · pele das costas: 0.5–0.75 · leggings: 0.7–1
  const topPath = ribbon(seg(0, 11), (t) => width((t * 11) / N))
  const skinPath = ribbon(seg(10, 15), (t) => width((10 + t * 5) / N))
  const legsPath = ribbon(seg(14, 20), (t) => width((14 + t * 6) / N))

  const shoulderDir = perp(norm(sub(spine[1], spine[0])))
  const shoulderL = add(fig.neck, mul(shoulderDir, wS / 2 - 1))
  const shoulderR = sub(fig.neck, mul(shoulderDir, wS / 2 - 1))
  const hipDir = perp(norm(sub(spine[N], spine[N - 1])))
  const hipL = add(fig.pelvis, mul(hipDir, wH / 2 - 1.5))
  const hipR = sub(fig.pelvis, mul(hipDir, wH / 2 - 1.5))

  // --- membros ----------------------------------------------------------------
  const arms = fig.arms.length === 1 && side ? [{ p: shift(fig.arms[0], -1.6, 1.4), far: true }, { p: fig.arms[0], far: false }] : fig.arms.map((p) => ({ p, far: false }))
  const legs = fig.legs.length === 1 && side ? [{ p: shift(fig.legs[0], -1.6, 1.4), far: true }, { p: fig.legs[0], far: false }] : fig.legs.map((p) => ({ p, far: false }))
  const ARM_W = [5.2, 4.4]
  const LEG_W = [7.2, 5.6]

  // --- cabeça e cabelo -------------------------------------------------------
  const R = 6.2
  const head = fig.head
  const toNeck = norm(sub(fig.neck, head))
  const neckStart = add(head, mul(toNeck, R - 1))
  const back: V = side ? [-facing, 0] : top ? [-1, 0] : [0, 0]
  const hairCenter = add(head, add(mul(back, 1.0), [0, -0.5]))
  const faceCenter = add(head, add(mul(back, -1.0), [0, 0.3]))
  const tailStart: V = side ? add(head, [-facing * 5.4, 0.6]) : top ? add(head, [-3, 4.6]) : add(head, [0.3, 5.4])
  const tailCtrl: V = side ? add(tailStart, [-facing * 3.6, 5]) : top ? add(tailStart, [-5, 4]) : add(tailStart, [1.6, 6])
  const tailEnd: V = side ? add(tailStart, [-facing * 2.4, 12.5]) : top ? add(tailStart, [-9.5, 6.5]) : add(tailStart, [-0.8, 13.5])
  const tail = quadRibbon(tailStart, tailCtrl, tailEnd, 3.4, 1.3)

  // --- enquadramento, sombra e manchas -------------------------------------
  const all: V[] = [head, fig.neck, fig.pelvis, ...fig.arms.flat(), ...fig.legs.flat()]
  const minX = Math.min(...all.map((p) => p[0])) - 3
  const maxX = Math.max(...all.map((p) => p[0])) + 3
  const minY = Math.min(...all.map((p) => p[1])) - 6
  const maxY = Math.max(...all.map((p) => p[1])) + 2
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2
  const washRx = Math.max(26, (maxX - minX) / 2 + 9)
  const washRy = Math.max(22, (maxY - minY) / 2 + 8)

  const splashes = Array.from({ length: 14 }, (_, i) => {
    const a = rand() * Math.PI * 2
    const rx = washRx * (0.75 + rand() * 0.55)
    const ry = washRy * (0.7 + rand() * 0.55)
    const x = Math.min(97, Math.max(3, cx + Math.cos(a) * rx))
    const y = Math.min(97, Math.max(3, cy + Math.sin(a) * ry))
    const r = i < 9 ? 0.5 + rand() * 1.3 : 0.25 + rand() * 0.4
    return { x, y, r, c: SPLASH[Math.floor(rand() * SPLASH.length)], o: 0.3 + rand() * 0.45 }
  })

  const hl = `url(#${uid}-hl)`

  return (
    <svg viewBox="0 0 100 100" className={`wc-figure ${className ?? ''}`} role="img" aria-label={title ?? pose.nome}>
      {title && <title>{title}</title>}
      <defs>
        <filter id={`${uid}-edge`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed={seed} result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id={`${uid}-wash`} x="-40%" y="-40%" width="180%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed={seed + 7} result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="16" xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
        <filter id={`${uid}-blur`} x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation="1.3" />
        </filter>
        <filter id={`${uid}-grain`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed={seed + 3} />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.32" />
          </feComponentTransfer>
        </filter>
        <radialGradient id={`${uid}-hl`} cx="0.38" cy="0.3" r="0.65">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* mancha de fundo (cor da categoria, em pastel) */}
      <ellipse cx={cx} cy={cy + 2} rx={washRx} ry={washRy} fill={wash} opacity="0.5" filter={`url(#${uid}-wash)`} />
      {top && <rect x="6" y="30" width="88" height="60" rx="4" fill={mixHex(LEGS, '#fff', 0.75)} opacity="0.6" filter={`url(#${uid}-wash)`} />}

      {/* sombra no chão */}
      {!top && (
        <ellipse cx={cx} cy={Math.min(maxY + 0.5, 91.5)} rx={(maxX - minX) / 2 + 1} ry={2.1} fill={SHADOW} opacity="0.22" filter={`url(#${uid}-blur)`} />
      )}

      <g filter={`url(#${uid}-edge)`} style={{ mixBlendMode: 'multiply' }}>
        {/* membros de trás */}
        {legs.filter((l) => l.far).map((l, i) => (
          <g key={`fl${i}`}>
            <Limb pts={l.p.slice(0, 3)} widths={LEG_W.map((w) => w * 0.9)} color={LEGS_DARK} light={LEGS} opacity={0.9} />
            <Limb pts={l.p.slice(2, 4)} widths={[3.3]} color={SKIN_DARK} light={SKIN} opacity={0.9} />
          </g>
        ))}
        {arms.filter((a) => a.far).map((a, i) => (
          <g key={`fa${i}`}>
            <Limb pts={a.p} widths={ARM_W.map((w) => w * 0.9)} color={SKIN_DARK} light={SKIN} opacity={0.9} />
            <circle cx={a.p[2][0]} cy={a.p[2][1]} r="2.1" fill={SKIN_DARK} opacity="0.9" />
          </g>
        ))}

        {/* rabo de cavalo (vista de cima: por trás da cabeça) */}
        {top && <path d={tail} fill={HAIR} />}

        {/* tronco: leggings, pele das costas, top */}
        <path d={legsPath} fill={LEGS} />
        <path d={legsPath} fill={hl} opacity="0.5" />
        <circle cx={hipL[0]} cy={hipL[1]} r="3" fill={LEGS} />
        <circle cx={hipR[0]} cy={hipR[1]} r="3" fill={LEGS} />
        <path d={skinPath} fill={SKIN} />
        <path d={skinPath} fill={hl} opacity="0.4" />
        <path d={topPath} fill={TOP} />
        <path d={topPath} fill={hl} opacity="0.45" />
        <circle cx={shoulderL[0]} cy={shoulderL[1]} r="2.9" fill={TOP} />
        <circle cx={shoulderR[0]} cy={shoulderR[1]} r="2.9" fill={TOP} />
        {!side && !top && <ellipse cx={spine[2][0]} cy={spine[2][1] + 1} rx="2.6" ry="3.6" fill={SKIN} />}
        <path d={topPath} fill="none" stroke={TOP_DARK} strokeWidth="0.45" opacity="0.45" />
        <path d={legsPath} fill="none" stroke={LEGS_DARK} strokeWidth="0.45" opacity="0.45" />

        {/* rabo de cavalo sobre as costas / atrás do perfil */}
        {!top && <path d={tail} fill={HAIR} />}
        {!top && <path d={tail} fill={hl} opacity="0.35" />}

        {/* pernas da frente */}
        {legs.filter((l) => !l.far).map((l, i) => (
          <g key={`l${i}`}>
            <Limb pts={l.p.slice(0, 3)} widths={LEG_W} color={LEGS} light={LEGS_LIGHT} />
            <Limb pts={l.p.slice(2, 4)} widths={[3.6]} color={SKIN} light={SKIN_LIGHT} />
            <circle cx={l.p[3][0]} cy={l.p[3][1]} r="1.9" fill={SKIN} />
          </g>
        ))}

        {/* pescoço, cabeça e cabelo */}
        <line x1={neckStart[0]} y1={neckStart[1]} x2={fig.neck[0]} y2={fig.neck[1] + 1} stroke={SKIN} strokeWidth="3.4" strokeLinecap="round" />
        <circle cx={hairCenter[0]} cy={hairCenter[1]} r={R + 0.5} fill={HAIR} />
        {(side || top) && <circle cx={faceCenter[0]} cy={faceCenter[1]} r={R - 0.6} fill={SKIN} />}
        {(side || top) && <circle cx={faceCenter[0]} cy={faceCenter[1]} r={R - 0.6} fill={hl} opacity="0.5" />}
        <circle cx={hairCenter[0] - 1.6} cy={hairCenter[1] - 1.8} r={R - 2.2} fill={HAIR_LIGHT} opacity="0.35" />
        <circle cx={tailStart[0]} cy={tailStart[1]} r="1.35" fill={TIE} />

        {/* braços da frente e mãos */}
        {arms.filter((a) => !a.far).map((a, i) => {
          const dir = norm(sub(a.p[2], a.p[1]))
          const hand = add(a.p[2], mul(dir, 1.2))
          return (
            <g key={`a${i}`}>
              <Limb pts={a.p} widths={ARM_W} color={SKIN} light={SKIN_LIGHT} />
              <circle cx={hand[0]} cy={hand[1]} r="2.3" fill={SKIN} />
              <circle cx={hand[0] - 0.5} cy={hand[1] - 0.5} r="1.1" fill={SKIN_LIGHT} opacity="0.5" />
            </g>
          )
        })}
      </g>

      {/* salpicos */}
      <g filter={`url(#${uid}-edge)`} style={{ mixBlendMode: 'multiply' }}>
        {splashes.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={s.c} opacity={s.o} />
        ))}
      </g>

      {/* grão de papel */}
      <rect width="100" height="100" filter={`url(#${uid}-grain)`} opacity="0.35" style={{ mixBlendMode: 'multiply' }} />
    </svg>
  )
}
