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

  const actionCls =
    'inline-flex items-center gap-1.5 rounded-sm border border-line px-3 py-1.5 text-xs font-medium text-ink2 transition-colors hover:border-accent hover:text-accent'

  return (
    <div className="space-y-5">
      <header className="border-b border-line pb-5">
        <p className="caption !text-accent">Capturar · Procesar</p>
        <h1 className="mt-2 font-display text-[28px] font-semibold tracking-tight">
          Bandeja de entrada
        </h1>
        <p className="mt-1.5 text-sm text-ink2">
          Todo lo que capturas cae aquí. Conviértelo en tarea o evento — y si toma{' '}
          <strong>menos de 2 minutos, hazlo ya</strong>.
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
            icon={<IconInbox className="w-9 h-9" />}
            title="Bandeja vacía. Mente despejada."
            hint="Cuando algo aparezca en tu cabeza —un pendiente, una idea— captúralo aquí en segundos y sigue con lo tuyo."
          />
        ) : (
          <ul className="divide-y divide-line">
            {inbox.map((item) => (
              <li
                key={item.id}
                className={`px-5 py-3.5 transition-opacity duration-500 ${
                  doneFlash === item.id ? 'opacity-0' : ''
                }`}
              >
                <p className="text-sm text-ink">{item.text}</p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => setConverting({ id: item.id, text: item.text, to: 'tarea' })}
                    className={actionCls}
                  >
                    <IconTasks className="w-3.5 h-3.5" /> Convertir en tarea
                  </button>
                  <button
                    onClick={() => setConverting({ id: item.id, text: item.text, to: 'evento' })}
                    className={actionCls}
                  >
                    <IconCalendar className="w-3.5 h-3.5" /> Convertir en evento
                  </button>
                  <button
                    onClick={() => quickDone(item.id)}
                    className="inline-flex items-center gap-1.5 rounded-sm border border-moss/40 px-3 py-1.5 text-xs font-medium text-moss transition-colors hover:bg-moss/10"
                  >
                    <IconCheck className="w-3.5 h-3.5" /> Hecho en 2 min
                  </button>
                  <button
                    onClick={() => deleteInbox(item.id)}
                    aria-label="Descartar"
                    className="ml-auto rounded-sm p-1.5 text-ink3 transition-colors hover:bg-oxide/10 hover:text-oxide"
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
