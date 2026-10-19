import { useId, type ReactElement } from 'react'
import { CATEGORY_MAP } from '../data/categories'
import type { Pose } from '../data/types'
import {
  LIGHT,
  add,
  bandPath,
  bump,
  darker,
  deg,
  dot,
  f,
  facingOf,
  hashStr,
  headFrame,
  len,
  lerp,
  limbPath,
  limbPathMulti,
  mixHex,
  mul,
  mulberry,
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
  type Tone,
  type V,
} from '../lib/figureGeometry'

// ---------------------------------------------------------------------------
// Ilustração em aquarela gerada a partir das articulações da postura.
// Versão com anatomia: silhueta do tronco (ombros, peito, cintura, ancas,
// glúteos), membros com curvas musculares e sombreado cilíndrico por
// gradiente, cabeça oval com perfil real (testa, nariz, lábios, queixo),
// traços faciais suaves, cabelo em massas com madeixas e rabo de cavalo,
// mãos com dedos e pés modelados. A mesma personagem em todas as posturas.
// Texturas de aguarela via filtros SVG. ViewBox fixo 0 0 100 100.
// ---------------------------------------------------------------------------

const SKIN: Tone = { base: '#e3b08c', light: '#f7dbc4', shade: '#cd916a', deep: '#a86f4d' }
const TOP: Tone = { base: '#82966c', light: '#adbb97', shade: '#647955', deep: '#4b5d3f' }
const LEG: Tone = { base: '#9eb9af', light: '#cddcd6', shade: '#78948a', deep: '#59756b' }
const HAIR: Tone = { base: '#6c4b31', light: '#a67e56', shade: '#4f361f', deep: '#372416' }
const INK = '#4a3425'
const LIP = '#c4767a'
const BLUSH = '#d98a8c'
const TIE = '#c9787f'
const SHADOW = '#8a9084'
const SPLASH = ['#82966c', '#9eb9af', '#d9a0b0', '#e9b784', '#e3b08c', '#b8a4c9', '#c9787f']

// ---------------------------------------------------------------------------
// Figura
// ---------------------------------------------------------------------------

interface Props {
  pose: Pose
  className?: string
  title?: string
  /** Grão de papel (requer mix-blend-mode; desativar ao exportar para PNG). */
  grain?: boolean
}

export function WatercolorFigure({ pose, className, title, grain = true }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const fig = pose.figura
  const rand = mulberry(hashStr(pose.id))
  const seed = hashStr(pose.id) % 1000
  const facing = facingOf(fig, pose.id)
  const side = fig.view === 'side'
  const top = fig.view === 'top'
  const wash = mixHex(CATEGORY_MAP[pose.categorias[0]].cor, '#ffffff', 0.5)
  const wash2 = SPLASH[hashStr(pose.id + 'w') % SPLASH.length]
  const DOWN: V = [0, 1]

  const defs: ReactElement[] = []
  let gk = 0
  /** Gradiente cilíndrico perpendicular a um eixo (lado iluminado segundo LIGHT). */
  const grad = (c: V, n: V, hw: number, tone: Tone, flip = false): string => {
    const lit = (dot(n, LIGHT) > 0 ? 1 : -1) * (flip ? -1 : 1)
    const id = `${uid}-g${gk++}`
    const p1 = add(c, mul(n, hw * lit))
    const p2 = sub(c, mul(n, hw * lit))
    defs.push(
      <linearGradient key={id} id={id} gradientUnits="userSpaceOnUse" x1={f(p1[0])} y1={f(p1[1])} x2={f(p2[0])} y2={f(p2[1])}>
        <stop offset="0" stopColor={tone.light} />
        <stop offset="0.36" stopColor={tone.base} />
        <stop offset="0.72" stopColor={tone.shade} />
        <stop offset="1" stopColor={tone.deep} />
      </linearGradient>,
    )
    return `url(#${id})`
  }
  const radial = (c: V, r: number, tone: Tone): string => {
    const id = `${uid}-r${gk++}`
    defs.push(
      <radialGradient key={id} id={id} gradientUnits="userSpaceOnUse" cx={f(c[0] - r * 0.3)} cy={f(c[1] - r * 0.35)} r={f(r * 1.5)}>
        <stop offset="0" stopColor={tone.light} />
        <stop offset="0.4" stopColor={tone.base} />
        <stop offset="0.8" stopColor={tone.shade} />
        <stop offset="1" stopColor={tone.deep} />
      </radialGradient>,
    )
    return `url(#${id})`
  }

  // --- membros ------------------------------------------------------------------
  const segment = (a: V, b: V, w0: number, w1: number, bulge: number, tb: number, tone: Tone, key: string, opacity = 1) => {
    const d = norm(sub(b, a))
    const n = perp(d)
    const mid = add(a, mul(sub(b, a), 0.5))
    const hw = (Math.max(w0, w1) + bulge) / 2
    return (
      <g key={key} opacity={opacity}>
        <path d={limbPath(a, b, w0, w1, bulge, tb)} fill={grad(mid, n, hw, tone)} />
        <path d={limbPath(a, b, w0, w1, bulge, tb)} fill="none" stroke={tone.deep} strokeWidth="0.3" opacity="0.28" />
      </g>
    )
  }

  const hand = (wrist: V, dir: V, tone: Tone, key: string, opacity = 1) => {
    const d = dir
    const n = perp(d)
    const P = (x: number, y: number): V => add(wrist, add(mul(d, x), mul(n, y)))
    const palm = smoothClosed([P(0.2, 1.25), P(1.5, 1.5), P(2.7, 1.0), P(2.9, -0.6), P(2.2, -1.4), P(0.6, -1.3), P(-0.2, -0.5)])
    const fingers = [
      [0.95, 2.0],
      [0.33, 2.35],
      [-0.3, 2.2],
      [-0.9, 1.75],
    ].map(([o, L], i) => {
      const base = P(2.6, o)
      const tip = add(base, add(mul(d, L), mul(n, o * 0.2)))
      const mid = add(base, add(mul(d, L * 0.55), mul(n, o * 0.08 - 0.12)))
      return <path key={i} d={bandPath(quadPts(base, mid, tip, 6), (t) => lerp(0.82, 0.5, t))} fill={tone.base} />
    })
    const thumb = bandPath(quadPts(P(1.0, 1.3), P(1.9, 2.3), P(2.7, 2.6), 6), (t) => lerp(1.0, 0.6, t))
    return (
      <g key={key} opacity={opacity}>
        <path d={palm} fill={grad(P(1.5, 0), n, 1.7, tone)} />
        <path d={thumb} fill={tone.base} />
        {fingers}
        <path d={palm} fill="none" stroke={tone.deep} strokeWidth="0.25" opacity="0.3" />
      </g>
    )
  }

  const foot = (ankle: V, toe: V, tone: Tone, key: string, opacity = 1) => {
    const d = norm(sub(toe, ankle))
    const n = perp(d)
    const heel = sub(ankle, mul(d, 0.9))
    const toes = [-1.05, -0.2, 0.65].map((o, i) => {
      const c = add(toe, add(mul(d, 0.55 + Math.abs(o) * 0.1), mul(n, o * 0.95)))
      return <circle key={i} cx={f(c[0])} cy={f(c[1])} r={f(0.8 - Math.abs(o) * 0.14)} fill={tone.base} />
    })
    return (
      <g key={key} opacity={opacity}>
        <circle cx={f(heel[0])} cy={f(heel[1])} r="1.95" fill={tone.shade} />
        <path d={limbPath(ankle, toe, 3.9, 3.0, 0, 0.5)} fill={grad(add(ankle, mul(sub(toe, ankle), 0.5)), n, 2, tone)} />
        {toes}
      </g>
    )
  }

  const arms = fig.arms.length === 1 && side ? [{ p: shift(fig.arms[0], -1.6, 1.4), far: true }, { p: fig.arms[0], far: false }] : fig.arms.map((p) => ({ p, far: false }))
  const legs = fig.legs.length === 1 && side ? [{ p: shift(fig.legs[0], -1.6, 1.4), far: true }, { p: fig.legs[0], far: false }] : fig.legs.map((p) => ({ p, far: false }))

  /** Membro contínuo (sem costuras) com gradiente cilíndrico segundo a direção geral. */
  const limb = (joints: V[], widths: number[], bulges: [number, number][], tone: Tone, key: string, opacity = 1) => {
    const first = joints[0]
    const last = joints[joints.length - 1]
    const axis = len(sub(last, first)) > 2 ? norm(sub(last, first)) : norm(sub(joints[1], joints[0]))
    const n = perp(axis)
    const mid = add(first, mul(sub(last, first), 0.5))
    const hw = (Math.max(...widths) + 1) / 2
    const d = limbPathMulti(joints, widths, bulges)
    return (
      <g key={key} opacity={opacity}>
        <path d={d} fill={grad(mid, n, hw, tone)} />
        <path d={d} fill="none" stroke={tone.deep} strokeWidth="0.3" opacity="0.22" />
      </g>
    )
  }

  const renderArm = (p: V[], far: boolean, key: string) => {
    const k = far ? 0.92 : 1
    const o = far ? 0.92 : 1
    const tone = far ? darker(SKIN) : SKIN
    const dir = norm(sub(p[2], p[1]))
    return (
      <g key={key}>
        {limb([p[0], p[1], p[2]], [6.0 * k, 4.3 * k, 2.9 * k], [[0.9 * k, 0.42], [0.8 * k, 0.28]], tone, 'arm', o)}
        {hand(p[2], dir, tone, 'h', o)}
      </g>
    )
  }

  const renderLeg = (p: V[], far: boolean, key: string) => {
    const k = far ? 0.92 : 1
    const o = far ? 0.92 : 1
    const tone = far ? darker(LEG) : LEG
    const skin = far ? darker(SKIN) : SKIN
    return (
      <g key={key}>
        {limb([p[0], p[1], p[2]], [9.4 * k, 5.8 * k, 3.4 * k], [[0.6 * k, 0.3], [1.5 * k, 0.32]], tone, 'leg', o)}
        <path d={smoothOpen([p[0], add(p[1], mul(perp(norm(sub(p[1], p[0]))), 0.6)), p[1]])} fill="none" stroke={tone.light} strokeWidth="0.35" opacity={0.45 * o} />
        {foot(p[2], p[3], skin, 'ft', o)}
      </g>
    )
  }

  // --- tronco ---------------------------------------------------------------------
  const N = 20
  const spine = spineSamples(fig.neck, fig.pelvis, fig.spine, N)
  const torsoDir = norm(sub(spine[N], spine[0]))
  const torsoN = perp(torsoDir)
  const frontSign = side ? (dot(torsoN, [facing, 0]) >= 0 ? 1 : -1) : 1

  // meias-larguras: de frente (simétricas) / de perfil (frente e costas)
  const W_FRONT: [number, number][] = [[0, 7.4], [0.1, 7.2], [0.3, 6.3], [0.52, 5.3], [0.7, 6.3], [0.86, 7.3], [1, 6.7]]
  const halfFront = (t: number) => (side ? 4.3 + 1.5 * bump(t, 0.2, 0.09) + 0.35 * bump(t, 0.62, 0.14) : prof(W_FRONT, t))
  const halfBack = (t: number) => (side ? 4.3 + 0.5 * bump(t, 0.14, 0.1) - 0.5 * bump(t, 0.5, 0.14) + 2.3 * bump(t, 0.92, 0.09) : prof(W_FRONT, t))
  const halfL = frontSign > 0 ? halfFront : halfBack
  const halfR = frontSign > 0 ? halfBack : halfFront

  const torsoPart = (t0: number, t1: number): string => {
    const i0 = Math.round(t0 * N)
    const i1 = Math.round(t1 * N)
    const L: V[] = []
    const R: V[] = []
    for (let i = i0; i <= i1; i++) {
      const t = i / N
      const prev = spine[Math.max(0, i - 1)]
      const next = spine[Math.min(N, i + 1)]
      const nv = perp(norm(sub(next, prev)))
      L.push(add(spine[i], mul(nv, halfL(t))))
      R.push(sub(spine[i], mul(nv, halfR(t))))
    }
    return smoothClosed([...L, ...R.reverse()])
  }
  const torsoMid = spine[10]
  const torsoFill = (tone: Tone) => grad(torsoMid, torsoN, 7.5, tone)

  const shoulderL = add(fig.neck, mul(torsoN, side ? 1.2 : 6.6))
  const shoulderR = sub(fig.neck, mul(torsoN, side ? 1.2 : 6.6))

  // --- cabeça --------------------------------------------------------------------
  const R = 5.0
  // cabeça ligeiramente mais perto do pescoço do que no esqueleto (pescoço mais curto e natural)
  const h = add(fig.head, mul(norm(sub(fig.neck, fig.head)), 0.9))
  const { u, uNeck, front } = headFrame(fig, h, facing)
  const r = perp(u)
  /** Ponto no referencial da cabeça: a = para cima, b = direita (de frente) ou frente (perfil). */
  const H = (a: number, b: number): V => add(h, add(mul(u, a * R), mul(side && front ? front : r, b * R)))
  const rotH = (c: V) => `rotate(${f(deg(side && front ? front : r))} ${f(c[0])} ${f(c[1])})`

  const headEls: ReactElement[] = []
  const hairBackEls: ReactElement[] = []
  const tailEls: ReactElement[] = []
  const hairTone = HAIR
  if (side && front) {
    const back = mul(front, -1)
    // massa de cabelo atrás
    const hb = H(0.2, -0.3)
    hairBackEls.push(<ellipse key="hb" cx={f(hb[0])} cy={f(hb[1])} rx={f(R * 1.08)} ry={f(R * 1.18)} transform={rotH(hb)} fill={radial(hb, R * 1.1, hairTone)} />)
    // rabo de cavalo
    const t0 = H(-0.2, -0.95)
    const grounded = t0[1] > 80
    const t1 = grounded ? add(t0, add(mul(back, 5), mul(DOWN, 1))) : add(t0, add(mul(back, 3.2), mul(DOWN, 5.5)))
    const t2 = grounded ? add(t0, add(mul(back, 11.5), mul(DOWN, 1.8))) : add(t0, add(mul(back, 1.8), mul(DOWN, 13)))
    const tail = quadPts(t0, t1, t2)
    tailEls.push(<path key="tail" d={bandPath(tail, (t) => lerp(3.6, 1.4, t))} fill={grad(tail[5], perp(norm(sub(tail[6], tail[4]))), 1.8, hairTone)} />)
    for (const o of [-0.9, 0.1, 0.9]) {
      const s = tail.map((p, i) => add(p, mul(perp(norm(sub(tail[Math.min(10, i + 1)], tail[Math.max(0, i - 1)]))), o * (1 - i / 14))))
      tailEls.push(<path key={`s${o}`} d={smoothOpen(s)} fill="none" stroke={o > 0 ? hairTone.light : hairTone.deep} strokeWidth="0.35" opacity="0.55" />)
    }
    tailEls.push(<circle key="tie" cx={f(t0[0])} cy={f(t0[1])} r="1.3" fill={TIE} />)
    // rosto de perfil
    const face = smoothClosed([
      H(1.0, 0.08), H(0.8, 0.66), H(0.5, 0.92), H(0.28, 0.9), H(0.1, 1.08), H(0.0, 1.22), H(-0.1, 1.02), H(-0.26, 0.98),
      H(-0.4, 1.02), H(-0.56, 0.92), H(-0.8, 0.68), H(-0.98, 0.3), H(-0.9, -0.25), H(-0.55, -0.78), H(-0.05, -1.0), H(0.5, -0.88), H(0.86, -0.5),
    ])
    headEls.push(<path key="face" d={face} fill={grad(h, front, R, SKIN)} />)
    headEls.push(<path key="facel" d={face} fill="none" stroke={SKIN.deep} strokeWidth="0.3" opacity="0.3" />)
    // orelha
    const ear = H(-0.05, -0.28)
    headEls.push(<ellipse key="ear" cx={f(ear[0])} cy={f(ear[1])} rx={f(R * 0.2)} ry={f(R * 0.32)} transform={rotH(ear)} fill={SKIN.shade} />)
    headEls.push(<ellipse key="ear2" cx={f(ear[0])} cy={f(ear[1])} rx={f(R * 0.1)} ry={f(R * 0.18)} transform={rotH(ear)} fill={SKIN.deep} opacity="0.5" />)
    // sobrancelha, olho fechado, nariz (sombra), lábios, blush
    headEls.push(<path key="brow" d={bandPath(quadPts(H(0.46, 0.8), H(0.51, 0.55), H(0.44, 0.3), 6), (t) => lerp(0.5, 0.22, t))} fill={HAIR.shade} opacity="0.7" />)
    headEls.push(<ellipse key="lidsh" cx={f(H(0.24, 0.58)[0])} cy={f(H(0.24, 0.58)[1])} rx={f(R * 0.26)} ry={f(R * 0.12)} transform={rotH(H(0.24, 0.58))} fill={SKIN.shade} opacity="0.35" />)
    headEls.push(<path key="eye" d={smoothOpen([H(0.2, 0.8), H(0.07, 0.6), H(0.17, 0.36)])} fill="none" stroke={INK} strokeWidth="0.5" strokeLinecap="round" />)
    headEls.push(<path key="lash" d={`M ${pt(H(0.2, 0.8))} L ${pt(H(0.1, 0.92))}`} stroke={INK} strokeWidth="0.4" strokeLinecap="round" />)
    headEls.push(<path key="nosesh" d={bandPath([H(-0.08, 1.08), H(-0.14, 0.9)], () => 0.7)} fill={SKIN.shade} opacity="0.4" />)
    headEls.push(<ellipse key="lip" cx={f(H(-0.34, 0.96)[0])} cy={f(H(-0.34, 0.96)[1])} rx={f(R * 0.1)} ry={f(R * 0.15)} transform={rotH(H(-0.34, 0.96))} fill={LIP} opacity="0.85" />)
    headEls.push(<path key="lipline" d={`M ${pt(H(-0.33, 1.02))} L ${pt(H(-0.36, 0.78))}`} stroke={SKIN.deep} strokeWidth="0.3" opacity="0.5" strokeLinecap="round" />)
    headEls.push(<ellipse key="blush" cx={f(H(-0.22, 0.5)[0])} cy={f(H(-0.22, 0.5)[1])} rx={f(R * 0.32)} ry={f(R * 0.2)} transform={rotH(H(-0.22, 0.5))} fill={BLUSH} opacity="0.22" />)
    // franja e madeixa
    const fringe = smoothClosed([H(1.1, 0.0), H(1.0, 0.55), H(0.74, 0.92), H(0.48, 1.0), H(0.4, 0.86), H(0.62, 0.55), H(0.78, 0.2), H(0.84, -0.15), H(1.0, -0.35)])
    headEls.push(<path key="fringe" d={fringe} fill={grad(H(0.85, 0.4), front, R * 0.6, hairTone)} />)
    headEls.push(<path key="strand" d={bandPath(quadPts(H(0.92, 0.5), H(0.72, 0.98), H(0.3, 1.02), 8), (t) => lerp(1.4, 0.4, t))} fill={hairTone.shade} opacity="0.8" />)
    headEls.push(<path key="shine" d={smoothOpen([H(1.0, -0.2), H(0.95, 0.25), H(0.8, 0.6)])} fill="none" stroke={hairTone.light} strokeWidth="0.5" opacity="0.6" strokeLinecap="round" />)
    headEls.push(<path key="shine2" d={smoothOpen([H(0.7, -0.75), H(0.35, -0.95), H(-0.1, -1.0)])} fill="none" stroke={hairTone.light} strokeWidth="0.45" opacity="0.45" strokeLinecap="round" />)
  } else {
    // massa de cabelo atrás e rabo de cavalo sobre um ombro (ou espalhado, deitado)
    const hb = H(0.3, 0)
    hairBackEls.push(<ellipse key="hb" cx={f(hb[0])} cy={f(hb[1])} rx={f(R * 1.14)} ry={f(R * 1.2)} transform={rotH(hb)} fill={radial(hb, R * 1.1, hairTone)} />)
    if (top) {
      const sp = H(0.75, 0)
      hairBackEls.push(<ellipse key="spread" cx={f(sp[0])} cy={f(sp[1])} rx={f(R * 1.25)} ry={f(R * 1.45)} transform={rotH(sp)} fill={radial(sp, R * 1.3, hairTone)} />)
    }
    const t0 = top ? H(0.9, 0.5) : H(-0.5, 0.95)
    const t1 = top ? H(1.6, 1.8) : add(t0, add(mul(r, 1.8), mul(DOWN, 5.5)))
    const t2 = top ? H(2.0, 3.4) : add(t0, add(mul(r, 0.9), mul(DOWN, 13.5)))
    const tail = quadPts(t0, t1, t2)
    tailEls.push(<path key="tail" d={bandPath(tail, (t) => lerp(3.6, 1.5, t))} fill={grad(tail[5], perp(norm(sub(tail[6], tail[4]))), 1.8, hairTone)} />)
    for (const o of [-0.9, 0.1, 0.9]) {
      const s = tail.map((p, i) => add(p, mul(perp(norm(sub(tail[Math.min(10, i + 1)], tail[Math.max(0, i - 1)]))), o * (1 - i / 14))))
      tailEls.push(<path key={`s${o}`} d={smoothOpen(s)} fill="none" stroke={o > 0 ? hairTone.light : hairTone.deep} strokeWidth="0.35" opacity="0.55" />)
    }
    // rosto de frente (oval com queixo)
    const face = smoothClosed([H(1.0, 0), H(0.86, 0.56), H(0.46, 0.92), H(0.0, 0.98), H(-0.46, 0.86), H(-0.8, 0.52), H(-1.04, 0), H(-0.8, -0.52), H(-0.46, -0.86), H(0.0, -0.98), H(0.46, -0.92), H(0.86, -0.56)])
    headEls.push(<path key="face" d={face} fill={grad(h, r, R, SKIN)} />)
    headEls.push(<path key="facel" d={face} fill="none" stroke={SKIN.deep} strokeWidth="0.3" opacity="0.3" />)
    for (const s of [-1, 1]) {
      const e = H(0.02, s * 1.0)
      headEls.push(<ellipse key={`ear${s}`} cx={f(e[0])} cy={f(e[1])} rx={f(R * 0.16)} ry={f(R * 0.3)} transform={rotH(e)} fill={SKIN.shade} />)
      // sobrancelha, pálpebra, olho fechado, pestanas, blush
      headEls.push(<path key={`brow${s}`} d={bandPath(quadPts(H(0.34, s * 0.64), H(0.45, s * 0.4), H(0.36, s * 0.16), 6), (t) => lerp(0.22, 0.5, t))} fill={HAIR.shade} opacity="0.7" />)
      headEls.push(<ellipse key={`lid${s}`} cx={f(H(0.18, s * 0.4)[0])} cy={f(H(0.18, s * 0.4)[1])} rx={f(R * 0.24)} ry={f(R * 0.11)} transform={rotH(H(0.18, s * 0.4))} fill={SKIN.shade} opacity="0.32" />)
      headEls.push(<path key={`eye${s}`} d={smoothOpen([H(0.1, s * 0.62), H(-0.04, s * 0.42), H(0.1, s * 0.2)])} fill="none" stroke={INK} strokeWidth="0.5" strokeLinecap="round" />)
      headEls.push(<path key={`lash${s}`} d={`M ${pt(H(0.1, s * 0.62))} L ${pt(H(0.0, s * 0.74))}`} stroke={INK} strokeWidth="0.4" strokeLinecap="round" />)
      const bl = H(-0.26, s * 0.55)
      headEls.push(<ellipse key={`blush${s}`} cx={f(bl[0])} cy={f(bl[1])} rx={f(R * 0.3)} ry={f(R * 0.19)} transform={rotH(bl)} fill={BLUSH} opacity="0.22" />)
    }
    // nariz (sombra lateral e ponta), lábios
    headEls.push(<path key="nosesh" d={bandPath([H(0.1, 0.1), H(-0.3, 0.14)], (t) => lerp(0.45, 0.8, t))} fill={SKIN.shade} opacity="0.35" />)
    headEls.push(<ellipse key="nosetip" cx={f(H(-0.3, 0)[0])} cy={f(H(-0.3, 0)[1])} rx={f(R * 0.17)} ry={f(R * 0.12)} transform={rotH(H(-0.3, 0))} fill={SKIN.light} opacity="0.5" />)
    headEls.push(<circle key="nl" cx={f(H(-0.38, -0.15)[0])} cy={f(H(-0.38, -0.15)[1])} r="0.22" fill={SKIN.deep} opacity="0.55" />)
    headEls.push(<circle key="nr" cx={f(H(-0.38, 0.15)[0])} cy={f(H(-0.38, 0.15)[1])} r="0.22" fill={SKIN.deep} opacity="0.55" />)
    headEls.push(<ellipse key="lipu" cx={f(H(-0.58, 0)[0])} cy={f(H(-0.58, 0)[1])} rx={f(R * 0.27)} ry={f(R * 0.07)} transform={rotH(H(-0.58, 0))} fill={LIP} opacity="0.85" />)
    headEls.push(<ellipse key="lipd" cx={f(H(-0.68, 0)[0])} cy={f(H(-0.68, 0)[1])} rx={f(R * 0.24)} ry={f(R * 0.1)} transform={rotH(H(-0.68, 0))} fill={LIP} opacity="0.75" />)
    headEls.push(<path key="lipline" d={`M ${pt(H(-0.61, -0.27))} L ${pt(H(-0.61, 0.27))}`} stroke={SKIN.deep} strokeWidth="0.3" opacity="0.5" strokeLinecap="round" />)
    // cabelo da frente: dois lóbulos com risco ao meio e madeixas
    for (const s of [-1, 1]) {
      const lobe = smoothClosed([H(1.1, s * 0.03), H(1.02, s * 0.5), H(0.84, s * 0.86), H(0.56, s * 1.05), H(0.2, s * 1.04), H(0.0, s * 0.94), H(0.28, s * 0.76), H(0.5, s * 0.5), H(0.64, s * 0.22), H(0.62, s * 0.03)])
      headEls.push(<path key={`lobe${s}`} d={lobe} fill={grad(H(0.7, s * 0.5), r, R * 0.6, hairTone, s < 0)} />)
      headEls.push(<path key={`strand${s}`} d={smoothOpen([H(1.0, s * 0.2), H(0.78, s * 0.62), H(0.45, s * 0.92)])} fill="none" stroke={hairTone.deep} strokeWidth="0.35" opacity="0.5" strokeLinecap="round" />)
      headEls.push(<path key={`shine${s}`} d={smoothOpen([H(1.02, s * 0.36), H(0.85, s * 0.7), H(0.6, s * 0.95)])} fill="none" stroke={hairTone.light} strokeWidth="0.45" opacity="0.5" strokeLinecap="round" />)
    }
    headEls.push(<path key="part" d={`M ${pt(H(1.12, 0))} L ${pt(H(0.62, 0.02))}`} stroke={SKIN.shade} strokeWidth="0.35" opacity="0.5" strokeLinecap="round" />)
  }

  // pescoço
  const neckTop = H(-0.9, 0)
  const neckBottom = add(fig.neck, mul(uNeck, -1.6))

  // --- enquadramento, sombra e manchas ----------------------------------------
  const all: V[] = [h, fig.neck, fig.pelvis, ...fig.arms.flat(), ...fig.legs.flat()]
  const minX = Math.min(...all.map((p) => p[0])) - 3
  const maxX = Math.max(...all.map((p) => p[0])) + 3
  const minY = Math.min(...all.map((p) => p[1])) - 6
  const maxY = Math.max(...all.map((p) => p[1])) + 2
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2
  const washRx = Math.max(27, (maxX - minX) / 2 + 9)
  const washRy = Math.max(23, (maxY - minY) / 2 + 8)

  const splashes = Array.from({ length: 16 }, (_, i) => {
    const a = rand() * Math.PI * 2
    const rx = washRx * (0.75 + rand() * 0.55)
    const ry = washRy * (0.7 + rand() * 0.55)
    const x = Math.min(97, Math.max(3, cx + Math.cos(a) * rx))
    const y = Math.min(97, Math.max(3, cy + Math.sin(a) * ry))
    const rr = i < 10 ? 0.5 + rand() * 1.3 : 0.25 + rand() * 0.4
    return { x, y, r: rr, c: SPLASH[Math.floor(rand() * SPLASH.length)], o: 0.3 + rand() * 0.45 }
  })

  // --- composição ---------------------------------------------------------------
  const body: ReactElement[] = []
  body.push(...legs.filter((l) => l.far).map((l, i) => renderLeg(l.p, true, `fl${i}`)))
  body.push(...arms.filter((a) => a.far).map((a, i) => renderArm(a.p, true, `fa${i}`)))
  body.push(<g key="hairback">{hairBackEls}</g>)
  if (top) body.push(<g key="tailtop">{tailEls}</g>)
  body.push(...legs.filter((l) => !l.far).map((l, i) => renderLeg(l.p, false, `l${i}`)))
  // tronco: pele, leggings, top
  body.push(<path key="skin" d={torsoPart(0, 1)} fill={torsoFill(SKIN)} />)
  body.push(<path key="legs" d={torsoPart(0.7, 1)} fill={torsoFill(LEG)} />)
  body.push(<path key="band" d={torsoPart(0.7, 0.75)} fill={LEG.deep} opacity="0.35" />)
  body.push(<path key="top" d={torsoPart(0.09, 0.52)} fill={torsoFill(TOP)} />)
  body.push(<path key="topl" d={torsoPart(0.09, 0.52)} fill="none" stroke={TOP.deep} strokeWidth="0.35" opacity="0.4" />)
  if (!side) {
    // peito, alças e linha do decote
    for (const s of [-1, 1]) {
      const c = add(spine[5], mul(torsoN, s * 3.1))
      body.push(<ellipse key={`bust${s}`} cx={f(c[0])} cy={f(c[1])} rx="3.1" ry="2.5" transform={`rotate(${f(deg(torsoN))} ${f(c[0])} ${f(c[1])})`} fill={TOP.light} opacity="0.32" />)
      body.push(<path key={`bustsh${s}`} d={smoothOpen([add(spine[7], mul(torsoN, s * 5.2)), add(spine[8], mul(torsoN, s * 3.0)), add(spine[7], mul(torsoN, s * 0.8))])} fill="none" stroke={TOP.deep} strokeWidth="0.5" opacity="0.4" />)
      const sh = s > 0 ? shoulderL : shoulderR
      body.push(<path key={`strap${s}`} d={smoothOpen([add(spine[2], mul(torsoN, s * 5.6)), add(sh, mul(torsoDir, -0.8)), add(fig.neck, mul(torsoN, s * 2.4))])} fill="none" stroke={TOP.base} strokeWidth="1.5" strokeLinecap="round" />)
    }
    body.push(<path key="neckline" d={smoothOpen([add(spine[2], mul(torsoN, 5.2)), add(spine[3], mul(torsoN, 0)), add(spine[2], mul(torsoN, -5.2))])} fill="none" stroke={TOP.deep} strokeWidth="0.45" opacity="0.5" />)
  }
  // ombros (deltoides)
  for (const [k, sh] of [['sl', shoulderL], ['sr', shoulderR]] as const) {
    if (side && k === 'sr') continue
    const rx = side ? 2.6 : 3.3
    const ry = side ? 2.2 : 2.7
    body.push(<ellipse key={k} cx={f(sh[0])} cy={f(sh[1])} rx={rx} ry={ry} transform={`rotate(${f(deg(torsoN))} ${f(sh[0])} ${f(sh[1])})`} fill={radial(sh, 3, SKIN)} />)
  }
  // pescoço e cabeça
  body.push(segment(neckTop, neckBottom, 3.6, 4.4, 0, 0.5, SKIN, 'neck'))
  if (!top) body.push(<g key="tail">{tailEls}</g>)
  body.push(<g key="head">{headEls}</g>)
  body.push(...arms.filter((a) => !a.far).map((a, i) => renderArm(a.p, false, `a${i}`)))

  return (
    <svg viewBox="0 0 100 100" className={`wc-figure ${className ?? ''}`} role="img" aria-label={title ?? pose.nome}>
      {title && <title>{title}</title>}
      <defs>
        <filter id={`${uid}-edge`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed={seed} result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="1.4" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed={seed + 11} result="m" />
          <feColorMatrix in="m" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.3 0.84" result="mask" />
          <feComposite in="d" in2="mask" operator="in" />
        </filter>
        <filter id={`${uid}-wash`} x="-40%" y="-40%" width="180%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed={seed + 7} result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="16" xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="1.3" />
        </filter>
        <filter id={`${uid}-blur`} x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation="1.3" />
        </filter>
        <filter id={`${uid}-grain`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed={seed + 3} />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.28" />
          </feComponentTransfer>
        </filter>
        {defs}
      </defs>

      {/* manchas de fundo */}
      <ellipse cx={f(cx)} cy={f(cy + 2)} rx={f(washRx)} ry={f(washRy)} fill={wash} opacity="0.55" filter={`url(#${uid}-wash)`} />
      <ellipse cx={f(cx + washRx * 0.35)} cy={f(cy - washRy * 0.3)} rx={f(washRx * 0.55)} ry={f(washRy * 0.5)} fill={mixHex(wash2, '#fff', 0.6)} opacity="0.5" filter={`url(#${uid}-wash)`} />
      {top && <rect x="6" y="30" width="88" height="60" rx="4" fill={mixHex(LEG.base, '#fff', 0.75)} opacity="0.6" filter={`url(#${uid}-wash)`} />}

      {/* sombra no chão */}
      {!top && (
        <ellipse cx={f(cx)} cy={f(Math.min(maxY + 0.5, 91.5))} rx={f((maxX - minX) / 2 + 1)} ry="2.1" fill={SHADOW} opacity="0.24" filter={`url(#${uid}-blur)`} />
      )}

      <g filter={`url(#${uid}-edge)`} style={{ mixBlendMode: 'multiply' }}>
        {body}
      </g>

      {/* salpicos */}
      <g filter={`url(#${uid}-edge)`} style={{ mixBlendMode: 'multiply' }}>
        {splashes.map((s, i) => (
          <circle key={i} cx={f(s.x)} cy={f(s.y)} r={f(s.r)} fill={s.c} opacity={s.o} />
        ))}
      </g>

      {/* grão de papel */}
      {grain && <rect width="100" height="100" filter={`url(#${uid}-grain)`} opacity="0.32" style={{ mixBlendMode: 'multiply' }} />}
    </svg>
  )
}
