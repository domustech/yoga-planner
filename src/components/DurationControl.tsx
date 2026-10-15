import { Minus, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { formatDuration, parseDuration } from '../lib/utils'

interface Props {
  value: number
  onChange: (seconds: number) => void
  step?: number
}

const MIN = 5

export function DurationControl({ value, onChange, step = 15 }: Props) {
  const [text, setText] = useState(formatDuration(value))
  useEffect(() => setText(formatDuration(value)), [value])

  const commit = () => {
    const s = parseDuration(text)
    if (s === null) setText(formatDuration(value))
    else onChange(Math.max(MIN, s))
  }

  return (
    <div className="duration" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        className="duration-btn"
        onClick={() => onChange(Math.max(MIN, value - step))}
        aria-label={`Menos ${step} segundos`}
      >
        <Minus size={14} />
      </button>
      <input
        className="duration-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        onFocus={(e) => e.target.select()}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
        }}
        aria-label="Duração (minutos:segundos)"
        title="Duração em m:ss — ex.: 1:30"
      />
      <button
        type="button"
        className="duration-btn"
        onClick={() => onChange(value + step)}
        aria-label={`Mais ${step} segundos`}
      >
        <Plus size={14} />
      </button>
    </div>
  )
}
