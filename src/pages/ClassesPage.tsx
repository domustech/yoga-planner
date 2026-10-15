import { Copy, Download, FilePlus2, Layers, Plus, Trash2, Upload } from 'lucide-react'
import { useRef, type ChangeEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ClassTimeline } from '../components/ClassTimeline'
import { LEVEL_LABEL } from '../data/categories'
import type { YogaClass } from '../data/types'
import { classDuration, classItemCount, downloadJson, formatDate, formatDurationLong, slugify } from '../lib/utils'
import { useClassStore } from '../store/useClassStore'

export function ClassesPage() {
  const aulas = useClassStore((s) => s.aulas)
  const criarAula = useClassStore((s) => s.criarAula)
  const duplicarAula = useClassStore((s) => s.duplicarAula)
  const apagarAula = useClassStore((s) => s.apagarAula)
  const importarAula = useClassStore((s) => s.importarAula)
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)

  const novaAula = () => {
    const id = criarAula()
    navigate(`/aula/${id}`)
  }

  const onImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const data = JSON.parse(await file.text()) as unknown
      const lista = Array.isArray(data) ? data : [data]
      let n = 0
      for (const a of lista) {
        const aula = a as Partial<YogaClass>
        if (!aula || typeof aula !== 'object' || !Array.isArray(aula.fases) || typeof aula.nome !== 'string') {
          throw new Error('o ficheiro não contém uma aula válida')
        }
        importarAula({
          ...aula,
          nivel: aula.nivel ?? 'iniciante',
          duracaoAlvo: aula.duracaoAlvo ?? 60,
        } as YogaClass)
        n++
      }
      window.alert(n === 1 ? 'Aula importada.' : `${n} aulas importadas.`)
    } catch (err) {
      window.alert(`Não foi possível importar: ${(err as Error).message}`)
    }
  }

  const ordenadas = [...aulas].sort((a, b) => b.atualizadoEm.localeCompare(a.atualizadoEm))

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>As minhas aulas</h1>
          <p className="muted">Planeie e organize as suas aulas de Hatha Yoga, fase a fase.</p>
        </div>
        <div className="page-actions">
          <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
            <Upload size={16} /> Importar
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={onImport} />
          <button type="button" className="btn primary" onClick={novaAula}>
            <Plus size={16} /> Nova aula
          </button>
        </div>
      </header>

      {ordenadas.length === 0 ? (
        <div className="empty">
          <FilePlus2 size={36} />
          <h2>Ainda não tem aulas</h2>
          <p>Crie a sua primeira aula: ela começa com a estrutura clássica de uma aula de Hatha Yoga.</p>
          <button type="button" className="btn primary" onClick={novaAula}>
            <Plus size={16} /> Criar aula
          </button>
        </div>
      ) : (
        <div className="class-grid">
          {ordenadas.map((aula) => {
            const total = classDuration(aula)
            return (
              <article key={aula.id} className="class-card">
                <div className="class-card-head">
                  <h2>
                    <Link to={`/aula/${aula.id}`}>{aula.nome || 'Aula sem nome'}</Link>
                  </h2>
                  <span className={`level level-${aula.nivel}`}>{LEVEL_LABEL[aula.nivel]}</span>
                </div>
                {aula.tema && <p className="class-card-theme">{aula.tema}</p>}
                <ClassTimeline aula={aula} />
                <div className="class-card-meta">
                  <span>
                    <strong>{formatDurationLong(total)}</strong> <span className="muted">/ {aula.duracaoAlvo} min</span>
                  </span>
                  <span>
                    <Layers size={13} /> {classItemCount(aula)} posturas
                  </span>
                  <span className="muted">atualizada {formatDate(aula.atualizadoEm)}</span>
                </div>
                <div className="class-card-actions">
                  <Link to={`/aula/${aula.id}`} className="btn primary">
                    Abrir
                  </Link>
                  <button
                    type="button"
                    className="icon-btn"
                    title="Duplicar"
                    onClick={() => {
                      const nid = duplicarAula(aula.id)
                      if (nid) navigate(`/aula/${nid}`)
                    }}
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    title="Exportar (JSON)"
                    onClick={() => downloadJson(`${slugify(aula.nome) || 'aula'}.json`, aula)}
                  >
                    <Download size={16} />
                  </button>
                  <button
                    type="button"
                    className="icon-btn danger"
                    title="Apagar"
                    onClick={() => {
                      if (window.confirm(`Apagar a aula "${aula.nome}"? Esta ação não pode ser anulada.`)) apagarAula(aula.id)
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
