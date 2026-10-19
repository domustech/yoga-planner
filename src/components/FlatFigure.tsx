import { useId, type ReactElement } from 'react'
import { CATEGORY_MAP } from '../data/categories'
import type { Pose } from '../data/types'
import {
  add,
  bandPath,
  bump,
  dot,
  f,
  facingOf,
  headFrame,
  limbPath,
  limbPathMulti,
  mixHex,
  mul,
  norm,
  perp,
  prof,
  pt,
  quadPts,
  shift,
  smoothClosed,
  smoothOpen,
  spineSamples,
  sub,
  type V,
} from '../lib/figureGeometry'

// ---------------------------------------------------------------------------
// Biblioteca de ilustrações "editorial flat" do Yoga Planner.
// Figura construída a partir das articulações de cada postura, com silhueta
// anatómica, duas tonalidades por forma (base + sombra do lado oposto à luz),
// contorno fino e personagem única: fato inteiro verde-escuro, pele quente,
// cabelo apanhado em coque. Rosto mínimo (olhos fechados; nariz no perfil).
// Fundo: disco pastel na cor da categoria e sombra de contacto.
// Sem filtros: nítida em qualquer tamanho. ViewBox fixo 0 0 100 100.
// ---------------------------------------------------------------------------

interface Flat {
  base: string
  shadow: string
}

const SKIN: Flat = { base: '#e4b798', shadow: '#c9966f' }
const SUIT: Flat = { base: '#5c7c64', shadow: '#47634f' }
const HAIR: Flat = { base: '#4b3b34', shadow: '#342723' }
const LINE = '#3a2d29'
const LINE_W = 0.55
const LINE_O = 0.78
/** Deslocamento da cópia iluminada (a sombra fica em baixo à direita). */
const SHIFT: V = [-0.85, -0.95]

interface Props {
  pose: Pose
  className?: string
  title?: string
  /** Disco pastel de fundo. */
  backdrop?: boolean
}

export function FlatFigure({ pose, className, title, backdrop = true }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const fig = pose.figura
  const facing = facingOf(fig, pose.id)
  const side = fig.view === 'side'
  const top = fig.view === 'top'
  const catColor = CATEGORY_MAP[pose.categorias[0]].cor

  const defs: ReactElement[] = []
  let ck = 0
  /** Forma com sombra (cópia deslocada para a luz, recortada pela própria forma) e contorno. */
  const shape = (d: string, tone: Flat, key: string, outline = true, opacity = 1) => {
    const id = `${uid}-c${ck++}`
    defs.push(
      <clipPath key={id} id={id}>
        <path d={d} />
      </clipPath>,
    )
    return (
      <g key={key} opacity={opacity}>
        <path d={d} fill={tone.shadow} />
        <g clipPath={`url(#${id})`}>
          <path d={d} fill={tone.base} transform={`translate(${f(SHIFT[0])} ${f(SHIFT[1])})`} />
        </g>
        {outline && <path d={d} fill="none" stroke={LINE} strokeWidth={LINE_W} strokeOpacity={LINE_O} strokeLinejoin="round" />}
      </g>
    )
  }

  // --- membros ------------------------------------------------------------------
  const hand = (wrist: V, dir: V, key: string) => {
    const n = perp(dir)
    const P = (x: number, y: number): V => add(wrist, add(mul(dir, x), mul(n, y)))
    const palm = smoothClosed([P(0.0, 1.3), P(1.5, 1.55), P(2.7, 1.0), P(2.9, -0.6), P(2.2, -1.4), P(0.6, -1.3), P(-0.3, -0.5)])
    const fingerPaths = [
      [0.95, 2.0],
      [0.33, 2.35],
      [-0.3, 2.2],
      [-0.9, 1.75],
    ].map(([o, L]) => {
      const base = P(2.5, o)
      const tip = add(base, add(mul(dir, L), mul(n, o * 0.2)))
      const mid = add(base, add(mul(dir, L * 0.55), mul(n, o * 0.08 - 0.12)))
      return bandPath(quadPts(base, mid, tip, 6), (s) => 0.95 - 0.35 * s)
    })
    const thumb = bandPath(quadPts(P(1.0, 1.3), P(1.9, 2.3), P(2.7, 2.6), 6), (s) => 1.05 - 0.4 * s)
    return (
      <g key={key}>
        {fingerPaths.map((d, i) => (
          <path key={i} d={d} fill={SKIN.base} stroke={LINE} strokeWidth="0.35" strokeOpacity="0.6" />
        ))}
        <path d={thumb} fill={SKIN.base} stroke={LINE} strokeWidth="0.35" strokeOpacity="0.6" />
        {shape(palm, SKIN, 'palm')}
      </g>
    )
  }

  const foot = (ankle: V, toe: V, key: string) => {
    const d = norm(sub(toe, ankle))
    const n = perp(d)
    const heel = sub(ankle, mul(d, 0.9))
    const sole = smoothClosed([
      add(heel, mul(n, 1.9)), add(ankle, mul(n, 2.0)), add(toe, mul(n, 1.6)), add(toe, add(mul(d, 1.2), mul(n, 0.4))),
      add(toe, add(mul(d, 1.0), mul(n, -1.0))), add(ankle, mul(n, -1.9)), add(heel, mul(n, -1.7)), sub(heel, mul(d, 1.0)),
    ])
    return <g key={key}>{shape(sole, SKIN, 'foot')}</g>
  }

  const arms = fig.arms.length === 1 && side ? [{ p: shift(fig.arms[0], -1.6, 1.4), far: true }, { p: fig.arms[0], far: false }] : fig.arms.map((p) => ({ p, far: false }))
  const legs = fig.legs.length === 1 && side ? [{ p: shift(fig.legs[0], -1.6, 1.4), far: true }, { p: fig.legs[0], far: false }] : fig.legs.map((p) => ({ p, far: false }))

  const renderArm = (p: V[], isFar: boolean, key: string) => {
    const k = isFar ? 0.92 : 1
    const d = limbPathMulti([p[0], p[1], p[2]], [6.0 * k, 4.3 * k, 2.9 * k], [[0.9 * k, 0.42], [0.8 * k, 0.28]])
    return (
      <g key={key} opacity={isFar ? 0.92 : 1}>
        {shape(d, isFar ? { base: SKIN.shadow, shadow: mixHex(SKIN.shadow, '#000', 0.2) } : SKIN, 'arm')}
        {hand(p[2], norm(sub(p[2], p[1])), 'h')}
      </g>
    )
  }
  const renderLeg = (p: V[], isFar: boolean, key: string) => {
    const k = isFar ? 0.92 : 1
    const d = limbPathMulti([p[0], p[1], p[2]], [9.4 * k, 5.8 * k, 3.4 * k], [[0.6 * k, 0.3], [1.5 * k, 0.32]])
    return (
      <g key={key} opacity={isFar ? 0.92 : 1}>
        {shape(d, isFar ? { base: SUIT.shadow, shadow: mixHex(SUIT.shadow, '#000', 0.2) } : SUIT, 'leg')}
        {foot(p[2], p[3], 'ft')}
      </g>
    )
  }

  // --- tronco ---------------------------------------------------------------------
  const N = 20
  const spine = spineSamples(fig.neck, fig.pelvis, fig.spine, N)
  const torsoDir = norm(sub(spine[N], spine[0]))
  const torsoN = perp(torsoDir)
  const frontSign = side ? (dot(torsoN, [facing, 0]) >= 0 ? 1 : -1) : 1
  const W_FRONT: [number, number][] = [[0, 7.4], [0.1, 7.2], [0.3, 6.3], [0.52, 5.3], [0.7, 6.3], [0.86, 7.3], [1, 6.7]]
  const halfFront = (t: number) => (side ? 4.3 + 1.5 * bump(t, 0.2, 0.09) + 0.35 * bump(t, 0.62, 0.14) : prof(W_FRONT, t))
  const halfBack = (t: number) => (side ? 4.3 + 0.5 * bump(t, 0.14, 0.1) - 0.5 * bump(t, 0.5, 0.14) + 2.3 * bump(t, 0.92, 0.09) : prof(W_FRONT, t))
  const halfL = frontSign > 0 ? halfFront : halfBack
  const halfR = frontSign > 0 ? halfBack : halfFront
  const L: V[] = []
  const Rr: V[] = []
  for (let i = 0; i <= N; i++) {
    const t = i / N
    const nv = perp(norm(sub(spine[Math.min(N, i + 1)], spine[Math.max(0, i - 1)])))
    L.push(add(spine[i], mul(nv, halfL(t))))
    Rr.push(sub(spine[i], mul(nv, halfR(t))))
  }
  const torso = smoothClosed([...L, ...Rr.reverse()])
  const shoulderL = add(fig.neck, mul(torsoN, side ? 1.2 : 6.4))
  const shoulderR = sub(fig.neck, mul(torsoN, side ? 1.2 : 6.4))
  const deltoid = (c: V) => {
    const rx = side ? 2.4 : 2.9
    const ry = side ? 2.0 : 2.3
    const a = Math.atan2(torsoN[1], torsoN[0])
    const pts: V[] = []
    for (let i = 0; i < 12; i++) {
      const th = (i / 12) * Math.PI * 2
      const x = Math.cos(th) * rx
      const y = Math.sin(th) * ry
      pts.push([c[0] + x * Math.cos(a) - y * Math.sin(a), c[1] + x * Math.sin(a) + y * Math.cos(a)])
    }
    return smoothClosed(pts)
  }

  // --- cabeça --------------------------------------------------------------------
  const R = 4.8
  const h = add(fig.head, mul(norm(sub(fig.neck, fig.head)), 1.0))
  const { u, uNeck, front } = headFrame(fig, h, facing)
  const r = perp(u)
  const B = side && front ? front : r
  const H = (a: number, b: number): V => add(h, add(mul(u, a * R), mul(B, b * R)))
  const headPath = side && front
    ? smoothClosed([
        H(1.0, 0.08), H(0.8, 0.66), H(0.5, 0.92), H(0.28, 0.9), H(0.1, 1.08), H(0.0, 1.22), H(-0.1, 1.02), H(-0.26, 0.98),
        H(-0.4, 1.02), H(-0.56, 0.92), H(-0.8, 0.68), H(-0.98, 0.3), H(-0.9, -0.25), H(-0.55, -0.78), H(-0.05, -1.0), H(0.5, -0.88), H(0.86, -0.5),
      ])
    : smoothClosed([H(1.0, 0), H(0.86, 0.56), H(0.46, 0.92), H(0.0, 0.98), H(-0.46, 0.86), H(-0.8, 0.52), H(-1.04, 0), H(-0.8, -0.52), H(-0.46, -0.86), H(0.0, -0.98), H(0.46, -0.92), H(0.86, -0.56)])
  const neckTop = H(-0.85, 0)
  const neckBottom = add(fig.neck, mul(uNeck, -1.6))
  const neckPath = limbPath(neckTop, neckBottom, 3.4, 4.2, 0, 0.5)

  // cabelo: massa atrás, coque e cabelo da frente
  const hairBack = (() => {
    const c = side && front ? H(0.3, -0.3) : H(0.3, 0)
    const rx = R * 1.06
    const ry = R * 1.14
    const a = Math.atan2(B[1], B[0])
    const pts: V[] = []
    for (let i = 0; i < 14; i++) {
      const th = (i / 14) * Math.PI * 2
      const x = Math.cos(th) * rx
      const y = Math.sin(th) * ry
      pts.push([c[0] + x * Math.cos(a) - y * Math.sin(a), c[1] + x * Math.sin(a) + y * Math.cos(a)])
    }
    return smoothClosed(pts)
  })()
  const bunC = side && front ? H(0.8, -0.8) : top ? H(1.2, 0.25) : H(1.14, 0.42)
  const bun = smoothClosed(Array.from({ length: 10 }, (_, i) => {
    const th = (i / 10) * Math.PI * 2
    return [bunC[0] + Math.cos(th) * R * 0.62, bunC[1] + Math.sin(th) * R * 0.56] as V
  }))
  const hairFront = side && front
    ? smoothClosed([H(1.08, 0.0), H(1.0, 0.55), H(0.74, 0.9), H(0.5, 0.98), H(0.42, 0.84), H(0.64, 0.52), H(0.8, 0.18), H(0.86, -0.2), H(1.0, -0.45)])
    : smoothClosed([H(1.1, 0), H(1.02, 0.5), H(0.84, 0.86), H(0.56, 1.0), H(0.3, 0.96), H(0.42, 0.7), H(0.56, 0.4), H(0.62, 0.0), H(0.56, -0.4), H(0.42, -0.7), H(0.3, -0.96), H(0.56, -1.0), H(0.84, -0.86), H(1.02, -0.5)])

  // rosto mínimo
  const faceEls: ReactElement[] = []
  if (side && front) {
    faceEls.push(<path key="eye" d={smoothOpen([H(0.2, 0.78), H(0.08, 0.6), H(0.18, 0.4)])} fill="none" stroke={LINE} strokeWidth="0.5" strokeOpacity="0.85" strokeLinecap="round" />)
    faceEls.push(<path key="brow" d={smoothOpen([H(0.44, 0.78), H(0.5, 0.56), H(0.44, 0.34)])} fill="none" stroke={LINE} strokeWidth="0.45" strokeOpacity="0.5" strokeLinecap="round" />)
    faceEls.push(<path key="mouth" d={`M ${pt(H(-0.36, 0.72))} L ${pt(H(-0.34, 0.98))}`} stroke={LINE} strokeWidth="0.4" strokeOpacity="0.55" strokeLinecap="round" />)
  } else {
    for (const s of [-1, 1]) {
      faceEls.push(<path key={`eye${s}`} d={smoothOpen([H(0.1, s * 0.62), H(-0.02, s * 0.42), H(0.1, s * 0.22)])} fill="none" stroke={LINE} strokeWidth="0.5" strokeOpacity="0.85" strokeLinecap="round" />)
      faceEls.push(<path key={`brow${s}`} d={smoothOpen([H(0.36, s * 0.64), H(0.44, s * 0.42), H(0.36, s * 0.2)])} fill="none" stroke={LINE} strokeWidth="0.4" strokeOpacity="0.45" strokeLinecap="round" />)
    }
    faceEls.push(<path key="nose" d={`M ${pt(H(0.0, 0.02))} L ${pt(H(-0.32, 0.1))}`} stroke={LINE} strokeWidth="0.35" strokeOpacity="0.4" strokeLinecap="round" />)
    faceEls.push(<path key="mouth" d={smoothOpen([H(-0.6, -0.2), H(-0.66, 0), H(-0.6, 0.2)])} fill="none" stroke={LINE} strokeWidth="0.45" strokeOpacity="0.6" strokeLinecap="round" />)
  }

  // --- composição ----------------------------------------------------------------
  const all: V[] = [h, fig.neck, fig.pelvis, ...fig.arms.flat(), ...fig.legs.flat()]
  const minX = Math.min(...all.map((p) => p[0]))
  const maxX = Math.max(...all.map((p) => p[0]))
  const minY = Math.min(...all.map((p) => p[1]))
  const maxY = Math.max(...all.map((p) => p[1]))

  const body: ReactElement[] = []
  body.push(...legs.filter((l) => l.far).map((l, i) => renderLeg(l.p, true, `fl${i}`)))
  body.push(...arms.filter((a) => a.far).map((a, i) => renderArm(a.p, true, `fa${i}`)))
  body.push(shape(hairBack, HAIR, 'hairback'))
  body.push(shape(bun, HAIR, 'bun'))
  body.push(...legs.filter((l) => !l.far).map((l, i) => renderLeg(l.p, false, `l${i}`)))
  body.push(shape(torso, SUIT, 'torso'))
  body.push(shape(deltoid(shoulderL), SKIN, 'sl'))
  if (!side) body.push(shape(deltoid(shoulderR), SKIN, 'sr'))
  body.push(shape(neckPath, SKIN, 'neck'))
  body.push(shape(headPath, SKIN, 'head'))
  body.push(shape(hairFront, HAIR, 'hairfront'))
  body.push(<g key="face">{faceEls}</g>)
  body.push(...arms.filter((a) => !a.far).map((a, i) => renderArm(a.p, false, `a${i}`)))

  return (
    <svg viewBox="0 0 100 100" className={`flat-figure ${className ?? ''}`} role="img" aria-label={title ?? pose.nome}>
      {title && <title>{title}</title>}
      <defs>{defs}</defs>
      {backdrop && <circle cx={f(Math.min(62, Math.max(38, (minX + maxX) / 2)))} cy="52" r="38" fill={mixHex(catColor, '#ffffff', 0.72)} />}
      {backdrop && top && <rect x="12" y={f(Math.max(28, minY - 4))} width="76" height={f(Math.min(64, maxY - minY + 14))} rx="4" fill={mixHex(catColor, '#ffffff', 0.55)} opacity="0.7" />}
      {!top && <ellipse cx={f((minX + maxX) / 2)} cy={f(Math.min(maxY + 1.4, 92))} rx={f((maxX - minX) / 2 + 2)} ry="1.9" fill={mixHex(catColor, '#000000', 0.35)} opacity="0.18" />}
      {body}
    </svg>
  )
}
