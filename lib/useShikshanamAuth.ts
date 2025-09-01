'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { GraphyUser, GraphyCourse } from './graphy'

interface AuthState {
  user: GraphyUser | null
  isAuthenticated: boolean
  isLoading: boolean
  courses: GraphyCourse[]
}

export function useShikshanamAuth() {
  const { data: session, status } = useSession()
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    courses: []
  })

  const checkAuthStatus = useCallback(async () => {
    try {
      // Check if we have a NextAuth session with Graphy user data
      if (session?.graphyUser) {
        setAuthState(prev => ({
          ...prev,
          user: session.graphyUser || null,
          isAuthenticated: true,
          isLoading: false
        }))
        return
      }

      // Fallback to custom Graphy authentication
      const response = await fetch('/api/auth/graphy')
      const data = await response.json()

      if (data.authenticated && data.user) {
        setAuthState(prev => ({
          ...prev,
          user: data.user || null,
          isAuthenticated: true,
          isLoading: false
        }))
      } else {
        setAuthState(prev => ({
          ...prev,
          user: null,
          isAuthenticated: false,
          isLoading: false
        }))
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setAuthState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        isLoading: false
      }))
    }
  }, [session])

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))
      
      const response = await fetch('/api/auth/graphy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (data.success && data.user) {
        setAuthState(prev => ({
          ...prev,
          user: data.user || null,
          isAuthenticated: true,
          isLoading: false
        }))
        return { success: true }
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }))
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Email login error:', error)
      setAuthState(prev => ({ ...prev, isLoading: false }))
      return { success: false, error: 'Login failed' }
    }
  }, [])

  const loginWithGoogle = useCallback(async (googleToken: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))
      
      const response = await fetch('/api/auth/graphy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ googleToken })
      })

      const data = await response.json()

      if (data.success && data.user) {
        setAuthState(prev => ({
          ...prev,
          user: data.user || null,
          isAuthenticated: true,
          isLoading: false
        }))
        return { success: true }
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }))
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Google login error:', error)
      setAuthState(prev => ({ ...prev, isLoading: false }))
      return { success: false, error: 'Login failed' }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/graphy', { method: 'DELETE' })
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        courses: []
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }, [])

  const fetchCourses = useCallback(async () => {
    if (!authState.isAuthenticated && !session?.graphyUser) return

    try {
      const response = await fetch('/api/user/courses')
      const data = await response.json()

      if (data.success) {
        setAuthState(prev => ({
          ...prev,
          courses: data.courses
        }))
      }
    } catch (error) {
      console.error('Fetch courses error:', error)
    }
  }, [authState.isAuthenticated, session?.graphyUser])

  // Update auth state when session changes
  useEffect(() => {
    if (status === 'loading') {
      setAuthState(prev => ({ ...prev, isLoading: true }))
    } else if (status === 'authenticated' && session?.graphyUser) {
      setAuthState(prev => ({
        ...prev,
        user: session.graphyUser || null,
        isAuthenticated: true,
        isLoading: false
      }))
    } else if (status === 'unauthenticated') {
      checkAuthStatus()
    }
  }, [session, status, checkAuthStatus])

  useEffect(() => {
    if (authState.isAuthenticated || session?.graphyUser) {
      fetchCourses()
    }
  }, [authState.isAuthenticated, session?.graphyUser, fetchCourses])

  return {
    ...authState,
    loginWithEmail,
    loginWithGoogle,
    logout,
    fetchCourses,
    checkAuthStatus
  }
}
