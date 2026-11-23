import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { usePublicContent } from '../context/ContentContext'
import { isSupabaseConfigured } from '../lib/supabaseClient'
import SetupNotice from '../components/SetupNotice'
import Navbar from '../components/public/Navbar'
import HeroVideo from '../components/public/HeroVideo'
import ProfileCard from '../components/public/ProfileCard'
import SocialLinks from '../components/public/SocialLinks'
import Projects from '../components/public/Projects'
import Contact from '../components/public/Contact'
import { CatFace, FloatingHearts } from '../components/public/Decor'

const hexToRgb = (hex) => {
  if (!/^#[0-9a-f]{6}$/i.test(hex || '')) return null
  const n = parseInt(hex.slice(1), 16)
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`
}

function Skeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse space-y-6 p-6" aria-label="Loading">
      <div className="h-12 rounded-full bg-primary/10" />
      <div className="grid gap-6 md:grid-cols-2"><div className="h-64 rounded-3xl bg-primary/10" /><div className="mx-auto aspect-[9/16] w-64 rounded-3xl bg-primary/10" /></div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center p-6">
      <div className="glow-card max-w-md p-8 text-center">
        <CatFace className="mx-auto h-20 w-20" />
        <h1 className="mt-3 font-display text-2xl font-semibold">This page doesn’t exist</h1>
        <p className="mt-2 text-sm text-muted">No creator uses this name yet.</p>
        <Link to="/" className="btn-pink mt-5">Go to CreatorSpace</Link>
      </div>
    </div>
  )
}

export default function Home() {
  const { slug } = useParams()
  const { content, loading, error, notFound, refresh } = usePublicContent(slug)
  const [theme, setTheme] = useState('dark')
  const settings = content?.settings

  useEffect(() => { if (settings?.theme) setTheme(settings.theme) }, [settings?.theme])
  useEffect(() => {
    if (!settings) return
    const root = document.documentElement
    root.dataset.theme = theme
    const p = hexToRgb(settings.primary), s = hexToRgb(settings.secondary)
    if (p) root.style.setProperty('--c-primary', p)
    if (s) root.style.setProperty('--c-secondary', s)
  }, [theme, settings?.primary, settings?.secondary])
  useEffect(() => { if (settings) document.title = settings.logo_text }, [settings?.logo_text])

  if (!isSupabaseConfigured) return <SetupNotice />
  if (notFound) return <NotFound />
  if (!content) {
    if (loading) return <Skeleton />
    return (
      <div className="grid min-h-screen place-items-center p-6">
        <div className="glow-card max-w-md p-8 text-center">
          <CatFace className="mx-auto h-20 w-20" />
          <h1 className="mt-3 font-display text-2xl font-semibold">Couldn’t load the website</h1>
          <p className="mt-2 text-sm text-muted">{error}</p>
          <button onClick={refresh} className="btn-pink mt-5">Try again</button>
        </div>
      </div>
    )
  }

  const c = content
  const sections = c.sections
  const renderers = {
    hero: () => <HeroVideo video={c.video} profile={c.profile} sections={sections} />,
    profile: (s) => <ProfileCard section={s} profile={c.profile} />,
    work: (s) => <Projects section={s} projects={c.projects} workLinks={c.workLinks} />,
    socials: (s) => <SocialLinks section={s} socials={c.socials} />,
    contact: (s) => <Contact section={s} contact={c.contact} />,
  }

  return (
    <div className="relative min-h-screen">
      <FloatingHearts enabled={settings.animations} />
      <Navbar settings={settings} sections={sections} theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
      <main className="relative z-10">
        {sections.filter((s) => s.visible && renderers[s.key]).map((s) => <div key={s.key}>{renderers[s.key](s)}</div>)}
        {sections.every((s) => !s.visible) && <p className="p-16 text-center text-muted">Nothing to show yet.</p>}
      </main>
      {settings.footer && <footer className="relative z-10 border-t border-primary/20 py-8 text-center text-sm text-muted">{settings.footer}</footer>}
    </div>
  )
}
