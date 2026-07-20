import { useState } from 'react'
import { useStore } from '../store'
import type { Area, AreaColor, ThemePref } from '../types'
import { AREA_COLOR_NAMES, areaVar } from '../utils'
import { IconDownload, IconPencil, IconPlus, IconTrash } from '../icons'
import { AREA_SHAPES, AreaMark, Mark } from '../components/AreaMark'
import { Btn, Card, CardHeader, Field, inputCls, Modal, segCls } from '../components/ui'

function AreaModal({ initial, onClose }: { initial?: Area; onClose: () => void }) {
  const { addArea, updateArea, deleteArea, areas } = useStore()
  const [name, setName] = useState(initial?.name ?? '')
  const [shape, setShape] = useState(initial?.icon ?? 'square')
  const [color, setColor] = useState<AreaColor>(initial?.color ?? 'cobalt')

  const save = () => {
    if (!name.trim()) return
    if (initial) updateArea(initial.id, { name: name.trim(), icon: shape, color })
    else addArea({ name: name.trim(), icon: shape, color })
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

        <Field label="Símbolo de leyenda">
          <div className="flex flex-wrap gap-1.5">
            {AREA_SHAPES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setShape(s)}
                aria-label={s}
                className={`flex h-10 w-10 items-center justify-center rounded-sm border transition-colors ${
                  shape === s ? 'border-accent bg-accent/8' : 'border-line hover:border-ink3'
                }`}
              >
                <Mark shape={s} color={areaVar(color)} size={14} />
              </button>
            ))}
          </div>
        </Field>

        <Field label="Color">
          <div className="flex flex-wrap gap-2">
            {AREA_COLOR_NAMES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-label={c}
                className={`h-8 w-8 rounded-sm transition-all ${
                  color === c ? 'ring-2 ring-ink ring-offset-2 ring-offset-surface' : ''
                }`}
                style={{ background: areaVar(c) }}
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
      <header className="border-b border-line pb-5">
        <p className="caption !text-accent">Tu bitácora, a tu manera</p>
        <h1 className="mt-2 font-display text-[28px] font-semibold tracking-tight">Ajustes</h1>
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
              <button key={o.v} onClick={() => setTheme(o.v)} className={segCls(theme === o.v)}>
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Áreas de vida"
          subtitle="Los ámbitos en los que organizas tu día a día, como la leyenda de un mapa."
          action={
            <Btn variant="soft" onClick={() => setAreaModal({ open: true })} className="!px-3 !py-1.5 text-xs">
              <IconPlus className="w-3.5 h-3.5" /> Nueva
            </Btn>
          }
        />
        <ul className="divide-y divide-line pb-2">
          {areas.map((a) => (
            <li key={a.id} className="flex items-center gap-3 px-5 py-3">
              <AreaMark area={a} size={13} />
              <span className="flex-1 text-sm font-medium">{a.name}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink3">
                {a.color}
              </span>
              <button
                onClick={() => setAreaModal({ open: true, area: a })}
                aria-label={`Editar ${a.name}`}
                className="rounded-sm p-1.5 text-ink3 transition-colors hover:bg-surface2 hover:text-ink"
              >
                <IconPencil className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardHeader
          title="Tus datos"
          subtitle="Todo se guarda en este dispositivo. Nada sale de aquí."
        />
        <div className="flex flex-wrap gap-2 px-5 pb-5 pt-1">
          <Btn variant="soft" onClick={exportData}>
            <IconDownload className="w-4 h-4" /> Exportar respaldo
          </Btn>
          {confirmWipe ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-oxide">¿Borrar todo definitivamente?</span>
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

      <p className="pb-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-ink3/60">
        Norte · v2 · Hecho para que dejes de procrastinar
      </p>

      {areaModal.open && (
        <AreaModal initial={areaModal.area} onClose={() => setAreaModal({ open: false })} />
      )}
    </div>
  )
}
