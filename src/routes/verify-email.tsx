import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { apiClient } from '../services/api'

export const Route = createFileRoute('/verify-email')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string) || undefined,
    email: (search.email as string) || '',
  }),
  beforeLoad: ({ search }) => {
    if (!search.email) {
      throw new Error('Email is required')
    }
  },
  component: VerifyEmailPage,
})

function VerifyEmailPage() {
  const navigate = useNavigate()
  const searchParams = useSearch({ from: Route.id })
  const { token } = searchParams
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [resendEmail, setResendEmail] = useState('')
  const [resendLoading, setResendLoading] = useState(false)

  useEffect(() => {
    if (token) {
      handleVerification(token)
    }
  }, [token])

  const handleVerification = async (verificationToken: string) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await apiClient.verifyEmail(verificationToken)

      if (response.success) {
        setSuccess(true)
        setTimeout(() => {
          navigate({ to: '/login', search: { redirect: '/dashboard' } })
        }, 3000)
      } else {
        setError(response.error?.message || 'Verification failed')
      }
    } catch (err) {
      setError('Network error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendVerification = async () => {
    if (!resendEmail) {
      setError('Please enter your email address')
      return
    }

    setResendLoading(true)
    setError('')

    try {
      const response = await apiClient.resendVerificationEmail(resendEmail)

      if (response.success) {
        setError('')
        alert('Verification email sent successfully! Please check your inbox.')
        setResendEmail('')
      } else {
        setError(response.error?.message || 'Failed to send verification email')
      }
    } catch (err) {
      setError('Network error occurred. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="bg-white py-8 px-4 shadow-lg rounded-lg">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-light text-gray-900 mb-2">Email Verified!</h2>
            <p className="text-gray-600 font-light mb-4">
              Your email has been successfully verified. You can now sign in to your account.
            </p>
            <p className="text-sm text-gray-500 font-light">
              Redirecting to login page...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (token && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">Verifying your email...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-light text-gray-900 mb-2">
            {token ? 'Verifying Email' : 'Email Verification Required'}
          </h2>
          <p className="text-gray-600 font-light">
            {token
              ? 'Please wait while we verify your email address...'
              : 'Please verify your email address to continue. Check your inbox for a verification link.'
            }
          </p>
        </div>

        {error && (
          <div className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-lg p-3">
            {error}
          </div>
        )}

        {!token && (
          <div className="bg-white py-8 px-4 shadow-lg rounded-lg">
            <div className="space-y-6">
              <div>
                <label htmlFor="resendEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="resendEmail"
                  name="resendEmail"
                  type="email"
                  required
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors"
                  placeholder="Enter your email"
                />
              </div>

              <button
                onClick={handleResendVerification}
                disabled={resendLoading}
                className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium cursor-pointer"
              >
                {resendLoading ? 'Sending...' : 'Resend Verification Email'}
              </button>

              <div className="text-center">
                <a href="/login" className="text-black hover:text-gray-600 transition-colors font-medium">
                  Back to sign in
                </a>
              </div>
            </div>
          </div>
        )}

        {token && (
          <div className="bg-white py-8 px-4 shadow-lg rounded-lg text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600 font-light">Processing verification...</p>
          </div>
        )}
      </div>
    </div>
  )
}
