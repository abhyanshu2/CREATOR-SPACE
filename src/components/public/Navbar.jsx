import { useState } from 'react'
import { Menu, X, Sun, Moon, Heart } from 'lucide-react'

export default function Navbar({ settings, sections, theme, onToggleTheme }) {
  const [open, setOpen] = useState(false)
  const links = sections.filter((s) => s.visible)
  return (
    <header className="sticky top-0 z-40 border-b border-primary/20 bg-bg/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#hero" className="flex items-center gap-2 font-display text-xl font-semibold">
          {settings.logo_url ? <img src={settings.logo_url} alt="" className="h-8 w-8 rounded-full object-cover" /> : <Heart className="h-6 w-6 fill-primary text-primary" />}
          {settings.logo_text}
        </a>
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((s) => (
            <li key={s.key}>
              <a href={`#${s.key}`} className="rounded-full px-4 py-2 text-sm font-semibold text-muted transition hover:bg-primary/15 hover:text-ink">{s.label}</a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <button onClick={onToggleTheme} aria-label="Toggle theme" className="rounded-full border border-primary/40 p-2 transition hover:bg-primary/15">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button onClick={() => setOpen(!open)} aria-label="Menu" className="rounded-full border border-primary/40 p-2 md:hidden">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      {open && (
        <ul className="border-t border-primary/20 px-4 py-2 md:hidden">
          {links.map((s) => (
            <li key={s.key}><a onClick={() => setOpen(false)} href={`#${s.key}`} className="block rounded-xl px-3 py-3 font-semibold hover:bg-primary/15">{s.label}</a></li>
          ))}
        </ul>
      )}
    </header>
  )
}
