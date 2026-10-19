import type { PoseFigure, Pt } from '../data/types'

// ---------------------------------------------------------------------------
// Geometria partilhada pelas ilustrações geradas (aquarela e silhueta).
// ---------------------------------------------------------------------------

export type V = Pt

export interface Tone {
  base: string
  light: string
  shade: string
  deep: string
}

export const add = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1]]
export const sub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1]]
export const mul = (a: V, k: number): V => [a[0] * k, a[1] * k]
export const dot = (a: V, b: V) => a[0] * b[0] + a[1] * b[1]
export const len = (a: V) => Math.hypot(a[0], a[1])
export const norm = (a: V): V => {
  const l = len(a) || 1
  return [a[0] / l, a[1] / l]
}
export const perp = (a: V): V => [-a[1], a[0]]
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const f = (n: number) => n.toFixed(2)
export const pt = (p: V) => `${f(p[0])},${f(p[1])}`
export const deg = (v: V) => (Math.atan2(v[1], v[0]) * 180) / Math.PI
export const bump = (t: number, c: number, s: number) => Math.exp(-((t - c) ** 2) / (2 * s * s))

/** Luz vinda de cima à esquerda. */
export const LIGHT: V = [-0.6, -0.8]

export function hashStr(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function mulberry(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function mixHex(a: string, b: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(a)
  const [r2, g2, b2] = hexToRgb(b)
  const c = (x: number, y: number) => Math.round(x + (y - x) * t).toString(16).padStart(2, '0')
  return `#${c(r1, r2)}${c(g1, g2)}${c(b1, b2)}`
}

export const darker = (t: Tone): Tone => ({ base: t.shade, light: t.base, shade: t.deep, deep: t.deep })

/** Curva fechada suave (Catmull-Rom → Bézier) por uma lista de pontos. */
export function smoothClosed(p: V[], tension = 0.5): string {
  const n = p.length
  let d = `M ${pt(p[0])}`
  for (let i = 0; i < n; i++) {
    const p0 = p[(i - 1 + n) % n]
    const p1 = p[i]
    const p2 = p[(i + 1) % n]
    const p3 = p[(i + 2) % n]
    const c1 = add(p1, mul(sub(p2, p0), tension / 3))
    const c2 = sub(p2, mul(sub(p3, p1), tension / 3))
    d += ` C ${pt(c1)} ${pt(c2)} ${pt(p2)}`
  }
  return d + ' Z'
}

/** Curva aberta suave por uma lista de pontos. */
export function smoothOpen(p: V[], tension = 0.5): string {
  const n = p.length
  if (n < 2) return ''
  let d = `M ${pt(p[0])}`
  for (let i = 0; i < n - 1; i++) {
    const p0 = p[Math.max(0, i - 1)]
    const p1 = p[i]
    const p2 = p[i + 1]
    const p3 = p[Math.min(n - 1, i + 2)]
    const c1 = add(p1, mul(sub(p2, p0), tension / 3))
    const c2 = sub(p2, mul(sub(p3, p1), tension / 3))
    d += ` C ${pt(c1)} ${pt(c2)} ${pt(p2)}`
  }
  return d
}

export function quadPts(p0: V, p1: V, p2: V, n = 10): V[] {
  const pts: V[] = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const mt = 1 - t
    pts.push([mt * mt * p0[0] + 2 * mt * t * p1[0] + t * t * p2[0], mt * mt * p0[1] + 2 * mt * t * p1[1] + t * t * p2[1]])
  }
  return pts
}

/** Faixa fechada ao longo de uma polilinha com largura variável e pontas arredondadas. */
export function bandPath(pts: V[], width: (t: number) => number, roundEnds = true): string {
  const n = pts.length
  const L: V[] = []
  const R: V[] = []
  for (let i = 0; i < n; i++) {
    const t = n > 1 ? i / (n - 1) : 0
    const prev = pts[Math.max(0, i - 1)]
    const next = pts[Math.min(n - 1, i + 1)]
    const nv = perp(norm(sub(next, prev)))
    const w = width(t) / 2
    L.push(add(pts[i], mul(nv, w)))
    R.push(sub(pts[i], mul(nv, w)))
  }
  if (!roundEnds) return smoothClosed([...L, ...R.reverse()])
  const d0 = norm(sub(pts[0], pts[1]))
  const d1 = norm(sub(pts[n - 1], pts[n - 2]))
  const cap0 = add(pts[0], mul(d0, width(0) * 0.42))
  const cap1 = add(pts[n - 1], mul(d1, width(1) * 0.42))
  return smoothClosed([cap0, ...L, cap1, ...R.reverse()])
}

/** Segmento de membro com curva muscular. */
export function limbPath(a: V, b: V, w0: number, w1: number, bulge: number, tb: number): string {
  const N = 8
  const d = norm(sub(b, a))
  const L = len(sub(b, a))
  const pts: V[] = []
  for (let i = 0; i <= N; i++) pts.push(add(a, mul(d, (L * i) / N)))
  return bandPath(pts, (t) => lerp(w0, w1, t) + bulge * bump(t, tb, 0.18))
}

/**
 * Membro inteiro (ex.: ombro → cotovelo → pulso) como uma única forma contínua,
 * sem costuras nas articulações. `widths` dá a largura em cada articulação e
 * `bulges` a curva muscular de cada segmento ([amplitude, posição]).
 */
export function limbPathMulti(joints: V[], widths: number[], bulges: [number, number][]): string {
  const S = 7
  const pts: V[] = []
  const ws: number[] = []
  for (let s = 0; s < joints.length - 1; s++) {
    const a = joints[s]
    const b = joints[s + 1]
    for (let i = s === 0 ? 0 : 1; i <= S; i++) {
      const t = i / S
      pts.push(add(a, mul(sub(b, a), t)))
      const [amp, pos] = bulges[s] ?? [0, 0.5]
      ws.push(lerp(widths[s], widths[s + 1], t) + amp * bump(t, pos, 0.18))
    }
  }
  const n = pts.length
  return bandPath(pts, (t) => ws[Math.min(n - 1, Math.round(t * (n - 1)))])
}

/** Pontos ao longo da coluna (curva quadrática se houver `spine`). */
export function spineSamples(neck: V, pelvis: V, spine: V | undefined, n: number): V[] {
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

/** Interpolação linear numa tabela [[t, valor], ...]. */
export function prof(table: [number, number][], t: number): number {
  if (t <= table[0][0]) return table[0][1]
  for (let i = 1; i < table.length; i++) {
    if (t <= table[i][0]) {
      const [t0, v0] = table[i - 1]
      const [t1, v1] = table[i]
      return lerp(v0, v1, (t - t0) / (t1 - t0))
    }
  }
  return table[table.length - 1][1]
}

/** Correções manuais da orientação (1 = frente para a direita, -1 = para a esquerda). */
export const FACING_OVERRIDE: Record<string, 1 | -1> = {
  ustrasana: -1,
  sarvangasana: 1,
  halasana: -1,
  sirsasana: -1,
  'adho-mukha-vrksasana': -1,
  'pincha-mayurasana': -1,
  matsyasana: -1,
  'setu-bandhasana': -1,
  'viparita-karani': -1,
}

/** Para onde a frente do corpo está virada (vista lateral): 1 = direita, -1 = esquerda. */
export function facingOf(fig: PoseFigure, id: string): 1 | -1 {
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

export function shift<T extends V[]>(points: T, dx: number, dy: number): T {
  return points.map(([x, y]) => [x + dx, y + dy]) as T
}

/** Eixo da cabeça e direção da frente do rosto (perfil), a partir do esqueleto. */
export function headFrame(fig: PoseFigure, h: V, facing: 1 | -1): { u: V; uNeck: V; front?: V } {
  const side = fig.view === 'side'
  const uNeck = norm(sub(h, fig.neck))
  const torsoHorizontal = Math.abs(fig.neck[0] - fig.pelvis[0]) > Math.abs(fig.neck[1] - fig.pelvis[1])
  let u = uNeck
  if (side && uNeck[1] < 0.3) u = torsoHorizontal ? norm([-facing * 0.3, -1]) : norm(add(uNeck, [0, -0.45]))
  let front: V | undefined
  if (side) {
    const horiz: V = [facing, 0]
    const c1 = perp(u)
    const c2 = mul(c1, -1)
    const s1 = dot(c1, horiz)
    const s2 = dot(c2, horiz)
    if (Math.abs(s1 - s2) > 0.35) front = s1 > s2 ? c1 : c2
    else {
      const pref: V = u[1] > 0.3 ? [0, 1] : [0, -1]
      front = dot(c1, pref) > dot(c2, pref) ? c1 : c2
    }
  }
  return { u, uNeck, front }
}
