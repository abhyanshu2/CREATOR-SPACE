import { Loader2 } from 'lucide-react'

export const inputCls = 'w-full rounded-xl border border-primary/30 bg-bg/60 px-3 py-2.5 text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40'

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  )
}

export function Btn({ variant = 'primary', busy, className = '', children, ...p }) {
  const styles = {
    primary: 'bg-gradient-to-r from-primary to-secondary text-white shadow-[0_0_18px_rgb(var(--c-primary)/0.4)] hover:brightness-110',
    ghost: 'border border-primary/40 hover:bg-primary/15',
    danger: 'border border-red-400/50 text-red-300 hover:bg-red-500/15',
    solidDanger: 'bg-red-500 text-white hover:bg-red-400',
  }
  return (
    <button {...p} disabled={busy || p.disabled} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition active:scale-95 disabled:opacity-50 ${styles[variant]} ${className}`}>
      {busy && <Loader2 className="h-4 w-4 animate-spin" />}{children}
    </button>
  )
}

export const Card = ({ className = '', children }) => (
  <div className={`rounded-2xl border border-primary/25 bg-surface/80 p-5 ${className}`}>{children}</div>
)

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export const Spinner = ({ className = '' }) => (
  <div className={`flex justify-center p-10 ${className}`}><Loader2 className="h-7 w-7 animate-spin text-primary" aria-label="Loading" /></div>
)

export const ErrorBox = ({ message }) => (
  <div className="rounded-xl border border-red-400/50 bg-red-950/40 p-4 text-sm text-red-200">{message}</div>
)

export function Toggle({ checked, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? 'bg-primary' : 'bg-muted/40'}`}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  )
}
