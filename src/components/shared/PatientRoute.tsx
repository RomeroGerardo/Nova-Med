import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

interface PatientRouteProps {
  children: React.ReactNode
}

export function PatientRoute({ children }: PatientRouteProps) {
  const { user, role } = useAuthStore()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role !== 'patient') {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
