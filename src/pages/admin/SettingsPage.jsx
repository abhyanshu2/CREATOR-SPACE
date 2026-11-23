import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { getSingleton, updateRow } from '../../lib/api'
import { useToast } from '../../context/ToastContext'
import { useContent } from '../../context/ContentContext'
import { Btn, Card, ErrorBox, PageHeader, Spinner, Toggle, inputCls } from '../../components/admin/ui'

export default function SettingsPage() {
  const toast = useToast()
  const { refresh } = useContent()
  const [row, setRow] = useState(null)
  const [sections, setSections] = useState([])
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getSingleton('site_settings').then((r) => { setRow(r); setSections([...r.sections].sort((a, b) => a.order - b.order)) }).catch((e) => setError(e.message))
  }, [])

  const patch = (i, p) => setSections((l) => l.map((s, j) => (j === i ? { ...s, ...p } : s)))
  const move = (i, d) => setSections((l) => { const n = [...l]; const j = i + d; if (j < 0 || j >= n.length) return l; [n[i], n[j]] = [n[j], n[i]]; return n })

  const save = async () => {
    setSaving(true)
    try {
      await updateRow('site_settings', row.id, { sections: sections.map((s, i) => ({ ...s, order: i + 1 })) })
      toast.success('Sections saved.'); refresh()
    } catch (e) { toast.error(e.message || 'Could not save.') }
    finally { setSaving(false) }
  }

  if (error) return <ErrorBox message={error} />
  if (!row) return <Spinner />
  return (
    <>
      <PageHeader title="Settings" subtitle="Show, hide and reorder website sections, and edit their headings." action={<Btn busy={saving} onClick={save}>Save sections</Btn>} />
      <ul className="space-y-3">
        {sections.map((s, i) => (
          <li key={s.key}>
            <Card className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <button aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} className="rounded p-1 hover:bg-primary/15 disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
                  <button aria-label="Move down" disabled={i === sections.length - 1} onClick={() => move(i, 1)} className="rounded p-1 hover:bg-primary/15 disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
                </div>
                <p className="flex-1 font-display font-semibold capitalize">{s.key} section</p>
                <span className="text-sm text-muted">{s.visible ? 'Visible' : 'Hidden'}</span>
                <Toggle checked={s.visible} onChange={(v) => patch(i, { visible: v })} label={`Show ${s.key} section`} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-semibold">Menu name<input className={`${inputCls} mt-1`} value={s.label} onChange={(e) => patch(i, { label: e.target.value })} /></label>
                {s.key !== 'hero' && <label className="text-sm font-semibold">Heading<input className={`${inputCls} mt-1`} value={s.heading} onChange={(e) => patch(i, { heading: e.target.value })} /></label>}
              </div>
              {s.key !== 'hero' && <label className="block text-sm font-semibold">Description<textarea rows={2} className={`${inputCls} mt-1`} value={s.description} onChange={(e) => patch(i, { description: e.target.value })} /></label>}
            </Card>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-end"><Btn busy={saving} onClick={save}>Save sections</Btn></div>
    </>
  )
}
