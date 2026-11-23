import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { CatFace } from './Decor'

export default function HeroVideo({ video, profile, sections = [] }) {
  const has = (k) => sections.some((s) => s.key === k && s.visible)
  const ref = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)

  const toggle = () => {
    const el = ref.current
    if (!el) return
    if (el.paused) { el.play(); setPlaying(true) } else { el.pause(); setPlaying(false) }
  }

  return (
    <section id="hero" className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-10 md:grid-cols-2 md:pt-16">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="order-2 md:order-1">
        <h1 className="whitespace-pre-line font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{profile.intro || profile.name}</h1>
        {(profile.name || profile.title) && <p className="mt-4 max-w-md text-lg text-muted">{[profile.name, profile.title].filter(Boolean).join(", ")}</p>}
        <div className="mt-8 flex flex-wrap gap-3">
          {has('contact') && <a href="#contact" className="btn-pink">Say hello</a>}
          {has('work') && <a href="#work" className="inline-flex items-center rounded-full border border-primary/60 px-6 py-3 font-display font-semibold transition hover:bg-primary/15">See projects</a>}
        </div>
      </motion.div>

      <div className="order-1 flex justify-center md:order-2">
        <div className="relative w-full max-w-[300px] sm:max-w-[340px]">
          <CatFace className="absolute -left-6 -top-10 z-10 h-20 w-20 animate-floaty" />
          <div className="glow-card relative aspect-[9/16] overflow-hidden p-2">
            <div className="relative h-full w-full overflow-hidden rounded-[1.4rem] bg-black/40">
              {video.url ? (
                <video ref={ref} src={video.url} poster={video.thumbnail || undefined} muted={muted} loop playsInline preload="metadata" className="h-full w-full object-cover" onClick={toggle} />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center text-muted">
                  <CatFace className="h-24 w-24" />
                  <p className="font-display text-lg text-ink">No video yet</p>
                  <p className="text-sm">The creator has not uploaded an intro video.</p>
                </div>
              )}
              {video.url && (
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent p-4">
                  <button onClick={toggle} aria-label={playing ? 'Pause video' : 'Play video'} className="rounded-full bg-primary p-3 text-white shadow-[0_0_18px_rgb(var(--c-primary)/0.7)] transition hover:scale-105">
                    {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-white" />}
                  </button>
                  <button onClick={() => setMuted(!muted)} aria-label={muted ? 'Unmute' : 'Mute'} className="rounded-full bg-black/50 p-3 text-white">
                    {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
