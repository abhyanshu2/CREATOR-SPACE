import { useCallback, useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react'
import { deleteRow, insertRow, listRows, removeFileByUrl, updateRow } from '../../lib/api'
import { useToast } from '../../context/ToastContext'
import { useContent } from '../../context/ContentContext'
import { Btn, Card, ErrorBox, PageHeader, Spinner, Toggle } from './ui'
import { FieldInput, prep, validate } from './FormFields'
import ConfirmDialog from './ConfirmDialog'

// Generic add / edit / delete / reorder / enable-disable list, driven by a field config.
export default function ListManager({ table, title, noun, subtitle, fields, enabledKey, itemTitle, itemSub, defaults = {} }) {
  const toast = useToast()
  const { refresh } = useContent()
  const [rows, setRows] = useState(null)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(null) // { id?, original?, values }
  const [saving, setSaving] = useState(false)
  const [toDelete, setToDelete] = useState(null)

  const load = useCallback(async () => {
    try { setRows(await listRows(table)); setError(null) } catch (e) { setError(e.message) }
  }, [table])
  useEffect(() => { load() }, [load])
  const changed = async () => { await load(); refresh() }
  const images = fields.filter((f) => f.type === 'image')

  const startNew = () => setEditing({ values: Object.fromEntries(fields.map((f) => [f.name, f.default ?? (f.type === 'select' ? f.options[0].value : '')])) })

  const save = async () => {
    const problem = validate(fields, editing.values)
    if (problem) return toast.error(problem)
    setSaving(true)
    try {
      const clean = Object.fromEntries(fields.map((f) => [f.name, prep(f, editing.values[f.name])]))
      if (editing.id) {
        await updateRow(table, editing.id, clean)
        await Promise.all(images.filter((f) => editing.original[f.name] && editing.original[f.name] !== clean[f.name]).map((f) => removeFileByUrl(editing.original[f.name])))
      } else {
        const next = Math.max(0, ...rows.map((r) => r.sort_order)) + 1
        await insertRow(table, { ...defaults, ...clean, sort_order: next })
      }
      toast.success(editing.id ? `${noun} updated.` : `${noun} added.`)
      setEditing(null); await changed()
    } catch (e) { toast.error(e.message || 'Could not save.') }
    finally { setSaving(false) }
  }

  const toggle = async (r) => {
    try { await updateRow(table, r.id, { [enabledKey]: !r[enabledKey] }); await changed() } catch (e) { toast.error(e.message) }
  }

  const move = async (i, dir) => {
    const a = rows[i], b = rows[i + dir]
    if (!b) return
    try {
      await Promise.all([updateRow(table, a.id, { sort_order: b.sort_order }), updateRow(table, b.id, { sort_order: a.sort_order })])
      await changed()
    } catch (e) { toast.error(e.message) }
  }

  const remove = async () => {
    setSaving(true)
    try {
      await deleteRow(table, toDelete.id)
      await Promise.all(images.map((f) => removeFileByUrl(toDelete[f.name])))
      toast.success(`${noun} deleted.`); setToDelete(null); await changed()
    } catch (e) { toast.error(e.message || 'Could not delete.') }
    finally { setSaving(false) }
  }

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} action={!editing && rows && <Btn onClick={startNew}><Plus className="h-4 w-4" />Add {noun.toLowerCase()}</Btn>} />
      {error && <ErrorBox message={error} />}
      {!rows && !error && <Spinner />}

      {editing && (
        <Card className="mb-6 space-y-4">
          <h2 className="font-display text-lg font-semibold">{editing.id ? `Edit ${noun.toLowerCase()}` : `New ${noun.toLowerCase()}`}</h2>
          {fields.map((f) => <FieldInput key={f.name} field={f} value={editing.values[f.name]} onChange={(v) => setEditing((s) => ({ ...s, values: { ...s.values, [f.name]: v } }))} />)}
          <div className="flex justify-end gap-2">
            <Btn variant="ghost" onClick={() => setEditing(null)}>Cancel</Btn>
            <Btn busy={saving} onClick={save}>{editing.id ? 'Save changes' : `Add ${noun.toLowerCase()}`}</Btn>
          </div>
        </Card>
      )}

      {rows && rows.length === 0 && !editing && (
        <Card className="py-10 text-center text-muted">No {noun.toLowerCase()}s yet. Click “Add {noun.toLowerCase()}” to create the first one.</Card>
      )}

      <ul className="space-y-3">
        {rows?.map((r, i) => (
          <li key={r.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-primary/25 bg-surface/80 p-4">
            <div className="flex flex-col">
              <button aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} className="rounded p-1 hover:bg-primary/15 disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
              <button aria-label="Move down" disabled={i === rows.length - 1} onClick={() => move(i, 1)} className="rounded p-1 hover:bg-primary/15 disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display font-semibold">{itemTitle(r)}</p>
              <p className="truncate text-sm text-muted">{itemSub(r)}</p>
            </div>
            <Toggle checked={r[enabledKey]} onChange={() => toggle(r)} label={r[enabledKey] ? 'Visible' : 'Hidden'} />
            <Btn variant="ghost" aria-label="Edit" onClick={() => setEditing({ id: r.id, original: r, values: { ...r } })}><Pencil className="h-4 w-4" /></Btn>
            <Btn variant="danger" aria-label="Delete" onClick={() => setToDelete(r)}><Trash2 className="h-4 w-4" /></Btn>
          </li>
        ))}
      </ul>

      <ConfirmDialog open={!!toDelete} busy={saving} title={`Delete this ${noun.toLowerCase()}?`} message={`“${toDelete ? itemTitle(toDelete) : ''}” will be removed from your website. This cannot be undone.`} onConfirm={remove} onCancel={() => setToDelete(null)} />
    </>
  )
}
