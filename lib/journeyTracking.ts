import { UTMParameters, UTMSession, TrafficSource, utmTracker } from './utmTracking'

import { storage } from '@/lib/utils'

export interface JourneyStep {
  id: string
  sessionId: string
  timestamp: number
  page: string
  action: string
  element?: string
  value?: string | number
  duration?: number
  scrollDepth?: number
  exitIntent?: boolean
  interactionData?: Record<string, any>
}

export interface PageMetrics {
  page: string
  entryTime: number
  exitTime?: number
  duration?: number
  scrollDepth: number
  maxScrollDepth: number
  clicks: number
  formInteractions: number
  videoPlays: number
  downloads: number
  exits: number
  bounces: number
}

export interface UserBehaviorPattern {
  userId?: string
  sessionId: string
  segment: UserSegment
  engagementLevel: 'low' | 'medium' | 'high' | 'very_high'
  intentScore: number
  conversionProbability: number
  preferredContent: string[]
  timeOnSite: number
  pageViews: number
  returnVisitor: boolean
  devicePreference: 'mobile' | 'desktop' | 'tablet'
  peakActivityHours: number[]
}

export interface UserSegment {
  id: string
  name: string
  description: string
  criteria: SegmentCriteria
  size: number
  conversionRate: number
  averageValue: number
}

export interface SegmentCriteria {
  trafficSource?: string[]
  utmCampaign?: string[]
  pageViews?: { min?: number; max?: number }
  timeOnSite?: { min?: number; max?: number }
  deviceType?: string[]
  location?: string[]
  behavior?: string[]
  engagement?: string[]
}

export interface ConversionFunnel {
  steps: FunnelStep[]
  conversionRates: number[]
  dropOffPoints: string[]
  averageTimeToConvert: number
  topPerformingTrafficSources: string[]
}

export interface FunnelStep {
  name: string
  page: string
  action: string
  users: number
  completionRate: number
  averageTime: number
}

export interface HeatmapData {
  page: string
  clicks: Array<{ x: number; y: number; count: number; element: string }>
  scrollDepth: Array<{ depth: number; users: number; timeSpent: number }>
  attention: Array<{ x: number; y: number; width: number; height: number; timeSpent: number }>
}

export class CustomerJourneyTracker {
  private static readonly STORAGE_KEY = 'journey_data'
  private static readonly METRICS_KEY = 'page_metrics'
  private static readonly BEHAVIOR_KEY = 'shikshanam_behavior_patterns'
  
  private sessionId: string
  private userId?: string
  private currentPageMetrics: PageMetrics
  private journeySteps: JourneyStep[] = []
  private scrollObserver: IntersectionObserver | null = null
  private clickTracker: any = null
  private heartbeatInterval: any = null

  constructor(userId?: string) {
    this.sessionId = utmTracker?.getSession().id || this.generateSessionId()
    this.userId = userId
    this.currentPageMetrics = this.initializePageMetrics()
    this.setupTracking()
    this.loadStoredJourney()
  }

  private generateSessionId(): string {
    return `journey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private initializePageMetrics(): PageMetrics {
    return {
      page: window.location.pathname,
      entryTime: Date.now(),
      scrollDepth: 0,
      maxScrollDepth: 0,
      clicks: 0,
      formInteractions: 0,
      videoPlays: 0,
      downloads: 0,
      exits: 0,
      bounces: 0
    }
  }

  private setupTracking(): void {
    this.setupScrollTracking()
    this.setupClickTracking()
    this.setupFormTracking()
    this.setupVideoTracking()
    this.setupExitIntentTracking()
    this.setupHeartbeat()
    this.setupVisibilityTracking()
  }

  private setupScrollTracking(): void {
    if (typeof window === 'undefined') return
    
    let maxScroll = 0
    const updateScrollDepth = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = Math.round((scrollTop / docHeight) * 100)
      
      this.currentPageMetrics.scrollDepth = scrollPercent
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent
        this.currentPageMetrics.maxScrollDepth = scrollPercent
        
        // Track milestone scrolls
        if (scrollPercent >= 25 && scrollPercent < 50 && maxScroll < 25) {
          this.trackStep('scroll_25', 'scroll', undefined, scrollPercent)
        } else if (scrollPercent >= 50 && scrollPercent < 75 && maxScroll < 50) {
          this.trackStep('scroll_50', 'scroll', undefined, scrollPercent)
        } else if (scrollPercent >= 75 && scrollPercent < 90 && maxScroll < 75) {
          this.trackStep('scroll_75', 'scroll', undefined, scrollPercent)
        } else if (scrollPercent >= 90 && maxScroll < 90) {
          this.trackStep('scroll_90', 'scroll', undefined, scrollPercent)
        }
      }
    }

    window.addEventListener('scroll', updateScrollDepth, { passive: true })
    
    // Intersection Observer for element visibility
    this.scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const element = entry.target as HTMLElement
          const elementId = element.id || element.className || element.tagName
          this.trackStep('element_view', 'view', elementId, entry.intersectionRatio)
        }
      })
    }, { threshold: [0.5] })

    // Observe key elements
    if (typeof document !== 'undefined') {
      document.querySelectorAll('[data-track], .cta-button, .course-card, .testimonial').forEach(el => {
        this.scrollObserver?.observe(el)
      })
    }
  }

  private setupClickTracking(): void {
    this.clickTracker = (event: MouseEvent) => {
      this.currentPageMetrics.clicks++
      
      const target = event.target as HTMLElement
      const element = this.getElementIdentifier(target)
      const coordinates = { x: event.clientX, y: event.clientY }
      
      this.trackStep('click', 'click', element, undefined, undefined, {
        coordinates,
        elementType: target.tagName,
        href: target.getAttribute('href'),
        text: target.textContent?.substring(0, 100)
      })

      // Track specific click types
      if (target.closest('a[href]')) {
        this.trackStep('link_click', 'click', element)
      }
      if (target.closest('button, [role="button"]')) {
        this.trackStep('button_click', 'click', element)
      }
      if (target.closest('.cta-button, [data-cta]')) {
        this.trackStep('cta_click', 'click', element)
      }
    }

    if (typeof document !== 'undefined') {
      document.addEventListener('click', this.clickTracker, true)
    }
  }

  private setupFormTracking(): void {
    if (typeof document !== 'undefined') {
      document.addEventListener('focusin', (event) => {
        const target = event.target as HTMLElement
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
          this.currentPageMetrics.formInteractions++
          this.trackStep('form_focus', 'form', this.getElementIdentifier(target))
        }
      })

      document.addEventListener('submit', (event) => {
        const form = event.target as HTMLFormElement
        this.trackStep('form_submit', 'form', this.getElementIdentifier(form), undefined, undefined, {
          formAction: form.action,
          formMethod: form.method,
          fieldCount: form.elements.length
        })
      })
    }
  }

  private setupVideoTracking(): void {
    if (typeof document !== 'undefined') {
      document.addEventListener('play', (event) => {
        const video = event.target as HTMLVideoElement
        this.currentPageMetrics.videoPlays++
        this.trackStep('video_play', 'media', this.getElementIdentifier(video), undefined, undefined, {
          duration: video.duration,
          currentTime: video.currentTime
        })
      }, true)

      document.addEventListener('ended', (event) => {
        const video = event.target as HTMLVideoElement
        this.trackStep('video_complete', 'media', this.getElementIdentifier(video), undefined, undefined, {
          duration: video.duration,
          watchTime: video.currentTime
        })
      }, true)
    }
  }

  private setupExitIntentTracking(): void {
    if (typeof document !== 'undefined') {
      let exitIntentFired = false
      
      document.addEventListener('mouseleave', (event) => {
        if (event.clientY <= 0 && !exitIntentFired) {
          exitIntentFired = true
          this.trackStep('exit_intent', 'navigation', undefined, undefined, true)
        }
      })
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.currentPageMetrics.exitTime = Date.now()
        this.currentPageMetrics.duration = this.currentPageMetrics.exitTime - this.currentPageMetrics.entryTime
        this.trackStep('page_exit', 'navigation', undefined, this.currentPageMetrics.duration)
        this.saveJourney()
        this.savePageMetrics()
      })
    }
  }

  private setupHeartbeat(): void {
    // Send heartbeat every 30 seconds to track time on page
    this.heartbeatInterval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        this.trackStep('heartbeat', 'engagement', undefined, Date.now() - this.currentPageMetrics.entryTime)
      }
    }, 30000)
  }

  private setupVisibilityTracking(): void {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.trackStep('page_hidden', 'engagement')
        } else {
          this.trackStep('page_visible', 'engagement')
        }
      })
    }
  }

  private getElementIdentifier(element: HTMLElement): string {
    if (element.id) return `#${element.id}`
    if (element.className && typeof element.className === 'string') {
      const classes = element.className.split(' ')
      return classes.length > 0 ? `.${classes[0]}` : element.tagName.toLowerCase()
    }
    if (element.getAttribute('data-track')) return `[data-track="${element.getAttribute('data-track')}"]`
    return element.tagName.toLowerCase()
  }

  private loadStoredJourney(): void {
    const stored = storage.get(CustomerJourneyTracker.STORAGE_KEY)
    if (stored) {
      this.journeySteps = stored[this.sessionId] || []
    }
  }

  private saveJourney(): void {
    const stored = (storage.get(CustomerJourneyTracker.STORAGE_KEY, {}) || {}) as Record<string, any>
    stored[this.sessionId] = this.journeySteps
    
    // Keep only last 10 sessions
    const sessions = Object.keys(stored)
    if (sessions.length > 10) {
      sessions.slice(0, -10).forEach(key => delete stored[key])
    }
    
    storage.set(CustomerJourneyTracker.STORAGE_KEY, stored)
  }

  private savePageMetrics(): void {
    const stored = (storage.get(CustomerJourneyTracker.METRICS_KEY, []) || []) as PageMetrics[]
    stored.push(this.currentPageMetrics)
    
    // Keep only last 100 page metrics
    if (stored.length > 100) {
      stored.splice(0, stored.length - 100)
    }
    
    storage.set(CustomerJourneyTracker.METRICS_KEY, stored)
  }

  // Public methods
  trackStep(
    action: string,
    category: string,
    element?: string,
    value?: string | number,
    exitIntent?: boolean,
    additionalData?: Record<string, any>
  ): void {
    const step: JourneyStep = {
      id: `step_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      page: typeof window !== 'undefined' ? window.location.pathname : '/',
      action: `${category}_${action}`,
      element,
      value,
      duration: Date.now() - this.currentPageMetrics.entryTime,
      scrollDepth: this.currentPageMetrics.scrollDepth,
      exitIntent,
      interactionData: {
        utm: utmTracker?.getCurrentUTM(),
        trafficSource: utmTracker?.getTrafficSource(),
        ...additionalData
      }
    }

    this.journeySteps.push(step)
    this.saveJourney()
  }

  trackConversion(
    conversionType: string,
    value?: number,
    currency?: string,
    additionalData?: Record<string, any>
  ): void {
    this.trackStep('conversion', 'conversion', conversionType, value, false, {
      currency,
      ...additionalData
    })

    // Also track in UTM tracker
    utmTracker?.trackConversion(conversionType, value, currency)
  }

  getJourneySteps(): JourneyStep[] {
    return [...this.journeySteps]
  }

  getCurrentPageMetrics(): PageMetrics {
    return { ...this.currentPageMetrics }
  }

  getUserBehaviorPattern(): UserBehaviorPattern {
    const session = utmTracker?.getSession()
    const steps = this.journeySteps
    const timeOnSite = Date.now() - this.currentPageMetrics.entryTime
    
    return {
      userId: this.userId,
      sessionId: this.sessionId,
      segment: this.calculateUserSegment(),
      engagementLevel: this.calculateEngagementLevel(),
      intentScore: this.calculateIntentScore(),
      conversionProbability: this.calculateConversionProbability(),
      preferredContent: this.getPreferredContent(),
      timeOnSite,
      pageViews: utmTracker?.getPageViewCount() || 1,
      returnVisitor: (session?.visitCount || 1) > 1,
      devicePreference: session?.device.type || 'desktop',
      peakActivityHours: this.getPeakActivityHours()
    }
  }

  private calculateUserSegment(): UserSegment {
    const trafficSource = utmTracker?.getTrafficSource()
    const timeOnSite = Date.now() - this.currentPageMetrics.entryTime
    const pageViews = utmTracker?.getPageViewCount() || 1
    const engagementScore = this.calculateEngagementScore()

    // High-intent users
    if (engagementScore > 0.8 && timeOnSite > 180000 && pageViews > 5) {
      return {
        id: 'high_intent',
        name: 'High Intent Users',
        description: 'Users showing strong purchase intent',
        criteria: { engagement: ['high'], timeOnSite: { min: 180000 }, pageViews: { min: 5 } },
        size: 15,
        conversionRate: 0.35,
        averageValue: 2500
      }
    }

    // First-time visitors from paid traffic
    if (trafficSource?.type === 'paid' && (utmTracker?.getSession().visitCount || 1) === 1) {
      return {
        id: 'paid_first_visit',
        name: 'Paid First-Time Visitors',
        description: 'New users from paid advertising',
        criteria: { trafficSource: ['paid'], behavior: ['first_visit'] },
        size: 25,
        conversionRate: 0.12,
        averageValue: 1800
      }
    }

    // Social media users
    if (trafficSource?.type === 'social') {
      return {
        id: 'social_users',
        name: 'Social Media Users',
        description: 'Users from social media platforms',
        criteria: { trafficSource: ['social'] },
        size: 30,
        conversionRate: 0.08,
        averageValue: 1200
      }
    }

    // Default segment
    return {
      id: 'general',
      name: 'General Users',
      description: 'All other users',
      criteria: {},
      size: 30,
      conversionRate: 0.05,
      averageValue: 1000
    }
  }

  private calculateEngagementLevel(): 'low' | 'medium' | 'high' | 'very_high' {
    const score = this.calculateEngagementScore()
    if (score >= 0.9) return 'very_high'
    if (score >= 0.7) return 'high'
    if (score >= 0.4) return 'medium'
    return 'low'
  }

  private calculateEngagementScore(): number {
    const timeOnSite = Date.now() - this.currentPageMetrics.entryTime
    const scrollDepth = this.currentPageMetrics.maxScrollDepth
    const clicks = this.currentPageMetrics.clicks
    const formInteractions = this.currentPageMetrics.formInteractions
    const videoPlays = this.currentPageMetrics.videoPlays
    
    let score = 0
    
    // Time on site (30% weight)
    score += Math.min(timeOnSite / 300000, 1) * 0.3 // 5 minutes max
    
    // Scroll depth (25% weight)
    score += (scrollDepth / 100) * 0.25
    
    // Interactions (45% weight)
    score += Math.min(clicks / 10, 1) * 0.2 // 10 clicks max
    score += Math.min(formInteractions / 5, 1) * 0.15 // 5 form interactions max
    score += Math.min(videoPlays / 3, 1) * 0.1 // 3 video plays max
    
    return Math.min(score, 1)
  }

  private calculateIntentScore(): number {
    const steps = this.journeySteps
    let score = 0
    
    // High-intent actions
    score += steps.filter(s => s.action.includes('cta_click')).length * 0.3
    score += steps.filter(s => s.action.includes('form_submit')).length * 0.4
    score += steps.filter(s => s.action.includes('video_complete')).length * 0.2
    score += steps.filter(s => s.action.includes('download')).length * 0.25
    score += steps.filter(s => s.action.includes('course') && s.action.includes('view')).length * 0.15
    
    return Math.min(score, 1)
  }

  private calculateConversionProbability(): number {
    const intentScore = this.calculateIntentScore()
    const engagementScore = this.calculateEngagementScore()
    const trafficSource = utmTracker?.getTrafficSource()
    const timeOnSite = Date.now() - this.currentPageMetrics.entryTime
    
    let probability = (intentScore * 0.4) + (engagementScore * 0.3)
    
    // Traffic source adjustments
    if (trafficSource?.type === 'paid') probability += 0.1
    if (trafficSource?.type === 'email') probability += 0.15
    if (trafficSource?.type === 'organic') probability += 0.05
    
    // Time on site adjustment
    if (timeOnSite > 300000) probability += 0.1 // 5+ minutes
    if (timeOnSite > 600000) probability += 0.1 // 10+ minutes
    
    return Math.min(probability, 1)
  }

  private getPreferredContent(): string[] {
    const steps = this.journeySteps
    const contentTypes: Record<string, number> = {}
    
    steps.forEach(step => {
      if (step.page.includes('/courses/')) {
        const courseType = step.page.split('/courses/')[1]?.split('/')[0]
        if (courseType) {
          contentTypes[courseType] = (contentTypes[courseType] || 0) + 1
        }
      }
    })
    
    return Object.entries(contentTypes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type)
  }

  private getPeakActivityHours(): number[] {
    const steps = this.journeySteps
    const hours: Record<number, number> = {}
    
    steps.forEach(step => {
      const hour = new Date(step.timestamp).getHours()
      hours[hour] = (hours[hour] || 0) + 1
    })
    
    return Object.entries(hours)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour))
  }

  destroy(): void {
    if (this.scrollObserver) {
      this.scrollObserver.disconnect()
    }
    if (this.clickTracker && typeof document !== 'undefined') {
      document.removeEventListener('click', this.clickTracker, true)
    }
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
    }
    this.saveJourney()
    this.savePageMetrics()
  }
}

// Singleton instance
export const journeyTracker = typeof window !== 'undefined' ? new CustomerJourneyTracker() : null

// Utility functions
export function trackJourneyStep(action: string, category: string, element?: string, value?: string | number): void {
  journeyTracker?.trackStep(action, category, element, value)
}

export function trackConversion(type: string, value?: number, currency?: string, additionalData?: Record<string, any>): void {
  journeyTracker?.trackConversion(type, value, currency, additionalData)
}

export function getUserBehaviorPattern(): UserBehaviorPattern | null {
  return journeyTracker?.getUserBehaviorPattern() || null
}

export function getCurrentPageMetrics(): PageMetrics | null {
  return journeyTracker?.getCurrentPageMetrics() || null
}

export function getJourneySteps(): JourneyStep[] {
  return journeyTracker?.getJourneySteps() || []
}
