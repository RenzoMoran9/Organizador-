import { useMemo, useState } from 'react'
import { useStore } from '../store'
import type { Task, ViewId } from '../types'
import {
  AREA_COLORS,
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
  IconStar,
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
    .sort((a, b) => (a.dueDate ?? '9999') < (b.dueDate ?? '9999') ? -1 : 1)
  const selected = candidates.filter((t) => t.priorityOn === hoy).length

  return (
    <Modal title="Tus 3 prioridades de hoy" onClose={onClose}>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        Elige como máximo <strong>3 tareas</strong>. Si todo es prioridad, nada lo es.
      </p>
      {candidates.length === 0 ? (
        <EmptyState
          icon={<IconTasks className="w-10 h-10" />}
          title="No tienes tareas pendientes"
          hint="Crea tareas desde la pestaña Tareas o captura ideas con el botón +."
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
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm transition-all ${
                  isSel
                    ? 'bg-amber-50 ring-2 ring-amber-400 dark:bg-amber-500/10'
                    : selected >= 3
                      ? 'bg-slate-50 opacity-40 dark:bg-slate-800/40'
                      : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800'
                }`}
              >
                <IconStar
                  className={`w-4 h-4 shrink-0 ${
                    isSel ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'
                  }`}
                />
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
  const {
    userName,
    setUserName,
    tasks,
    events,
    habits,
    inbox,
    areas,
    toggleHabitOn,
  } = useStore()
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
    return [...evts, ...blocks].sort(
      (a, b) => timeToMinutes(a.time) - timeToMinutes(b.time)
    )
  }, [events, tasks, hoy, weekday])

  const habitsToday = habits.filter((h) => h.days.includes(weekday))
  const habitsDone = habitsToday.filter((h) => h.completions.includes(hoy)).length

  const dueToday = tasks.filter(
    (t) => !t.done && t.dueDate === hoy && t.priorityOn !== hoy
  )
  const overdue = tasks.filter((t) => !t.done && t.dueDate && t.dueDate < hoy)

  const resumen: string[] = []
  if (timeline.length > 0)
    resumen.push(`${timeline.length} ${timeline.length === 1 ? 'evento' : 'eventos'} en tu horario`)
  if (prioritiesPending.length > 0)
    resumen.push(`${prioritiesPending.length} ${prioritiesPending.length === 1 ? 'prioridad' : 'prioridades'} por completar`)
  if (habitsToday.length > 0) resumen.push(`hábitos: ${habitsDone}/${habitsToday.length}`)
  if (inbox.length > 0)
    resumen.push(`${inbox.length} ${inbox.length === 1 ? 'captura' : 'capturas'} por procesar`)

  return (
    <div className="space-y-5">
      {/* Encabezado */}
      <header>
        <p className="text-sm font-medium text-teal-600 dark:text-teal-400">
          {fmtLong(now)}
        </p>
        <h1 className="mt-0.5 text-2xl font-bold tracking-tight">
          {greeting()}
          {userName ? `, ${userName}` : ''} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {resumen.length > 0
            ? `Hoy tienes ${resumen.join(' · ')}.`
            : 'Día despejado. Un buen momento para planear o descansar.'}
        </p>
      </header>

      {/* Bienvenida si aún no hay nombre */}
      {!userName && (
        <Card className="p-5">
          <h2 className="text-sm font-semibold">¡Bienvenido a Norte! 🧭</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            ¿Cómo te llamas? Así personalizamos tu espacio.
          </p>
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
              <IconStar className="w-3.5 h-3.5" /> Elegir
            </Btn>
          }
        />
        {priorities.length === 0 ? (
          <EmptyState
            icon={<IconStar className="w-10 h-10" />}
            title="Aún no eliges tus prioridades"
            hint="Elegir solo 3 cosas importantes hace que empezar sea fácil. Ese es el truco contra la procrastinación."
          />
        ) : (
          <div className="divide-y divide-slate-100 pb-2 dark:divide-slate-800">
            {priorities.map((t) => (
              <TaskRow key={t.id} task={t} onEdit={setEditing} showStar />
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
            icon={<IconCalendar className="w-10 h-10" />}
            title="Sin eventos para hoy"
            hint="Agrega eventos o rutinas desde la Agenda, o resérvale una hora a una tarea."
          />
        ) : (
          <div className="px-5 pb-4 pt-2">
            <ol className="relative ml-14 border-l-2 border-slate-100 dark:border-slate-800">
              {timeline.map((item) => {
                const area = areas.find((a) => a.id === item.areaId)
                const color = area ? AREA_COLORS[area.color] : null
                return (
                  <li key={item.key} className="relative mb-4 pl-4 last:mb-1">
                    <span
                      className={`absolute -left-[7px] top-1.5 h-3 w-3 rounded-full ring-4 ring-white dark:ring-slate-900 ${color?.dot ?? 'bg-slate-300 dark:bg-slate-600'}`}
                    />
                    <span className="absolute -left-16 top-0.5 w-11 text-right text-xs font-semibold tabular-nums text-slate-400 dark:text-slate-500">
                      {item.time}
                    </span>
                    <p className="text-sm font-medium leading-5">
                      {item.title}
                      {item.kind === 'tarea' && (
                        <span className="ml-2 rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
                          bloque de trabajo
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {item.end ? `${item.time} – ${item.end}` : item.time}
                      {area && ` · ${area.icon} ${area.name}`}
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
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all ${
                    done
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{h.icon}</span>
                  {h.name}
                  {done ? (
                    <IconCheck className="w-4 h-4" />
                  ) : streak > 0 ? (
                    <span className="flex items-center text-xs text-orange-500">
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
          <div className="divide-y divide-slate-100 pb-2 dark:divide-slate-800">
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
          <Card className="p-5 text-center">
            <IconSun className="mx-auto w-8 h-8 text-amber-400" />
            <p className="mt-2 text-sm font-semibold">¡Prioridades del día completadas!</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Lo importante ya está hecho. Todo lo demás es ganancia.
            </p>
          </Card>
        )}

      {pickerOpen && <PriorityPicker onClose={() => setPickerOpen(false)} />}
      {editing && <TaskModal initial={editing} onClose={() => setEditing(null)} />}
    </div>
  )
}
