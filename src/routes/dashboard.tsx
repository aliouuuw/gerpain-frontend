import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '../stores/authStore'
import Header from '../components/Header'
import AuthGuard from '../components/AuthGuard'

export const Route = createFileRoute('/dashboard')({
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

    // Perform non-blocking session validation in the background
    // This will check session validity every 5 minutes, but won't block navigation
    authStore.validateSessionIfNeeded()
  },
  component: DashboardPage,
})

function DashboardPage() {

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-light">₣</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-light text-gray-600">Today's Sales</p>
                <p className="text-2xl font-light text-gray-900">₣45,230</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-light">📦</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-light text-gray-600">Products Sold</p>
                <p className="text-2xl font-light text-gray-900">1,234</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-light">🏪</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-light text-gray-600">Active Locations</p>
                <p className="text-2xl font-light text-gray-900">5</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-light">👥</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-light text-gray-600">Active Employees</p>
                <p className="text-2xl font-light text-gray-900">23</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-100 rounded-lg mb-8">
          <div className="px-6 py-6">
            <h3 className="text-lg font-light text-gray-900 mb-6">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <button className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg text-sm font-light transition-colors cursor-pointer">
                New Sale
              </button>
              <button className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg text-sm font-light transition-colors cursor-pointer">
                Add Inventory
              </button>
              <button className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg text-sm font-light transition-colors cursor-pointer">
                Cash Collection
              </button>
              <button className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg text-sm font-light transition-colors cursor-pointer">
                View Reports
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-100 rounded-lg">
          <div className="px-6 py-6">
            <h3 className="text-lg font-light text-gray-900 mb-6">
              Recent Activity
            </h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-light">✓</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 font-light">
                    Sale completed at <span className="font-medium text-gray-900">Location A</span>
                  </p>
                  <p className="text-sm text-gray-400 font-light">₣1,250</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-light">📦</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 font-light">
                    Inventory updated at <span className="font-medium text-gray-900">Location B</span>
                  </p>
                  <p className="text-sm text-gray-400 font-light">2 min ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-light">💰</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 font-light">
                    Cash collection completed at <span className="font-medium text-gray-900">Location C</span>
                  </p>
                  <p className="text-sm text-gray-400 font-light">15 min ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    </AuthGuard>
  )
}
