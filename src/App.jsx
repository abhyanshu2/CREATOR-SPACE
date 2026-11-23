import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ContentProvider } from './context/ContentContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Landing from './pages/Landing'

// Admin code is split out so public visitors never download it.
const Login = lazy(() => import('./pages/admin/Login'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const Overview = lazy(() => import('./pages/admin/Overview'))
const ProfilePage = lazy(() => import('./pages/admin/ProfilePage'))
const VideoPage = lazy(() => import('./pages/admin/VideoPage'))
const SocialPage = lazy(() => import('./pages/admin/SocialPage'))
const ProjectsPage = lazy(() => import('./pages/admin/ProjectsPage'))
const WorkLinksPage = lazy(() => import('./pages/admin/WorkLinksPage'))
const ContactPage = lazy(() => import('./pages/admin/ContactPage'))
const AppearancePage = lazy(() => import('./pages/admin/AppearancePage'))
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'))

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <ContentProvider>
            <Suspense fallback={<div className="grid min-h-screen place-items-center text-muted">Loading…</div>}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                  <Route index element={<Overview />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="video" element={<VideoPage />} />
                  <Route path="social" element={<SocialPage />} />
                  <Route path="projects" element={<ProjectsPage />} />
                  <Route path="work-links" element={<WorkLinksPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="appearance" element={<AppearancePage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
                <Route path="/:slug" element={<Home />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </ContentProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
