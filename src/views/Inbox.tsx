import { useState } from 'react'
import { useStore } from '../store'
import { IconCalendar, IconCheck, IconInbox, IconPlus, IconTasks, IconTrash } from '../icons'
import { Btn, Card, EmptyState, inputCls } from '../components/ui'
import { EventModal, TaskModal } from '../components/modals'

export function Inbox() {
  const { inbox, addInbox, deleteInbox } = useStore()
  const [text, setText] = useState('')
  const [converting, setConverting] = useState<{ id: string; text: string; to: 'tarea' | 'evento' } | null>(null)
  const [doneFlash, setDoneFlash] = useState<string | null>(null)

  const capture = () => {
    const t = text.trim()
    if (!t) return
    addInbox(t)
    setText('')
  }

  const quickDone = (id: string) => {
    setDoneFlash(id)
    setTimeout(() => {
      deleteInbox(id)
      setDoneFlash(null)
    }, 600)
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Bandeja de entrada</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Todo lo que capturas cae aquí. Procesa cada cosa: conviértela en tarea o evento —
          y si toma <strong>menos de 2 minutos, hazla ya</strong>.
        </p>
      </header>

      <div className="flex gap-2">
        <input
          className={inputCls}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') capture()
          }}
          placeholder="Captura algo nuevo…"
        />
        <Btn onClick={capture} disabled={!text.trim()}>
          <IconPlus className="w-4 h-4" />
        </Btn>
      </div>

      <Card>
        {inbox.length === 0 ? (
          <EmptyState
            icon={<IconInbox className="w-10 h-10" />}
            title="Bandeja vacía. Mente despejada. ✨"
            hint="Cuando algo aparezca en tu cabeza —un pendiente, una idea— captúralo aquí en segundos y sigue con lo tuyo."
          />
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {inbox.map((item) => (
              <li
                key={item.id}
                className={`px-5 py-3.5 transition-opacity duration-500 ${
                  doneFlash === item.id ? 'opacity-0' : ''
                }`}
              >
                <p className="text-sm text-slate-800 dark:text-slate-100">{item.text}</p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => setConverting({ id: item.id, text: item.text, to: 'tarea' })}
                    className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 transition-colors hover:bg-teal-100 dark:bg-teal-500/10 dark:text-teal-300 dark:hover:bg-teal-500/20"
                  >
                    <IconTasks className="w-3.5 h-3.5" /> Convertir en tarea
                  </button>
                  <button
                    onClick={() => setConverting({ id: item.id, text: item.text, to: 'evento' })}
                    className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700 transition-colors hover:bg-sky-100 dark:bg-sky-500/10 dark:text-sky-300 dark:hover:bg-sky-500/20"
                  >
                    <IconCalendar className="w-3.5 h-3.5" /> Convertir en evento
                  </button>
                  <button
                    onClick={() => quickDone(item.id)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
                  >
                    <IconCheck className="w-3.5 h-3.5" /> Hecho en 2 min
                  </button>
                  <button
                    onClick={() => deleteInbox(item.id)}
                    aria-label="Descartar"
                    className="ml-auto rounded-full p-1.5 text-slate-300 transition-colors hover:bg-rose-50 hover:text-rose-500 dark:text-slate-600 dark:hover:bg-rose-500/10"
                  >
                    <IconTrash className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {converting?.to === 'tarea' && (
        <TaskModal
          presetTitle={converting.text}
          onClose={() => setConverting(null)}
          onSaved={() => deleteInbox(converting.id)}
        />
      )}
      {converting?.to === 'evento' && (
        <EventModal
          presetTitle={converting.text}
          onClose={() => setConverting(null)}
          onSaved={() => deleteInbox(converting.id)}
        />
      )}
    </div>
  )
}
