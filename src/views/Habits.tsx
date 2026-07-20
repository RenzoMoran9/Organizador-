import { useState } from 'react'
import { isToday } from 'date-fns'
import { useStore } from '../store'
import type { Habit } from '../types'
import { dateStr, fmtWeekday, habitRate30, habitStreak, weekDays } from '../utils'
import { IconCheck, IconFlame, IconPlus } from '../icons'
import { Btn, Card, EmptyState } from '../components/ui'
import { AreaChip } from '../components/AreaMark'
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
          <span className="flex h-10 w-10 items-center justify-center rounded-sm border border-line bg-paper text-lg">
            {habit.icon}
          </span>
          <div>
            <p className="text-sm font-semibold">{habit.name}</p>
            <div className="mt-1 flex items-center gap-1.5">
              {area && <AreaChip area={area} />}
              <span className="font-mono text-[10px] text-ink3 tabular-nums">{rate}% / 30 días</span>
            </div>
          </div>
        </button>
        <div
          className={`flex items-center gap-1 rounded-sm border px-2 py-1 font-mono text-sm font-semibold tabular-nums ${
            streak > 0 ? 'border-ochre/40 text-ochre' : 'border-line text-ink3'
          }`}
          title="Racha actual"
        >
          <IconFlame className="w-3.5 h-3.5" />
          {streak}
        </div>
      </div>

      <div className="mt-4 flex justify-between gap-1">
        {week.map((d) => {
          const ds = dateStr(d)
          const applies = habit.days.includes(d.getDay())
          const done = habit.completions.includes(ds)
          const future = d > today && !isToday(d)
          const esHoy = isToday(d)
          return (
            <div key={ds} className="flex flex-1 flex-col items-center gap-1.5">
              <span className="font-mono text-[9px] font-medium uppercase tracking-[0.08em] text-ink3">
                {fmtWeekday(d).replace('.', '').slice(0, 2)}
              </span>
              <button
                disabled={!applies || future}
                onClick={() => toggleHabitOn(habit.id, ds)}
                aria-label={`${habit.name} — ${ds}`}
                data-today={esHoy || undefined}
                className={`flex h-7 w-7 items-center justify-center rounded-[3px] border transition-colors ${
                  !applies
                    ? 'border-transparent'
                    : done
                      ? 'border-accent bg-accent text-onaccent'
                      : future
                        ? 'border-line opacity-35'
                        : esHoy
                          ? 'border-accent/70 hover:bg-accent/10'
                          : 'border-line hover:border-ink3'
                }`}
              >
                {applies && done && <IconCheck className="w-3.5 h-3.5" />}
                {!applies && <span className="h-px w-2.5 bg-line" />}
              </button>
            </div>
          )
        })}
      </div>

      <div className="mt-3.5 h-1 overflow-hidden rounded-full bg-surface2">
        <div
          className="h-full bg-accent transition-all duration-500"
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
      <header className="flex items-end justify-between gap-3 border-b border-line pb-5">
        <div>
          <p className="caption !text-accent">Constancia diaria</p>
          <h1 className="mt-2 font-display text-[28px] font-semibold tracking-tight">Hábitos</h1>
          <p className="mt-1.5 text-sm text-ink2">
            La constancia le gana al talento. No rompas la racha.
          </p>
        </div>
        <Btn onClick={() => setCreating(true)}>
          <IconPlus className="w-4 h-4" /> Nuevo
        </Btn>
      </header>

      {habits.length === 0 ? (
        <Card>
          <EmptyState
            icon={<IconFlame className="w-9 h-9" />}
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
