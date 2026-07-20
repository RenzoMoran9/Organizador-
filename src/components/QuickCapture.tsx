import { useState } from 'react'
import { useStore } from '../store'
import { IconSparkles } from '../icons'
import { Btn, Modal } from './ui'

export function QuickCapture({ onClose }: { onClose: () => void }) {
  const addInbox = useStore((s) => s.addInbox)
  const [text, setText] = useState('')
  const [savedCount, setSavedCount] = useState(0)

  const save = () => {
    const t = text.trim()
    if (!t) return
    addInbox(t)
    setText('')
    setSavedCount((c) => c + 1)
  }

  return (
    <Modal title="Captura rápida" onClose={onClose}>
      <div className="space-y-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Saca de tu cabeza lo que sea — un pendiente, una idea, un encargo. Luego lo
          organizas desde la <strong>Bandeja</strong>.
        </p>
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              save()
            }
          }}
          placeholder="Escribe y presiona Enter…"
          className="min-h-24 w-full resize-y rounded-xl border-0 bg-slate-100 px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-slate-800"
        />
        {savedCount > 0 && (
          <p className="flex items-center gap-1.5 text-xs font-medium text-teal-600 dark:text-teal-400">
            <IconSparkles className="w-4 h-4" />
            {savedCount === 1
              ? 'Guardado en tu bandeja. Puedes seguir capturando.'
              : `${savedCount} capturas guardadas en tu bandeja.`}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <Btn variant="ghost" onClick={onClose}>
            {savedCount > 0 ? 'Listo' : 'Cancelar'}
          </Btn>
          <Btn onClick={save} disabled={!text.trim()}>
            Capturar
          </Btn>
        </div>
      </div>
    </Modal>
  )
}
