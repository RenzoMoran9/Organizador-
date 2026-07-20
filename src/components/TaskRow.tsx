import { useStore } from '../store'
import type { Task } from '../types'
import { AREA_COLORS, fmtShort, PRIORITY_META, todayStr } from '../utils'
import { IconCheck, IconClock, IconStar } from '../icons'

export function TaskRow({
  task,
  onEdit,
  showStar,
}: {
  task: Task
  onEdit: (task: Task) => void
  showStar?: boolean
}) {
  const { toggleTask, toggleSubtask, areas } = useStore()
  const area = areas.find((a) => a.id === task.areaId)
  const overdue = !task.done && !!task.dueDate && task.dueDate < todayStr()
  const doneSubs = task.subtasks.filter((s) => s.done).length

  return (
    <div className="group px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <div className="flex items-start gap-3">
        <button
          onClick={() => toggleTask(task.id)}
          aria-label={task.done ? 'Marcar pendiente' : 'Completar tarea'}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
            task.done
              ? 'border-teal-500 bg-teal-500 text-white'
              : 'border-slate-300 dark:border-slate-600 hover:border-teal-500'
          }`}
        >
          {task.done && <IconCheck className="w-3 h-3" />}
        </button>

        <button className="flex-1 text-left min-w-0" onClick={() => onEdit(task)}>
          <div className="flex items-center gap-2">
            {showStar && task.priorityOn === todayStr() && (
              <IconStar className="w-3.5 h-3.5 shrink-0 text-amber-500 fill-amber-400" />
            )}
            <span
              className={`text-sm truncate ${
                task.done
                  ? 'text-slate-400 dark:text-slate-500 line-through'
                  : 'text-slate-800 dark:text-slate-100'
              }`}
            >
              {task.title}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
            {area && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${AREA_COLORS[area.color].chip}`}
              >
                {area.icon} {area.name}
              </span>
            )}
            {task.priority !== 'baja' && !task.done && (
              <span
                className={`rounded-full px-2 py-0.5 font-medium ${PRIORITY_META[task.priority].chip}`}
              >
                {PRIORITY_META[task.priority].label}
              </span>
            )}
            {task.dueDate && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${
                  overdue
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                <IconClock className="w-3 h-3" />
                {fmtShort(task.dueDate)}
                {task.scheduledTime && ` · ${task.scheduledTime}`}
              </span>
            )}
            {task.subtasks.length > 0 && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                {doneSubs}/{task.subtasks.length} pasos
              </span>
            )}
          </div>
        </button>
      </div>

      {!task.done && task.subtasks.length > 0 && (
        <div className="ml-8 mt-2 space-y-1">
          {task.subtasks.map((st) => (
            <button
              key={st.id}
              onClick={() => toggleSubtask(task.id, st.id)}
              className="flex w-full items-center gap-2 text-left"
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
                  st.done
                    ? 'border-teal-500 bg-teal-500 text-white'
                    : 'border-slate-300 dark:border-slate-600'
                }`}
              >
                {st.done && <IconCheck className="w-2.5 h-2.5" />}
              </span>
              <span
                className={`text-xs ${
                  st.done
                    ? 'text-slate-400 line-through dark:text-slate-500'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {st.title}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
