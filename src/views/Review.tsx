import { useMemo, useState } from 'react'
import { addDays, format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useStore } from '../store'
import type { Task } from '../types'
import { areaVar, dateStr, todayStr, weekDays } from '../utils'
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
import { AreaMark } from '../components/AreaMark'

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

  const pillCls =
    'inline-flex items-center gap-1 rounded-sm border px-2.5 py-1 text-[11px] font-medium transition-colors'

  return (
    <div className="space-y-5">
      <header className="border-b border-line pb-5">
        <p className="caption !text-accent">Diez minutos que ordenan la semana</p>
        <h1 className="mt-2 font-display text-[28px] font-semibold tracking-tight">
          Revisión semanal
        </h1>
        <p className="mt-1.5 font-mono text-[11px] text-ink3">
          {format(week[0], 'd MMM', { locale: es })} —{' '}
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
            <span className="text-accent">{m.icon}</span>
            <p className="mt-2 font-mono text-[26px] font-semibold tabular-nums leading-8">
              {m.value}
            </p>
            <p className="text-[11px] leading-4 text-ink3">{m.label}</p>
          </Card>
        ))}
      </div>

      {/* Paso 1: celebrar */}
      <Card>
        <CardHeader
          title="01 · Celebra lo que lograste"
          subtitle="Reconocer el avance motiva más que castigarse por lo pendiente."
        />
        {stats.completedThisWeek.length === 0 ? (
          <EmptyState
            icon={<IconSparkles className="w-9 h-9" />}
            title="Aún no completas tareas esta semana"
            hint="Cada tarea que completes aparecerá aquí como un logro."
          />
        ) : (
          <ul className="space-y-1 px-5 pb-4 pt-1">
            {stats.completedThisWeek.map((t) => (
              <li key={t.id} className="flex items-center gap-2 text-sm text-ink2">
                <IconCheck className="w-4 h-4 shrink-0 text-moss" />
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
                <span className="flex w-26 shrink-0 items-center gap-1.5 truncate text-xs font-medium text-ink2">
                  <AreaMark area={area} size={9} />
                  {area.name}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface2">
                  <div
                    className="h-full transition-all duration-700"
                    style={{
                      width: `${(count / stats.maxArea) * 100}%`,
                      background: areaVar(area.color),
                    }}
                  />
                </div>
                <span className="w-6 text-right font-mono text-xs font-semibold tabular-nums text-ink3">
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
          title="02 · Decide sobre lo pendiente"
          subtitle="Reprograma o suelta sin culpa. Lo que importa avanza; lo que no, estorba."
        />
        {pendientes.length === 0 ? (
          <EmptyState icon={<IconCheck className="w-9 h-9" />} title="Nada vencido. Vas al día." />
        ) : (
          <ul className="divide-y divide-line pb-2">
            {pendientes.map((t: Task) => (
              <li key={t.id} className="px-5 py-3">
                <p className="text-sm">{t.title}</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <button
                    onClick={() => updateTask(t.id, { dueDate: nextMonday })}
                    className={`${pillCls} border-accent/40 text-accent hover:bg-accent/8`}
                  >
                    <IconArrowRight className="w-3 h-3" /> Próxima semana
                  </button>
                  <button
                    onClick={() => updateTask(t.id, { dueDate: hoy })}
                    className={`${pillCls} border-ochre/40 text-ochre hover:bg-ochre/10`}
                  >
                    Hoy mismo
                  </button>
                  <button
                    onClick={() => updateTask(t.id, { dueDate: undefined })}
                    className={`${pillCls} border-line text-ink3 hover:text-ink2`}
                  >
                    <IconX className="w-3 h-3" /> Quitar fecha
                  </button>
                  <button
                    onClick={() => deleteTask(t.id)}
                    className={`${pillCls} border-oxide/40 text-oxide hover:bg-oxide/10`}
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
      <Card className="p-6 text-center">
        {celebrando ? (
          <>
            <p className="font-display italic text-xl">¡Revisión completada!</p>
            <p className="mt-1 text-xs text-ink3">Empiezas la semana con el mapa claro.</p>
          </>
        ) : reviewedThisWeek ? (
          <>
            <IconCheck className="mx-auto w-6 h-6 text-moss" />
            <p className="mt-1.5 font-display text-lg">Revisión de esta semana hecha</p>
            <p className="text-xs text-ink3">
              Nos vemos la próxima semana. Mañana, elige tus 3 prioridades en "Hoy".
            </p>
          </>
        ) : (
          <>
            <p className="caption">03 · Cierra tu revisión</p>
            <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-ink3">
              ¿Listo? Mañana al abrir la app elige tus 3 prioridades del día en la pestaña
              "Hoy". Diez minutos de revisión te ahorran una semana de caos.
            </p>
            <Btn onClick={finish} className="mt-3.5">
              <IconSparkles className="w-4 h-4" /> Terminar revisión
            </Btn>
          </>
        )}
      </Card>
    </div>
  )
}
