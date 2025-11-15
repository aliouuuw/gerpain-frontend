import { useEffect, useState } from 'react'
import { Link, Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { ChevronDown, LogOut, Settings, User } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { useOrganizationStore } from '../../stores/organizationStore'

export const Route = createFileRoute('/(admin)/admin/layout')({
  beforeLoad: ({ location }) => {
    const authStore = useAuthStore.getState()

    // Check if we have basic auth state
    if (!authStore.isAuthenticated || !authStore.user) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.pathname,
        },
      })
    }

    // Check if user has admin permissions
    if (!authStore.hasPermission('ADMIN_ACCESS')) {
      throw redirect({
        to: '/dashboard',
      })
    }

    // Perform non-blocking session validation in the background
    authStore.validateSessionIfNeeded()
  },
  component: AdminLayout,
})

function AdminLayout() {
  const { user, signout } = useAuthStore()
  const { organizations, selectedOrganization, setSelectedOrganization, loadOrganizations } = useOrganizationStore()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showOrgMenu, setShowOrgMenu] = useState(false)

  useEffect(() => {
    loadOrganizations()
  }, [loadOrganizations])

  const handleSignout = async () => {
    await signout()
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Layout Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-light text-gray-900">Admin Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Organization Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowOrgMenu(!showOrgMenu)}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span className="text-sm font-light text-gray-700">
                    {selectedOrganization?.name || 'Select Organization'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {showOrgMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="py-2">
                      {organizations.map((org) => (
                        <button
                          key={org.id}
                          onClick={() => {
                            setSelectedOrganization(org)
                            setShowOrgMenu(false)
                          }}
                          className="w-full text-left px-4 py-2 text-sm font-light text-gray-700 hover:bg-gray-50"
                        >
                          {org.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="py-2">
                      <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                        {user?.name || user?.email}
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm font-light text-gray-700 hover:bg-gray-50"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Profile Settings</span>
                      </Link>
                      <button
                        onClick={handleSignout}
                        className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm font-light text-gray-700 hover:bg-gray-50"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)]">
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              <Link
                to="/admin/dashboard"
                className="flex items-center px-4 py-3 text-sm font-light text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/users"
                className="flex items-center px-4 py-3 text-sm font-light text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Users
              </Link>
              <Link
                to="/admin/organizations"
                className="flex items-center px-4 py-3 text-sm font-light text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Organizations
              </Link>
              <Link
                to="/admin/invitations"
                className="flex items-center px-4 py-3 text-sm font-light text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Invitations
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
