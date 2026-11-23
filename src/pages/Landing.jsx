import { Link } from 'react-router-dom'
import { CatFace, FloatingHearts } from '../components/public/Decor'

export default function Landing() {
  return (
    <div className="relative grid min-h-screen place-items-center p-6">
      <FloatingHearts />
      <div className="glow-card relative z-10 max-w-lg p-10 text-center">
        <CatFace className="mx-auto h-24 w-24 animate-floaty" />
        <h1 className="mt-4 font-display text-4xl font-bold">CreatorSpace</h1>
        <p className="mt-3 text-muted">Make your own cute creator website. Pick a name and a secret code, and manage everything yourself.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/admin/login?mode=signup" className="btn-pink">Create my space</Link>
          <Link to="/admin/login" className="inline-flex items-center rounded-full border border-primary/60 px-6 py-3 font-display font-semibold transition hover:bg-primary/15">Login</Link>
        </div>
      </div>
    </div>
  )
}
