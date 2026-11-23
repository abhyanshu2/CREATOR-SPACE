import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { fetchPublicContent } from '../lib/api'
import { isSupabaseConfigured } from '../lib/supabaseClient'

const PREFIX = 'cs_content_v2_'
const readCache = (slug) => { try { return JSON.parse(sessionStorage.getItem(PREFIX + slug)) } catch { return null } }
const writeCache = (slug, data) => { try { sessionStorage.setItem(PREFIX + slug, JSON.stringify(data)) } catch { /* ignore */ } }

// Public page data for one creator. Cached copy shows instantly, fresh data replaces it.
export function usePublicContent(slug) {
  const [content, setContent] = useState(() => readCache(slug))
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState(null)
  const last = useRef(0)

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) return
    try {
      const data = await fetchPublicContent(slug)
      if (!data) { setNotFound(true); setContent(null) } else { setNotFound(false); setContent(data); writeCache(slug, data) }
      setError(null)
    } catch (e) { setError(e.message || 'Could not load content.') }
    finally { setLoading(false); last.current = Date.now() }
  }, [slug])

  useEffect(() => { setContent(readCache(slug)); setNotFound(false); setLoading(true); load() }, [slug, load])
  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === 'visible' && Date.now() - last.current > 60000) load() }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [load])

  return { content, loading, error, notFound, refresh: load }
}

// Admin pages call refresh() after saving: clears cached public pages so the next view is fresh.
const Ctx = createContext({ refresh: () => {} })
export const useContent = () => useContext(Ctx)
export function ContentProvider({ children }) {
  const refresh = useCallback(() => {
    try { Object.keys(sessionStorage).filter((k) => k.startsWith(PREFIX)).forEach((k) => sessionStorage.removeItem(k)) } catch { /* ignore */ }
  }, [])
  return <Ctx.Provider value={{ refresh }}>{children}</Ctx.Provider>
}
