import { useMemo, useState } from 'react'
import { useStore } from '../store'
import type { Task } from '../types'
import { areaVar, tint, todayStr } from '../utils'
import { IconPlus, IconTasks } from '../icons'
import { Btn, Card, CardHeader, EmptyState, segCls } from '../components/ui'
import { AreaMark } from '../components/AreaMark'
import { TaskRow } from '../components/TaskRow'
import { TaskModal } from '../components/modals'

type Tab = 'pendientes' | 'completadas'

export function Tasks() {
  const { tasks, areas } = useStore()
  const [tab, setTab] = useState<Tab>('pendientes')
  const [areaFilter, setAreaFilter] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)

  const hoy = todayStr()

  const filtered = useMemo(() => {
    let list = tasks.filter((t) => (tab === 'pendientes' ? !t.done : t.done))
    if (areaFilter) list = list.filter((t) => t.areaId === areaFilter)
    return list
  }, [tasks, tab, areaFilter])

  const groups = useMemo(() => {
    if (tab === 'completadas') {
      return [
        {
          label: 'Completadas',
          items: [...filtered].sort((a, b) =>
            (b.completedAt ?? '') < (a.completedAt ?? '') ? -1 : 1
          ),
        },
      ].filter((g) => g.items.length > 0)
    }
    const byDue = (a: Task, b: Task) => ((a.dueDate ?? '9999') < (b.dueDate ?? '9999') ? -1 : 1)
    return [
      { label: 'Vencidas', items: filtered.filter((t) => t.dueDate && t.dueDate < hoy).sort(byDue) },
      { label: 'Para hoy', items: filtered.filter((t) => t.dueDate === hoy) },
      { label: 'Próximas', items: filtered.filter((t) => t.dueDate && t.dueDate > hoy).sort(byDue) },
      { label: 'Sin fecha', items: filtered.filter((t) => !t.dueDate) },
    ].filter((g) => g.items.length > 0)
  }, [filtered, tab, hoy])

  const pendingCount = tasks.filter((t) => !t.done).length
  const doneCount = tasks.length - pendingCount

  return (
    <div className="space-y-5">
      <header className="flex items-end justify-between gap-3 border-b border-line pb-5">
        <div>
          <p className="caption !text-accent">Organizar · Ejecutar</p>
          <h1 className="mt-2 font-display text-[28px] font-semibold tracking-tight">Tareas</h1>
          <p className="mt-1.5 font-mono text-[11px] text-ink3 tabular-nums">
            {pendingCount} pendientes · {doneCount} completadas
          </p>
        </div>
        <Btn onClick={() => setCreating(true)}>
          <IconPlus className="w-4 h-4" /> Nueva
        </Btn>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1.5">
          {(['pendientes', 'completadas'] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={segCls(tab === t) + ' capitalize'}>
              {t}
            </button>
          ))}
        </div>
        <span className="mx-1 hidden h-4 w-px bg-line sm:block" />
        <div className="flex flex-wrap gap-1.5">
          {areas.map((a) => (
            <button
              key={a.id}
              onClick={() => setAreaFilter(areaFilter === a.id ? null : a.id)}
              className="inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1.5 text-xs font-medium transition-colors"
              style={
                areaFilter === a.id
                  ? {
                      borderColor: areaVar(a.color),
                      color: areaVar(a.color),
                      background: tint(areaVar(a.color), 10),
                    }
                  : { borderColor: 'var(--line)', color: 'var(--ink-2)' }
              }
            >
              <AreaMark area={a} size={9} />
              {a.name}
            </button>
          ))}
        </div>
      </div>

      {groups.length === 0 ? (
        <Card>
          <EmptyState
            icon={<IconTasks className="w-9 h-9" />}
            title={
              tab === 'pendientes'
                ? areaFilter
                  ? 'Nada pendiente en esta área'
                  : 'No tienes tareas pendientes'
                : 'Aún no hay tareas completadas'
            }
            hint={
              tab === 'pendientes'
                ? 'Crea una tarea con el botón "Nueva" o convierte capturas desde tu Bandeja.'
                : 'Cuando completes tareas aparecerán aquí: tu historial de logros.'
            }
          />
        </Card>
      ) : (
        groups.map((g) => (
          <Card key={g.label}>
            <CardHeader
              title={g.label}
              subtitle={`${g.items.length} ${g.items.length === 1 ? 'tarea' : 'tareas'}`}
            />
            <div className="divide-y divide-line pb-2">
              {g.items.map((t) => (
                <TaskRow key={t.id} task={t} onEdit={setEditing} />
              ))}
            </div>
          </Card>
        ))
      )}

      {creating && <TaskModal onClose={() => setCreating(false)} />}
      {editing && <TaskModal initial={editing} onClose={() => setEditing(null)} />}
    </div>
  )
}
