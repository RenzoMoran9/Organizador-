import { useState } from 'react'
import { useStore } from '../store'
import type { Area, AreaColor, ThemePref } from '../types'
import { AREA_COLORS } from '../utils'
import { IconDownload, IconPencil, IconPlus, IconTrash } from '../icons'
import { Btn, Card, CardHeader, Field, inputCls, Modal } from '../components/ui'

const COLOR_OPTIONS = Object.keys(AREA_COLORS) as AreaColor[]
const AREA_ICONS = ['💼', '👨‍👩‍👧', '🧠', '💪', '💰', '🏠', '📚', '🎨', '🚗', '🌱', '⚽', '✈️']

function AreaModal({ initial, onClose }: { initial?: Area; onClose: () => void }) {
  const { addArea, updateArea, deleteArea, areas } = useStore()
  const [name, setName] = useState(initial?.name ?? '')
  const [icon, setIcon] = useState(initial?.icon ?? '🏠')
  const [color, setColor] = useState<AreaColor>(initial?.color ?? 'teal')

  const save = () => {
    if (!name.trim()) return
    if (initial) updateArea(initial.id, { name: name.trim(), icon, color })
    else addArea({ name: name.trim(), icon, color })
    onClose()
  }

  return (
    <Modal title={initial ? 'Editar área' : 'Nueva área de vida'} onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          save()
        }}
      >
        <Field label="Nombre">
          <input
            autoFocus
            className={inputCls}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej.: Hogar, Estudios, Emprendimiento…"
          />
        </Field>
        <Field label="Ícono">
          <div className="flex flex-wrap gap-1.5">
            {AREA_ICONS.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIcon(i)}
                className={`h-10 w-10 rounded-xl text-lg transition-all ${
                  icon === i
                    ? 'bg-teal-100 ring-2 ring-teal-500 dark:bg-teal-500/20'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700'
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Color">
          <div className="flex flex-wrap gap-2">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-label={c}
                className={`h-8 w-8 rounded-full ${AREA_COLORS[c].dot} transition-all ${
                  color === c ? 'ring-2 ring-offset-2 ring-slate-400 dark:ring-offset-slate-900' : ''
                }`}
              />
            ))}
          </div>
        </Field>
        <div className="flex items-center justify-between pt-1">
          {initial && areas.length > 1 ? (
            <Btn
              variant="danger"
              onClick={() => {
                deleteArea(initial.id)
                onClose()
              }}
            >
              <IconTrash className="w-4 h-4" /> Eliminar
            </Btn>
          ) : (
            <span />
          )}
          <Btn type="submit" disabled={!name.trim()}>
            Guardar
          </Btn>
        </div>
      </form>
    </Modal>
  )
}

export function Settings() {
  const store = useStore()
  const { userName, setUserName, theme, setTheme, areas } = store
  const [nameDraft, setNameDraft] = useState(userName)
  const [areaModal, setAreaModal] = useState<{ open: boolean; area?: Area }>({ open: false })
  const [confirmWipe, setConfirmWipe] = useState(false)

  const exportData = () => {
    const data = JSON.stringify(
      {
        userName: store.userName,
        areas: store.areas,
        tasks: store.tasks,
        events: store.events,
        habits: store.habits,
        inbox: store.inbox,
        focusSessions: store.focusSessions,
      },
      null,
      2
    )
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `norte-respaldo-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const wipe = () => {
    localStorage.removeItem('norte-datos')
    location.reload()
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Ajustes</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Haz que Norte se sienta tuyo.
        </p>
      </header>

      <Card>
        <CardHeader title="Perfil" />
        <div className="px-5 pb-5 pt-1">
          <Field label="Tu nombre">
            <div className="flex gap-2">
              <input
                className={inputCls}
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                placeholder="¿Cómo te llamas?"
              />
              <Btn onClick={() => setUserName(nameDraft.trim())} disabled={nameDraft.trim() === userName}>
                Guardar
              </Btn>
            </div>
          </Field>
        </div>
      </Card>

      <Card>
        <CardHeader title="Apariencia" />
        <div className="px-5 pb-5 pt-1">
          <div className="grid grid-cols-3 gap-1.5">
            {(
              [
                { v: 'system', label: 'Sistema' },
                { v: 'light', label: 'Claro' },
                { v: 'dark', label: 'Oscuro' },
              ] as { v: ThemePref; label: string }[]
            ).map((o) => (
              <button
                key={o.v}
                onClick={() => setTheme(o.v)}
                className={`rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  theme === o.v
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Áreas de vida"
          subtitle="Los ámbitos en los que organizas tu día a día."
          action={
            <Btn variant="soft" onClick={() => setAreaModal({ open: true })} className="!px-3 !py-1.5 text-xs">
              <IconPlus className="w-3.5 h-3.5" /> Nueva
            </Btn>
          }
        />
        <ul className="divide-y divide-slate-100 pb-2 dark:divide-slate-800">
          {areas.map((a) => (
            <li key={a.id} className="flex items-center gap-3 px-5 py-3">
              <span className={`h-3 w-3 rounded-full ${AREA_COLORS[a.color].dot}`} />
              <span className="text-lg">{a.icon}</span>
              <span className="flex-1 text-sm font-medium">{a.name}</span>
              <button
                onClick={() => setAreaModal({ open: true, area: a })}
                aria-label={`Editar ${a.name}`}
                className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                <IconPencil className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardHeader title="Tus datos" subtitle="Todo se guarda en este dispositivo. Nada sale de aquí." />
        <div className="flex flex-wrap gap-2 px-5 pb-5 pt-1">
          <Btn variant="soft" onClick={exportData}>
            <IconDownload className="w-4 h-4" /> Exportar respaldo
          </Btn>
          {confirmWipe ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-rose-600 dark:text-rose-400">
                ¿Borrar todo definitivamente?
              </span>
              <Btn variant="danger" onClick={wipe}>
                Sí, borrar
              </Btn>
              <Btn variant="ghost" onClick={() => setConfirmWipe(false)}>
                Cancelar
              </Btn>
            </div>
          ) : (
            <Btn variant="danger" onClick={() => setConfirmWipe(true)}>
              <IconTrash className="w-4 h-4" /> Borrar todos los datos
            </Btn>
          )}
        </div>
      </Card>

      <p className="pb-4 text-center text-xs text-slate-300 dark:text-slate-600">
        Norte v1.0 · Hecho para que dejes de procrastinar 🧭
      </p>

      {areaModal.open && (
        <AreaModal initial={areaModal.area} onClose={() => setAreaModal({ open: false })} />
      )}
    </div>
  )
}
