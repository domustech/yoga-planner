import type { ClassPhase, YogaClass } from '../data/types'

export function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

/** Formata segundos como m:ss (ex.: 90 → "1:30"). */
export function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.round(seconds))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${r.toString().padStart(2, '0')}`
}

/** Formata segundos de forma legível (ex.: 3900 → "1h 05min", 150 → "2min 30s"). */
export function formatDurationLong(seconds: number): string {
  const s = Math.max(0, Math.round(seconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const r = s % 60
  if (h > 0) return `${h}h ${m.toString().padStart(2, '0')}min`
  if (m > 0) return r > 0 ? `${m}min ${r}s` : `${m}min`
  return `${r}s`
}

/** Converte "m:ss" ou "mm" em segundos. Devolve null se inválido. */
export function parseDuration(text: string): number | null {
  const t = text.trim()
  if (!t) return null
  if (/^\d+$/.test(t)) return parseInt(t, 10) * 60
  const m = t.match(/^(\d+)[:.](\d{1,2})$/)
  if (!m) return null
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10)
}

export function phaseDuration(fase: ClassPhase): number {
  return fase.itens.reduce((acc, it) => acc + it.duracao, 0)
}

export function classDuration(aula: YogaClass): number {
  return aula.fases.reduce((acc, f) => acc + phaseDuration(f), 0)
}

export function classItemCount(aula: YogaClass): number {
  return aula.fases.reduce((acc, f) => acc + f.itens.length, 0)
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return iso
  }
}

export function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
