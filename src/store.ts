import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Area,
  CalendarEvent,
  FocusSession,
  Habit,
  InboxItem,
  Subtask,
  Task,
  ThemePref,
} from './types'
import { todayStr, uid } from './utils'

export interface FocusState {
  taskId?: string
  taskTitle: string
  phase: 'trabajo' | 'descanso' | null
  running: boolean
  /** Timestamp (ms) en que termina la fase actual, si está corriendo */
  endsAt: number | null
  /** Milisegundos restantes cuando está en pausa */
  remainingMs: number | null
  workMinutes: number
  breakMinutes: number
  cycles: number
}

const focusInicial: FocusState = {
  taskId: undefined,
  taskTitle: '',
  phase: null,
  running: false,
  endsAt: null,
  remainingMs: null,
  workMinutes: 25,
  breakMinutes: 5,
  cycles: 0,
}

const areasIniciales: Area[] = [
  { id: 'trabajo', name: 'Trabajo', icon: 'square', color: 'cobalt' },
  { id: 'familia', name: 'Familia', icon: 'circle', color: 'oxide' },
  { id: 'personal', name: 'Personal', icon: 'diamond', color: 'plum' },
  { id: 'salud', name: 'Salud', icon: 'triangle', color: 'moss' },
  { id: 'finanzas', name: 'Finanzas', icon: 'hex', color: 'ochre' },
]

/** Migración v1 → v2: colores Tailwind y emojis pasan a la paleta e íconos cartográficos. */
const COLOR_V1_V2: Record<string, Area['color']> = {
  teal: 'petrol',
  blue: 'cobalt',
  violet: 'plum',
  rose: 'oxide',
  emerald: 'moss',
  amber: 'ochre',
  sky: 'slate',
  orange: 'sepia',
}
const SHAPE_SET = new Set(['square', 'circle', 'diamond', 'triangle', 'hex', 'ring'])
const ICON_V1_V2: Record<string, string> = {
  '💼': 'square',
  '👨‍👩‍👧': 'circle',
  '🧠': 'diamond',
  '💪': 'triangle',
  '💰': 'hex',
}

export interface AppState {
  userName: string
  theme: ThemePref
  areas: Area[]
  tasks: Task[]
  events: CalendarEvent[]
  habits: Habit[]
  inbox: InboxItem[]
  focusSessions: FocusSession[]
  lastReviewDate?: string
  focus: FocusState

  setUserName: (name: string) => void
  setTheme: (theme: ThemePref) => void

  addArea: (area: Omit<Area, 'id'>) => void
  updateArea: (id: string, patch: Partial<Omit<Area, 'id'>>) => void
  deleteArea: (id: string) => void

  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'done'>) => void
  updateTask: (id: string, patch: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTask: (id: string) => void
  toggleSubtask: (taskId: string, subtaskId: string) => void
  setPriorityToday: (id: string, on: boolean) => void

  addEvent: (event: Omit<CalendarEvent, 'id'>) => void
  updateEvent: (id: string, patch: Partial<CalendarEvent>) => void
  deleteEvent: (id: string) => void

  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => void
  updateHabit: (id: string, patch: Partial<Habit>) => void
  deleteHabit: (id: string) => void
  toggleHabitOn: (id: string, date: string) => void

  addInbox: (text: string) => void
  deleteInbox: (id: string) => void

  addFocusSession: (session: Omit<FocusSession, 'id'>) => void
  setFocus: (patch: Partial<FocusState>) => void
  startFocus: (taskId: string | undefined, taskTitle: string, workMinutes: number, breakMinutes: number) => void
  pauseFocus: () => void
  resumeFocus: () => void
  stopFocus: () => void
  /** Cierra la fase actual: registra la sesión si era trabajo y pasa a la siguiente fase. */
  completePhase: () => void

  markReviewDone: () => void
  replaceAll: (data: Partial<AppState>) => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      userName: '',
      theme: 'system',
      areas: areasIniciales,
      tasks: [],
      events: [],
      habits: [],
      inbox: [],
      focusSessions: [],
      lastReviewDate: undefined,
      focus: focusInicial,

      setUserName: (userName) => set({ userName }),
      setTheme: (theme) => set({ theme }),

      addArea: (area) => set((s) => ({ areas: [...s.areas, { ...area, id: uid() }] })),
      updateArea: (id, patch) =>
        set((s) => ({
          areas: s.areas.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        })),
      deleteArea: (id) =>
        set((s) => ({
          areas: s.areas.filter((a) => a.id !== id),
          tasks: s.tasks.map((t) => (t.areaId === id ? { ...t, areaId: undefined } : t)),
          events: s.events.map((e) => (e.areaId === id ? { ...e, areaId: undefined } : e)),
          habits: s.habits.map((h) => (h.areaId === id ? { ...h, areaId: undefined } : h)),
        })),

      addTask: (task) =>
        set((s) => ({
          tasks: [
            ...s.tasks,
            { ...task, id: uid(), createdAt: new Date().toISOString(), done: false },
          ],
        })),
      updateTask: (id, patch) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),
      deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
      toggleTask: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  done: !t.done,
                  completedAt: !t.done ? new Date().toISOString() : undefined,
                }
              : t
          ),
        })),
      toggleSubtask: (taskId, subtaskId) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  subtasks: t.subtasks.map((st: Subtask) =>
                    st.id === subtaskId ? { ...st, done: !st.done } : st
                  ),
                }
              : t
          ),
        })),
      setPriorityToday: (id, on) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, priorityOn: on ? todayStr() : undefined } : t
          ),
        })),

      addEvent: (event) => set((s) => ({ events: [...s.events, { ...event, id: uid() }] })),
      updateEvent: (id, patch) =>
        set((s) => ({
          events: s.events.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        })),
      deleteEvent: (id) => set((s) => ({ events: s.events.filter((e) => e.id !== id) })),

      addHabit: (habit) =>
        set((s) => ({
          habits: [
            ...s.habits,
            { ...habit, id: uid(), createdAt: new Date().toISOString(), completions: [] },
          ],
        })),
      updateHabit: (id, patch) =>
        set((s) => ({
          habits: s.habits.map((h) => (h.id === id ? { ...h, ...patch } : h)),
        })),
      deleteHabit: (id) => set((s) => ({ habits: s.habits.filter((h) => h.id !== id) })),
      toggleHabitOn: (id, date) =>
        set((s) => ({
          habits: s.habits.map((h) => {
            if (h.id !== id) return h
            const has = h.completions.includes(date)
            return {
              ...h,
              completions: has
                ? h.completions.filter((c) => c !== date)
                : [...h.completions, date],
            }
          }),
        })),

      addInbox: (text) =>
        set((s) => ({
          inbox: [...s.inbox, { id: uid(), text, createdAt: new Date().toISOString() }],
        })),
      deleteInbox: (id) => set((s) => ({ inbox: s.inbox.filter((i) => i.id !== id) })),

      addFocusSession: (session) =>
        set((s) => ({ focusSessions: [...s.focusSessions, { ...session, id: uid() }] })),
      setFocus: (patch) => set((s) => ({ focus: { ...s.focus, ...patch } })),
      startFocus: (taskId, taskTitle, workMinutes, breakMinutes) =>
        set((s) => ({
          focus: {
            ...s.focus,
            taskId,
            taskTitle,
            workMinutes,
            breakMinutes,
            phase: 'trabajo',
            running: true,
            endsAt: Date.now() + workMinutes * 60_000,
            remainingMs: null,
          },
        })),
      pauseFocus: () =>
        set((s) => ({
          focus: {
            ...s.focus,
            running: false,
            remainingMs: s.focus.endsAt ? Math.max(0, s.focus.endsAt - Date.now()) : null,
            endsAt: null,
          },
        })),
      resumeFocus: () =>
        set((s) => ({
          focus: {
            ...s.focus,
            running: true,
            endsAt: Date.now() + (s.focus.remainingMs ?? s.focus.workMinutes * 60_000),
            remainingMs: null,
          },
        })),
      stopFocus: () => set(() => ({ focus: { ...focusInicial } })),
      completePhase: () => {
        const { focus } = get()
        if (focus.phase === 'trabajo') {
          get().addFocusSession({
            taskId: focus.taskId,
            taskTitle: focus.taskTitle,
            minutes: focus.workMinutes,
            date: todayStr(),
          })
          set((s) => ({
            focus: {
              ...s.focus,
              phase: 'descanso',
              cycles: s.focus.cycles + 1,
              running: true,
              endsAt: Date.now() + s.focus.breakMinutes * 60_000,
              remainingMs: null,
            },
          }))
        } else if (focus.phase === 'descanso') {
          set((s) => ({
            focus: {
              ...s.focus,
              phase: null,
              running: false,
              endsAt: null,
              remainingMs: null,
            },
          }))
        }
      },

      markReviewDone: () => set({ lastReviewDate: todayStr() }),
      replaceAll: (data) => set(() => ({ ...data })),
    }),
    {
      name: 'norte-datos',
      version: 2,
      migrate: (persisted) => {
        const s = persisted as Partial<AppState>
        const colorSet = new Set(['cobalt', 'oxide', 'moss', 'ochre', 'plum', 'petrol', 'sepia', 'slate'])
        if (s.areas) {
          s.areas = s.areas.map((a) => ({
            ...a,
            color: COLOR_V1_V2[a.color] ?? (colorSet.has(a.color) ? a.color : 'slate'),
            icon: SHAPE_SET.has(a.icon) ? a.icon : (ICON_V1_V2[a.icon] ?? 'ring'),
          }))
        }
        return s as never
      },
      partialize: (s) => ({
        userName: s.userName,
        theme: s.theme,
        areas: s.areas,
        tasks: s.tasks,
        events: s.events,
        habits: s.habits,
        inbox: s.inbox,
        focusSessions: s.focusSessions,
        lastReviewDate: s.lastReviewDate,
      }),
    }
  )
)
