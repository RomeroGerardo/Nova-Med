import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

interface PrivateRouteProps {
  children: React.ReactNode
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, isLoading } = useAuthStore()

  if (isLoading) {
    return null // LoadingScreen handled by Suspense
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
