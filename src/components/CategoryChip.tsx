import { CATEGORY_MAP } from '../data/categories'
import type { CategoryId } from '../data/types'

interface Props {
  id: CategoryId
  small?: boolean
  active?: boolean
  onClick?: () => void
}

export function CategoryChip({ id, small, active, onClick }: Props) {
  const cat = CATEGORY_MAP[id]
  const style = { '--cat': cat.cor } as React.CSSProperties
  const cls = `chip ${small ? 'chip-sm' : ''} ${active ? 'is-active' : ''} ${onClick ? 'is-clickable' : ''}`
  if (onClick) {
    return (
      <button type="button" className={cls} style={style} onClick={onClick} title={cat.descricao}>
        <span className="chip-dot" />
        {cat.nome}
      </button>
    )
  }
  return (
    <span className={cls} style={style} title={cat.descricao}>
      <span className="chip-dot" />
      {cat.nome}
    </span>
  )
}
