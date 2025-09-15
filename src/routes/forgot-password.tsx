import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { apiClient } from '../services/api'

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await apiClient.requestPasswordReset(email)

      if (response.success) {
        setSuccess(true)
      } else {
        setError(response.error?.message || 'Failed to send reset email')
      }
    } catch (err) {
      setError('Network error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="bg-white py-8 px-4 shadow-lg rounded-lg">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-light text-gray-900 mb-2">Check your email</h2>
            <p className="text-gray-600 font-light mb-4">
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500 font-light mb-4">
              If an account with that email exists, you'll receive a password reset link shortly.
            </p>
            <div className="space-y-2">
              <a
                href="/login"
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
              >
                Back to sign in
              </a>
              <button
                onClick={() => setSuccess(false)}
                className="w-full text-sm text-gray-600 hover:text-gray-900 font-light"
              >
                Didn't receive the email? Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Black Background */}
      <div className="hidden lg:flex lg:flex-1 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="max-w-md text-center">
            <h1 className="text-5xl font-light mb-6 tracking-tight">Reset Password</h1>
            <p className="text-xl font-light text-gray-300 leading-relaxed">
              Forgot your password?
            </p>
            <p className="text-sm text-gray-400 mt-4 font-light">
              No worries, we'll help you reset it
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Reset Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-sm">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-light text-gray-900 mb-2">Reset your password</h2>
            <p className="text-gray-600 font-light">Enter your email and we'll send you a reset link</p>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors bg-gray-50 focus:bg-white"
                placeholder="Enter your email"
              />
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
              {isLoading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 font-light">
              Remember your password?{' '}
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
  )
}


