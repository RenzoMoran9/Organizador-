import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { todayStr } from '../utils'
import { IconCheck, IconPause, IconPlay, IconRotate, IconTarget } from '../icons'
import { Btn, Card, Field, segCls } from '../components/ui'

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

/** Bisel de cronómetro: 60 marcas finas alrededor del dial. */
function Bezel({ r, cx, cy }: { r: number; cx: number; cy: number }) {
  const ticks = []
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2
    const long = i % 5 === 0
    const r1 = r + 7
    const r2 = r1 + (long ? 6 : 3)
    ticks.push(
      <line
        key={i}
        x1={cx + r1 * Math.sin(a)}
        y1={cy - r1 * Math.cos(a)}
        x2={cx + r2 * Math.sin(a)}
        y2={cy - r2 * Math.cos(a)}
        strokeWidth={long ? 1.5 : 1}
        className="stroke-ink3/50"
      />
    )
  }
  return <>{ticks}</>
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

  const totalMs = (focus.phase === 'descanso' ? focus.breakMinutes : focus.workMinutes) * 60_000
  const remaining = focus.running
    ? Math.max(0, (focus.endsAt ?? 0) - Date.now())
    : (focus.remainingMs ?? totalMs)
  const progress = focus.phase ? 1 - remaining / totalMs : 0

  const R = 84
  const C = 2 * Math.PI * R

  const start = () => {
    const t = pending.find((x) => x.id === taskId)
    startFocus(t?.id, t?.title ?? 'Sesión de enfoque', PRESETS[preset].work, PRESETS[preset].brk)
  }

  const currentTask = tasks.find((t) => t.id === focus.taskId)

  return (
    <div className="space-y-5">
      <header className="border-b border-line pb-5">
        <p className="caption !text-accent">Una tarea a la vez</p>
        <h1 className="mt-2 font-display text-[28px] font-semibold tracking-tight">Modo Enfoque</h1>
        <p className="mt-1.5 text-sm text-ink2">
          Una sola tarea, un temporizador, cero distracciones.
        </p>
      </header>

      {focus.phase === null ? (
        <Card className="p-5 space-y-4">
          <Field label="En qué vas a trabajar">
            <select
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              className="w-full rounded-sm border border-line bg-paper px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            >
              <option value="">Sesión libre (sin tarea concreta)</option>
              {pending.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Ritmo trabajo / descanso">
            <div className="grid grid-cols-3 gap-1.5">
              {PRESETS.map((p, i) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setPreset(i)}
                  className={segCls(preset === i) + ' font-mono !text-[11px]'}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </Field>

          <p className="text-xs leading-relaxed text-ink3">
            <span className="caption !text-[9px]">Nota</span> — ¿te cuesta arrancar? Usa el
            modo <strong>Arranque (10 min)</strong>: dile a tu cerebro "solo 10 minutos".
            Empezar es la única parte difícil.
          </p>

          <Btn onClick={start} className="w-full !py-3">
            <IconPlay className="w-4 h-4" /> Empezar sesión
          </Btn>
        </Card>
      ) : (
        <Card className="flex flex-col items-center p-8">
          <p
            className={`caption !text-[10px] rounded-sm border px-2.5 py-1 ${
              focus.phase === 'trabajo'
                ? 'border-accent/40 !text-accent'
                : 'border-moss/40 !text-moss'
            }`}
          >
            {focus.phase === 'trabajo' ? 'Enfoque' : 'Descanso'}
          </p>

          <div className="relative mt-6">
            <svg width="220" height="220" viewBox="0 0 220 220">
              <Bezel r={R} cx={110} cy={110} />
              <g className="-rotate-90 origin-center">
                <circle
                  cx="110" cy="110" r={R} fill="none" strokeWidth="6"
                  className="stroke-surface2"
                />
                <circle
                  cx="110" cy="110" r={R} fill="none" strokeWidth="6" strokeLinecap="butt"
                  strokeDasharray={C}
                  strokeDashoffset={C * progress}
                  className={`transition-[stroke-dashoffset] duration-500 ${
                    focus.phase === 'trabajo' ? 'stroke-accent' : 'stroke-moss'
                  }`}
                />
              </g>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-5xl font-medium tabular-nums tracking-tight">
                {fmt(remaining)}
              </span>
              <span className="mt-1.5 max-w-28 truncate text-xs text-ink3">
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
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
            >
              <IconCheck className="w-3.5 h-3.5" /> Tarea terminada — marcar como completada
            </button>
          )}

          {focus.cycles > 0 && (
            <p className="mt-4 font-mono text-[11px] text-ink3 tabular-nums">
              {focus.cycles} {focus.cycles === 1 ? 'ciclo completado' : 'ciclos completados'} en
              esta sesión
            </p>
          )}
        </Card>
      )}

      <Card className="p-5">
        <div className="flex items-center gap-3.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-sm border border-accent/30 text-accent">
            <IconTarget className="w-5 h-5" />
          </span>
          <div>
            <p className="font-mono text-lg font-semibold tabular-nums leading-6">
              {todayMinutes} min
            </p>
            <p className="text-xs text-ink3">
              de enfoque hoy · {todaySessions.length}{' '}
              {todaySessions.length === 1 ? 'sesión' : 'sesiones'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
