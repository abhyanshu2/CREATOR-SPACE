import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'

const Ctx = createContext(null)
export const useToast = () => useContext(Ctx)

export function ToastProvider({ children }) {
  const [items, setItems] = useState([])
  const push = useCallback((type, message) => {
    const id = Math.random().toString(36).slice(2)
    setItems((l) => [...l, { id, type, message }])
    setTimeout(() => setItems((l) => l.filter((t) => t.id !== id)), 4000)
  }, [])
  const api = { success: (m) => push('ok', m), error: (m) => push('err', m) }
  return (
    <Ctx.Provider value={api}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex max-w-[90vw] flex-col gap-2" role="status" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg backdrop-blur ${t.type === 'ok' ? 'border-emerald-400/50 bg-emerald-950/90 text-emerald-100' : 'border-red-400/50 bg-red-950/90 text-red-100'}`}>
            {t.type === 'ok' ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <XCircle className="h-4 w-4 shrink-0" />}
            {t.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}
