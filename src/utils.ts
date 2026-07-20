import { addDays, format, startOfWeek } from 'date-fns'
import { es } from 'date-fns/locale'
import type { AreaColor, Habit } from './types'

export const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36)

export const dateStr = (d: Date) => format(d, 'yyyy-MM-dd')
export const todayStr = () => dateStr(new Date())

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
export const fmtLong = (d: Date) => cap(format(d, "EEEE d 'de' MMMM", { locale: es }))
export const fmtShort = (iso: string) =>
  format(new Date(iso + 'T00:00:00'), "d MMM", { locale: es })
export const fmtWeekday = (d: Date) => format(d, 'EEE', { locale: es })

export function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

/** Los 7 días de la semana de `ref`, empezando en lunes. */
export function weekDays(ref: Date): Date[] {
  const start = startOfWeek(ref, { weekStartsOn: 1 })
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

/** Días de la semana para pickers, ordenados lunes → domingo, con el número de Date.getDay(). */
export const WEEKDAYS: { day: number; label: string; full: string }[] = [
  { day: 1, label: 'L', full: 'lunes' },
  { day: 2, label: 'M', full: 'martes' },
  { day: 3, label: 'X', full: 'miércoles' },
  { day: 4, label: 'J', full: 'jueves' },
  { day: 5, label: 'V', full: 'viernes' },
  { day: 6, label: 'S', full: 'sábado' },
  { day: 0, label: 'D', full: 'domingo' },
]

export const timeToMinutes = (t?: string): number => {
  if (!t) return Number.MAX_SAFE_INTEGER
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

/** Racha actual: días aplicables consecutivos completados, contando hacia atrás. */
export function habitStreak(habit: Habit): number {
  const done = new Set(habit.completions)
  const applies = (d: Date) => habit.days.includes(d.getDay())
  let d = new Date()
  // Si hoy aplica pero aún no se marcó, la racha no se rompe: se cuenta desde ayer.
  if (applies(d) && !done.has(dateStr(d))) d = addDays(d, -1)
  let streak = 0
  for (let i = 0; i < 730; i++) {
    if (applies(d)) {
      if (done.has(dateStr(d))) streak++
      else break
    }
    d = addDays(d, -1)
  }
  return streak
}

/** Porcentaje de cumplimiento del hábito en los últimos 30 días. */
export function habitRate30(habit: Habit): number {
  const done = new Set(habit.completions)
  const created = new Date(habit.createdAt)
  let applicable = 0
  let completed = 0
  for (let i = 0; i < 30; i++) {
    const d = addDays(new Date(), -i)
    if (d < created && dateStr(d) !== dateStr(created)) break
    if (habit.days.includes(d.getDay())) {
      applicable++
      if (done.has(dateStr(d))) completed++
    }
  }
  return applicable === 0 ? 0 : Math.round((completed / applicable) * 100)
}

/** Color del área como variable CSS: cambia solo entre tema claro y oscuro. */
export const areaVar = (color: AreaColor) => `var(--area-${color})`

export const AREA_COLOR_NAMES: AreaColor[] = [
  'cobalt',
  'oxide',
  'moss',
  'ochre',
  'plum',
  'petrol',
  'sepia',
  'slate',
]

/** Tinte suave de un color para fondos de fichas y chips. */
export const tint = (cssColor: string, pct = 12) =>
  `color-mix(in srgb, ${cssColor} ${pct}%, transparent)`

export const PRIORITY_META: Record<
  'alta' | 'media' | 'baja',
  { label: string; color: string }
> = {
  alta: { label: 'Alta', color: 'var(--oxide)' },
  media: { label: 'Media', color: 'var(--ochre)' },
  baja: { label: 'Baja', color: 'var(--ink-3)' },
}
