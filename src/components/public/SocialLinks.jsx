import { getIcon } from '../../lib/icons'

export default function SocialLinks({ section, socials }) {
  const items = socials.filter((s) => s.enabled).sort((a, b) => a.order - b.order)
  return (
    <section id="socials" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14">
      {section.heading && <h2 className="section-title">{section.heading}</h2>}
      {section.description && <p className="mt-2 max-w-xl text-muted">{section.description}</p>}
      {items.length === 0 ? (
        <p className="glow-card mt-6 p-8 text-center text-muted">No social links added yet.</p>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => {
            const Icon = getIcon(s.icon)
            return (
              <li key={s.id}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="glow-card flex items-center gap-4 p-4 transition hover:-translate-y-1 hover:border-primary">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/20 text-primary"><Icon className="h-6 w-6" /></span>
                  <span>
                    <span className="block font-display font-semibold">{s.platform}</span>
                    <span className="text-sm text-muted">{s.username}</span>
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
