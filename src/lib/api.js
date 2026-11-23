import { supabase, BUCKETS } from './supabaseClient'
import { validateFile, safeFileName } from './uploadValidation'

const unwrap = ({ data, error }) => { if (error) throw error; return data }

// DB rows -> the shape the public components use. Disabled/unpublished rows are
// filtered here too, so an admin previewing the site sees exactly what visitors see.
export function normalize({ profile, settings, contact, socials, projects, workLinks }) {
  const p = profile || {}, s = settings || {}, c = contact || {}
  return {
    settings: {
      logo_text: s.logo_text || 'CreatorSpace',
      logo_url: s.logo_url || null,
      primary: s.primary_color || '#ff4fa3',
      secondary: s.secondary_color || '#a855f7',
      theme: s.background_theme || 'dark',
      animations: s.animations_enabled !== false,
      footer: s.footer_text || '',
    },
    sections: [...(s.sections || [])].sort((a, b) => a.order - b.order),
    video: { url: s.video_url || null, thumbnail: s.video_thumbnail_url || null, title: s.video_title || '' },
    profile: {
      name: p.name || '', title: p.title || '', intro: p.intro || '', bio: p.bio || '',
      avatar_url: p.avatar_url || null, banner_url: p.banner_url || null,
      stats: Array.isArray(p.stats) ? p.stats : [],
    },
    socials: (socials || []).filter((x) => x.is_enabled).map((x) => ({ id: x.id, platform: x.platform, username: x.username, url: x.url, icon: x.icon, enabled: true, order: x.sort_order })),
    projects: (projects || []).filter((x) => x.is_published).map((x) => ({ id: x.id, title: x.title, description: x.description, thumbnail: x.thumbnail_url, github_url: x.github_url, demo_url: x.demo_url, order: x.sort_order })),
    workLinks: (workLinks || []).filter((x) => x.is_enabled).map((x) => ({ id: x.id, label: x.label, url: x.url, icon: x.icon, enabled: true, order: x.sort_order })),
    contact: { email: c.email || '', whatsapp: c.whatsapp || '', message: c.message || '', button_label: c.button_label || 'Get in touch', button_url: c.button_url || '' },
  }
}

// Returns null when no creator has this name.
export async function fetchPublicContent(slug) {
  const first = await supabase.from('profiles').select('*').eq('slug', String(slug).toLowerCase()).maybeSingle()
  if (first.error) throw first.error
  const profile = first.data
  if (!profile) return null
  const one = (t) => supabase.from(t).select('*').eq('owner_id', profile.owner_id).maybeSingle()
  const many = (t) => supabase.from(t).select('*').eq('owner_id', profile.owner_id).order('sort_order')
  const res = await Promise.all([one('site_settings'), one('contact_settings'), many('social_links'), many('projects'), many('work_links')])
  const failed = res.find((r) => r.error)
  if (failed) throw failed.error
  const [settings, contact, socials, projects, workLinks] = res.map((r) => r.data)
  return normalize({ profile, settings, contact, socials, projects, workLinks })
}

// ---- admin CRUD ----
export async function currentUid() {
  const { data } = await supabase.auth.getSession()
  const id = data.session?.user?.id
  if (!id) throw new Error('Please sign in again.')
  return id
}
export const listRows = async (table) => supabase.from(table).select('*').eq('owner_id', await currentUid()).order('sort_order').then(unwrap)
export const getSingleton = async (table) => supabase.from(table).select('*').eq('owner_id', await currentUid()).single().then(unwrap)
export const insertRow = async (table, row) => supabase.from(table).insert({ ...row, owner_id: await currentUid() }).select().single().then(unwrap)
export const updateRow = (table, id, patch) => supabase.from(table).update(patch).eq('id', id).select().single().then(unwrap)
export const deleteRow = async (table, id) => { const { error } = await supabase.from(table).delete().eq('id', id); if (error) throw error }

// ---- storage ----
export async function uploadFile(bucket, file) {
  const problem = validateFile(file, bucket)
  if (problem) throw new Error(problem)
  const path = `${await currentUid()}/${safeFileName(file)}`
  const { error } = await supabase.storage.from(bucket).upload(path, file, { contentType: file.type, cacheControl: '3600', upsert: false })
  if (error) throw error
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
}

// Best-effort cleanup of a replaced/removed file; never throws.
export async function removeFileByUrl(url) {
  try {
    const m = url && url.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/)
    if (!m || !Object.values(BUCKETS).includes(m[1])) return
    await supabase.storage.from(m[1]).remove([decodeURIComponent(m[2])])
  } catch { /* ignore */ }
}
