import { useState } from 'react'
import { isToday } from 'date-fns'
import { useStore } from '../store'
import type { Habit } from '../types'
import {
  AREA_COLORS,
  dateStr,
  fmtWeekday,
  habitRate30,
  habitStreak,
  weekDays,
} from '../utils'
import { IconCheck, IconFlame, IconPlus } from '../icons'
import { Btn, Card, EmptyState } from '../components/ui'
import { HabitModal } from '../components/modals'

function HabitCard({ habit, onEdit }: { habit: Habit; onEdit: (h: Habit) => void }) {
  const { areas, toggleHabitOn } = useStore()
  const area = areas.find((a) => a.id === habit.areaId)
  const streak = habitStreak(habit)
  const rate = habitRate30(habit)
  const week = weekDays(new Date())
  const today = new Date()

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <button className="flex items-center gap-3 text-left" onClick={() => onEdit(habit)}>
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-xl dark:bg-slate-800">
            {habit.icon}
          </span>
          <div>
            <p className="text-sm font-semibold">{habit.name}</p>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
              {area && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${AREA_COLORS[area.color].chip}`}
                >
                  {area.icon} {area.name}
                </span>
              )}
              <span>{rate}% últimos 30 días</span>
            </div>
          </div>
        </button>
        <div
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-bold ${
            streak > 0
              ? 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400'
              : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
          }`}
          title="Racha actual"
        >
          <IconFlame className="w-4 h-4" />
          {streak}
        </div>
      </div>

      <div className="mt-3.5 flex justify-between gap-1">
        {week.map((d) => {
          const ds = dateStr(d)
          const applies = habit.days.includes(d.getDay())
          const done = habit.completions.includes(ds)
          const future = d > today && !isToday(d)
          return (
            <div key={ds} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[10px] font-medium uppercase text-slate-400 dark:text-slate-500">
                {fmtWeekday(d).slice(0, 2)}
              </span>
              <button
                disabled={!applies || future}
                onClick={() => toggleHabitOn(habit.id, ds)}
                aria-label={`${habit.name} — ${ds}`}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs transition-all ${
                  !applies
                    ? 'bg-transparent'
                    : done
                      ? 'bg-teal-600 text-white shadow-sm'
                      : future
                        ? 'bg-slate-100 dark:bg-slate-800 opacity-40'
                        : isToday(d)
                          ? 'bg-slate-100 ring-2 ring-teal-500/50 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-teal-500/10'
                          : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700'
                }`}
              >
                {applies && (done ? <IconCheck className="w-4 h-4" /> : '')}
              </button>
            </div>
          )
        })}
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-teal-500 transition-all duration-500"
          style={{ width: `${rate}%` }}
        />
      </div>
    </Card>
  )
}

export function Habits() {
  const habits = useStore((s) => s.habits)
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Habit | null>(null)

  return (
    <div className="space-y-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hábitos</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            La constancia le gana al talento. No rompas la racha. 🔥
          </p>
        </div>
        <Btn onClick={() => setCreating(true)}>
          <IconPlus className="w-4 h-4" /> Nuevo
        </Btn>
      </header>

      {habits.length === 0 ? (
        <Card>
          <EmptyState
            icon={<IconFlame className="w-10 h-10" />}
            title="Aún no tienes hábitos"
            hint='Empieza con uno pequeño y fácil de cumplir — "leer 10 minutos", "un vaso de agua al despertar". Lo pequeño y constante transforma más que lo grande y esporádico.'
          />
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {habits.map((h) => (
            <HabitCard key={h.id} habit={h} onEdit={setEditing} />
          ))}
        </div>
      )}

      {creating && <HabitModal onClose={() => setCreating(false)} />}
      {editing && <HabitModal initial={editing} onClose={() => setEditing(null)} />}
    </div>
  )
}
