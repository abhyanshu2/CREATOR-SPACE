import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { getSingleton, removeFileByUrl, updateRow } from '../../lib/api'
import { BUCKETS } from '../../lib/supabaseClient'
import { useToast } from '../../context/ToastContext'
import { useContent } from '../../context/ContentContext'
import { Btn, Card, ErrorBox, Field, PageHeader, Spinner, inputCls } from '../../components/admin/ui'
import FileUploader from '../../components/admin/FileUploader'
import ConfirmDialog from '../../components/admin/ConfirmDialog'

export default function VideoPage() {
  const toast = useToast()
  const { refresh } = useContent()
  const [row, setRow] = useState(null)
  const [title, setTitle] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  const [confirm, setConfirm] = useState(false)

  useEffect(() => { getSingleton('site_settings').then((r) => { setRow(r); setTitle(r.video_title || '') }).catch((e) => setError(e.message)) }, [])

  // Video and thumbnail save immediately after upload so a big upload is never lost.
  const apply = async (patch, message, oldUrls = []) => {
    setBusy(true)
    try {
      const r = await updateRow('site_settings', row.id, patch)
      await Promise.all(oldUrls.filter((u) => u && !Object.values(patch).includes(u)).map(removeFileByUrl))
      setRow(r); toast.success(message); refresh()
    } catch (e) { toast.error(e.message || 'Could not save.') }
    finally { setBusy(false); setConfirm(false) }
  }

  if (error) return <ErrorBox message={error} />
  if (!row) return <Spinner />

  return (
    <>
      <PageHeader title="Video" subtitle="The portrait video shown on your home page." />
      <Card className="space-y-5">
        <FileUploader label="Video (MP4, WebM or MOV)" bucket={BUCKETS.video} kind="video" value={row.video_url} onChange={(url) => (url ? apply({ video_url: url }, 'Video saved.', [row.video_url]) : setConfirm(true))} />
        <FileUploader label="Thumbnail (poster image)" bucket={BUCKETS.assets} value={row.video_thumbnail_url} onChange={(url) => apply({ video_thumbnail_url: url }, url ? 'Thumbnail saved.' : 'Thumbnail removed.', [row.video_thumbnail_url])} />
        <Field label="Video title"><input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
        <div className="flex flex-wrap justify-between gap-2">
          <Btn variant="danger" disabled={!row.video_url} onClick={() => setConfirm(true)}><Trash2 className="h-4 w-4" />Delete video</Btn>
          <Btn busy={busy} onClick={() => apply({ video_title: title.trim() }, 'Title saved.')}>Save title</Btn>
        </div>
      </Card>
      <ConfirmDialog open={confirm} busy={busy} title="Delete the video?" message="The video and its thumbnail will be removed from your website." onConfirm={() => apply({ video_url: null, video_thumbnail_url: null, video_title: '' }, 'Video deleted.', [row.video_url, row.video_thumbnail_url])} onCancel={() => setConfirm(false)} />
    </>
  )
}
