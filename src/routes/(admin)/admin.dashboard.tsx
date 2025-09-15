import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAdminStore } from '../../stores/adminStore'
import { useOrganizationStore } from '../../stores/organizationStore'

export const Route = createFileRoute('/(admin)/admin/dashboard')({
  component: AdminDashboardPage,
})

function AdminDashboardPage() {
  const { loadStats, stats, isLoading } = useAdminStore()
  const { selectedOrganization } = useOrganizationStore()

  useEffect(() => {
    if (selectedOrganization) {
      loadStats()
    }
  }, [selectedOrganization, loadStats])

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="ml-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-light">👥</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-light text-gray-600">Total Users</p>
              <p className="text-2xl font-light text-gray-900">{stats?.totalUsers || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-light">🏢</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-light text-gray-600">Organizations</p>
              <p className="text-2xl font-light text-gray-900">{stats?.totalOrganizations || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-light">✉️</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-light text-gray-600">Active Invitations</p>
              <p className="text-2xl font-light text-gray-900">{stats?.activeInvitations || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-light">🔐</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-light text-gray-600">API Keys</p>
              <p className="text-2xl font-light text-gray-900">{stats?.totalApiKeys || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-6">
          <h3 className="text-lg font-light text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <a
              href="/admin/users"
              className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg text-sm font-light transition-colors text-center block"
            >
              Manage Users
            </a>
            <a
              href="/admin/organizations"
              className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg text-sm font-light transition-colors text-center block"
            >
              Manage Organizations
            </a>
            <a
              href="/admin/invitations"
              className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg text-sm font-light transition-colors text-center block"
            >
              Send Invitations
            </a>
            <a
              href="/settings/profile"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg text-sm font-light transition-colors text-center block"
            >
              Profile Settings
            </a>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-6">
          <h3 className="text-lg font-light text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-light">👤</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 font-light">
                  New user registered in the system
                </p>
                <p className="text-sm text-gray-400 font-light">2 min ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-light">🏢</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 font-light">
                  Organization created successfully
                </p>
                <p className="text-sm text-gray-400 font-light">15 min ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-light">✉️</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 font-light">
                  Invitation sent to new member
                </p>
                <p className="text-sm text-gray-400 font-light">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

