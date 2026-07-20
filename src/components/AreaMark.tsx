import type { Area, AreaShape } from '../types'
import { areaVar } from '../utils'

/** Símbolo de leyenda cartográfica: cada área de vida tiene forma y color propios. */
const SHAPES: Record<AreaShape, (filled: boolean) => React.ReactNode> = {
  square: (f) => (
    <rect x="2.5" y="2.5" width="11" height="11" fill={f ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7" />
  ),
  circle: (f) => (
    <circle cx="8" cy="8" r="5.6" fill={f ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7" />
  ),
  diamond: (f) => (
    <path d="M8 1.8 L14.2 8 L8 14.2 L1.8 8 Z" fill={f ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
  ),
  triangle: (f) => (
    <path d="M8 2.4 L14.4 13.6 L1.6 13.6 Z" fill={f ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
  ),
  hex: (f) => (
    <path d="M8 1.8 L13.5 5 L13.5 11 L8 14.2 L2.5 11 L2.5 5 Z" fill={f ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
  ),
  ring: () => (
    <>
      <circle cx="8" cy="8" r="5.6" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="8" cy="8" r="1.8" fill="currentColor" />
    </>
  ),
}

export const AREA_SHAPES = Object.keys(SHAPES) as AreaShape[]

const isShape = (s: string): s is AreaShape => s in SHAPES

export function Mark({
  shape,
  color,
  size = 12,
  filled = true,
  className,
}: {
  shape: string
  color?: string
  size?: number
  filled?: boolean
  className?: string
}) {
  const s: AreaShape = isShape(shape) ? shape : 'square'
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      style={color ? { color } : undefined}
      className={className}
      aria-hidden="true"
    >
      {SHAPES[s](filled)}
    </svg>
  )
}

export function AreaMark({ area, size = 12 }: { area: Area; size?: number }) {
  return <Mark shape={area.icon} color={areaVar(area.color)} size={size} />
}

/** Chip de área: símbolo + nombre, con tinte del color del área. */
export function AreaChip({ area, className = '' }: { area: Area; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[3px] px-2 py-0.5 text-[11px] font-medium ${className}`}
      style={{
        color: areaVar(area.color),
        background: `color-mix(in srgb, ${areaVar(area.color)} 11%, transparent)`,
      }}
    >
      <AreaMark area={area} size={9} />
      {area.name}
    </span>
  )
}
