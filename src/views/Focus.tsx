import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { todayStr } from '../utils'
import { IconCheck, IconPause, IconPlay, IconRotate, IconTarget } from '../icons'
import { Btn, Card, Field } from '../components/ui'

const PRESETS = [
  { label: 'Clásico · 25/5', work: 25, brk: 5 },
  { label: 'Profundo · 50/10', work: 50, brk: 10 },
  { label: 'Arranque · 10/2', work: 10, brk: 2 },
]

function fmt(ms: number) {
  const total = Math.max(0, Math.round(ms / 1000))
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function Focus() {
  const { tasks, focus, focusSessions, startFocus, pauseFocus, resumeFocus, stopFocus, toggleTask } =
    useStore()
  const [taskId, setTaskId] = useState<string>('')
  const [preset, setPreset] = useState(0)
  const [, setTick] = useState(0)

  // Re-renderizar cada medio segundo mientras corre el temporizador
  useEffect(() => {
    if (!focus.running) return
    const id = setInterval(() => setTick((t) => t + 1), 500)
    return () => clearInterval(id)
  }, [focus.running])

  const pending = tasks.filter((t) => !t.done)
  const hoy = todayStr()
  const todaySessions = focusSessions.filter((s) => s.date === hoy)
  const todayMinutes = todaySessions.reduce((acc, s) => acc + s.minutes, 0)

  const totalMs =
    (focus.phase === 'descanso' ? focus.breakMinutes : focus.workMinutes) * 60_000
  const remaining = focus.running
    ? Math.max(0, (focus.endsAt ?? 0) - Date.now())
    : (focus.remainingMs ?? totalMs)
  const progress = focus.phase ? 1 - remaining / totalMs : 0

  const R = 88
  const C = 2 * Math.PI * R

  const start = () => {
    const t = pending.find((x) => x.id === taskId)
    startFocus(t?.id, t?.title ?? 'Sesión de enfoque', PRESETS[preset].work, PRESETS[preset].brk)
  }

  const currentTask = tasks.find((t) => t.id === focus.taskId)

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Modo Enfoque</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Una sola tarea, un temporizador, cero distracciones.
        </p>
      </header>

      {focus.phase === null ? (
        <Card className="p-5 space-y-4">
          <Field label="¿En qué vas a trabajar?">
            <select
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              className="w-full rounded-xl border-0 bg-slate-100 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-slate-800"
            >
              <option value="">Sesión libre (sin tarea concreta)</option>
              {pending.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Ritmo de trabajo / descanso">
            <div className="grid grid-cols-3 gap-1.5">
              {PRESETS.map((p, i) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setPreset(i)}
                  className={`rounded-xl px-2 py-2.5 text-xs font-medium transition-all ${
                    preset === i
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </Field>

          <p className="text-xs text-slate-400 dark:text-slate-500">
            💡 ¿Te cuesta arrancar? Usa el modo <strong>Arranque (10 min)</strong>: dile a
            tu cerebro "solo 10 minutos". Empezar es la única parte difícil.
          </p>

          <Btn onClick={start} className="w-full !py-3">
            <IconPlay className="w-4 h-4" /> Empezar sesión
          </Btn>
        </Card>
      ) : (
        <Card className="flex flex-col items-center p-8">
          <p
            className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${
              focus.phase === 'trabajo'
                ? 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300'
                : 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300'
            }`}
          >
            {focus.phase === 'trabajo' ? 'Enfoque' : 'Descanso'}
          </p>

          <div className="relative mt-6">
            <svg width="220" height="220" viewBox="0 0 220 220" className="-rotate-90">
              <circle
                cx="110" cy="110" r={R} fill="none" strokeWidth="10"
                className="stroke-slate-100 dark:stroke-slate-800"
              />
              <circle
                cx="110" cy="110" r={R} fill="none" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * progress}
                className={`transition-[stroke-dashoffset] duration-500 ${
                  focus.phase === 'trabajo' ? 'stroke-teal-500' : 'stroke-sky-500'
                }`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold tabular-nums tracking-tight">
                {fmt(remaining)}
              </span>
              <span className="mt-1 max-w-40 truncate text-xs text-slate-400 dark:text-slate-500">
                {focus.taskTitle}
              </span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2">
            {focus.running ? (
              <Btn variant="soft" onClick={pauseFocus}>
                <IconPause className="w-4 h-4" /> Pausar
              </Btn>
            ) : (
              <Btn onClick={resumeFocus}>
                <IconPlay className="w-4 h-4" /> Continuar
              </Btn>
            )}
            <Btn variant="ghost" onClick={stopFocus}>
              <IconRotate className="w-4 h-4" /> Terminar
            </Btn>
          </div>

          {currentTask && !currentTask.done && (
            <button
              onClick={() => {
                toggleTask(currentTask.id)
                stopFocus()
              }}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:underline dark:text-teal-400"
            >
              <IconCheck className="w-3.5 h-3.5" /> ¡Tarea terminada! Marcar como completada
            </button>
          )}

          {focus.cycles > 0 && (
            <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
              {focus.cycles} {focus.cycles === 1 ? 'ciclo completado' : 'ciclos completados'} en esta sesión 🍅
            </p>
          )}
        </Card>
      )}

      <Card className="p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
            <IconTarget className="w-5 h-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">
              {todayMinutes} minutos de enfoque hoy
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {todaySessions.length}{' '}
              {todaySessions.length === 1 ? 'sesión completada' : 'sesiones completadas'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
