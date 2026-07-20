import { useMemo, useState } from 'react'
import { addDays, format, isToday } from 'date-fns'
import { es } from 'date-fns/locale'
import { useStore } from '../store'
import type { CalendarEvent, Task } from '../types'
import { areaVar, dateStr, timeToMinutes, tint, weekDays } from '../utils'
import { IconChevronLeft, IconChevronRight, IconPlus } from '../icons'
import { Btn } from '../components/ui'
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

  const days = useMemo(() => weekDays(addDays(new Date(), weekOffset * 7)), [weekOffset])

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

  const rangeLabel = `${format(days[0], 'd MMM', { locale: es })} — ${format(days[6], "d 'de' MMM", { locale: es })}`

  const DayColumn = ({ d }: { d: Date }) => {
    const ds = dateStr(d)
    const items = itemsByDay.get(ds) ?? []
    const today = isToday(d)
    return (
      <div
        className={`flex min-h-28 flex-col rounded-md border bg-surface p-2.5 transition-colors ${
          today ? 'border-accent/60' : 'border-line'
        }`}
      >
        <div className="mb-2 flex items-center justify-between border-b border-line pb-1.5">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink3">
            {format(d, 'EEE', { locale: es }).replace('.', '')}{' '}
            <span className={`ml-1 text-[13px] tabular-nums ${today ? 'text-accent' : 'text-ink'}`}>
              {format(d, 'dd')}
            </span>
          </p>
          <button
            onClick={() => setCreatingOn(ds)}
            aria-label={`Agregar evento el ${format(d, 'EEEE d', { locale: es })}`}
            className="rounded-sm p-1 text-ink3 transition-colors hover:bg-surface2 hover:text-accent"
          >
            <IconPlus className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="space-y-1.5">
          {items.length === 0 && (
            <p className="px-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink3/50">
              Libre
            </p>
          )}
          {items.map((item) => {
            const area = areas.find((a) => a.id === item.areaId)
            const color = area ? areaVar(area.color) : 'var(--ink-3)'
            return (
              <button
                key={item.key}
                onClick={() =>
                  item.kind === 'evento' ? setEditingEvent(item.event!) : setEditingTask(item.task!)
                }
                className="w-full rounded-[3px] px-2 py-1.5 text-left transition-opacity hover:opacity-80"
                style={{ background: tint(color, 9), borderLeft: `2px solid ${color}` }}
              >
                <p className="truncate text-xs font-medium leading-4 text-ink">
                  {item.title}
                  {item.recurring && <span style={{ color }}> ↻</span>}
                </p>
                <p className="font-mono text-[10px] tabular-nums text-ink3">
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
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-5">
        <div>
          <p className="caption !text-accent">Time-blocking semanal</p>
          <h1 className="mt-2 font-display text-[28px] font-semibold tracking-tight">Agenda</h1>
          <p className="mt-1.5 font-mono text-[11px] text-ink3">{rangeLabel}</p>
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

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-7 xl:gap-2">
        {days.map((d) => (
          <DayColumn key={dateStr(d)} d={d} />
        ))}
      </div>

      <p className="text-xs leading-relaxed text-ink3">
        <span className="caption !text-[9px]">Nota</span> — lo que no tiene hora, rara vez se
        hace. Los eventos con ↻ son rutinas semanales; los "bloques" son tareas a las que les
        reservaste una hora desde su formulario.
      </p>

      {creatingOn && <EventModal presetDate={creatingOn} onClose={() => setCreatingOn(null)} />}
      {editingEvent && <EventModal initial={editingEvent} onClose={() => setEditingEvent(null)} />}
      {editingTask && <TaskModal initial={editingTask} onClose={() => setEditingTask(null)} />}
    </div>
  )
}
