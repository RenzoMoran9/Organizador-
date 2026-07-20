export type AreaColor =
  | 'teal'
  | 'blue'
  | 'violet'
  | 'rose'
  | 'emerald'
  | 'amber'
  | 'sky'
  | 'orange'

export interface Area {
  id: string
  name: string
  icon: string
  color: AreaColor
}

export type Priority = 'alta' | 'media' | 'baja'

export interface Subtask {
  id: string
  title: string
  done: boolean
}

export interface Task {
  id: string
  title: string
  notes?: string
  areaId?: string
  priority: Priority
  /** Fecha límite en formato yyyy-MM-dd */
  dueDate?: string
  /** Hora asignada (time-blocking) en formato HH:mm */
  scheduledTime?: string
  /** Duración estimada en minutos */
  duration?: number
  subtasks: Subtask[]
  done: boolean
  completedAt?: string
  createdAt: string
  /** Fecha (yyyy-MM-dd) en la que esta tarea es una de las 3 prioridades del día */
  priorityOn?: string
}

export interface CalendarEvent {
  id: string
  title: string
  areaId?: string
  notes?: string
  /** Evento puntual: fecha yyyy-MM-dd. Vacío si es recurrente. */
  date?: string
  /** Rutina semanal: días de la semana (0=domingo … 6=sábado) */
  recurringDays?: number[]
  startTime: string
  endTime?: string
}

export interface Habit {
  id: string
  name: string
  icon: string
  areaId?: string
  /** Días de la semana en que aplica (0=domingo … 6=sábado) */
  days: number[]
  /** Fechas yyyy-MM-dd en que se completó */
  completions: string[]
  createdAt: string
}

export interface InboxItem {
  id: string
  text: string
  createdAt: string
}

export interface FocusSession {
  id: string
  taskId?: string
  taskTitle: string
  minutes: number
  date: string
}

export type ViewId =
  | 'hoy'
  | 'bandeja'
  | 'tareas'
  | 'agenda'
  | 'habitos'
  | 'enfoque'
  | 'revision'
  | 'ajustes'

export type ThemePref = 'system' | 'light' | 'dark'
