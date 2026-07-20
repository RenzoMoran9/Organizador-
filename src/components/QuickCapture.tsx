import { useState } from 'react'
import { useStore } from '../store'
import { IconCheck } from '../icons'
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
        <p className="text-sm text-ink2">
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
          className="min-h-24 w-full resize-y rounded-sm border border-line bg-paper px-3.5 py-2.5 text-sm placeholder:text-ink3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
        />
        {savedCount > 0 && (
          <p className="flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-accent">
            <IconCheck className="w-3.5 h-3.5" />
            {savedCount === 1
              ? 'Guardado en tu bandeja'
              : `${savedCount} capturas en tu bandeja`}
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
