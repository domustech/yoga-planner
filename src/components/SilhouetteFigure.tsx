import { useId, type ReactElement } from 'react'
import type { Pose } from '../data/types'
import {
  add,
  bandPath,
  bump,
  deg,
  dot,
  f,
  facingOf,
  hashStr,
  headFrame,
  limbPath,
  limbPathMulti,
  mul,
  norm,
  perp,
  prof,
  quadPts,
  shift,
  smoothClosed,
  spineSamples,
  sub,
  type Tone,
  type V,
} from '../lib/figureGeometry'

// ---------------------------------------------------------------------------
// Figura realista monocromática (estilo "poster de asanas"): corpo com
// proporções humanas numa só cor terracota, sem rosto nem roupa, cabelo em
// coque. O volume é calculado por iluminação: a silhueta serve de mapa de
// altura (desfocado) e recebe luz difusa e especular de cima à esquerda, o
// que dá sombreado contínuo e sem costuras entre membros e tronco.
// Fundo branco. ViewBox fixo 0 0 100 100.
// ---------------------------------------------------------------------------

const TERRA: Tone = { base: '#c0744a', light: '#e2a781', shade: '#9b5631', deep: '#6b381d' }

interface Props {
  pose: Pose
  className?: string
  title?: string
  tone?: Tone
}

export function SilhouetteFigure({ pose, className, title, tone = TERRA }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const fig = pose.figura
  const facing = facingOf(fig, pose.id)
  const side = fig.view === 'side'
  const top = fig.view === 'top'
  void hashStr

  // --- membros ------------------------------------------------------------------
  const limb = (joints: V[], widths: number[], bulges: [number, number][], key: string) => (
    <path key={key} d={limbPathMulti(joints, widths, bulges)} fill={tone.base} />
  )

  const hand = (wrist: V, dir: V, key: string) => {
    const n = perp(dir)
    const P = (x: number, y: number): V => add(wrist, add(mul(dir, x), mul(n, y)))
    const palm = smoothClosed([P(0.0, 1.3), P(1.5, 1.55), P(2.7, 1.0), P(2.9, -0.6), P(2.2, -1.4), P(0.6, -1.3), P(-0.3, -0.5)])
    const fingers = [
      [0.95, 2.0],
      [0.33, 2.35],
      [-0.3, 2.2],
      [-0.9, 1.75],
    ].map(([o, L], i) => {
      const base = P(2.5, o)
      const tip = add(base, add(mul(dir, L), mul(n, o * 0.2)))
      const mid = add(base, add(mul(dir, L * 0.55), mul(n, o * 0.08 - 0.12)))
      return <path key={i} d={bandPath(quadPts(base, mid, tip, 6), (s) => 0.9 - 0.32 * s)} fill={tone.base} />
    })
    const thumb = bandPath(quadPts(P(1.0, 1.3), P(1.9, 2.3), P(2.7, 2.6), 6), (s) => 1.05 - 0.4 * s)
    return (
      <g key={key}>
        <path d={palm} fill={tone.base} />
        <path d={thumb} fill={tone.base} />
        {fingers}
      </g>
    )
  }

  const foot = (ankle: V, toe: V, key: string) => {
    const d = norm(sub(toe, ankle))
    const n = perp(d)
    const heel = sub(ankle, mul(d, 0.9))
    const toes = [-1.05, -0.2, 0.65].map((o, i) => {
      const c = add(toe, add(mul(d, 0.55 + Math.abs(o) * 0.1), mul(n, o * 0.95)))
      return <circle key={i} cx={f(c[0])} cy={f(c[1])} r={f(0.85 - Math.abs(o) * 0.14)} fill={tone.base} />
    })
    return (
      <g key={key}>
        <circle cx={f(heel[0])} cy={f(heel[1])} r="1.95" fill={tone.base} />
        <path d={limbPath(ankle, toe, 3.9, 3.0, 0, 0.5)} fill={tone.base} />
        {toes}
      </g>
    )
  }

  const arms = fig.arms.length === 1 && side ? [{ p: shift(fig.arms[0], -1.6, 1.4), far: true }, { p: fig.arms[0], far: false }] : fig.arms.map((p) => ({ p, far: false }))
  const legs = fig.legs.length === 1 && side ? [{ p: shift(fig.legs[0], -1.6, 1.4), far: true }, { p: fig.legs[0], far: false }] : fig.legs.map((p) => ({ p, far: false }))

  const renderArm = (p: V[], isFar: boolean, key: string) => {
    const k = isFar ? 0.92 : 1
    return (
      <g key={key}>
        {limb([p[0], p[1], p[2]], [6.0 * k, 4.3 * k, 2.9 * k], [[0.9 * k, 0.42], [0.8 * k, 0.28]], 'arm')}
        {hand(p[2], norm(sub(p[2], p[1])), 'h')}
      </g>
    )
  }
  const renderLeg = (p: V[], isFar: boolean, key: string) => {
    const k = isFar ? 0.92 : 1
    return (
      <g key={key}>
        {limb([p[0], p[1], p[2]], [9.4 * k, 5.8 * k, 3.4 * k], [[0.6 * k, 0.3], [1.5 * k, 0.32]], 'leg')}
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
  const shoulderL = add(fig.neck, mul(torsoN, side ? 1.2 : 6.6))
  const shoulderR = sub(fig.neck, mul(torsoN, side ? 1.2 : 6.6))

  // --- cabeça --------------------------------------------------------------------
  const R = 4.7
  const h = add(fig.head, mul(norm(sub(fig.neck, fig.head)), 1.1))
  const { u, uNeck, front } = headFrame(fig, h, facing)
  const r = perp(u)
  const H = (a: number, b: number): V => add(h, add(mul(u, a * R), mul(side && front ? front : r, b * R)))
  const head = side && front
    ? smoothClosed([
        H(1.0, 0.08), H(0.8, 0.66), H(0.5, 0.92), H(0.28, 0.9), H(0.1, 1.08), H(0.0, 1.22), H(-0.1, 1.02), H(-0.26, 0.98),
        H(-0.4, 1.02), H(-0.56, 0.92), H(-0.8, 0.68), H(-0.98, 0.3), H(-0.9, -0.25), H(-0.55, -0.78), H(-0.05, -1.0), H(0.5, -0.88), H(0.86, -0.5),
      ])
    : smoothClosed([H(1.0, 0), H(0.86, 0.56), H(0.46, 0.92), H(0.0, 0.98), H(-0.46, 0.86), H(-0.8, 0.52), H(-1.04, 0), H(-0.8, -0.52), H(-0.46, -0.86), H(0.0, -0.98), H(0.46, -0.92), H(0.86, -0.56)])
  const hairMass = side && front ? H(0.3, -0.25) : H(0.3, 0)
  const bun = side && front ? H(0.78, -0.78) : top ? H(1.15, 0.2) : H(1.12, 0.35)
  const neckTop = H(-0.9, 0)
  const neckBottom = add(fig.neck, mul(uNeck, -1.6))

  const farEls: ReactElement[] = []
  farEls.push(...legs.filter((l) => l.far).map((l, i) => renderLeg(l.p, true, `fl${i}`)))
  farEls.push(...arms.filter((a) => a.far).map((a, i) => renderArm(a.p, true, `fa${i}`)))

  const body: ReactElement[] = []
  body.push(<ellipse key="hair" cx={f(hairMass[0])} cy={f(hairMass[1])} rx={f(R * 1.08)} ry={f(R * 1.16)} transform={`rotate(${f(deg(r))} ${f(hairMass[0])} ${f(hairMass[1])})`} fill={tone.base} />)
  body.push(<circle key="bun" cx={f(bun[0])} cy={f(bun[1])} r={f(R * 0.6)} fill={tone.base} />)
  body.push(...legs.filter((l) => !l.far).map((l, i) => renderLeg(l.p, false, `l${i}`)))
  body.push(<path key="torso" d={torso} fill={tone.base} />)
  for (const [k, sh] of [['sl', shoulderL], ['sr', shoulderR]] as const) {
    if (side && k === 'sr') continue
    body.push(<ellipse key={k} cx={f(sh[0])} cy={f(sh[1])} rx={side ? 2.6 : 3.3} ry={side ? 2.2 : 2.7} transform={`rotate(${f(deg(torsoN))} ${f(sh[0])} ${f(sh[1])})`} fill={tone.base} />)
  }
  body.push(<path key="neck" d={limbPath(neckTop, neckBottom, 3.6, 4.4, 0, 0.5)} fill={tone.base} />)
  body.push(<path key="head" d={head} fill={tone.base} />)
  body.push(...arms.filter((a) => !a.far).map((a, i) => renderArm(a.p, false, `a${i}`)))

  // sombra de contacto no chão
  const all: V[] = [h, fig.neck, fig.pelvis, ...fig.arms.flat(), ...fig.legs.flat()]
  const minX = Math.min(...all.map((p) => p[0]))
  const maxX = Math.max(...all.map((p) => p[0]))
  const maxY = Math.max(...all.map((p) => p[1]))

  const relief = (id: string, color: string, depth: number) => (
    <filter id={id} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
      <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="hm" />
      <feDiffuseLighting in="hm" surfaceScale={depth} diffuseConstant="1.05" lightingColor="#ffffff" result="diff">
        <feDistantLight azimuth="225" elevation="52" />
      </feDiffuseLighting>
      <feFlood floodColor={color} result="col" />
      <feComposite in="col" in2="diff" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" result="lit" />
      <feSpecularLighting in="hm" surfaceScale={depth} specularConstant="0.5" specularExponent="24" lightingColor="#fff1e4" result="spec">
        <feDistantLight azimuth="225" elevation="52" />
      </feSpecularLighting>
      <feComposite in="lit" in2="spec" operator="arithmetic" k1="0" k2="1" k3="0.8" k4="0" result="shaded" />
      <feComposite in="shaded" in2="SourceAlpha" operator="in" result="bodyLit" />
      <feMorphology in="SourceAlpha" operator="erode" radius="0.3" result="er" />
      <feComposite in="SourceAlpha" in2="er" operator="out" result="rimA" />
      <feFlood floodColor={tone.deep} floodOpacity="0.45" result="df" />
      <feComposite in="df" in2="rimA" operator="in" result="rim" />
      <feMerge>
        <feMergeNode in="bodyLit" />
        <feMergeNode in="rim" />
      </feMerge>
    </filter>
  )

  return (
    <svg viewBox="0 0 100 100" className={`wc-figure sil-figure ${className ?? ''}`} role="img" aria-label={title ?? pose.nome}>
      {title && <title>{title}</title>}
      <defs>
        {relief(`${uid}-near`, tone.base, 9)}
        {relief(`${uid}-far`, tone.shade, 7)}
        <filter id={`${uid}-blur`} x="-30%" y="-80%" width="160%" height="260%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
      </defs>
      {!top && (
        <ellipse cx={f((minX + maxX) / 2)} cy={f(Math.min(maxY + 1.2, 92))} rx={f((maxX - minX) / 2 + 1)} ry="1.6" fill="#7a6a60" opacity="0.18" filter={`url(#${uid}-blur)`} />
      )}
      {farEls.length > 0 && <g filter={`url(#${uid}-far)`}>{farEls}</g>}
      <g filter={`url(#${uid}-near)`}>{body}</g>
    </svg>
  )
}
