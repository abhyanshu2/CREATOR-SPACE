import { BUCKETS } from './supabaseClient'

// Keep in sync with supabase/migrations/002_storage.sql (the bucket enforces the same limits server-side).
const MB = 1024 * 1024
const IMAGE = ['image/jpeg', 'image/png', 'image/webp']
export const LIMITS = {
  [BUCKETS.profile]: { maxBytes: 5 * MB, types: IMAGE },
  [BUCKETS.project]: { maxBytes: 5 * MB, types: IMAGE },
  [BUCKETS.assets]: { maxBytes: 5 * MB, types: IMAGE },
  [BUCKETS.video]: { maxBytes: 50 * MB, types: ['video/mp4', 'video/webm', 'video/quicktime'] },
}

// Returns an error message, or null when the file is acceptable.
export function validateFile(file, bucket) {
  const rule = LIMITS[bucket]
  if (!rule) return 'Unknown upload destination.'
  if (!file) return 'Choose a file first.'
  if (!rule.types.includes(file.type)) {
    return `Unsupported file type. Allowed: ${rule.types.map((t) => t.split('/')[1]).join(', ')}.`
  }
  if (file.size > rule.maxBytes) {
    return `File is too large. Maximum size is ${Math.round(rule.maxBytes / MB)} MB.`
  }
  return null
}

// Random file name so uploads never collide and user-supplied names are never trusted.
export function safeFileName(file) {
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '')
  return `${crypto.randomUUID()}.${ext}`
}
