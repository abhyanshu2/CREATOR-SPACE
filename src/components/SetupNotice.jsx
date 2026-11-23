export default function SetupNotice() {
  return (
    <div className="grid min-h-screen place-items-center p-6">
      <div className="glow-card max-w-lg p-8 text-center">
        <h1 className="font-display text-2xl font-semibold">Supabase is not connected</h1>
        <p className="mt-3 text-muted">Add <code className="text-primary">VITE_SUPABASE_URL</code> and <code className="text-primary">VITE_SUPABASE_ANON_KEY</code> to your <code>.env</code> file (or to your Vercel environment variables), then restart / redeploy.</p>
      </div>
    </div>
  )
}
