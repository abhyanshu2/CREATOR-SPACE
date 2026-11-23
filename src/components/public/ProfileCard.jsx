import { CatFace } from './Decor'

export default function ProfileCard({ section, profile }) {
  return (
    <section id="profile" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14">
      {section.heading && <h2 className="section-title">{section.heading}</h2>}
      {section.description && <p className="mt-2 max-w-xl text-muted">{section.description}</p>}
      <div className={`glow-card overflow-hidden ${section.heading ? 'mt-8' : ''}`}>
        {profile.banner_url && <img src={profile.banner_url} alt="" className="h-36 w-full object-cover sm:h-48" loading="lazy" />}
        <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[auto,1fr] md:items-center">
          <div className="mx-auto h-40 w-40 overflow-hidden rounded-full border-2 border-primary shadow-[0_0_28px_rgb(var(--c-primary)/0.5)]">
            {profile.avatar_url ? <img src={profile.avatar_url} alt={profile.name} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center bg-surface"><CatFace className="h-28 w-28" /></div>}
          </div>
          <div>
            <h3 className="font-display text-2xl font-semibold">{profile.name}</h3>
            <p className="font-semibold text-primary">{profile.title}</p>
            <p className="mt-3 max-w-prose whitespace-pre-line text-muted">{profile.bio}</p>
            {profile.stats.length > 0 && (
              <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {profile.stats.map((s, i) => (
                  <div key={i} className="rounded-2xl border border-primary/30 bg-bg/40 p-3 text-center">
                    <dd className="font-display text-2xl font-bold text-primary">{s.value}</dd>
                    <dt className="text-xs text-muted">{s.label}</dt>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
