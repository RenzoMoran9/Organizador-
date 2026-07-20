import { useMemo, useState } from 'react'
import { getISOWeek } from 'date-fns'
import { useStore } from '../store'
import type { Task, ViewId } from '../types'
import {
  areaVar,
  fmtLong,
  greeting,
  habitStreak,
  timeToMinutes,
  todayStr,
} from '../utils'
import {
  IconArrowRight,
  IconCalendar,
  IconCheck,
  IconFlame,
  IconSun,
  IconTasks,
} from '../icons'
import { Btn, Card, CardHeader, EmptyState, Modal, inputCls } from '../components/ui'
import { TaskRow } from '../components/TaskRow'
import { TaskModal } from '../components/modals'

function PriorityPicker({ onClose }: { onClose: () => void }) {
  const { tasks, setPriorityToday } = useStore()
  const hoy = todayStr()
  const candidates = tasks
    .filter((t) => !t.done)
    .sort((a, b) => ((a.dueDate ?? '9999') < (b.dueDate ?? '9999') ? -1 : 1))
  const selected = candidates.filter((t) => t.priorityOn === hoy).length

  return (
    <Modal title="Tus 3 prioridades de hoy" onClose={onClose}>
      <p className="mb-4 text-sm text-ink2">
        Elige como máximo <strong>3 tareas</strong>. Si todo es prioridad, nada lo es.
      </p>
      {candidates.length === 0 ? (
        <EmptyState
          icon={<IconTasks className="w-10 h-10" />}
          title="No tienes tareas pendientes"
          hint="Crea tareas desde la pestaña Tareas o captura ideas con el botón de captura rápida."
        />
      ) : (
        <div className="space-y-1.5">
          {candidates.map((t) => {
            const isSel = t.priorityOn === hoy
            return (
              <button
                key={t.id}
                onClick={() => {
                  if (!isSel && selected >= 3) return
                  setPriorityToday(t.id, !isSel)
                }}
                disabled={!isSel && selected >= 3}
                className={`flex w-full items-center gap-3 rounded-sm border px-3.5 py-2.5 text-left text-sm transition-colors ${
                  isSel
                    ? 'border-accent bg-accent/8 text-ink'
                    : selected >= 3
                      ? 'border-line opacity-40'
                      : 'border-line hover:border-ink3'
                }`}
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border transition-colors ${
                    isSel ? 'border-accent bg-accent text-onaccent' : 'border-ink3'
                  }`}
                >
                  {isSel && <IconCheck className="w-2.5 h-2.5" />}
                </span>
                <span className="flex-1 truncate">{t.title}</span>
              </button>
            )
          })}
        </div>
      )}
      <div className="mt-4 flex justify-end">
        <Btn onClick={onClose}>Listo ({selected}/3)</Btn>
      </div>
    </Modal>
  )
}

export function Today({ go }: { go: (v: ViewId) => void }) {
  const { userName, setUserName, tasks, events, habits, inbox, areas, toggleHabitOn } =
    useStore()
  const [nameDraft, setNameDraft] = useState('')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)

  const hoy = todayStr()
  const now = new Date()
  const weekday = now.getDay()

  const priorities = tasks.filter((t) => t.priorityOn === hoy)
  const prioritiesPending = priorities.filter((t) => !t.done)

  const timeline = useMemo(() => {
    const evts = events
      .filter((e) => e.date === hoy || e.recurringDays?.includes(weekday))
      .map((e) => ({
        key: 'e' + e.id,
        title: e.title,
        time: e.startTime,
        end: e.endTime,
        areaId: e.areaId,
        kind: 'evento' as const,
      }))
    const blocks = tasks
      .filter((t) => !t.done && t.dueDate === hoy && t.scheduledTime)
      .map((t) => ({
        key: 't' + t.id,
        title: t.title,
        time: t.scheduledTime!,
        end: undefined as string | undefined,
        areaId: t.areaId,
        kind: 'tarea' as const,
      }))
    return [...evts, ...blocks].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time))
  }, [events, tasks, hoy, weekday])

  const habitsToday = habits.filter((h) => h.days.includes(weekday))
  const habitsDone = habitsToday.filter((h) => h.completions.includes(hoy)).length

  const dueToday = tasks.filter((t) => !t.done && t.dueDate === hoy && t.priorityOn !== hoy)
  const overdue = tasks.filter((t) => !t.done && t.dueDate && t.dueDate < hoy)

  const resumen: string[] = []
  if (timeline.length > 0)
    resumen.push(`${timeline.length} ${timeline.length === 1 ? 'evento' : 'eventos'} en tu horario`)
  if (prioritiesPending.length > 0)
    resumen.push(
      `${prioritiesPending.length} ${prioritiesPending.length === 1 ? 'prioridad' : 'prioridades'} por completar`
    )
  if (habitsToday.length > 0) resumen.push(`hábitos ${habitsDone}/${habitsToday.length}`)
  if (inbox.length > 0)
    resumen.push(`${inbox.length} ${inbox.length === 1 ? 'captura' : 'capturas'} por procesar`)

  return (
    <div className="space-y-5">
      {/* Cabecera de bitácora */}
      <header className="border-b border-line pb-5">
        <p className="caption !text-accent">
          Bitácora · Semana {getISOWeek(now)} — {now.getFullYear()}
        </p>
        <h1 className="mt-2 font-display text-[32px] font-semibold leading-tight tracking-tight">
          {greeting()}
          {userName ? `, ${userName}` : ''}.
        </h1>
        <p className="mt-1.5 text-sm text-ink2">
          {fmtLong(now)}
          {resumen.length > 0 ? ` — ${resumen.join(' · ')}.` : ' — día despejado.'}
        </p>
      </header>

      {/* Bienvenida si aún no hay nombre */}
      {!userName && (
        <Card className="p-5">
          <h2 className="font-display text-lg font-semibold">¡Bienvenido a Norte!</h2>
          <p className="mt-1 text-sm text-ink2">¿Cómo te llamas? Así personalizamos tu bitácora.</p>
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              if (nameDraft.trim()) setUserName(nameDraft.trim())
            }}
          >
            <input
              className={inputCls}
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              placeholder="Tu nombre"
            />
            <Btn type="submit" disabled={!nameDraft.trim()}>
              Empezar
            </Btn>
          </form>
        </Card>
      )}

      {/* Prioridades del día */}
      <Card>
        <CardHeader
          title="Prioridades de hoy"
          subtitle="Máximo 3. Empieza por aquí."
          action={
            <Btn variant="soft" onClick={() => setPickerOpen(true)} className="!px-3 !py-1.5 text-xs">
              Elegir
            </Btn>
          }
        />
        {priorities.length === 0 ? (
          <EmptyState
            icon={<IconSun className="w-9 h-9" />}
            title="Aún no eliges tus prioridades"
            hint="Elegir solo 3 cosas importantes hace que empezar sea fácil. Ese es el truco contra la procrastinación."
          />
        ) : (
          <div className="divide-y divide-line pb-2">
            {priorities.map((t, i) => (
              <TaskRow key={t.id} task={t} onEdit={setEditing} marker={String(i + 1).padStart(2, '0')} />
            ))}
          </div>
        )}
      </Card>

      {/* Horario del día */}
      <Card>
        <CardHeader
          title="Tu horario de hoy"
          action={
            <Btn variant="ghost" onClick={() => go('agenda')} className="!px-3 !py-1.5 text-xs">
              Agenda <IconArrowRight className="w-3.5 h-3.5" />
            </Btn>
          }
        />
        {timeline.length === 0 ? (
          <EmptyState
            icon={<IconCalendar className="w-9 h-9" />}
            title="Sin eventos para hoy"
            hint="Agrega eventos o rutinas desde la Agenda, o resérvale una hora a una tarea."
          />
        ) : (
          <div className="px-5 pb-4 pt-2">
            <ol className="relative ml-14 border-l border-line">
              {timeline.map((item) => {
                const area = areas.find((a) => a.id === item.areaId)
                return (
                  <li key={item.key} className="relative mb-4 pl-4 last:mb-1">
                    <span
                      className="absolute -left-[5px] top-1.5 h-[9px] w-[9px] rounded-full ring-4 ring-surface"
                      style={{ background: area ? areaVar(area.color) : 'var(--ink-3)' }}
                    />
                    <span className="absolute -left-16 top-0.5 w-11 text-right font-mono text-[11px] font-medium tabular-nums text-ink3">
                      {item.time}
                    </span>
                    <p className="text-sm font-medium leading-5">
                      {item.title}
                      {item.kind === 'tarea' && (
                        <span className="ml-2 rounded-[3px] bg-accent/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.08em] text-accent">
                          Bloque
                        </span>
                      )}
                    </p>
                    <p className="font-mono text-[10px] text-ink3 tabular-nums">
                      {item.end ? `${item.time} – ${item.end}` : item.time}
                      {area && <span className="font-sans"> · {area.name}</span>}
                    </p>
                  </li>
                )
              })}
            </ol>
          </div>
        )}
      </Card>

      {/* Hábitos de hoy */}
      {habitsToday.length > 0 && (
        <Card>
          <CardHeader
            title="Hábitos de hoy"
            subtitle={`${habitsDone} de ${habitsToday.length} completados`}
          />
          <div className="flex flex-wrap gap-2 px-5 pb-5 pt-1">
            {habitsToday.map((h) => {
              const done = h.completions.includes(hoy)
              const streak = habitStreak(h)
              return (
                <button
                  key={h.id}
                  onClick={() => toggleHabitOn(h.id, hoy)}
                  className={`flex items-center gap-2 rounded-sm border px-3.5 py-2 text-sm font-medium transition-colors ${
                    done
                      ? 'border-accent bg-accent text-onaccent'
                      : 'border-line text-ink2 hover:border-ink3'
                  }`}
                >
                  <span>{h.icon}</span>
                  {h.name}
                  {done ? (
                    <IconCheck className="w-4 h-4" />
                  ) : streak > 0 ? (
                    <span className="flex items-center gap-0.5 font-mono text-[11px] text-ochre">
                      <IconFlame className="w-3.5 h-3.5" />
                      {streak}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        </Card>
      )}

      {/* Más tareas de hoy / vencidas */}
      {(dueToday.length > 0 || overdue.length > 0) && (
        <Card>
          <CardHeader title="También para hoy" />
          <div className="divide-y divide-line pb-2">
            {overdue.map((t) => (
              <TaskRow key={t.id} task={t} onEdit={setEditing} />
            ))}
            {dueToday.map((t) => (
              <TaskRow key={t.id} task={t} onEdit={setEditing} />
            ))}
          </div>
        </Card>
      )}

      {/* Estado sereno cuando todo está en orden */}
      {priorities.length > 0 &&
        prioritiesPending.length === 0 &&
        dueToday.length === 0 &&
        overdue.length === 0 && (
          <Card className="p-6 text-center">
            <p className="font-display italic text-lg">Prioridades del día completadas.</p>
            <p className="mt-1 text-xs text-ink3">
              Lo importante ya está hecho. Todo lo demás es ganancia.
            </p>
          </Card>
        )}

      {pickerOpen && <PriorityPicker onClose={() => setPickerOpen(false)} />}
      {editing && <TaskModal initial={editing} onClose={() => setEditing(null)} />}
    </div>
  )
}
