import { BookOpen, Search } from 'lucide-react'
import type { CSSProperties } from 'react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { normalizeText } from '../components/LibraryPanel'
import { EFEITO_MAP } from '../data/categories'
import { CHAKRAS, CHAKRA_MAP } from '../data/chakras'
import { CAMINHOS, GLOSSARIO, MEDITACOES, OITO_MEMBROS, SUTRAS, VEDANTA } from '../data/conhecimento'
import { POSES } from '../data/poses'

const SECCOES = [
  { id: 'caminhos', nome: 'Caminhos do Yoga' },
  { id: 'patanjali', nome: 'Patanjali' },
  { id: 'vedanta', nome: 'Vedanta' },
  { id: 'chakras', nome: 'Chakras' },
  { id: 'meditacoes', nome: 'Meditações' },
  { id: 'glossario', nome: 'Glossário' },
]

/**
 * Página "Saber": conhecimento de apoio para preparar meditações e conversas
 * com alunos (Yoga Sutras, Vedanta, chakras, roteiros, glossário).
 */
export function KnowledgePage() {
  const [q, setQ] = useState('')
  const nq = normalizeText(q.trim())
  const match = (...campos: string[]) => !nq || campos.some((c) => normalizeText(c).includes(nq))

  const caminhos = CAMINHOS.filter((c) => match(c.nome, c.sanscrito, c.descricao, c.naAula))
  const membros = OITO_MEMBROS.filter((m) => match(m.nome, m.traducao, m.descricao, m.naAula))
  const sutras = SUTRAS.filter((s) => match(s.ref, s.texto, s.traducao, s.comentario))
  const vedanta = VEDANTA.filter((e) => match(e.titulo, e.resumo, ...e.pontos, e.naAula ?? ''))
  const chakras = CHAKRAS.filter((c) => match(c.nome, c.nomePT, c.qualidades, c.desequilibrio, c.praticas, c.reflexao))
  const meditacoes = MEDITACOES.filter((m) => match(m.nome, m.objetivo, ...m.roteiro))
  const glossario = GLOSSARIO.filter((t) => match(t.termo, t.significado))

  /** Posturas e práticas por chakra (para ligar o conhecimento à biblioteca). */
  const porChakra = useMemo(() => {
    const map: Record<string, { nome: string; tipo: string }[]> = {}
    for (const p of POSES) {
      const principal = p.chakras?.[0]
      if (!principal) continue
      ;(map[principal] ??= []).push({ nome: p.nome, tipo: p.tipo })
    }
    return map
  }, [])

  const vazio =
    caminhos.length + membros.length + sutras.length + vedanta.length + chakras.length + meditacoes.length + glossario.length === 0

  return (
    <div className="page page-knowledge">
      <header className="page-header">
        <div>
          <h1>
            <BookOpen size={24} /> Saber
          </h1>
          <p className="muted">
            Conhecimento de apoio para preparar meditações e conversar com os alunos: os caminhos do Yoga, os Yoga Sutras de
            Patanjali, o Vedanta, os chakras, roteiros de meditação e um glossário.
          </p>
        </div>
        <label className="search knowledge-search">
          <Search size={16} />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pesquisar em todo o Saber…" />
        </label>
      </header>

      <nav className="knowledge-nav" aria-label="Secções">
        {SECCOES.map((s) => (
          <a key={s.id} href={`#${s.id}`}>
            {s.nome}
          </a>
        ))}
      </nav>

      {vazio && <p className="muted empty">Nada encontrado para «{q}».</p>}

      {caminhos.length > 0 && (
        <section id="caminhos" className="knowledge-section">
          <h2>Caminhos do Yoga</h2>
          <p className="muted">Os nomes do Yoga: cada caminho (marga) acentua uma porta de entrada, e todos se encontram no mesmo fim.</p>
          <div className="knowledge-grid">
            {caminhos.map((c) => (
              <article key={c.nome} className="knowledge-card">
                <h3>
                  {c.nome} <em>{c.sanscrito}</em>
                </h3>
                <p>{c.descricao}</p>
                <p className="na-aula">
                  <strong>Na aula:</strong> {c.naAula}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      {(membros.length > 0 || sutras.length > 0) && (
        <section id="patanjali" className="knowledge-section">
          <h2>Yoga Sutras de Patanjali</h2>
          <p className="muted">
            Os 195 sutras (c. séc. II a.C.–IV d.C.) são o texto de referência do Raja Yoga. Aqui ficam os oito membros e os
            sutras mais úteis para a aula.
          </p>
          {membros.length > 0 && (
            <>
              <h3 className="knowledge-subtitle">Os oito membros (Ashtanga)</h3>
              <ol className="membros">
                {membros.map((m) => (
                  <li key={m.n} value={m.n}>
                    <div className="membro-head">
                      <strong>{m.nome}</strong> <em>{m.sanscrito}</em> <span className="muted">· {m.traducao}</span>
                    </div>
                    <p>{m.descricao}</p>
                    <p className="na-aula">
                      <strong>Na aula:</strong> {m.naAula}
                    </p>
                  </li>
                ))}
              </ol>
            </>
          )}
          {sutras.length > 0 && (
            <>
              <h3 className="knowledge-subtitle">Sutras essenciais</h3>
              <div className="sutras">
                {sutras.map((s) => (
                  <article key={s.ref} className="sutra">
                    <span className="sutra-ref">{s.ref}</span>
                    <div>
                      <p className="sutra-texto">{s.texto}</p>
                      <p className="sutra-trad">«{s.traducao}»</p>
                      <p className="muted">{s.comentario}</p>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {vedanta.length > 0 && (
        <section id="vedanta" className="knowledge-section">
          <h2>Vedanta: conhecimento básico</h2>
          <p className="muted">
            Na linha de ensino de Swami Dayananda Saraswati (Arsha Vidya): o Vedanta como meio de conhecimento sobre quem somos,
            em linguagem simples. Cada tema termina com uma frase para usar em aula.
          </p>
          <div className="knowledge-grid">
            {vedanta.map((e) => (
              <article key={e.titulo} className="knowledge-card">
                <h3>{e.titulo}</h3>
                <p>{e.resumo}</p>
                <ul>
                  {e.pontos.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                {e.naAula && (
                  <p className="na-aula">
                    <strong>Na aula:</strong> {e.naAula}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {chakras.length > 0 && (
        <section id="chakras" className="knowledge-section">
          <h2>Chakras</h2>
          <p className="muted">
            Os sete centros energéticos, com as práticas da biblioteca que os trabalham. Na{' '}
            <Link to="/biblioteca">Biblioteca</Link> pode filtrar por chakra e por efeito (calmante, energizante, equilibrante).
          </p>
          <div className="chakra-list">
            {chakras.map((c) => {
              const praticas = porChakra[c.id] ?? []
              return (
                <article key={c.id} className="chakra-card" style={{ '--ch': c.cor } as CSSProperties}>
                  <div className="chakra-card-head">
                    <span className="chakra-badge">{c.ordem}</span>
                    <div>
                      <h3>
                        {c.nome} <em>{c.nomePT}</em>
                      </h3>
                      <span className="muted">
                        {c.localizacao} · {c.elemento} · bija {c.bija}
                      </span>
                    </div>
                  </div>
                  <p>
                    <strong>Equilibrado:</strong> {c.qualidades}
                  </p>
                  <p>
                    <strong>Desequilíbrio:</strong> {c.desequilibrio}
                  </p>
                  <p>
                    <strong>Práticas:</strong> {c.praticas}
                  </p>
                  <p className="na-aula">
                    <strong>Reflexão:</strong> {c.reflexao}
                  </p>
                  {praticas.length > 0 && (
                    <details>
                      <summary>
                        {praticas.length} itens da biblioteca com este chakra principal
                      </summary>
                      <p className="muted chakra-praticas">{praticas.map((p) => p.nome).join(' · ')}</p>
                    </details>
                  )}
                </article>
              )
            })}
          </div>
        </section>
      )}

      {meditacoes.length > 0 && (
        <section id="meditacoes" className="knowledge-section">
          <h2>Roteiros de meditação</h2>
          <p className="muted">Para ler ou adaptar em voz alta. Cada roteiro indica o efeito e os chakras a que se dirige.</p>
          <div className="meditacoes">
            {meditacoes.map((m) => (
              <details key={m.id} className="meditacao" open={meditacoes.length <= 2}>
                <summary>
                  <span className="meditacao-nome">{m.nome}</span>
                  <span className="meditacao-meta">
                    <span className="efeito-tag" style={{ '--ef': EFEITO_MAP[m.efeito].cor } as CSSProperties}>
                      {EFEITO_MAP[m.efeito].nome}
                    </span>
                    {m.chakras?.map((c) => (
                      <span key={c} className="chakra-tag" style={{ '--ch': CHAKRA_MAP[c].cor } as CSSProperties}>
                        <span className="chakra-dot" />
                        {CHAKRA_MAP[c].nomePT}
                      </span>
                    ))}
                    <span className="muted">{m.duracao}</span>
                  </span>
                </summary>
                <p className="meditacao-objetivo">{m.objetivo}</p>
                <ol>
                  {m.roteiro.map((passo) => (
                    <li key={passo}>{passo}</li>
                  ))}
                </ol>
                {m.fonte && <p className="muted small">{m.fonte}</p>}
              </details>
            ))}
          </div>
        </section>
      )}

      {glossario.length > 0 && (
        <section id="glossario" className="knowledge-section">
          <h2>Glossário</h2>
          <dl className="glossario">
            {glossario.map((t) => (
              <div key={t.termo} className="glossario-item">
                <dt>{t.termo}</dt>
                <dd>{t.significado}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </div>
  )
}
