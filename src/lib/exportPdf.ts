import type { YogaClass } from '../data/types'
import { slugify } from './utils'

export type ExportPdfResult = 'partilhado' | 'descarregado'

/** iPhone, iPad (incluindo iPadOS que se apresenta como Mac) e Android. */
function isMobileLike(): boolean {
  const ua = navigator.userAgent
  const iPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
  return /iPhone|iPad|iPod|Android/i.test(ua) || iPadOS
}

/**
 * Gera o PDF da aula e entrega-o ao utilizador:
 * - em telemóvel/tablet abre a folha de partilha do sistema (no iPhone inclui
 *   "Imprimir", "Guardar em Ficheiros", Mail, AirDrop…);
 * - noutros casos descarrega o ficheiro.
 * O gerador (jsPDF) é carregado apenas quando é preciso.
 */
export async function exportClassPdf(aula: YogaClass): Promise<ExportPdfResult> {
  // O PDF usa as figuras esquemáticas (vetor), como os cartões da aula.
  const { buildClassPdf } = await import('./pdf/classPdf')
  const doc = buildClassPdf(aula)
  const blob = doc.output('blob')
  const filename = `${slugify(aula.nome) || 'aula'}.pdf`

  if (isMobileLike() && typeof navigator.share === 'function') {
    const file = new File([blob], filename, { type: 'application/pdf' })
    const podePartilhar = typeof navigator.canShare !== 'function' || navigator.canShare({ files: [file] })
    if (podePartilhar) {
      try {
        await navigator.share({ files: [file], title: aula.nome })
        return 'partilhado'
      } catch (err) {
        // Cancelado pelo utilizador: não fazer mais nada. Outro erro: cair para o download.
        if ((err as Error).name === 'AbortError') return 'partilhado'
      }
    }
  }

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
  return 'descarregado'
}
