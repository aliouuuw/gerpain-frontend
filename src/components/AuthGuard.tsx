import { useLocation, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    // If user loses authentication while on this route, redirect immediately
    if (!isAuthenticated || !user) {
      navigate({
        to: '/login',
        search: {
          redirect: location.pathname,
        },
        replace: true, // Replace current history entry to prevent going back
      })
    }
  }, [isAuthenticated, user, navigate, location.pathname])

  // Don't render children if user is not authenticated
  if (!isAuthenticated || !user) {
    return null
  }

  return <>{children}</>
}
