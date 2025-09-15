import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '../stores/authStore'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const authStore = useAuthStore.getState()

    if (authStore.isAuthenticated) {
      // User is authenticated, redirect to dashboard
      throw redirect({
        to: '/dashboard',
      })
    } else {
      // User is not authenticated, redirect to login
      throw redirect({
        to: '/login',
      })
    }
  },
})
