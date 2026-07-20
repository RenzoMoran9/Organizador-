import { useStore } from '../store'
import type { Task } from '../types'
import { fmtShort, PRIORITY_META, tint, todayStr } from '../utils'
import { IconCheck, IconClock } from '../icons'
import { AreaChip } from './AreaMark'

export function TaskRow({
  task,
  onEdit,
  marker,
}: {
  task: Task
  onEdit: (task: Task) => void
  /** Índice mono (p. ej. "01") para listas ordenadas como las prioridades del día */
  marker?: string
}) {
  const { toggleTask, toggleSubtask, areas } = useStore()
  const area = areas.find((a) => a.id === task.areaId)
  const overdue = !task.done && !!task.dueDate && task.dueDate < todayStr()
  const doneSubs = task.subtasks.filter((s) => s.done).length
  const isPriorityToday = task.priorityOn === todayStr()

  return (
    <div className="group px-5 py-3 transition-colors hover:bg-surface2/50">
      <div className="flex items-start gap-3">
        {marker && (
          <span className="mt-0.5 font-mono text-[11px] font-semibold text-accent tabular-nums">
            {marker}
          </span>
        )}
        <button
          onClick={() => toggleTask(task.id)}
          aria-label={task.done ? 'Marcar pendiente' : 'Completar tarea'}
          className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[3px] border transition-all ${
            task.done
              ? 'border-accent bg-accent text-onaccent'
              : 'border-ink3 hover:border-accent'
          }`}
        >
          {task.done && <IconCheck className="w-3 h-3" />}
        </button>

        <button className="flex-1 text-left min-w-0" onClick={() => onEdit(task)}>
          <span
            className={`text-sm block truncate transition-colors ${
              task.done ? 'text-ink3 line-through' : 'text-ink'
            }`}
          >
            {task.title}
          </span>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {area && <AreaChip area={area} />}
            {task.priority !== 'baja' && !task.done && (
              <span
                className="rounded-[3px] px-2 py-0.5 text-[11px] font-medium"
                style={{
                  color: PRIORITY_META[task.priority].color,
                  background: tint(PRIORITY_META[task.priority].color, 10),
                }}
              >
                {PRIORITY_META[task.priority].label}
              </span>
            )}
            {task.dueDate && (
              <span
                className={`inline-flex items-center gap-1 rounded-[3px] px-2 py-0.5 font-mono text-[10px] font-medium ${
                  overdue ? 'text-oxide bg-oxide/10' : 'text-ink3 bg-surface2'
                }`}
              >
                <IconClock className="w-3 h-3" />
                {fmtShort(task.dueDate)}
                {task.scheduledTime && ` · ${task.scheduledTime}`}
              </span>
            )}
            {task.subtasks.length > 0 && (
              <span className="rounded-[3px] bg-surface2 px-2 py-0.5 font-mono text-[10px] font-medium text-ink3 tabular-nums">
                {doneSubs}/{task.subtasks.length} pasos
              </span>
            )}
            {!marker && isPriorityToday && !task.done && (
              <span className="rounded-[3px] px-2 py-0.5 text-[11px] font-medium text-accent bg-accent/10">
                Prioridad de hoy
              </span>
            )}
          </div>
        </button>
      </div>

      {!task.done && task.subtasks.length > 0 && (
        <div className={`${marker ? 'ml-14' : 'ml-8'} mt-2 space-y-1`}>
          {task.subtasks.map((st) => (
            <button
              key={st.id}
              onClick={() => toggleSubtask(task.id, st.id)}
              className="flex w-full items-center gap-2 text-left"
            >
              <span
                className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[2px] border transition-all ${
                  st.done ? 'border-accent bg-accent text-onaccent' : 'border-ink3'
                }`}
              >
                {st.done && <IconCheck className="w-2.5 h-2.5" />}
              </span>
              <span className={`text-xs ${st.done ? 'text-ink3 line-through' : 'text-ink2'}`}>
                {st.title}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
