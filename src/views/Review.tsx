import { useMemo, useState } from 'react'
import { addDays, format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useStore } from '../store'
import type { Task } from '../types'
import { AREA_COLORS, dateStr, todayStr, weekDays } from '../utils'
import {
  IconArrowRight,
  IconChart,
  IconCheck,
  IconSparkles,
  IconTarget,
  IconTrash,
  IconX,
} from '../icons'
import { Btn, Card, CardHeader, EmptyState } from '../components/ui'

export function Review() {
  const { tasks, habits, focusSessions, areas, updateTask, deleteTask, lastReviewDate, markReviewDone } =
    useStore()
  const [celebrando, setCelebrando] = useState(false)

  const week = weekDays(new Date())
  const weekSet = new Set(week.map(dateStr))
  const hoy = todayStr()

  const stats = useMemo(() => {
    const completedThisWeek = tasks.filter(
      (t) => t.done && t.completedAt && weekSet.has(t.completedAt.slice(0, 10))
    )
    const focusMinutes = focusSessions
      .filter((s) => weekSet.has(s.date))
      .reduce((acc, s) => acc + s.minutes, 0)

    let habitHits = 0
    let habitSlots = 0
    for (const h of habits) {
      for (const d of week) {
        if (d > new Date()) continue
        if (h.days.includes(d.getDay())) {
          habitSlots++
          if (h.completions.includes(dateStr(d))) habitHits++
        }
      }
    }

    const byArea = areas
      .map((a) => ({
        area: a,
        count: completedThisWeek.filter((t) => t.areaId === a.id).length,
      }))
      .filter((x) => x.count > 0)
    const maxArea = Math.max(1, ...byArea.map((x) => x.count))

    return {
      completedThisWeek,
      focusMinutes,
      habitPct: habitSlots === 0 ? null : Math.round((habitHits / habitSlots) * 100),
      byArea,
      maxArea,
    }
  }, [tasks, focusSessions, habits, areas]) // eslint-disable-line react-hooks/exhaustive-deps

  const pendientes = tasks.filter((t) => !t.done && t.dueDate && t.dueDate < hoy)
  const nextMonday = dateStr(addDays(weekDays(new Date())[0], 7))
  const reviewedThisWeek = !!lastReviewDate && weekSet.has(lastReviewDate)

  const finish = () => {
    markReviewDone()
    setCelebrando(true)
    setTimeout(() => setCelebrando(false), 2500)
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Revisión semanal</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {format(week[0], "d MMM", { locale: es })} —{' '}
          {format(week[6], "d 'de' MMMM", { locale: es })}
        </p>
      </header>

      {/* Métricas */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: 'Tareas completadas',
            value: String(stats.completedThisWeek.length),
            icon: <IconCheck className="w-4 h-4" />,
          },
          {
            label: 'Minutos de enfoque',
            value: String(stats.focusMinutes),
            icon: <IconTarget className="w-4 h-4" />,
          },
          {
            label: 'Hábitos cumplidos',
            value: stats.habitPct === null ? '—' : `${stats.habitPct}%`,
            icon: <IconChart className="w-4 h-4" />,
          },
        ].map((m) => (
          <Card key={m.label} className="p-4">
            <span className="text-teal-600 dark:text-teal-400">{m.icon}</span>
            <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight">{m.value}</p>
            <p className="text-[11px] leading-4 text-slate-400 dark:text-slate-500">{m.label}</p>
          </Card>
        ))}
      </div>

      {/* Paso 1: celebrar */}
      <Card>
        <CardHeader
          title="1 · Celebra lo que lograste"
          subtitle="Reconocer el avance motiva más que castigarse por lo pendiente."
        />
        {stats.completedThisWeek.length === 0 ? (
          <EmptyState
            icon={<IconSparkles className="w-10 h-10" />}
            title="Aún no completas tareas esta semana"
            hint="Cada tarea que completes aparecerá aquí como un logro."
          />
        ) : (
          <ul className="space-y-1 px-5 pb-4 pt-1">
            {stats.completedThisWeek.map((t) => (
              <li key={t.id} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <IconCheck className="w-4 h-4 shrink-0 text-teal-500" />
                <span className="truncate">{t.title}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Balance por áreas */}
      {stats.byArea.length > 0 && (
        <Card>
          <CardHeader
            title="Balance de tu semana"
            subtitle="¿Alguna área de tu vida quedó olvidada?"
          />
          <div className="space-y-2.5 px-5 pb-5 pt-1">
            {stats.byArea.map(({ area, count }) => (
              <div key={area.id} className="flex items-center gap-3">
                <span className="w-24 shrink-0 truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                  {area.icon} {area.name}
                </span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className={`h-full rounded-full ${AREA_COLORS[area.color].bar} transition-all duration-700`}
                    style={{ width: `${(count / stats.maxArea) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right text-xs font-semibold tabular-nums text-slate-400">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Paso 2: decidir sobre pendientes */}
      <Card>
        <CardHeader
          title="2 · Decide sobre lo pendiente"
          subtitle="Reprograma o suelta sin culpa. Lo que importa avanza; lo que no, estorba."
        />
        {pendientes.length === 0 ? (
          <EmptyState
            icon={<IconCheck className="w-10 h-10" />}
            title="Nada vencido. ¡Vas al día!"
          />
        ) : (
          <ul className="divide-y divide-slate-100 pb-2 dark:divide-slate-800">
            {pendientes.map((t: Task) => (
              <li key={t.id} className="px-5 py-3">
                <p className="text-sm">{t.title}</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <button
                    onClick={() => updateTask(t.id, { dueDate: nextMonday })}
                    className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-medium text-teal-700 hover:bg-teal-100 dark:bg-teal-500/10 dark:text-teal-300 dark:hover:bg-teal-500/20 transition-colors"
                  >
                    <IconArrowRight className="w-3 h-3" /> Próxima semana
                  </button>
                  <button
                    onClick={() => updateTask(t.id, { dueDate: hoy })}
                    className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20 transition-colors"
                  >
                    Hoy mismo
                  </button>
                  <button
                    onClick={() => updateTask(t.id, { dueDate: undefined })}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
                  >
                    <IconX className="w-3 h-3" /> Quitar fecha
                  </button>
                  <button
                    onClick={() => deleteTask(t.id)}
                    className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-medium text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20 transition-colors"
                  >
                    <IconTrash className="w-3 h-3" /> Soltar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Paso 3: cerrar */}
      <Card className="p-5 text-center">
        {celebrando ? (
          <>
            <p className="text-3xl">🎉</p>
            <p className="mt-1 text-sm font-semibold">¡Revisión completada!</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Empiezas la semana con el mapa claro.
            </p>
          </>
        ) : reviewedThisWeek ? (
          <>
            <IconCheck className="mx-auto w-7 h-7 text-teal-500" />
            <p className="mt-1 text-sm font-semibold">Revisión de esta semana hecha</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Nos vemos la próxima semana. Mañana, elige tus 3 prioridades en "Hoy".
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold">3 · Cierra tu revisión</p>
            <p className="mx-auto mt-1 max-w-sm text-xs text-slate-400 dark:text-slate-500">
              ¿Listo? Mañana al abrir la app elige tus 3 prioridades del día en la
              pestaña "Hoy". Diez minutos de revisión te ahorran una semana de caos.
            </p>
            <Btn onClick={finish} className="mt-3">
              <IconSparkles className="w-4 h-4" /> Terminar revisión
            </Btn>
          </>
        )}
      </Card>
    </div>
  )
}
