import { useRef, useState } from 'react'
import { Upload, Trash2 } from 'lucide-react'
import { uploadFile } from '../../lib/api'
import { LIMITS, validateFile } from '../../lib/uploadValidation'
import { useToast } from '../../context/ToastContext'
import { Btn } from './ui'

export default function FileUploader({ label, bucket, kind = 'image', value, onChange }) {
  const toast = useToast()
  const input = useRef(null)
  const [busy, setBusy] = useState(false)
  const rule = LIMITS[bucket]

  const pick = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const problem = validateFile(file, bucket)
    if (problem) return toast.error(problem)
    setBusy(true)
    try { onChange(await uploadFile(bucket, file)); toast.success('File uploaded.') }
    catch (err) { toast.error(err.message || 'Upload failed.') }
    finally { setBusy(false) }
  }

  return (
    <div>
      <span className="mb-1 block text-sm font-semibold">{label}</span>
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-dashed border-primary/40 bg-bg/40 p-3">
        {value ? (
          kind === 'video'
            ? <video src={value} controls preload="metadata" className="h-40 rounded-lg bg-black" />
            : <img src={value} alt="" className="h-20 w-20 rounded-lg object-cover" />
        ) : <div className="grid h-20 w-20 place-items-center rounded-lg bg-surface text-xs text-muted">No file</div>}
        <div className="flex flex-col gap-2">
          <input ref={input} type="file" accept={rule.types.join(',')} onChange={pick} className="hidden" />
          <Btn type="button" variant="ghost" busy={busy} onClick={() => input.current.click()}><Upload className="h-4 w-4" />{value ? 'Replace' : 'Upload'}</Btn>
          {value && <Btn type="button" variant="danger" disabled={busy} onClick={() => onChange(null)}><Trash2 className="h-4 w-4" />Remove</Btn>}
          <span className="text-xs text-muted">Max {Math.round(rule.maxBytes / 1048576)} MB</span>
        </div>
      </div>
    </div>
  )
}
