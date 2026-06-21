import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Toaster } from 'sonner'
import { AppLayout } from '@/components/shared/AppLayout'
import { PrivateRoute } from '@/components/shared/PrivateRoute'
import { PatientRoute } from '@/components/shared/PatientRoute'
import { LoadingScreen } from '@/components/shared/LoadingScreen'

// Public pages
const LandingPage = lazy(() => import('@/features/landing/pages/LandingPage').then(m => ({ default: m.LandingPage })))
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage').then(m => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage').then(m => ({ default: m.RegisterPage })))

// Professional pages (lazy loaded)
const OnboardingPage = lazy(() => import('@/features/onboarding/pages/OnboardingPage').then(m => ({ default: m.OnboardingPage })))
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage').then(m => ({ default: m.DashboardPage })))
const PatientsPage = lazy(() => import('@/features/patients/pages/PatientsPage').then(m => ({ default: m.PatientsPage })))
const PatientDetailPage = lazy(() => import('@/features/patients/pages/PatientDetailPage').then(m => ({ default: m.PatientDetailPage })))
const TrackingPage = lazy(() => import('@/features/tracking/pages/TrackingPage').then(m => ({ default: m.TrackingPage })))
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage').then(m => ({ default: m.SettingsPage })))

// Patient portal pages (lazy loaded)
const PatientLayout = lazy(() => import('@/features/patient-portal/layouts/PatientLayout').then(m => ({ default: m.PatientLayout })))
const PatientDashboardPage = lazy(() => import('@/features/patient-portal/pages/PatientDashboardPage').then(m => ({ default: m.PatientDashboardPage })))
const LogVitalsPage = lazy(() => import('@/features/patient-portal/pages/LogVitalsPage').then(m => ({ default: m.LogVitalsPage })))
const LifestyleDashboardPage = lazy(() => import('@/features/patient-portal/pages/LifestyleDashboardPage').then(m => ({ default: m.LifestyleDashboardPage })))
const LogLifestylePage = lazy(() => import('@/features/patient-portal/pages/LogLifestylePage').then(m => ({ default: m.LogLifestylePage })))

function App() {
  return (
    <>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Onboarding (semi-private — after registration) */}
          <Route path="/onboarding" element={<PrivateRoute><OnboardingPage /></PrivateRoute>} />

          {/* Professional Routes with AppLayout */}
          <Route element={<PrivateRoute><AppLayout /></PrivateRoute>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/patients/:id" element={<PatientDetailPage />} />
            <Route path="/patients/:id/tracking" element={<TrackingPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/app" element={<Navigate to="/dashboard" replace />} />
          </Route>

          {/* Patient Portal Routes */}
          <Route element={<PatientRoute><PatientLayout /></PatientRoute>}>
            <Route path="/patient/dashboard" element={<PatientDashboardPage />} />
            <Route path="/patient/lifestyle" element={<LifestyleDashboardPage />} />
            <Route path="/patient/log-vitals" element={<LogVitalsPage />} />
            <Route path="/patient/log-lifestyle" element={<LogLifestylePage />} />
            <Route path="/patient" element={<Navigate to="/patient/dashboard" replace />} />
          </Route>

          {/* Global fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Toaster position="top-right" richColors closeButton expand={false} />
    </>
  )
}

export default App
