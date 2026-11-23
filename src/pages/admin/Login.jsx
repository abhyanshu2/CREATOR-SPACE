import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { MIN_CODE, cleanName, useAuth } from '../../context/AuthContext'
import { isSupabaseConfigured } from '../../lib/supabaseClient'
import SetupNotice from '../../components/SetupNotice'
import { Btn, Field, inputCls } from '../../components/admin/ui'

export default function Login() {
  const { session, loading, signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [mode, setMode] = useState(params.get('mode') === 'signup' ? 'signup' : 'login')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => { document.documentElement.dataset.theme = 'dark' }, [])

  if (!isSupabaseConfigured) return <SetupNotice />
  if (!loading && session) return <Navigate to="/admin" replace />

  const signup = mode === 'signup'
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setError('')
    try {
      if (signup) await signUp(name, code); else await signIn(name, code)
      navigate('/admin', { replace: true })
    } catch (err) { setError(err.message) }
    finally { setBusy(false) }
  }

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <form onSubmit={submit} className="glow-card w-full max-w-sm space-y-4 p-8">
        <div className="text-center">
          <Heart className="mx-auto h-10 w-10 fill-primary text-primary" />
          <h1 className="mt-2 font-display text-2xl font-semibold">{signup ? 'Create your space' : 'Open your admin panel'}</h1>
          <p className="text-sm text-muted">{signup ? 'Choose a name and a secret code.' : 'Enter your name and code.'}</p>
        </div>
        <Field label="Name" hint={signup && name ? `Your website link: ${window.location.origin}/${cleanName(name)}` : undefined}>
          <input className={inputCls} autoComplete="username" autoCapitalize="none" required placeholder="anshu" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Code" hint={signup ? `At least ${MIN_CODE} characters. Keep it secret - anyone with your name and code can edit your website.` : undefined}>
          <input className={inputCls} type="password" autoComplete={signup ? 'new-password' : 'current-password'} required minLength={signup ? MIN_CODE : undefined} value={code} onChange={(e) => setCode(e.target.value)} />
        </Field>
        {error && <p role="alert" className="rounded-xl border border-red-400/50 bg-red-950/40 p-3 text-sm text-red-200">{error}</p>}
        <Btn type="submit" busy={busy} className="w-full">{signup ? 'Create my space' : 'Open admin panel'}</Btn>
        <button type="button" onClick={() => { setMode(signup ? 'login' : 'signup'); setError('') }} className="w-full text-center text-sm text-muted hover:text-ink">
          {signup ? 'Already have a space? Login' : 'New here? Create your space'}
        </button>
      </form>
    </div>
  )
}
