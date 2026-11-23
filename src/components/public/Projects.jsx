import { Github, ExternalLink, ImageOff } from 'lucide-react'
import { getIcon } from '../../lib/icons'

export default function Projects({ section, projects, workLinks }) {
  const links = [...workLinks].sort((a, b) => a.order - b.order)
  const items = [...projects].sort((a, b) => a.order - b.order)
  return (
    <section id="work" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14">
      {section.heading && <h2 className="section-title">{section.heading}</h2>}
      {section.description && <p className="mt-2 max-w-xl text-muted">{section.description}</p>}

      {links.length > 0 && (
        <ul className={`flex flex-wrap gap-3 ${section.heading ? 'mt-6' : ''} mb-8`}>
          {links.map((l) => {
            const Icon = getIcon(l.icon)
            return (
              <li key={l.id}>
                <a href={l.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-primary/50 px-4 py-2 text-sm font-semibold transition hover:bg-primary/15">
                  <Icon className="h-4 w-4 text-primary" />{l.label}
                </a>
              </li>
            )
          })}
        </ul>
      )}

      {items.length === 0 ? (
        <p className="glow-card p-8 text-center text-muted">No projects published yet.</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2">
          {items.map((p) => (
            <li key={p.id} className="glow-card overflow-hidden">
              <div className="aspect-video bg-bg/50">
                {p.thumbnail ? <img src={p.thumbnail} alt="" loading="lazy" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-muted"><ImageOff className="h-8 w-8" /></div>}
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm text-muted">{p.description}</p>
                <div className="mt-4 flex gap-3">
                  {p.github_url && <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"><Github className="h-4 w-4" />Code</a>}
                  {p.demo_url && <a href={p.demo_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"><ExternalLink className="h-4 w-4" />Live demo</a>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
