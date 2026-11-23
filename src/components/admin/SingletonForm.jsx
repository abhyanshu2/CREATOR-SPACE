import { useEffect, useState } from 'react'
import { getSingleton, updateRow, removeFileByUrl } from '../../lib/api'
import { useToast } from '../../context/ToastContext'
import { useContent } from '../../context/ContentContext'
import { Btn, Card, ErrorBox, PageHeader, Spinner } from './ui'
import { FieldInput, prep, validate } from './FormFields'

// One editable row (profile, contact, appearance). Saves to Supabase, then refreshes the public cache.
export default function SingletonForm({ table, title, subtitle, fields }) {
  const toast = useToast()
  const { refresh } = useContent()
  const [orig, setOrig] = useState(null)
  const [vals, setVals] = useState(null)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { getSingleton(table).then((r) => { setOrig(r); setVals(r) }).catch((e) => setError(e.message)) }, [table])

  const save = async () => {
    const problem = validate(fields, vals)
    if (problem) return toast.error(problem)
    setSaving(true)
    try {
      const patch = Object.fromEntries(fields.map((f) => [f.name, prep(f, vals[f.name])]))
      const row = await updateRow(table, orig.id, patch)
      await Promise.all(fields.filter((f) => f.type === 'image' && orig[f.name] && orig[f.name] !== row[f.name]).map((f) => removeFileByUrl(orig[f.name])))
      setOrig(row); setVals(row)
      toast.success('Saved. Your website is updated.')
      refresh()
    } catch (e) { toast.error(e.message || 'Could not save.') }
    finally { setSaving(false) }
  }

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} action={vals && <Btn busy={saving} onClick={save}>Save changes</Btn>} />
      {error && <ErrorBox message={error} />}
      {!vals && !error && <Spinner />}
      {vals && (
        <Card className="space-y-4">
          {fields.map((f) => <FieldInput key={f.name} field={f} value={vals[f.name]} onChange={(v) => setVals((s) => ({ ...s, [f.name]: v }))} />)}
          <div className="flex justify-end"><Btn busy={saving} onClick={save}>Save changes</Btn></div>
        </Card>
      )}
    </>
  )
}
