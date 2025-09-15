import { Outlet, createRootRoute } from '@tanstack/react-router'
// import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
// import { TanstackDevtools } from '@tanstack/react-devtools'
import { useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useToastStore } from '../stores/toastStore'
import { setAuthRedirectCallback } from '../services/api'
import { ToastContainer } from '../components/Toast'

function RootComponent() {
  const initialize = useAuthStore((state) => state.initialize)
  const { toasts, removeToast } = useToastStore()

  useEffect(() => {
    // Initialize auth state on app startup
    initialize()

    // Set up auth redirect callback for 401 responses
    setAuthRedirectCallback(() => {
      // Redirect to login page on auth failure
      window.location.href = '/login'
    })
  }, [initialize])

  return (
    <>
      <Outlet />
      <ToastContainer toasts={toasts} onClose={removeToast} />
      {/* <TanstackDevtools
        config={{
          position: 'bottom-left',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      /> */}
    </>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
