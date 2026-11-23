import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)

export const SLUG_RE = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/
export const RESERVED = ['admin', 'login', 'signup', 'api', 'www', 'assets', 'static', 'u', 'app', 'dashboard']
export const MIN_CODE = 6
// Supabase Auth needs an email; the creator never sees or types this one.
const emailFor = (slug) => `${slug}@creatorspace.app`
export const cleanName = (v) => v.trim().toLowerCase()

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false) })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  const signIn = async (name, code) => {
    const { error } = await supabase.auth.signInWithPassword({ email: emailFor(cleanName(name)), password: code })
    if (error) throw new Error(error.message === 'Invalid login credentials' ? 'Wrong name or code.' : error.message)
  }

  const signUp = async (name, code) => {
    const slug = cleanName(name)
    if (!SLUG_RE.test(slug)) throw new Error('Name must be 3-30 characters: letters, numbers or hyphen (no spaces).')
    if (RESERVED.includes(slug)) throw new Error('This name is reserved. Please choose another.')
    if (code.length < MIN_CODE) throw new Error(`Code must be at least ${MIN_CODE} characters.`)
    const { data: free } = await supabase.rpc('slug_available', { s: slug })
    if (free === false) throw new Error('This name is already taken. Try another one.')
    const { data, error } = await supabase.auth.signUp({ email: emailFor(slug), password: code, options: { data: { slug } } })
    if (error) {
      if (/already registered/i.test(error.message)) throw new Error('This name is already taken. Try another one.')
      if (/database error/i.test(error.message)) throw new Error('This name cannot be used. Try another one.')
      throw new Error(error.message)
    }
    if (!data.session) throw new Error('Sign-up worked but email confirmation is ON in Supabase. Turn off "Confirm email" (see setup steps).')
  }

  const signOut = async () => { await supabase.auth.signOut() }
  const slug = session?.user?.user_metadata?.slug || null

  return <Ctx.Provider value={{ session, isAdmin: Boolean(session), slug, loading, signIn, signUp, signOut }}>{children}</Ctx.Provider>
}
