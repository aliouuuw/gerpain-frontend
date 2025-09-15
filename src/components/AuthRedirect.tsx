import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '../stores/authStore'

interface AuthRedirectProps {
  children: React.ReactNode
  redirectTo?: string
}

export default function AuthRedirect({ children, redirectTo = '/dashboard' }: AuthRedirectProps) {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    // If user is authenticated on an auth page, redirect to dashboard or specified route
    if (isAuthenticated && user) {
      navigate({
        to: redirectTo,
        replace: true, // Replace current history entry
      })
    }
  }, [isAuthenticated, user, navigate, redirectTo])

  // Don't render children if user is authenticated
  if (isAuthenticated && user) {
    return null
  }

  return <>{children}</>
}
