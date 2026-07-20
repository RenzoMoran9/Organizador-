import { useState } from 'react'
import { useStore } from '../store'
import type { CalendarEvent, Habit, Priority, Subtask, Task } from '../types'
import { areaVar, PRIORITY_META, tint, uid, WEEKDAYS } from '../utils'
import { IconPlus, IconTrash, IconX } from '../icons'
import { AreaMark } from './AreaMark'
import { Btn, Field, inputCls, Modal, segCls } from './ui'

export function AreaPicker({
  value,
  onChange,
}: {
  value?: string
  onChange: (id?: string) => void
}) {
  const areas = useStore((s) => s.areas)
  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        type="button"
        onClick={() => onChange(undefined)}
        className={segCls(!value)}
      >
        Sin área
      </button>
      {areas.map((a) => (
        <button
          key={a.id}
          type="button"
          onClick={() => onChange(a.id)}
          className="inline-flex items-center gap-1.5 rounded-sm border px-3 py-2 text-xs font-medium transition-colors"
          style={
            value === a.id
              ? {
                  borderColor: areaVar(a.color),
                  color: areaVar(a.color),
                  background: tint(areaVar(a.color), 10),
                }
              : { borderColor: 'var(--line)', color: 'var(--ink-2)' }
          }
        >
          <AreaMark area={a} size={10} />
          {a.name}
        </button>
      ))}
    </div>
  )
}

export function WeekdayPicker({
  value,
  onChange,
}: {
  value: number[]
  onChange: (days: number[]) => void
}) {
  const toggle = (d: number) =>
    onChange(value.includes(d) ? value.filter((x) => x !== d) : [...value, d])
  return (
    <div className="flex gap-1.5">
      {WEEKDAYS.map((w) => (
        <button
          key={w.day}
          type="button"
          onClick={() => toggle(w.day)}
          title={w.full}
          className={`h-9 w-9 rounded-sm border font-mono text-xs font-semibold transition-colors ${
            value.includes(w.day)
              ? 'border-accent bg-accent text-onaccent'
              : 'border-line text-ink2 hover:border-ink3'
          }`}
        >
          {w.label}
        </button>
      ))}
    </div>
  )
}

export function TaskModal({
  initial,
  presetTitle,
  presetDate,
  onClose,
  onSaved,
}: {
  initial?: Task
  presetTitle?: string
  presetDate?: string
  onClose: () => void
  onSaved?: () => void
}) {
  const { addTask, updateTask, deleteTask } = useStore()
  const [title, setTitle] = useState(initial?.title ?? presetTitle ?? '')
  const [areaId, setAreaId] = useState<string | undefined>(initial?.areaId)
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? 'media')
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? presetDate ?? '')
  const [scheduledTime, setScheduledTime] = useState(initial?.scheduledTime ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [subtasks, setSubtasks] = useState<Subtask[]>(initial?.subtasks ?? [])
  const [newSub, setNewSub] = useState('')

  const addSub = () => {
    const t = newSub.trim()
    if (!t) return
    setSubtasks((s) => [...s, { id: uid(), title: t, done: false }])
    setNewSub('')
  }

  const save = () => {
    const t = title.trim()
    if (!t) return
    const data = {
      title: t,
      areaId,
      priority,
      dueDate: dueDate || undefined,
      scheduledTime: scheduledTime || undefined,
      notes: notes.trim() || undefined,
      subtasks,
    }
    if (initial) updateTask(initial.id, data)
    else addTask(data)
    onSaved?.()
    onClose()
  }

  return (
    <Modal title={initial ? 'Editar tarea' : 'Nueva tarea'} onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          save()
        }}
      >
        <Field label="Qué hay que hacer">
          <input
            autoFocus
            className={inputCls}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej.: Enviar el informe mensual"
          />
        </Field>

        <Field label="Área de vida">
          <AreaPicker value={areaId} onChange={setAreaId} />
        </Field>

        <Field label="Prioridad">
          <div className="grid grid-cols-3 gap-1.5">
            {(['alta', 'media', 'baja'] as Priority[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className="rounded-sm border px-3 py-2 text-xs font-medium transition-colors"
                style={
                  priority === p
                    ? {
                        borderColor: PRIORITY_META[p].color,
                        color: PRIORITY_META[p].color,
                        background: tint(PRIORITY_META[p].color, 10),
                      }
                    : { borderColor: 'var(--line)', color: 'var(--ink-2)' }
                }
              >
                {PRIORITY_META[p].label}
              </button>
            ))}
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Fecha">
            <input
              type="date"
              className={inputCls + ' font-mono text-xs'}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </Field>
          <Field label="Hora — reservar bloque">
            <input
              type="time"
              className={inputCls + ' font-mono text-xs'}
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
            />
          </Field>
        </div>

        <Field label="Pasos pequeños">
          <div className="space-y-1.5">
            {subtasks.map((st) => (
              <div
                key={st.id}
                className="flex items-center gap-2 rounded-sm border border-line bg-paper px-3 py-2"
              >
                <span className="flex-1 text-sm">{st.title}</span>
                <button
                  type="button"
                  onClick={() => setSubtasks((s) => s.filter((x) => x.id !== st.id))}
                  className="text-ink3 hover:text-oxide transition-colors"
                  aria-label={`Quitar ${st.title}`}
                >
                  <IconX className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="flex gap-1.5">
              <input
                className={inputCls}
                value={newSub}
                onChange={(e) => setNewSub(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addSub()
                  }
                }}
                placeholder="Divide la tarea en pasos de 15 min…"
              />
              <Btn variant="soft" onClick={addSub}>
                <IconPlus className="w-4 h-4" />
              </Btn>
            </div>
          </div>
        </Field>

        <Field label="Notas">
          <textarea
            className={inputCls + ' min-h-20 resize-y'}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Detalles, enlaces, contexto…"
          />
        </Field>

        <div className="flex items-center justify-between pt-1">
          {initial ? (
            <Btn
              variant="danger"
              onClick={() => {
                deleteTask(initial.id)
                onClose()
              }}
            >
              <IconTrash className="w-4 h-4" /> Eliminar
            </Btn>
          ) : (
            <span />
          )}
          <Btn type="submit" disabled={!title.trim()}>
            Guardar
          </Btn>
        </div>
      </form>
    </Modal>
  )
}

export function EventModal({
  initial,
  presetTitle,
  presetDate,
  onClose,
  onSaved,
}: {
  initial?: CalendarEvent
  presetTitle?: string
  presetDate?: string
  onClose: () => void
  onSaved?: () => void
}) {
  const { addEvent, updateEvent, deleteEvent } = useStore()
  const [title, setTitle] = useState(initial?.title ?? presetTitle ?? '')
  const [areaId, setAreaId] = useState<string | undefined>(initial?.areaId)
  const [recurring, setRecurring] = useState(!!initial?.recurringDays?.length)
  const [date, setDate] = useState(initial?.date ?? presetDate ?? '')
  const [days, setDays] = useState<number[]>(initial?.recurringDays ?? [])
  const [startTime, setStartTime] = useState(initial?.startTime ?? '')
  const [endTime, setEndTime] = useState(initial?.endTime ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')

  const valid = title.trim() && startTime && (recurring ? days.length > 0 : !!date)

  const save = () => {
    if (!valid) return
    const data = {
      title: title.trim(),
      areaId,
      date: recurring ? undefined : date,
      recurringDays: recurring ? days : undefined,
      startTime,
      endTime: endTime || undefined,
      notes: notes.trim() || undefined,
    }
    if (initial) updateEvent(initial.id, data)
    else addEvent(data)
    onSaved?.()
    onClose()
  }

  return (
    <Modal title={initial ? 'Editar evento' : 'Nuevo evento'} onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          save()
        }}
      >
        <Field label="Título">
          <input
            autoFocus
            className={inputCls}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej.: Reunión de equipo"
          />
        </Field>

        <Field label="Área de vida">
          <AreaPicker value={areaId} onChange={setAreaId} />
        </Field>

        <div className="grid grid-cols-2 gap-1.5">
          <button type="button" onClick={() => setRecurring(false)} className={segCls(!recurring)}>
            Fecha única
          </button>
          <button type="button" onClick={() => setRecurring(true)} className={segCls(recurring)}>
            Rutina semanal
          </button>
        </div>

        {recurring ? (
          <Field label="Se repite los días">
            <WeekdayPicker value={days} onChange={setDays} />
          </Field>
        ) : (
          <Field label="Fecha">
            <input
              type="date"
              className={inputCls + ' font-mono text-xs'}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Field label="Empieza">
            <input
              type="time"
              className={inputCls + ' font-mono text-xs'}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </Field>
          <Field label="Termina — opcional">
            <input
              type="time"
              className={inputCls + ' font-mono text-xs'}
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </Field>
        </div>

        <Field label="Notas">
          <textarea
            className={inputCls + ' min-h-16 resize-y'}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Lugar, enlace de la videollamada…"
          />
        </Field>

        <div className="flex items-center justify-between pt-1">
          {initial ? (
            <Btn
              variant="danger"
              onClick={() => {
                deleteEvent(initial.id)
                onClose()
              }}
            >
              <IconTrash className="w-4 h-4" /> Eliminar
            </Btn>
          ) : (
            <span />
          )}
          <Btn type="submit" disabled={!valid}>
            Guardar
          </Btn>
        </div>
      </form>
    </Modal>
  )
}

const HABIT_ICONS = ['💧', '📖', '🏃', '🏋️', '🧘', '😴', '🥗', '💊', '✍️', '🎸', '🚭', '🌅']

export function HabitModal({
  initial,
  onClose,
}: {
  initial?: Habit
  onClose: () => void
}) {
  const { addHabit, updateHabit, deleteHabit } = useStore()
  const [name, setName] = useState(initial?.name ?? '')
  const [icon, setIcon] = useState(initial?.icon ?? '💧')
  const [areaId, setAreaId] = useState<string | undefined>(initial?.areaId)
  const [days, setDays] = useState<number[]>(initial?.days ?? [1, 2, 3, 4, 5, 6, 0])

  const valid = name.trim() && days.length > 0

  const save = () => {
    if (!valid) return
    const data = { name: name.trim(), icon, areaId, days }
    if (initial) updateHabit(initial.id, data)
    else addHabit(data)
    onClose()
  }

  return (
    <Modal title={initial ? 'Editar hábito' : 'Nuevo hábito'} onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          save()
        }}
      >
        <Field label="Hábito">
          <input
            autoFocus
            className={inputCls}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej.: Leer 10 minutos"
          />
        </Field>

        <Field label="Símbolo">
          <div className="flex flex-wrap gap-1.5">
            {HABIT_ICONS.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIcon(i)}
                className={`h-10 w-10 rounded-sm border text-lg transition-colors ${
                  icon === i
                    ? 'border-accent bg-accent/8'
                    : 'border-line hover:border-ink3'
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Días de la semana">
          <WeekdayPicker value={days} onChange={setDays} />
        </Field>

        <Field label="Área de vida">
          <AreaPicker value={areaId} onChange={setAreaId} />
        </Field>

        <div className="flex items-center justify-between pt-1">
          {initial ? (
            <Btn
              variant="danger"
              onClick={() => {
                deleteHabit(initial.id)
                onClose()
              }}
            >
              <IconTrash className="w-4 h-4" /> Eliminar
            </Btn>
          ) : (
            <span />
          )}
          <Btn type="submit" disabled={!valid}>
            Guardar
          </Btn>
        </div>
      </form>
    </Modal>
  )
}
