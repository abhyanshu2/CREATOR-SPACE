import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// True when .env is filled in. The app can show a setup message instead of crashing.
export const isSupabaseConfigured = Boolean(url && anonKey)

// Only the public anon key is used here; row-level security protects the data.
export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, { auth: { persistSession: true, autoRefreshToken: true } })
  : null

export const BUCKETS = {
  profile: 'profile-images',
  video: 'creator-videos',
  project: 'project-images',
  assets: 'website-assets',
}
