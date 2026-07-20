import { useEffect, type ReactNode } from 'react'
import { IconX } from '../icons'

export function Modal({
  title,
  onClose,
  children,
  wide,
}: {
  title: string
  onClose: () => void
  children: ReactNode
  wide?: boolean
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-panel/60 backdrop-blur-[2px] p-0 sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className={`w-full ${wide ? 'sm:max-w-2xl' : 'sm:max-w-lg'} max-h-[92dvh] overflow-y-auto rounded-t-lg sm:rounded-lg bg-surface border border-line shadow-2xl animate-slide-up`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line bg-surface/95 backdrop-blur px-5 py-3.5">
          <h2 className="font-display text-[17px] font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-sm p-1.5 text-ink3 hover:bg-surface2 hover:text-ink transition-colors"
            aria-label="Cerrar"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  )
}

export function Card({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`rounded-md bg-surface border border-line ${className}`}>
      {children}
    </section>
  )
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-1">
      <div>
        <h2 className="caption flex items-center gap-2">
          <span className="inline-block h-px w-4 bg-ink3" />
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-xs text-ink3">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function EmptyState({
  icon,
  title,
  hint,
}: {
  icon: ReactNode
  title: string
  hint?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-10 text-center">
      <div className="text-ink3/60">{icon}</div>
      <p className="font-display italic text-[15px] text-ink2">{title}</p>
      {hint && <p className="text-xs text-ink3 max-w-xs leading-relaxed">{hint}</p>}
    </div>
  )
}

export function Btn({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  className = '',
  disabled,
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'ghost' | 'danger' | 'soft'
  type?: 'button' | 'submit'
  className?: string
  disabled?: boolean
}) {
  const styles = {
    primary:
      'bg-accent text-onaccent hover:bg-accent2 disabled:opacity-40 disabled:hover:bg-accent',
    soft: 'border border-line text-accent hover:border-accent/50 hover:bg-accent/5',
    ghost: 'text-ink2 hover:bg-surface2 hover:text-ink',
    danger: 'text-oxide hover:bg-oxide/10',
  }[variant]
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 rounded-sm px-4 py-2 text-sm font-medium transition-colors active:translate-y-px ${styles} ${className}`}
    >
      {children}
    </button>
  )
}

export function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="caption mb-1.5 block !text-[10px]">{label}</span>
      {children}
    </label>
  )
}

export const inputCls =
  'w-full rounded-sm border border-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors'

/** Botón de opción tipo segmento (formas, colores, presets…) */
export const segCls = (active: boolean) =>
  `rounded-sm px-3 py-2 text-xs font-medium transition-colors border ${
    active
      ? 'border-accent text-accent bg-accent/8'
      : 'border-line text-ink2 hover:border-ink3 hover:text-ink'
  }`
