import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import AuthRedirect from '../components/AuthRedirect'

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>) => {
    const redirect = (search.redirect as string) || '/dashboard'
    return { redirect }
  },
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const { signin, isLoading, error, clearError } = useAuthStore()
  const { redirect } = Route.useSearch()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    const success = await signin(formData.email, formData.password)

    if (success) {
      navigate({ to: redirect })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <AuthRedirect redirectTo="/dashboard">
      <div className="min-h-screen flex">
      {/* Left Column - Black Background */}
      <div className="hidden lg:flex lg:flex-1 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="max-w-md text-center">
            <h1 className="text-5xl font-light mb-6 tracking-tight">Gerpain</h1>
            <p className="text-xl font-light text-gray-300 leading-relaxed">
              Bakery ERP System
            </p>
            <p className="text-sm text-gray-400 mt-4 font-light">
              Multi-location management • Real-time tracking • Smart analytics
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-sm">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-light text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-600 font-light">Sign in to your account</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors bg-gray-50 focus:bg-white"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors bg-gray-50 focus:bg-white"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="/forgot-password" className="font-medium text-black hover:text-gray-600 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium cursor-pointer"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 font-light">
              Don't have an account?{' '}
              <a href="/signup" className="text-black hover:text-gray-600 transition-colors font-medium">
                Sign up
              </a>
            </p>
          </div>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-light">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-colors font-light cursor-pointer"
              >
                Request Magic Link
              </button>
            </div>
          </div>

          {/* Mobile logo for small screens */}
          <div className="mt-8 text-center lg:hidden">
            <h1 className="text-2xl font-light text-gray-900">Gerpain</h1>
            <p className="text-sm text-gray-500 mt-1 font-light">Bakery ERP System</p>
          </div>
        </div>
      </div>
    </div>
    </AuthRedirect>
  )
}
