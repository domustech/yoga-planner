import { FileDown, Loader2 } from 'lucide-react'
import { useState } from 'react'
import type { YogaClass } from '../data/types'
import { exportClassPdf } from '../lib/exportPdf'

interface Props {
  aula: YogaClass
  /** "btn" = botão com texto; "icon" = só ícone. */
  variant?: 'btn' | 'icon'
  label?: string
  className?: string
}

export function ExportPdfButton({ aula, variant = 'btn', label = 'PDF', className = '' }: Props) {
  const [busy, setBusy] = useState(false)

  const run = async () => {
    if (busy) return
    setBusy(true)
    try {
      await exportClassPdf(aula)
    } catch (err) {
      console.error(err)
      window.alert('Não foi possível gerar o PDF. Tente novamente.')
    } finally {
      setBusy(false)
    }
  }

  const Icon = busy ? Loader2 : FileDown
  const title = 'Exportar PDF para imprimir ou partilhar'

  if (variant === 'icon') {
    return (
      <button type="button" className={`icon-btn ${className}`} title={title} onClick={run} disabled={busy} aria-label={title}>
        <Icon size={16} className={busy ? 'spin' : undefined} />
      </button>
    )
  }
  return (
    <button type="button" className={`btn ${className}`} title={title} onClick={run} disabled={busy}>
      <Icon size={16} className={busy ? 'spin' : undefined} /> {busy ? 'A gerar…' : label}
    </button>
  )
}
