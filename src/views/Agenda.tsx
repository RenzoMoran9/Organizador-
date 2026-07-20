import { useMemo, useState } from 'react'
import { addDays, format, isToday } from 'date-fns'
import { es } from 'date-fns/locale'
import { useStore } from '../store'
import type { CalendarEvent, Task } from '../types'
import { AREA_COLORS, dateStr, timeToMinutes, weekDays } from '../utils'
import { IconChevronLeft, IconChevronRight, IconPlus } from '../icons'
import { Btn, Card } from '../components/ui'
import { EventModal, TaskModal } from '../components/modals'

interface DayItem {
  key: string
  time: string
  end?: string
  title: string
  areaId?: string
  recurring: boolean
  kind: 'evento' | 'tarea'
  event?: CalendarEvent
  task?: Task
}

export function Agenda() {
  const { events, tasks, areas } = useStore()
  const [weekOffset, setWeekOffset] = useState(0)
  const [creatingOn, setCreatingOn] = useState<string | null>(null)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const days = useMemo(
    () => weekDays(addDays(new Date(), weekOffset * 7)),
    [weekOffset]
  )

  const itemsByDay = useMemo(() => {
    const map = new Map<string, DayItem[]>()
    for (const d of days) {
      const ds = dateStr(d)
      const wd = d.getDay()
      const items: DayItem[] = []
      for (const e of events) {
        if (e.date === ds || e.recurringDays?.includes(wd)) {
          items.push({
            key: 'e' + e.id,
            time: e.startTime,
            end: e.endTime,
            title: e.title,
            areaId: e.areaId,
            recurring: !!e.recurringDays?.length,
            kind: 'evento',
            event: e,
          })
        }
      }
      for (const t of tasks) {
        if (!t.done && t.dueDate === ds && t.scheduledTime) {
          items.push({
            key: 't' + t.id,
            time: t.scheduledTime,
            title: t.title,
            areaId: t.areaId,
            recurring: false,
            kind: 'tarea',
            task: t,
          })
        }
      }
      items.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time))
      map.set(ds, items)
    }
    return map
  }, [days, events, tasks])

  const rangeLabel = `${format(days[0], "d MMM", { locale: es })} — ${format(days[6], "d 'de' MMM", { locale: es })}`

  const DayColumn = ({ d }: { d: Date }) => {
    const ds = dateStr(d)
    const items = itemsByDay.get(ds) ?? []
    const today = isToday(d)
    return (
      <div
        className={`flex min-h-28 flex-col rounded-2xl p-2.5 ring-1 transition-colors ${
          today
            ? 'bg-teal-50/70 ring-teal-500/30 dark:bg-teal-500/5 dark:ring-teal-400/20'
            : 'bg-white ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10'
        }`}
      >
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold capitalize text-slate-500 dark:text-slate-400">
            {format(d, 'EEE', { locale: es })}{' '}
            <span
              className={`ml-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs tabular-nums ${
                today
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              {format(d, 'd')}
            </span>
          </p>
          <button
            onClick={() => setCreatingOn(ds)}
            aria-label={`Agregar evento el ${format(d, 'EEEE d', { locale: es })}`}
            className="rounded-lg p-1 text-slate-300 transition-colors hover:bg-slate-100 hover:text-teal-600 dark:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-teal-400"
          >
            <IconPlus className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-1.5">
          {items.length === 0 && (
            <p className="px-1 text-[11px] text-slate-300 dark:text-slate-600">Libre</p>
          )}
          {items.map((item) => {
            const area = areas.find((a) => a.id === item.areaId)
            const color = area ? AREA_COLORS[area.color] : null
            return (
              <button
                key={item.key}
                onClick={() =>
                  item.kind === 'evento'
                    ? setEditingEvent(item.event!)
                    : setEditingTask(item.task!)
                }
                className={`w-full rounded-lg border-l-4 bg-slate-50 px-2 py-1.5 text-left transition-colors hover:bg-slate-100 dark:bg-slate-800/70 dark:hover:bg-slate-800 ${
                  color?.soft ?? 'border-slate-300 dark:border-slate-600'
                }`}
              >
                <p className="truncate text-xs font-medium leading-4">
                  {item.title}
                  {item.recurring && ' ↻'}
                </p>
                <p className="text-[10px] tabular-nums text-slate-400 dark:text-slate-500">
                  {item.time}
                  {item.end && `–${item.end}`}
                  {item.kind === 'tarea' && ' · bloque'}
                </p>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agenda</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{rangeLabel}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <Btn variant="ghost" onClick={() => setWeekOffset((o) => o - 1)} className="!px-2.5">
            <IconChevronLeft className="w-4 h-4" />
          </Btn>
          {weekOffset !== 0 && (
            <Btn variant="soft" onClick={() => setWeekOffset(0)} className="!px-3 text-xs">
              Hoy
            </Btn>
          )}
          <Btn variant="ghost" onClick={() => setWeekOffset((o) => o + 1)} className="!px-2.5">
            <IconChevronRight className="w-4 h-4" />
          </Btn>
          <Btn onClick={() => setCreatingOn(dateStr(new Date()))}>
            <IconPlus className="w-4 h-4" /> Evento
          </Btn>
        </div>
      </header>

      <Card className="p-3 sm:p-4 !bg-slate-50/50 dark:!bg-slate-950/50 !shadow-none !ring-0">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-7 xl:gap-2">
          {days.map((d) => (
            <DayColumn key={dateStr(d)} d={d} />
          ))}
        </div>
      </Card>

      <p className="text-xs text-slate-400 dark:text-slate-500">
        💡 <strong>Time-blocking:</strong> lo que no tiene hora, rara vez se hace. Los
        eventos con ↻ son rutinas semanales; los "bloques" son tareas a las que les
        reservaste una hora desde su formulario.
      </p>

      {creatingOn && (
        <EventModal presetDate={creatingOn} onClose={() => setCreatingOn(null)} />
      )}
      {editingEvent && (
        <EventModal initial={editingEvent} onClose={() => setEditingEvent(null)} />
      )}
      {editingTask && (
        <TaskModal initial={editingTask} onClose={() => setEditingTask(null)} />
      )}
    </div>
  )
}
