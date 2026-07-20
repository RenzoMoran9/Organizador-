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
      className={`relative flex w-full items-center gap-3 px-4 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] transition-colors ${
        view === id
          ? 'text-panelink'
          : 'text-panelmuted hover:text-panelink/80'
      }`}
    >
      <span
        className={`absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 transition-opacity ${
          view === id ? 'bg-accent opacity-100' : 'opacity-0'
        }`}
      />
      <Icon className="w-4 h-4" />
      {label}
      {id === 'bandeja' && inboxCount > 0 && (
        <span className="ml-auto rounded-[3px] bg-accent px-1.5 py-0.5 font-mono text-[10px] font-semibold text-onaccent tracking-normal">
          {inboxCount}
        </span>
      )}
    </button>
  )

  return (
    <div className="min-h-dvh bg-paper">
      {/* Panel lateral — escritorio */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col bg-panel py-6 lg:flex">
        <div className="mb-8 flex items-center gap-3 px-5">
          <span className="text-accent">
            <IconCompass className="w-7 h-7" />
          </span>
          <div>
            <p className="font-display text-xl font-semibold tracking-tight text-panelink">
              Norte
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-panelmuted">
              Bitácora personal
            </p>
          </div>
        </div>
        <nav className="flex flex-col gap-0.5">
          {NAV.map((item) => (
            <NavItem key={item.id} {...item} />
          ))}
        </nav>
        <div className="mt-auto px-4">
          <button
            onClick={onQuickCapture}
            className="flex w-full items-center justify-center gap-2 rounded-sm bg-accent px-4 py-2.5 text-sm font-medium text-onaccent transition-colors hover:bg-accent2 active:translate-y-px"
          >
            <IconPlus className="w-4 h-4" /> Captura rápida
            <kbd className="ml-1 rounded-[3px] border border-onaccent/30 px-1 font-mono text-[10px]">
              N
            </kbd>
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <main className="mx-auto w-full max-w-3xl px-4 pb-28 pt-6 sm:px-6 lg:ml-60 lg:max-w-4xl lg:pb-12 lg:pl-12 lg:pr-10">
        {children}
      </main>

      {/* Botón flotante de captura — móvil */}
      <button
        onClick={onQuickCapture}
        aria-label="Captura rápida"
        className="fixed bottom-20 right-4 z-40 flex h-13 w-13 items-center justify-center rounded-md bg-accent text-onaccent shadow-lg shadow-panel/30 transition-transform active:scale-95 lg:hidden"
      >
        <IconPlus className="w-6 h-6" />
      </button>

      {/* Menú "más" — móvil */}
      {moreOpen && (
        <div
          className="fixed inset-0 z-40 bg-panel/50 backdrop-blur-[2px] lg:hidden"
          onClick={() => setMoreOpen(false)}
        >
          <div
            className="absolute bottom-16 inset-x-3 rounded-md bg-panel py-2 shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {NAV.filter((n) => MOBILE_MORE.includes(n.id)).map((item) => (
              <NavItem key={item.id} {...item} />
            ))}
          </div>
        </div>
      )}

      {/* Barra inferior — móvil */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex bg-panel pb-[env(safe-area-inset-bottom)] lg:hidden">
        {NAV.filter((n) => MOBILE_MAIN.includes(n.id)).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              setView(id)
              setMoreOpen(false)
            }}
            className={`relative flex flex-1 flex-col items-center gap-1 py-2.5 font-mono text-[9px] font-medium uppercase tracking-[0.14em] transition-colors ${
              view === id && !moreOpen ? 'text-panelink' : 'text-panelmuted'
            }`}
          >
            <span
              className={`absolute top-0 h-0.5 w-6 bg-accent transition-opacity ${
                view === id && !moreOpen ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
        <button
          onClick={() => setMoreOpen((o) => !o)}
          className={`relative flex flex-1 flex-col items-center gap-1 py-2.5 font-mono text-[9px] font-medium uppercase tracking-[0.14em] transition-colors ${
            moreOpen || MOBILE_MORE.includes(view) ? 'text-panelink' : 'text-panelmuted'
          }`}
        >
          <span
            className={`absolute top-0 h-0.5 w-6 bg-accent transition-opacity ${
              moreOpen || MOBILE_MORE.includes(view) ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {moreOpen ? <IconX className="w-5 h-5" /> : <IconMore className="w-5 h-5" />}
          Más
        </button>
      </nav>
    </div>
  )
}
