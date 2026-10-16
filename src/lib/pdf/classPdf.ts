import { jsPDF } from 'jspdf'
import { CATEGORY_MAP, LEVEL_LABEL } from '../../data/categories'
import { getPose } from '../../data/poses'
import type { ClassItem, ClassPhase, Pose, PoseFigure, Pt, YogaClass } from '../../data/types'
import { classDuration, classItemCount, formatDuration, formatDurationLong, phaseDuration } from '../utils'

// ---------------------------------------------------------------------------
// Geração do PDF de uma aula (A4, vertical). Tudo em milímetros.
// As figuras são desenhadas em vetor a partir das articulações (ver PoseFigure).
// ---------------------------------------------------------------------------

type RGB = [number, number, number]

const PAGE_W = 210
const PAGE_H = 297
const MARGIN = 14
const CONTENT_W = PAGE_W - 2 * MARGIN
const BOTTOM = PAGE_H - 16

const COLS = 4
const GAP = 4
const CARD_W = (CONTENT_W - GAP * (COLS - 1)) / COLS
const CARD_PAD = 2.5
const FIG = 24

const PRIMARY: RGB = [111, 146, 112]
const TEXT: RGB = [42, 39, 51]
const MUTED: RGB = [113, 108, 125]
const BORDER: RGB = [227, 220, 209]
const SURFACE2: RGB = [241, 236, 228]
const WHITE: RGB = [255, 255, 255]

const PT_MM = 0.352778
/** Altura de linha (mm) para um tamanho de letra em pontos. */
const lh = (pt: number, factor = 1.2) => pt * PT_MM * factor

function hexToRgb(hex: string): RGB {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function mix(a: RGB, b: RGB, t: number): RGB {
  return [Math.round(a[0] + (b[0] - a[0]) * t), Math.round(a[1] + (b[1] - a[1]) * t), Math.round(a[2] + (b[2] - a[2]) * t)]
}

const KEEP = new Set(['–', '—', '‘', '’', '“', '”', '•', '…', '€', '™'])
const REPLACE: Record<string, string> = { '→': '->', '←': '<-', '↔': '<->', '✓': 'v', '′': "'", '″': '"', ' ': ' ' }

/** Converte o texto para caracteres suportados pelas fontes base do PDF (WinAnsi). */
export function pdfSafe(text: string): string {
  let out = ''
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0
    if (code < 256 || KEEP.has(ch)) {
      out += ch
      continue
    }
    if (REPLACE[ch] !== undefined) {
      out += REPLACE[ch]
      continue
    }
    const base = ch.normalize('NFD').replace(/[̀-ͯ]/g, '')
    if (base && (base.codePointAt(0) ?? 999) < 256) out += base
  }
  return out
}

function clampLines(lines: string[], max: number): string[] {
  if (lines.length <= max) return lines
  const out = lines.slice(0, max)
  out[max - 1] = out[max - 1].replace(/\s*\S*$/, '') + '…'
  return out
}

function wrap(doc: jsPDF, text: string, width: number): string[] {
  return doc.splitTextToSize(pdfSafe(text), width) as string[]
}

// ---------------------------------------------------------------------------
// Figura
// ---------------------------------------------------------------------------

function torsoPoints(neck: Pt, pelvis: Pt, spine?: Pt): Pt[] {
  if (!spine) return [neck, pelvis]
  const cx = 2 * spine[0] - (neck[0] + pelvis[0]) / 2
  const cy = 2 * spine[1] - (neck[1] + pelvis[1]) / 2
  const pts: Pt[] = []
  const N = 12
  for (let i = 0; i <= N; i++) {
    const t = i / N
    const mt = 1 - t
    pts.push([mt * mt * neck[0] + 2 * mt * t * cx + t * t * pelvis[0], mt * mt * neck[1] + 2 * mt * t * cy + t * t * pelvis[1]])
  }
  return pts
}

function shift<T extends Pt[]>(points: T, dx: number, dy: number): T {
  return points.map(([x, y]) => [x + dx, y + dy]) as T
}

/** Desenha a figura esquemática num quadrado de lado `size` com canto superior esquerdo em (x, y). */
export function drawFigure(doc: jsPDF, fig: PoseFigure, x: number, y: number, size: number, color: RGB) {
  const s = size / 100
  const px = (p: Pt) => x + p[0] * s
  const py = (p: Pt) => y + p[1] * s
  const far = mix(color, WHITE, 0.6)

  doc.setLineCap('round')
  doc.setLineJoin('round')

  const stroke = (pts: Pt[], w: number, c: RGB) => {
    doc.setDrawColor(c[0], c[1], c[2])
    doc.setLineWidth(w)
    for (let i = 1; i < pts.length; i++) doc.line(px(pts[i - 1]), py(pts[i - 1]), px(pts[i]), py(pts[i]))
  }

  // chão / tapete
  if (fig.view === 'top') {
    const m = mix(color, WHITE, 0.92)
    doc.setFillColor(m[0], m[1], m[2])
    doc.roundedRect(x + 6 * s, y + 30 * s, 88 * s, 60 * s, 3 * s, 3 * s, 'F')
  } else {
    stroke([[6, 90.5], [94, 90.5]], 1.2 * s, mix(color, WHITE, 0.75))
  }

  const limbW = 4.2 * s
  const torsoW = 5 * s
  const arms = fig.arms.length === 1 && fig.view === 'side'
    ? [{ p: shift(fig.arms[0], -1.6, 1.4), far: true }, { p: fig.arms[0], far: false }]
    : fig.arms.map((p) => ({ p, far: false }))
  const legs = fig.legs.length === 1 && fig.view === 'side'
    ? [{ p: shift(fig.legs[0], -1.6, 1.4), far: true }, { p: fig.legs[0], far: false }]
    : fig.legs.map((p) => ({ p, far: false }))

  for (const l of legs) if (l.far) stroke(l.p, limbW, far)
  for (const a of arms) if (a.far) stroke(a.p, limbW, far)
  stroke(torsoPoints(fig.neck, fig.pelvis, fig.spine), torsoW, color)
  for (const l of legs) if (!l.far) stroke(l.p, limbW, color)
  doc.setFillColor(color[0], color[1], color[2])
  doc.circle(px(fig.head), py(fig.head), 5.5 * s, 'F')
  for (const a of arms) if (!a.far) stroke(a.p, limbW, color)
}

// ---------------------------------------------------------------------------
// Cartões de postura
// ---------------------------------------------------------------------------

interface CardLayout {
  pose: Pose
  item: ClassItem
  nameLines: string[]
  sansLines: string[]
  notesLines: string[]
  h: number
}

function layoutCard(doc: jsPDF, item: ClassItem): CardLayout | null {
  const pose = getPose(item.poseId)
  if (!pose) return null
  const inner = CARD_W - 2 * CARD_PAD

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  const nameLines = clampLines(wrap(doc, pose.nome, inner), 2)

  doc.setFont('helvetica', 'italic')
  doc.setFontSize(7.5)
  const sansLines = clampLines(wrap(doc, pose.sanscrito, inner), 2)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  const notesLines = item.notas?.trim() ? clampLines(wrap(doc, item.notas.trim(), inner), 3) : []

  const h =
    CARD_PAD +
    FIG +
    1.5 +
    nameLines.length * lh(8.5) +
    sansLines.length * lh(7.5) +
    1.5 +
    4.5 +
    (notesLines.length ? 1.5 + notesLines.length * lh(7) : 0) +
    CARD_PAD

  return { pose, item, nameLines, sansLines, notesLines, h }
}

/** Opções de geração: `imagens` mapeia id da postura → data URL (JPEG/PNG) da ilustração. */
export interface PdfOptions {
  imagens?: Record<string, string>
}

function drawCard(doc: jsPDF, c: CardLayout, x: number, y: number, h: number, opts: PdfOptions) {
  const color = hexToRgb(CATEGORY_MAP[c.pose.categorias[0]].cor)

  doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2])
  doc.setLineWidth(0.3)
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(x, y, CARD_W, h, 2, 2, 'FD')

  // faixa de cor da categoria
  doc.setDrawColor(color[0], color[1], color[2])
  doc.setLineWidth(1.2)
  doc.setLineCap('round')
  doc.line(x + 2.5, y + 0.9, x + CARD_W - 2.5, y + 0.9)

  // ilustração (aquarela) ou figura esquemática
  const fx = x + (CARD_W - FIG) / 2
  const fy = y + CARD_PAD + 0.5
  const img = opts.imagens?.[c.pose.id]
  if (img) {
    doc.addImage(img, img.startsWith('data:image/png') ? 'PNG' : 'JPEG', fx, fy, FIG, FIG)
  } else {
    doc.setFillColor(SURFACE2[0], SURFACE2[1], SURFACE2[2])
    doc.roundedRect(fx, fy, FIG, FIG, 1.5, 1.5, 'F')
    drawFigure(doc, c.pose.figura, fx, fy, FIG, color)
  }

  let ty = fy + FIG + 1.5
  const cx = x + CARD_W / 2

  doc.setTextColor(TEXT[0], TEXT[1], TEXT[2])
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  for (const l of c.nameLines) {
    doc.text(l, cx, ty, { align: 'center', baseline: 'top' })
    ty += lh(8.5)
  }

  doc.setTextColor(MUTED[0], MUTED[1], MUTED[2])
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(7.5)
  for (const l of c.sansLines) {
    doc.text(l, cx, ty, { align: 'center', baseline: 'top' })
    ty += lh(7.5)
  }

  ty += 1.5
  const pill = formatDuration(c.item.duracao) + (c.pose.bilateral ? '  ·  2 lados' : '')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  const pw = doc.getTextWidth(pill) + 5
  doc.setFillColor(SURFACE2[0], SURFACE2[1], SURFACE2[2])
  doc.roundedRect(cx - pw / 2, ty, pw, 4.5, 2.25, 2.25, 'F')
  doc.setTextColor(TEXT[0], TEXT[1], TEXT[2])
  doc.text(pill, cx, ty + 2.25, { align: 'center', baseline: 'middle' })
  ty += 4.5

  if (c.notesLines.length) {
    ty += 1.5
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2])
    for (const l of c.notesLines) {
      doc.text(l, x + CARD_PAD, ty, { baseline: 'top' })
      ty += lh(7)
    }
  }
}

// ---------------------------------------------------------------------------
// Barra cronológica
// ---------------------------------------------------------------------------

function drawTimeline(doc: jsPDF, aula: YogaClass, x: number, y: number, w: number, h: number) {
  const total = classDuration(aula)
  if (total === 0) {
    doc.setFillColor(SURFACE2[0], SURFACE2[1], SURFACE2[2])
    doc.roundedRect(x, y, w, h, h / 2, h / 2, 'F')
    return
  }
  let cx = x
  for (const f of aula.fases) {
    for (const it of f.itens) {
      const pose = getPose(it.poseId)
      const color = pose ? hexToRgb(CATEGORY_MAP[pose.categorias[0]].cor) : MUTED
      const sw = (it.duracao / total) * w
      doc.setFillColor(color[0], color[1], color[2])
      doc.rect(cx, y, Math.max(sw - 0.3, 0.2), h, 'F')
      cx += sw
    }
  }
}

// ---------------------------------------------------------------------------
// Documento
// ---------------------------------------------------------------------------

function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n))
  return out
}

export function buildClassPdf(aula: YogaClass, opts: PdfOptions = {}): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true })
  doc.setProperties({ title: aula.nome, subject: 'Plano de aula de Hatha Yoga', creator: 'Yoga Planner' })

  let y = MARGIN
  const ensure = (h: number) => {
    if (y + h > BOTTOM) {
      doc.addPage()
      y = MARGIN
    }
  }

  // --- Cabeçalho -----------------------------------------------------------
  doc.setTextColor(TEXT[0], TEXT[1], TEXT[2])
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  const titleLines = wrap(doc, aula.nome || 'Aula sem nome', CONTENT_W)
  for (const l of titleLines) {
    doc.text(l, MARGIN, y, { baseline: 'top' })
    y += lh(18, 1.15)
  }
  y += 1

  const total = classDuration(aula)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(MUTED[0], MUTED[1], MUTED[2])
  const meta = `${LEVEL_LABEL[aula.nivel]}   ·   ${formatDurationLong(total)} (alvo ${aula.duracaoAlvo} min)   ·   ${classItemCount(aula)} posturas`
  doc.text(pdfSafe(meta), MARGIN, y, { baseline: 'top' })
  y += lh(10) + 1.5

  if (aula.tema?.trim()) {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(TEXT[0], TEXT[1], TEXT[2])
    const label = 'Tema: '
    doc.text(label, MARGIN, y, { baseline: 'top' })
    const lw = doc.getTextWidth(label)
    doc.setFont('helvetica', 'normal')
    const lines = wrap(doc, aula.tema.trim(), CONTENT_W - lw)
    lines.forEach((l, i) => doc.text(l, MARGIN + lw, y + i * lh(10), { baseline: 'top' }))
    y += lines.length * lh(10) + 1
  }

  if (aula.descricao?.trim()) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.5)
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2])
    const lines = wrap(doc, aula.descricao.trim(), CONTENT_W)
    for (const l of lines) {
      doc.text(l, MARGIN, y, { baseline: 'top' })
      y += lh(9.5)
    }
    y += 1
  }

  y += 2
  drawTimeline(doc, aula, MARGIN, y, CONTENT_W, 3.5)
  y += 3.5 + 1.5

  const legenda = aula.fases
    .filter((f) => phaseDuration(f) > 0)
    .map((f) => `${f.nome} ${formatDuration(phaseDuration(f))}`)
    .join('   ·   ')
  if (legenda) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2])
    const lines = wrap(doc, legenda, CONTENT_W)
    for (const l of lines) {
      doc.text(l, MARGIN, y, { baseline: 'top' })
      y += lh(7.5)
    }
  }
  y += 5

  // --- Fases ---------------------------------------------------------------
  const HEAD_H = 9

  const drawPhase = (fase: ClassPhase, idx: number) => {
    const cards = fase.itens.map((it) => layoutCard(doc, it)).filter((c): c is CardLayout => c !== null)
    const rows = chunk(cards, COLS)
    const rowH = (row: CardLayout[]) => Math.max(...row.map((c) => c.h))

    doc.setFont('helvetica', 'italic')
    doc.setFontSize(9)
    const notesLines = fase.notas?.trim() ? wrap(doc, fase.notas.trim(), CONTENT_W) : []
    const notesH = notesLines.length ? notesLines.length * lh(9) + 2 : 0

    // evita um título órfão no fim da página
    ensure(HEAD_H + 1 + notesH + (rows.length ? rowH(rows[0]) : 0))

    doc.setFillColor(PRIMARY[0], PRIMARY[1], PRIMARY[2])
    doc.circle(MARGIN + 3.5, y + 3.5, 3.5, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text(String(idx + 1), MARGIN + 3.5, y + 3.6, { align: 'center', baseline: 'middle' })

    doc.setTextColor(TEXT[0], TEXT[1], TEXT[2])
    doc.setFontSize(13)
    doc.text(pdfSafe(fase.nome), MARGIN + 10, y + 3.6, { baseline: 'middle' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2])
    doc.text(formatDuration(phaseDuration(fase)), MARGIN + CONTENT_W, y + 3.6, { align: 'right', baseline: 'middle' })

    doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2])
    doc.setLineWidth(0.5)
    doc.setLineCap('butt')
    doc.line(MARGIN, y + 8.2, MARGIN + CONTENT_W, y + 8.2)
    y += HEAD_H + 1

    if (notesLines.length) {
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(9)
      doc.setTextColor(MUTED[0], MUTED[1], MUTED[2])
      for (const l of notesLines) {
        doc.text(l, MARGIN, y, { baseline: 'top' })
        y += lh(9)
      }
      y += 2
    }

    for (const row of rows) {
      const h = rowH(row)
      ensure(h)
      row.forEach((c, i) => drawCard(doc, c, MARGIN + i * (CARD_W + GAP), y, h, opts))
      y += h + GAP
    }
    y += 4
  }

  const fasesVisiveis = aula.fases.filter((f) => f.itens.length > 0 || f.notas?.trim())
  if (fasesVisiveis.length === 0) {
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(10)
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2])
    doc.text('Esta aula ainda não tem posturas.', MARGIN, y, { baseline: 'top' })
  } else {
    aula.fases.forEach((f, i) => {
      if (f.itens.length > 0 || f.notas?.trim()) drawPhase(f, i)
    })
  }

  // --- Rodapé em todas as páginas -----------------------------------------
  const n = doc.getNumberOfPages()
  const data = new Date().toLocaleDateString('pt-PT')
  for (let i = 1; i <= n; i++) {
    doc.setPage(i)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2])
    doc.text(pdfSafe(`Yoga Planner   ·   ${aula.nome}   ·   ${data}`), MARGIN, PAGE_H - 9, { baseline: 'top' })
    doc.text(`Página ${i} de ${n}`, PAGE_W - MARGIN, PAGE_H - 9, { align: 'right', baseline: 'top' })
  }

  return doc
}
