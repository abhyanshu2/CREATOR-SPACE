import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { isSupabaseConfigured } from '../lib/supabaseClient'
import SetupNotice from './SetupNotice'
import { Spinner } from './admin/ui'

export default function ProtectedRoute({ children }) {
  const { session, isAdmin, loading } = useAuth()
  if (!isSupabaseConfigured) return <SetupNotice />
  if (loading) return <div className="grid min-h-screen place-items-center"><Spinner /></div>
  if (!session || !isAdmin) return <Navigate to="/admin/login" replace />
  return children
}
