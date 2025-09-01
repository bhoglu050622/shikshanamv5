'use client'

import { useEffect, useState, createContext, useContext, ReactNode } from 'react'
import { storage } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { analyticsOrchestrator, initializeAnalytics, AnalyticsConfig, AnalyticsInsights } from '@/lib/analyticsOrchestrator'

interface AnalyticsContextType {
  isInitialized: boolean
  trackEvent: (eventName: string, properties?: Record<string, any>) => void
  trackConversion: (goalId: string, value?: number, properties?: Record<string, any>) => void
  trackUserAction: (action: string, element?: string, properties?: Record<string, any>) => void
  getPersonalizedContent: (contentType: string, defaultContent: any) => any
  getPersonalizedRecommendations: (limit?: number) => any[]
  getAnalyticsInsights: () => AnalyticsInsights
  setUserConsent: (hasConsent: boolean) => void
  clearData: () => void
  exportData: () => string
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null)

interface AnalyticsProviderProps {
  children: ReactNode
  config?: Partial<AnalyticsConfig>
}

export function AnalyticsProvider({ children, config = {} }: AnalyticsProviderProps) {
  const { data: session } = useSession()
  const [isInitialized, setIsInitialized] = useState(false)
  const [consentGiven, setConsentGiven] = useState(false)

  useEffect(() => {
    // Check for existing consent
    const existingConsent = storage.get('analytics_consent', false)
    const hasConsent = Boolean(existingConsent)
    setConsentGiven(hasConsent)

    // Show consent banner if needed and not already given
    if (!hasConsent && config.consentRequired !== false) {
      showConsentBanner()
    }

    // Initialize analytics if consent is given or not required
    if (hasConsent || config.consentRequired === false) {
      initializeAnalyticsSystem()
    }
  }, [])

  useEffect(() => {
    // Re-initialize when user session changes
    if (isInitialized && session?.user) {
      const userId = session.user.email || session.user.name || undefined
      initializeAnalyticsSystem(userId)
    }
  }, [session, isInitialized])

  const initializeAnalyticsSystem = async (userId?: string) => {
    try {
      const defaultConfig: Partial<AnalyticsConfig> = {
        enableUTMTracking: true,
        enableJourneyTracking: true,
        enableSegmentation: true,
        enableConversionTracking: true,
        enablePersonalization: true,
        enableRetargeting: true,
        debug: process.env.NODE_ENV === 'development',
        dataRetentionDays: 90,
        gdprCompliant: true,
        consentRequired: true,
        ...config
      }

      await initializeAnalytics(defaultConfig, userId)
      setIsInitialized(true)

      // Track initialization
      analyticsOrchestrator.trackEvent('analytics_initialized', {
        userId: userId || 'anonymous',
        hasSession: !!session,
        timestamp: Date.now()
      })

      console.log('✅ Shikshanam Analytics initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize Shikshanam Analytics:', error)
    }
  }

  const showConsentBanner = () => {
    // Create and show consent banner
    if (typeof document !== 'undefined') {
      const banner = createConsentBanner()
      document.body.appendChild(banner)
    }
  }

  const createConsentBanner = (): HTMLElement => {
    if (typeof document === 'undefined') {
      throw new Error('Document not available')
    }
    const banner = document.createElement('div')
    banner.id = 'shikshanam-consent-banner'
    banner.className = 'fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 shadow-lg'
    banner.innerHTML = `
      <div class="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div class="mb-4 md:mb-0 md:mr-4">
          <p class="text-sm">
            We use analytics to improve your experience and provide personalized content. 
            Your data is stored locally and used to enhance your learning journey.
          </p>
        </div>
        <div class="flex space-x-4">
          <button id="consent-accept" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium">
            Accept
          </button>
          <button id="consent-decline" class="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-sm font-medium">
            Decline
          </button>
        </div>
      </div>
    `

    // Add event listeners
    const acceptBtn = banner.querySelector('#consent-accept')
    const declineBtn = banner.querySelector('#consent-decline')

    acceptBtn?.addEventListener('click', () => {
      handleConsentResponse(true)
      banner.remove()
    })

    declineBtn?.addEventListener('click', () => {
      handleConsentResponse(false)
      banner.remove()
    })

    return banner
  }

  const handleConsentResponse = (consent: boolean) => {
    setConsentGiven(consent)
    analyticsOrchestrator.setUserConsent(consent)
    
    if (consent) {
      const userId = session?.user?.email || session?.user?.name || undefined
      initializeAnalyticsSystem(userId)
    }
  }

  const contextValue: AnalyticsContextType = {
    isInitialized,
    trackEvent: (eventName: string, properties?: Record<string, any>) => {
      if (isInitialized) {
        analyticsOrchestrator.trackEvent(eventName, properties)
      }
    },
    trackConversion: (goalId: string, value?: number, properties?: Record<string, any>) => {
      if (isInitialized) {
        analyticsOrchestrator.trackConversion(goalId, value, properties)
      }
    },
    trackUserAction: (action: string, element?: string, properties?: Record<string, any>) => {
      if (isInitialized) {
        analyticsOrchestrator.trackUserAction(action, element, properties)
      }
    },
    getPersonalizedContent: (contentType: string, defaultContent: any) => {
      if (isInitialized) {
        return analyticsOrchestrator.getPersonalizedContent(contentType, defaultContent)
      }
      return defaultContent
    },
    getPersonalizedRecommendations: (limit?: number) => {
      if (isInitialized) {
        return analyticsOrchestrator.getPersonalizedRecommendations(limit)
      }
      return []
    },
    getAnalyticsInsights: () => {
      if (isInitialized) {
        return analyticsOrchestrator.getAnalyticsInsights()
      }
      return {} as AnalyticsInsights
    },
    setUserConsent: (hasConsent: boolean) => {
      handleConsentResponse(hasConsent)
    },
    clearData: () => {
      if (isInitialized) {
        analyticsOrchestrator.clearData()
      }
    },
    exportData: () => {
      if (isInitialized) {
        return analyticsOrchestrator.exportData()
      }
      return ''
    }
  }

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalytics(): AnalyticsContextType | null {
  const context = useContext(AnalyticsContext)
  return context
}

// Higher-order component for easy analytics integration
export function withAnalytics<T extends {}>(Component: React.ComponentType<T>) {
  return function AnalyticsWrappedComponent(props: T) {
    const analytics = useAnalytics()
    return <Component {...props} analytics={analytics} />
  }
}

// Hook for tracking page views
export function usePageTracking(pageName?: string) {
  const analytics = useAnalytics()

  useEffect(() => {
    if (analytics?.isInitialized && typeof window !== 'undefined') {
      analytics.trackEvent('page_view', {
        page: pageName || window.location.pathname,
        timestamp: Date.now()
      })
    }
  }, [analytics?.isInitialized, pageName, analytics?.trackEvent])
}

// Hook for tracking component interactions
export function useInteractionTracking() {
  const analytics = useAnalytics()

  const trackClick = (element: string, properties?: Record<string, any>) => {
    if (analytics?.isInitialized) {
      analytics.trackUserAction('click', element, properties)
    }
  }

  const trackHover = (element: string, properties?: Record<string, any>) => {
    if (analytics?.isInitialized) {
      analytics.trackUserAction('hover', element, properties)
    }
  }

  const trackScroll = (depth: number, properties?: Record<string, any>) => {
    if (analytics?.isInitialized) {
      analytics.trackEvent('scroll_depth', { depth, ...properties })
    }
  }

  const trackFormInteraction = (formName: string, action: string, properties?: Record<string, any>) => {
    if (analytics?.isInitialized) {
      analytics.trackUserAction(`form_${action}`, formName, properties)
    }
  }

  return {
    trackClick,
    trackHover,
    trackScroll,
    trackFormInteraction
  }
}

// Hook for personalized content
export function usePersonalization() {
  const analytics = useAnalytics()

  const getContent = (contentType: string, defaultContent: any) => {
    if (!analytics?.isInitialized) return defaultContent
    return analytics.getPersonalizedContent(contentType, defaultContent)
  }

  const getRecommendations = (limit?: number) => {
    if (!analytics?.isInitialized) return []
    return analytics.getPersonalizedRecommendations(limit)
  }

  return {
    getContent,
    getRecommendations,
    isInitialized: analytics?.isInitialized || false
  }
}

// Component for tracking conversions
interface ConversionTrackerProps {
  goalId: string
  value?: number
  trigger?: 'immediate' | 'click' | 'submit' | 'scroll'
  children?: ReactNode
  className?: string
  properties?: Record<string, any>
}

export function ConversionTracker({ 
  goalId, 
  value, 
  trigger = 'immediate', 
  children, 
  className,
  properties 
}: ConversionTrackerProps) {
  const analytics = useAnalytics()

  useEffect(() => {
    if (trigger === 'immediate' && analytics?.isInitialized) {
      analytics.trackConversion(goalId, value, properties)
    }
  }, [analytics?.isInitialized, trigger, goalId, value, analytics?.trackConversion, properties])

  const handleTrigger = () => {
    if (analytics?.isInitialized) {
      analytics.trackConversion(goalId, value, properties)
    }
  }

  if (trigger === 'immediate') {
    return children ? <>{children}</> : null
  }

  const triggerProps: any = {}
  if (trigger === 'click') {
    triggerProps.onClick = handleTrigger
  } else if (trigger === 'submit') {
    triggerProps.onSubmit = handleTrigger
  }

  return (
    <div className={className} {...triggerProps}>
      {children}
    </div>
  )
}

export default AnalyticsProvider
