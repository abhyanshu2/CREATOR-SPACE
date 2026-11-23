import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Briefcase, Contact, ExternalLink, Heart, LayoutDashboard, Link2, LogOut, Menu, Palette, Settings, User, Video, Share2, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/profile', label: 'Profile', icon: User },
  { to: '/admin/video', label: 'Video', icon: Video },
  { to: '/admin/social', label: 'Social Links', icon: Share2 },
  { to: '/admin/projects', label: 'Projects', icon: Briefcase },
  { to: '/admin/work-links', label: 'Work Links', icon: Link2 },
  { to: '/admin/contact', label: 'Contact', icon: Contact },
  { to: '/admin/appearance', label: 'Appearance', icon: Palette },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout() {
  const { signOut, slug } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  useEffect(() => { document.documentElement.dataset.theme = 'dark' }, [])

  const logout = async () => { await signOut(); navigate('/admin/login', { replace: true }) }
  const link = ({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${isActive ? 'bg-gradient-to-r from-primary/80 to-secondary/80 text-white shadow-[0_0_16px_rgb(var(--c-primary)/0.4)]' : 'text-muted hover:bg-primary/15 hover:text-ink'}`

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[17rem,1fr]">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-primary/20 bg-bg/90 px-4 py-3 backdrop-blur lg:hidden">
        <span className="flex items-center gap-2 font-display font-semibold"><Heart className="h-5 w-5 fill-primary text-primary" />Admin</span>
        <button onClick={() => setOpen(!open)} aria-label="Menu" className="rounded-full border border-primary/40 p-2">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
      </header>

      <aside className={`${open ? 'block' : 'hidden'} fixed inset-x-0 bottom-0 top-[57px] z-20 overflow-y-auto border-r border-primary/20 bg-bg p-4 lg:sticky lg:top-0 lg:block lg:h-screen lg:inset-auto`}>
        <div className="mb-6 hidden items-center gap-2 px-2 font-display text-xl font-semibold lg:flex"><Heart className="h-6 w-6 fill-primary text-primary" />Admin panel</div>
        <nav className="space-y-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)} className={link}><Icon className="h-4 w-4" />{label}</NavLink>
          ))}
          <a href={`/${slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-muted hover:bg-primary/15 hover:text-ink"><ExternalLink className="h-4 w-4" />View website</a>
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-300 hover:bg-red-500/15"><LogOut className="h-4 w-4" />Logout</button>
        </nav>
      </aside>

      <main className="min-w-0 p-4 sm:p-8"><div className="mx-auto max-w-3xl"><Outlet /></div></main>
    </div>
  )
}
