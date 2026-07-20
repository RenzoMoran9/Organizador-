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

export interface AreaColorClasses {
  dot: string
  chip: string
  bar: string
  soft: string
}

export const AREA_COLORS: Record<AreaColor, AreaColorClasses> = {
  teal: {
    dot: 'bg-teal-500',
    chip: 'bg-teal-100 text-teal-800 dark:bg-teal-500/15 dark:text-teal-300',
    bar: 'bg-teal-500',
    soft: 'border-teal-500/40',
  },
  blue: {
    dot: 'bg-blue-500',
    chip: 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300',
    bar: 'bg-blue-500',
    soft: 'border-blue-500/40',
  },
  violet: {
    dot: 'bg-violet-500',
    chip: 'bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300',
    bar: 'bg-violet-500',
    soft: 'border-violet-500/40',
  },
  rose: {
    dot: 'bg-rose-500',
    chip: 'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300',
    bar: 'bg-rose-500',
    soft: 'border-rose-500/40',
  },
  emerald: {
    dot: 'bg-emerald-500',
    chip: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
    bar: 'bg-emerald-500',
    soft: 'border-emerald-500/40',
  },
  amber: {
    dot: 'bg-amber-500',
    chip: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
    bar: 'bg-amber-500',
    soft: 'border-amber-500/40',
  },
  sky: {
    dot: 'bg-sky-500',
    chip: 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300',
    bar: 'bg-sky-500',
    soft: 'border-sky-500/40',
  },
  orange: {
    dot: 'bg-orange-500',
    chip: 'bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-300',
    bar: 'bg-orange-500',
    soft: 'border-orange-500/40',
  },
}

export const PRIORITY_META: Record<
  'alta' | 'media' | 'baja',
  { label: string; chip: string }
> = {
  alta: {
    label: 'Alta',
    chip: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
  },
  media: {
    label: 'Media',
    chip: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  },
  baja: {
    label: 'Baja',
    chip: 'bg-slate-200 text-slate-600 dark:bg-slate-500/15 dark:text-slate-300',
  },
}
