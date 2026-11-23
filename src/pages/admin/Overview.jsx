import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { currentUid } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { Btn } from '../../components/admin/ui'
import { Card, ErrorBox, PageHeader, Spinner } from '../../components/admin/ui'

const TABLES = [
  ['profiles', 'Profile'], ['social_links', 'Social links'], ['projects', 'Projects'],
  ['work_links', 'Work links'], ['site_settings', 'Site settings'], ['contact_settings', 'Contact'],
]
const SHORTCUTS = [['/admin/profile', 'Edit profile'], ['/admin/video', 'Change video'], ['/admin/social', 'Manage social links'], ['/admin/projects', 'Manage projects'], ['/admin/appearance', 'Appearance'], ['/admin/settings', 'Show / hide sections']]

export default function Overview() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const { slug } = useAuth()
  const toast = useToast()
  const link = `${window.location.origin}/${slug}`

  useEffect(() => {
    (async () => {
      try {
        const uid = await currentUid()
        const count = (t) => supabase.from(t).select('*', { count: 'exact', head: true }).eq('owner_id', uid)
        const latest = (t) => supabase.from(t).select('updated_at').eq('owner_id', uid).order('updated_at', { ascending: false }).limit(1).maybeSingle()
        const [social, projects, work, settings, ...recent] = await Promise.all([count('social_links'), count('projects'), count('work_links'), supabase.from('site_settings').select('sections').eq('owner_id', uid).single(), ...TABLES.map(([t]) => latest(t))])
        const failed = [social, projects, work, settings, ...recent].find((r) => r.error)
        if (failed) throw failed.error
        setData({
          social: social.count, projects: projects.count, work: work.count,
          sections: settings.data.sections.length, visible: settings.data.sections.filter((s) => s.visible).length,
          recent: TABLES.map(([, label], i) => ({ label, at: recent[i].data?.updated_at })).filter((r) => r.at).sort((a, b) => new Date(b.at) - new Date(a.at)),
        })
      } catch (e) { setError(e.message) }
    })()
  }, [])

  if (error) return <ErrorBox message={error} />
  if (!data) return <Spinner />
  const stats = [['Social links', data.social], ['Projects', data.projects], ['Work links', data.work], ['Website sections', `${data.visible}/${data.sections} visible`]]

  return (
    <>
      <PageHeader title="Overview" subtitle="Everything on your website is managed from here." />
      <Card className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0"><p className="text-sm text-muted">Your website link (share this)</p><a href={link} target="_blank" rel="noopener noreferrer" className="break-all font-semibold text-primary hover:underline">{link}</a></div>
        <Btn variant="ghost" onClick={() => navigator.clipboard.writeText(link).then(() => toast.success('Link copied.'), () => toast.error('Could not copy.'))}>Copy link</Btn>
      </Card>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(([label, value]) => (
          <Card key={label}><p className="text-sm text-muted">{label}</p><p className="mt-1 font-display text-2xl font-bold text-primary">{value}</p></Card>
        ))}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-display text-lg font-semibold">Quick shortcuts</h2>
          <div className="flex flex-wrap gap-2">{SHORTCUTS.map(([to, label]) => <Link key={to} to={to} className="rounded-full border border-primary/40 px-4 py-2 text-sm font-semibold hover:bg-primary/15">{label}</Link>)}</div>
        </Card>
        <Card>
          <h2 className="mb-3 font-display text-lg font-semibold">Recent updates</h2>
          {data.recent.length === 0 ? <p className="text-sm text-muted">No updates yet.</p> : (
            <ul className="space-y-2 text-sm">{data.recent.map((r) => <li key={r.label} className="flex justify-between gap-2"><span>{r.label}</span><span className="text-muted">{new Date(r.at).toLocaleString()}</span></li>)}</ul>
          )}
        </Card>
      </div>
    </>
  )
}
