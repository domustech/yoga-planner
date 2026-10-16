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
/** Converte uma ilustração (WebP) num data URL JPEG, para a embeber no PDF. */
function imagemParaDataUrl(url: string, tamanho = 360): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = tamanho
        canvas.height = tamanho
        const ctx = canvas.getContext('2d')
        if (!ctx) return resolve(null)
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, tamanho, tamanho)
        ctx.drawImage(img, 0, 0, tamanho, tamanho)
        resolve(canvas.toDataURL('image/jpeg', 0.86))
      } catch {
        resolve(null)
      }
    }
    img.onerror = () => resolve(null)
    img.src = url
  })
}

/** Carrega as ilustrações existentes das posturas usadas na aula. */
async function carregarIlustracoes(aula: YogaClass): Promise<Record<string, string>> {
  const { poseImageUrl } = await import('../components/PoseVisual')
  const ids = [...new Set(aula.fases.flatMap((f) => f.itens.map((it) => it.poseId)))]
  const pares = await Promise.all(
    ids.map(async (id) => {
      const url = poseImageUrl(id)
      if (!url) return null
      const data = await imagemParaDataUrl(url)
      return data ? ([id, data] as const) : null
    }),
  )
  return Object.fromEntries(pares.filter((p): p is readonly [string, string] => p !== null))
}

export async function exportClassPdf(aula: YogaClass): Promise<ExportPdfResult> {
  const [{ buildClassPdf }, imagens] = await Promise.all([import('./pdf/classPdf'), carregarIlustracoes(aula)])
  const doc = buildClassPdf(aula, { imagens })
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
