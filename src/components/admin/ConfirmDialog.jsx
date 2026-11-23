import { useEffect } from 'react'
import { Btn } from './ui'

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', busy, onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onCancel()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/70 p-4" onClick={onCancel}>
      <div role="dialog" aria-modal="true" aria-labelledby="dlg-title" onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl border border-primary/40 bg-surface p-6">
        <h2 id="dlg-title" className="font-display text-xl font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-muted">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
          <Btn variant="solidDanger" busy={busy} onClick={onConfirm}>{confirmLabel}</Btn>
        </div>
      </div>
    </div>
  )
}
