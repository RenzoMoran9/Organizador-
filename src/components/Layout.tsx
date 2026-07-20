import { useState, type ReactNode } from 'react'
import { useStore } from '../store'
import type { ViewId } from '../types'
import {
  IconCalendar,
  IconChart,
  IconCompass,
  IconFlame,
  IconInbox,
  IconMore,
  IconPlus,
  IconSettings,
  IconSun,
  IconTarget,
  IconTasks,
  IconX,
} from '../icons'

const NAV: { id: ViewId; label: string; icon: (p: { className?: string }) => ReactNode }[] = [
  { id: 'hoy', label: 'Hoy', icon: IconSun },
  { id: 'bandeja', label: 'Bandeja', icon: IconInbox },
  { id: 'tareas', label: 'Tareas', icon: IconTasks },
  { id: 'agenda', label: 'Agenda', icon: IconCalendar },
  { id: 'habitos', label: 'Hábitos', icon: IconFlame },
  { id: 'enfoque', label: 'Enfoque', icon: IconTarget },
  { id: 'revision', label: 'Revisión', icon: IconChart },
  { id: 'ajustes', label: 'Ajustes', icon: IconSettings },
]

const MOBILE_MAIN: ViewId[] = ['hoy', 'tareas', 'agenda', 'habitos']
const MOBILE_MORE: ViewId[] = ['bandeja', 'enfoque', 'revision', 'ajustes']

export function Layout({
  view,
  setView,
  onQuickCapture,
  children,
}: {
  view: ViewId
  setView: (v: ViewId) => void
  onQuickCapture: () => void
  children: ReactNode
}) {
  const inboxCount = useStore((s) => s.inbox.length)
  const [moreOpen, setMoreOpen] = useState(false)

  const NavItem = ({ id, label, icon: Icon }: (typeof NAV)[number]) => (
    <button
      onClick={() => {
        setView(id)
        setMoreOpen(false)
      }}
      className={`relative flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
        view === id
          ? 'bg-teal-600/10 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300'
          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
      {id === 'bandeja' && inboxCount > 0 && (
        <span className="ml-auto rounded-full bg-teal-600 px-2 py-0.5 text-[10px] font-bold text-white">
          {inboxCount}
        </span>
      )}
    </button>
  )

  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-slate-950">
      {/* Barra lateral — escritorio */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-slate-200/70 bg-white px-3 py-5 dark:border-slate-800 dark:bg-slate-900 lg:flex">
        <div className="mb-6 flex items-center gap-2.5 px-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-teal-700 text-white">
            <IconCompass className="w-5 h-5" />
          </span>
          <div>
            <p className="text-base font-bold tracking-tight">Norte</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 -mt-0.5">
              Tu organizador de vida
            </p>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => (
            <NavItem key={item.id} {...item} />
          ))}
        </nav>
        <button
          onClick={onQuickCapture}
          className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700"
        >
          <IconPlus className="w-4 h-4" /> Captura rápida
        </button>
      </aside>

      {/* Contenido */}
      <main className="mx-auto w-full max-w-3xl px-4 pb-28 pt-5 sm:px-6 lg:ml-60 lg:max-w-4xl lg:pb-10 lg:pl-10 lg:pr-8">
        {children}
      </main>

      {/* Botón flotante de captura — móvil */}
      <button
        onClick={onQuickCapture}
        aria-label="Captura rápida"
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-600/30 transition-transform active:scale-95 lg:hidden"
      >
        <IconPlus className="w-6 h-6" />
      </button>

      {/* Menú "más" — móvil */}
      {moreOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMoreOpen(false)}
        >
          <div
            className="absolute bottom-16 inset-x-3 rounded-2xl bg-white p-2 shadow-2xl dark:bg-slate-900 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {NAV.filter((n) => MOBILE_MORE.includes(n.id)).map((item) => (
              <NavItem key={item.id} {...item} />
            ))}
          </div>
        </div>
      )}

      {/* Barra inferior — móvil */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-slate-200/70 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 lg:hidden pb-[env(safe-area-inset-bottom)]">
        {NAV.filter((n) => MOBILE_MAIN.includes(n.id)).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              setView(id)
              setMoreOpen(false)
            }}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
              view === id && !moreOpen
                ? 'text-teal-600 dark:text-teal-400'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
        <button
          onClick={() => setMoreOpen((o) => !o)}
          className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
            moreOpen || MOBILE_MORE.includes(view)
              ? 'text-teal-600 dark:text-teal-400'
              : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          {moreOpen ? <IconX className="w-5 h-5" /> : <IconMore className="w-5 h-5" />}
          Más
        </button>
      </nav>
    </div>
  )
}
