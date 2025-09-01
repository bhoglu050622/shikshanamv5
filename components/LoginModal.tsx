'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Chrome, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useShikshanamAuth } from '@/lib/useShikshanamAuth'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isEmailLogin, setIsEmailLogin] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const { data: session, status } = useSession()
  const { user, isAuthenticated, isLoading, loginWithEmail } = useShikshanamAuth()

  // Close modal if user is already logged in
  useEffect(() => {
    if ((isAuthenticated || session) && isOpen) {
      if (session?.graphyUser || user) {
        setIsSuccess(true)
        setSuccessMessage('Successfully signed in! Redirecting to homepage...')
        setTimeout(() => {
          onClose()
          setIsSuccess(false)
          setSuccessMessage('')
        }, 2000)
      } else {
        onClose()
      }
    }
  }, [isAuthenticated, session, isOpen, onClose, user])

  const handleGoogleLogin = async () => {
    try {
      setError('')
      const result = await signIn('google', { 
        callbackUrl: '/',
        redirect: false 
      })
      
      if (result?.error) {
        setError('Google login failed. Please try again.')
      } else if (result?.ok) {
        setIsSuccess(true)
        setSuccessMessage('Successfully signed in with Google! Redirecting...')
        setTimeout(() => {
          onClose()
          setIsSuccess(false)
          setSuccessMessage('')
        }, 2000)
      }
    } catch (error) {
      console.error('Google login error:', error)
      setError('Google login failed')
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setError('')
      const result = await loginWithEmail(email, password)
      
      if (!result.success) {
        setError(result.error || 'Email login failed')
      } else {
        setIsSuccess(true)
        setSuccessMessage('Successfully signed in! Redirecting...')
        setTimeout(() => {
          onClose()
          setIsSuccess(false)
          setSuccessMessage('')
        }, 2000)
      }
    } catch (error) {
      console.error('Email login error:', error)
      setError('Email login failed')
    }
  }

  const handleClose = () => {
    setEmail('')
    setPassword('')
    setError('')
    setIsSuccess(false)
    setSuccessMessage('')
    setIsEmailLogin(false)
    setShowPassword(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-6 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome to Shikshanam
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Continue your spiritual journey
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {isSuccess ? (
                // Success State
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Welcome!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {successMessage}
                  </p>
                </motion.div>
              ) : !isEmailLogin ? (
                // Social Login Options
                <div className="space-y-4">
                  {/* Google Login */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGoogleLogin}
                    disabled={status === 'loading'}
                    className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Chrome className="w-5 h-5 text-red-500" />
                    <span className="font-medium">
                      {status === 'loading' ? 'Signing In...' : 'Continue with Google'}
                    </span>
                  </motion.button>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                        or
                      </span>
                    </div>
                  </div>

                  {/* Email Login Option */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEmailLogin(true)}
                    className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark text-white hover:from-primary-light/90 hover:to-secondary-light/90 dark:hover:from-primary-dark/90 dark:hover:to-secondary-dark/90 transition-all duration-200 shadow-lg"
                  >
                    <Mail className="w-5 h-5" />
                    <span className="font-medium">Continue with Email</span>
                  </motion.button>
                </div>
              ) : (
                // Email Login Form
                <motion.form
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleEmailLogin}
                  className="space-y-4"
                >
                  {/* Back Button */}
                  <button
                    type="button"
                    onClick={() => setIsEmailLogin(false)}
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-200 mb-4"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-sm">Back to options</span>
                  </button>

                  {/* Email Input */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  {/* Password Input */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent transition-all duration-200"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Forgot Password */}
                  <div className="text-right">
                    <button
                      type="button"
                      className="text-sm text-primary-light dark:text-primary-dark hover:underline transition-colors duration-200"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Error Display */}
                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark text-white font-medium hover:from-primary-light/90 hover:to-secondary-light/90 dark:hover:from-primary-dark/90 dark:hover:to-secondary-dark/90 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </motion.button>

                  {/* Sign Up Link */}
                  <div className="text-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        className="text-primary-light dark:text-primary-dark hover:underline font-medium transition-colors duration-200"
                      >
                        Sign up
                      </button>
                    </span>
                  </div>
                </motion.form>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                By continuing, you agree to our{' '}
                <button className="text-primary-light dark:text-primary-dark hover:underline transition-colors duration-200">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button className="text-primary-light dark:text-primary-dark hover:underline transition-colors duration-200">
                  Privacy Policy
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
