import { Plus, X } from 'lucide-react'
import { Field, Toggle, Btn, inputCls } from './ui'
import FileUploader from './FileUploader'

export function validate(fields, v) {
  for (const f of fields) {
    const val = v[f.name]
    const empty = val === undefined || val === null || String(val).trim() === ''
    if (f.required && empty) return `${f.label} is required.`
    if (f.type === 'url' && !empty) {
      const ok = (f.http ? /^https?:\/\//i : /^(https?:\/\/|mailto:|tel:)/i).test(String(val).trim())
      if (!ok) return `${f.label} must start with ${f.http ? 'https://' : 'https://, mailto: or tel:'}.`
    }
    if (f.type === 'color' && !/^#[0-9a-f]{6}$/i.test(val || '')) return `${f.label} must be a hex colour like #ff4fa3.`
  }
  return null
}

// Prepare a value for the database: trim text, turn empty optional fields into null.
export function prep(f, val) {
  if (f.type === 'stats') return (val || []).filter((s) => s.label?.trim()).map((s) => ({ label: s.label.trim(), value: String(s.value ?? '').trim() }))
  if (typeof val === 'string') { const t = val.trim(); return t === '' && f.nullable ? null : t }
  return val === undefined ? (f.nullable ? null : val) : val
}

function StatsEditor({ value = [], onChange }) {
  const set = (i, k, v) => onChange(value.map((s, j) => (j === i ? { ...s, [k]: v } : s)))
  return (
    <div className="space-y-2">
      {value.map((s, i) => (
        <div key={i} className="flex gap-2">
          <input className={inputCls} placeholder="Label (e.g. Followers)" value={s.label || ''} onChange={(e) => set(i, 'label', e.target.value)} aria-label={`Stat ${i + 1} label`} />
          <input className={`${inputCls} max-w-[8rem]`} placeholder="Value" value={s.value ?? ''} onChange={(e) => set(i, 'value', e.target.value)} aria-label={`Stat ${i + 1} value`} />
          <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label="Remove stat" className="rounded-xl border border-red-400/50 px-3 text-red-300 hover:bg-red-500/15"><X className="h-4 w-4" /></button>
        </div>
      ))}
      {value.length < 6 && <Btn type="button" variant="ghost" onClick={() => onChange([...value, { label: '', value: '' }])}><Plus className="h-4 w-4" />Add stat</Btn>}
    </div>
  )
}

export function FieldInput({ field: f, value, onChange }) {
  if (f.type === 'image') return <FileUploader label={f.label} bucket={f.bucket} value={value} onChange={onChange} />
  if (f.type === 'toggle') return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-primary/20 p-3">
      <span className="text-sm font-semibold">{f.label}</span><Toggle checked={!!value} onChange={onChange} label={f.label} />
    </div>
  )
  return (
    <Field label={f.label + (f.required ? ' *' : '')} hint={f.hint}>
      {f.type === 'textarea' && <textarea className={inputCls} rows={4} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />}
      {f.type === 'select' && (
        <select className={inputCls} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
          {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      )}
      {f.type === 'color' && (
        <div className="flex gap-2">
          <input type="color" value={/^#[0-9a-f]{6}$/i.test(value || '') ? value : '#ff4fa3'} onChange={(e) => onChange(e.target.value)} className="h-11 w-14 cursor-pointer rounded-xl border border-primary/30 bg-transparent" aria-label={`${f.label} picker`} />
          <input className={inputCls} value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder="#ff4fa3" />
        </div>
      )}
      {f.type === 'stats' && <StatsEditor value={value} onChange={onChange} />}
      {(!f.type || f.type === 'text' || f.type === 'url') && (
        <input className={inputCls} type="text" inputMode={f.type === 'url' ? 'url' : undefined} value={value ?? ''} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
    </Field>
  )
}
