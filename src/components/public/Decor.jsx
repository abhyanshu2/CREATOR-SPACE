import { Heart } from 'lucide-react'

export function CatFace({ className = 'w-24 h-24' }) {
  return (
    <svg viewBox="0 0 120 110" className={className} fill="none" aria-hidden="true">
      <path d="M18 40 L22 8 L50 26 Z M102 40 L98 8 L70 26 Z" fill="rgb(var(--c-primary))" opacity=".9" />
      <ellipse cx="60" cy="64" rx="46" ry="38" fill="rgb(var(--c-surface))" stroke="rgb(var(--c-primary))" strokeWidth="3" />
      <ellipse cx="44" cy="62" rx="5" ry="7" fill="rgb(var(--c-ink))" />
      <ellipse cx="76" cy="62" rx="5" ry="7" fill="rgb(var(--c-ink))" />
      <circle cx="46" cy="60" r="1.8" fill="#fff" /><circle cx="78" cy="60" r="1.8" fill="#fff" />
      <path d="M55 74 Q60 80 65 74" stroke="rgb(var(--c-primary))" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="32" cy="74" rx="7" ry="4" fill="rgb(var(--c-primary))" opacity=".35" />
      <ellipse cx="88" cy="74" rx="7" ry="4" fill="rgb(var(--c-primary))" opacity=".35" />
      <path d="M8 66 H26 M8 74 H24 M112 66 H94 M112 74 H96" stroke="rgb(var(--c-primary))" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function FloatingHearts({ enabled = true }) {
  if (!enabled) return null
  const spots = [
    ['left-[6%] top-24', 'w-5 h-5', '0s'], ['right-[8%] top-40', 'w-7 h-7', '1s'],
    ['left-[12%] top-[60%]', 'w-4 h-4', '2s'], ['right-[14%] top-[78%]', 'w-6 h-6', '.5s'],
  ]
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {spots.map(([pos, size, delay], i) => (
        <Heart key={i} className={`absolute ${pos} ${size} text-primary/50 fill-primary/30 animate-floaty`} style={{ animationDelay: delay }} />
      ))}
    </div>
  )
}
