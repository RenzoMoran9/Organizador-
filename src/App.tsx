import { useEffect, useState } from 'react'
import { useStore } from './store'
import type { ViewId } from './types'
import { Layout } from './components/Layout'
import { QuickCapture } from './components/QuickCapture'
import { Today } from './views/Today'
import { Inbox } from './views/Inbox'
import { Tasks } from './views/Tasks'
import { Agenda } from './views/Agenda'
import { Habits } from './views/Habits'
import { Focus } from './views/Focus'
import { Review } from './views/Review'
import { Settings } from './views/Settings'

export default function App() {
  const [view, setView] = useState<ViewId>('hoy')
  const [captureOpen, setCaptureOpen] = useState(false)
  const theme = useStore((s) => s.theme)
  const focus = useStore((s) => s.focus)
  const completePhase = useStore((s) => s.completePhase)

  // Aplicar tema claro/oscuro
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && mq.matches)
      document.documentElement.classList.toggle('dark', dark)
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [theme])

  // El temporizador de enfoque avanza aunque estés en otra pestaña de la app
  useEffect(() => {
    if (!focus.running || !focus.endsAt) return
    const id = setInterval(() => {
      const f = useStore.getState().focus
      if (f.running && f.endsAt && Date.now() >= f.endsAt) completePhase()
    }, 1000)
    return () => clearInterval(id)
  }, [focus.running, focus.endsAt, completePhase])

  // Atajo de teclado: "n" abre la captura rápida
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const typing =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      if (!typing && e.key.toLowerCase() === 'n' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        setCaptureOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <Layout view={view} setView={setView} onQuickCapture={() => setCaptureOpen(true)}>
      {view === 'hoy' && <Today go={setView} />}
      {view === 'bandeja' && <Inbox />}
      {view === 'tareas' && <Tasks />}
      {view === 'agenda' && <Agenda />}
      {view === 'habitos' && <Habits />}
      {view === 'enfoque' && <Focus />}
      {view === 'revision' && <Review />}
      {view === 'ajustes' && <Settings />}
      {captureOpen && <QuickCapture onClose={() => setCaptureOpen(false)} />}
    </Layout>
  )
}
