import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import AuthRedirect from '../components/AuthRedirect'

export const Route = createFileRoute('/signup')({
  component: SignupPage,
})

function SignupPage() {
  const navigate = useNavigate()
  const { signup, isLoading, error, clearError } = useAuthStore()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  })

  const [validationError, setValidationError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setValidationError('')

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setValidationError('Password must be at least 8 characters')
      return
    }

    const success = await signup(formData.email, formData.password, formData.name || undefined)

    if (success) {
      navigate({ to: '/verify-email', search: { email: formData.email, token: undefined } })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (validationError) setValidationError('')
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
            <h1 className="text-5xl font-light mb-6 tracking-tight">Join Gerpain</h1>
            <p className="text-xl font-light text-gray-300 leading-relaxed">
              Create your account
            </p>
            <p className="text-sm text-gray-400 mt-4 font-light">
              Start managing your bakery operations today
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Signup Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-sm">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-light text-gray-900 mb-2">Create account</h2>
            <p className="text-gray-600 font-light">Sign up to get started</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full name (optional)
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors bg-gray-50 focus:bg-white"
                placeholder="Enter your full name"
              />
            </div>

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
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors bg-gray-50 focus:bg-white"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors bg-gray-50 focus:bg-white"
                placeholder="Confirm your password"
              />
            </div>

            {(error || validationError) && (
              <div className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-lg p-3">
                {error || validationError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium cursor-pointer"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 font-light">
              Already have an account?{' '}
              <a href="/login" className="text-black hover:text-gray-600 transition-colors font-medium">
                Sign in
              </a>
            </p>
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

