import { useMemo, useState } from 'react'
import { useStore } from '../store'
import type { Task } from '../types'
import { AREA_COLORS, todayStr } from '../utils'
import { IconPlus, IconTasks } from '../icons'
import { Btn, Card, CardHeader, EmptyState } from '../components/ui'
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
    const byDue = (a: Task, b: Task) =>
      (a.dueDate ?? '9999') < (b.dueDate ?? '9999') ? -1 : 1
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
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tareas</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {pendingCount} pendientes · {doneCount} completadas
          </p>
        </div>
        <Btn onClick={() => setCreating(true)}>
          <IconPlus className="w-4 h-4" /> Nueva
        </Btn>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          {(['pendientes', 'completadas'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium capitalize transition-colors ${
                tab === t
                  ? 'bg-white shadow-sm dark:bg-slate-700'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {areas.map((a) => (
            <button
              key={a.id}
              onClick={() => setAreaFilter(areaFilter === a.id ? null : a.id)}
              className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
                areaFilter === a.id
                  ? AREA_COLORS[a.color].chip + ' ring-2 ring-current'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
              }`}
            >
              {a.icon} {a.name}
            </button>
          ))}
        </div>
      </div>

      {groups.length === 0 ? (
        <Card>
          <EmptyState
            icon={<IconTasks className="w-10 h-10" />}
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
                : 'Cuando completes tareas aparecerán aquí. ¡Tu historial de logros!'
            }
          />
        </Card>
      ) : (
        groups.map((g) => (
          <Card key={g.label}>
            <CardHeader title={g.label} subtitle={`${g.items.length} ${g.items.length === 1 ? 'tarea' : 'tareas'}`} />
            <div className="divide-y divide-slate-100 pb-2 dark:divide-slate-800">
              {g.items.map((t) => (
                <TaskRow key={t.id} task={t} onEdit={setEditing} showStar />
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
