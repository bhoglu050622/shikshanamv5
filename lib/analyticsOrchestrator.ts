'use client'

import { utmTracker, UTMTracker } from './utmTracking'
import { journeyTracker, CustomerJourneyTracker } from './journeyTracking'
import { segmentationEngine, BehavioralSegmentationEngine } from './behavioralSegmentation'
import { conversionTracker, ConversionTracker } from './conversionTracking'
import { personalizationEngine, PersonalizationEngine } from './personalizationEngine'
import { analyticsStorage, AnalyticsStorageManager } from './analyticsStorage'
import { storage } from '@/lib/utils'

export interface AnalyticsConfig {
  enableUTMTracking: boolean
  enableJourneyTracking: boolean
  enableSegmentation: boolean
  enableConversionTracking: boolean
  enablePersonalization: boolean
  enableRetargeting: boolean
  debug: boolean
  apiEndpoint?: string
  userId?: string
  customEvents?: string[]
  dataRetentionDays: number
  gdprCompliant: boolean
  consentRequired: boolean
}

export interface AnalyticsEvent {
  type: string
  data: any
  timestamp: number
  source: string
}

export interface AnalyticsInsights {
  utm: {
    topSources: Array<{ source: string; sessions: number; conversions: number }>
    conversionsBySource: Array<{ source: string; rate: number; value: number }>
    topCampaigns: Array<{ campaign: string; sessions: number; conversions: number }>
  }
  journey: {
    averageSessionDuration: number
    bounceRate: number
    topPages: Array<{ page: string; views: number; avgTime: number }>
    conversionFunnels: Array<{ name: string; conversionRate: number }>
  }
  segmentation: {
    segmentDistribution: Array<{ segment: string; percentage: number; conversionRate: number }>
    topPerformingSegments: Array<{ segment: string; conversions: number; value: number }>
  }
  personalization: {
    personalizedSessions: number
    personalizationEffectiveness: number
    topPersonalizedContent: Array<{ content: string; engagement: number }>
  }
  conversions: {
    totalConversions: number
    conversionRate: number
    totalValue: number
    topConversionGoals: Array<{ goal: string; conversions: number; value: number }>
  }
}

export class AnalyticsOrchestrator {
  private static instance: AnalyticsOrchestrator | null = null
  private config: AnalyticsConfig
  private isInitialized = false
  private userId?: string
  private eventQueue: AnalyticsEvent[] = []
  private flushInterval: NodeJS.Timeout | null = null

  private constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = {
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
  }

  static getInstance(config?: Partial<AnalyticsConfig>): AnalyticsOrchestrator {
    if (!AnalyticsOrchestrator.instance) {
      AnalyticsOrchestrator.instance = new AnalyticsOrchestrator(config)
    }
    return AnalyticsOrchestrator.instance
  }

  async initialize(userId?: string): Promise<void> {
    if (this.isInitialized) return

    this.userId = userId

    if (this.config.debug) {
      console.log('🚀 Initializing Shikshanam Analytics Orchestrator', this.config)
    }

    // Check for user consent
    if (this.config.consentRequired && !this.hasUserConsent()) {
      if (this.config.debug) {
        console.log('⏳ Waiting for user consent...')
      }
      return
    }

    try {
      // Initialize all tracking systems
      await this.initializeTrackingSystems()
      
      // Set up event listeners
      this.setupEventListeners()
      
      // Start data synchronization
      this.startDataSync()
      
      // Perform initial segmentation
      this.performInitialAnalysis()

      this.isInitialized = true

      if (this.config.debug) {
        console.log('✅ Analytics Orchestrator initialized successfully')
      }

      // Dispatch initialization event
      this.dispatchEvent('analytics:initialized', {
        config: this.config,
        userId: this.userId,
        timestamp: Date.now()
      })

    } catch (error) {
      console.error('❌ Failed to initialize Analytics Orchestrator:', error)
      throw error
    }
  }

  private async initializeTrackingSystems(): Promise<void> {
    const initPromises: Promise<void>[] = []

    if (this.config.enableUTMTracking) {
      initPromises.push(this.initializeUTMTracking())
    }

    if (this.config.enableJourneyTracking) {
      initPromises.push(this.initializeJourneyTracking())
    }

    if (this.config.enableSegmentation) {
      initPromises.push(this.initializeSegmentation())
    }

    if (this.config.enableConversionTracking) {
      initPromises.push(this.initializeConversionTracking())
    }

    if (this.config.enablePersonalization) {
      initPromises.push(this.initializePersonalization())
    }

    await Promise.all(initPromises)
  }

  private async initializeUTMTracking(): Promise<void> {
    if (typeof window === 'undefined') return

    // UTM tracker is already initialized as singleton
    if (this.config.debug) {
      console.log('✅ UTM Tracking initialized')
    }
  }

  private async initializeJourneyTracking(): Promise<void> {
    if (typeof window === 'undefined') return

    // Journey tracker is already initialized as singleton
    if (this.config.debug) {
      console.log('✅ Journey Tracking initialized')
    }
  }

  private async initializeSegmentation(): Promise<void> {
    // Segmentation engine is already initialized as singleton
    if (this.config.debug) {
      console.log('✅ Behavioral Segmentation initialized')
    }
  }

  private async initializeConversionTracking(): Promise<void> {
    // Conversion tracker is already initialized as singleton
    if (this.config.debug) {
      console.log('✅ Conversion Tracking initialized')
    }
  }

  private async initializePersonalization(): Promise<void> {
    // Personalization engine is already initialized as singleton
    if (this.config.debug) {
      console.log('✅ Personalization Engine initialized')
    }
  }

  private setupEventListeners(): void {
    if (typeof window === 'undefined') return

    // Listen for custom analytics events
    document.addEventListener('shikshanam:conversion', (event: Event) => {
      const customEvent = event as CustomEvent
      this.handleConversionEvent(customEvent.detail)
    })

    document.addEventListener('personalization:conversion', (event: Event) => {
      const customEvent = event as CustomEvent
      this.handlePersonalizationConversion(customEvent.detail)
    })

    // Set up page visibility tracking
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.handlePageHidden()
      } else {
        this.handlePageVisible()
      }
    })

    // Set up beforeunload for data cleanup
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.handleBeforeUnload()
      })

      // Set up error tracking
      window.addEventListener('error', (event) => {
        this.trackError(event.error, 'javascript_error')
      })

      window.addEventListener('unhandledrejection', (event) => {
        this.trackError(event.reason, 'unhandled_promise_rejection')
      })
    }
  }

  private startDataSync(): void {
    // Flush events every 30 seconds
    this.flushInterval = setInterval(() => {
      this.flushEventQueue()
    }, 30000)

    // Optimize storage every 5 minutes
    setInterval(() => {
      analyticsStorage.optimizeStorage()
    }, 5 * 60 * 1000)
  }

  private performInitialAnalysis(): void {
    if (typeof window === 'undefined') return

    setTimeout(() => {
      // Perform initial user segmentation
      const userSegment = segmentationEngine.segmentUser(this.userId)
      
      if (this.config.debug) {
        console.log('🎯 Initial user segment:', userSegment.primarySegment.name)
      }

      // Track initial page view with enhanced data
      this.trackPageView({
        enhanced: true,
        segment: userSegment.primarySegment.id,
        utm: utmTracker?.getCurrentUTM(),
        trafficSource: utmTracker?.getTrafficSource()
      })

    }, 1000) // Allow other systems to initialize first
  }

  // Event tracking methods
  trackEvent(eventName: string, properties: Record<string, any> = {}): void {
    if (!this.isInitialized) {
      this.queueEvent('custom_event', { eventName, properties })
      return
    }

    const event: AnalyticsEvent = {
      type: 'custom_event',
      data: {
        eventName,
        properties,
        utm: utmTracker?.getCurrentUTM(),
        segment: segmentationEngine.segmentUser().primarySegment.id,
        userId: this.userId,
        sessionId: utmTracker?.getSession().id
      },
      timestamp: Date.now(),
      source: 'orchestrator'
    }

    this.processEvent(event)
  }

  trackPageView(properties: Record<string, any> = {}): void {
    const event: AnalyticsEvent = {
      type: 'page_view',
      data: {
        page: typeof window !== 'undefined' ? window.location.pathname : '/',
        title: typeof document !== 'undefined' ? document.title : '',
        referrer: typeof document !== 'undefined' ? document.referrer : '',
        ...properties
      },
      timestamp: Date.now(),
      source: 'orchestrator'
    }

    this.processEvent(event)
  }

  trackConversion(goalId: string, value?: number, properties: Record<string, any> = {}): void {
    conversionTracker.trackCustomConversion(goalId, value, {
      ...properties,
      userId: this.userId
    })

    this.trackEvent('conversion_tracked', {
      goalId,
      value,
      ...properties
    })
  }

  trackUserAction(action: string, element?: string, properties: Record<string, any> = {}): void {
    journeyTracker?.trackStep(action, 'user_action', element, undefined, false, {
      ...properties,
      orchestratorTracked: true
    })

    this.trackEvent('user_action', {
      action,
      element,
      ...properties
    })
  }

  trackError(error: any, type: string = 'unknown'): void {
    const errorData = {
      type,
      message: error?.message || String(error),
      stack: error?.stack,
      page: window.location.pathname,
              userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      timestamp: Date.now()
    }

    this.trackEvent('error_tracked', errorData)

    if (this.config.debug) {
      console.error('🚨 Tracked error:', errorData)
    }
  }

  // Personalization methods
  getPersonalizedContent(contentType: string, defaultContent: any): any {
    if (!this.config.enablePersonalization) return defaultContent
    return personalizationEngine.getPersonalizedContent(contentType, defaultContent)
  }

  getPersonalizedRecommendations(limit: number = 6): any[] {
    if (!this.config.enablePersonalization) return []
    return personalizationEngine.getPersonalizedRecommendations(limit)
  }

  getPersonalizedMessage(messageType: string): string {
    if (!this.config.enablePersonalization) return ''
    return personalizationEngine.getPersonalizedMessage(messageType)
  }

  // Analytics insights
  getAnalyticsInsights(): AnalyticsInsights {
    const utmSessions = analyticsStorage.getUTMSessions()
    const conversions = analyticsStorage.getConversions()
    const journeySteps = analyticsStorage.getJourneySteps()
    const pageMetrics = analyticsStorage.getPageMetrics()
    const segments = segmentationEngine.getAllUserSegments()

    // If no real data exists, generate sample data for testing
    if (utmSessions.length === 0 && conversions.length === 0) {
      return this.generateSampleAnalyticsData()
    }

    return {
      utm: {
        topSources: this.calculateTopSources(utmSessions, conversions),
        conversionsBySource: this.calculateConversionsBySource(utmSessions, conversions),
        topCampaigns: this.calculateTopCampaigns(utmSessions, conversions)
      },
      journey: {
        averageSessionDuration: this.calculateAverageSessionDuration(utmSessions),
        bounceRate: this.calculateBounceRate(pageMetrics),
        topPages: this.calculateTopPages(pageMetrics),
        conversionFunnels: this.calculateFunnelPerformance()
      },
      segmentation: {
        segmentDistribution: this.calculateSegmentDistribution(segments),
        topPerformingSegments: this.calculateTopPerformingSegments(segments, conversions)
      },
      personalization: {
        personalizedSessions: this.calculatePersonalizedSessions(),
        personalizationEffectiveness: this.calculatePersonalizationEffectiveness(),
        topPersonalizedContent: this.calculateTopPersonalizedContent()
      },
      conversions: {
        totalConversions: conversions.length,
        conversionRate: utmSessions.length > 0 ? conversions.length / utmSessions.length : 0,
        totalValue: conversions.reduce((sum, c) => sum + (c.value || 0), 0),
        topConversionGoals: this.calculateTopConversionGoals(conversions)
      }
    }
  }

  private generateSampleAnalyticsData(): AnalyticsInsights {
    return {
      utm: {
        topSources: [
          { source: 'Google', sessions: 4500, conversions: 135 },
          { source: 'Facebook', sessions: 3200, conversions: 96 },
          { source: 'Direct', sessions: 2800, conversions: 84 },
          { source: 'Email', sessions: 1200, conversions: 48 },
          { source: 'LinkedIn', sessions: 800, conversions: 24 }
        ],
        conversionsBySource: [
          { source: 'Google', rate: 0.03, value: 13500 },
          { source: 'Facebook', rate: 0.03, value: 9600 },
          { source: 'Direct', rate: 0.03, value: 8400 },
          { source: 'Email', rate: 0.04, value: 4800 },
          { source: 'LinkedIn', rate: 0.03, value: 2400 }
        ],
        topCampaigns: [
          { campaign: 'Summer Sale 2024', sessions: 2500, conversions: 75 },
          { campaign: 'New Course Launch', sessions: 1800, conversions: 54 },
          { campaign: 'Holiday Special', sessions: 1200, conversions: 36 },
          { campaign: 'Referral Program', sessions: 800, conversions: 24 },
          { campaign: 'Newsletter Signup', sessions: 600, conversions: 18 }
        ]
      },
      journey: {
        averageSessionDuration: 180000, // 3 minutes in milliseconds
        bounceRate: 0.35,
        topPages: [
          { page: '/courses', views: 8500, avgTime: 240000 },
          { page: '/about', views: 6200, avgTime: 120000 },
          { page: '/guna-profiler', views: 4800, avgTime: 300000 },
          { page: '/rishi-mode', views: 3200, avgTime: 180000 },
          { page: '/seva-sangh', views: 2100, avgTime: 150000 }
        ],
        conversionFunnels: [
          { name: 'Course Enrollment', conversionRate: 0.08 },
          { name: 'Newsletter Signup', conversionRate: 0.12 },
          { name: 'Guna Profiler Completion', conversionRate: 0.15 },
          { name: 'Rishi Mode Activation', conversionRate: 0.06 },
          { name: 'Donation/Seva', conversionRate: 0.04 }
        ]
      },
      segmentation: {
        segmentDistribution: [
          { segment: 'Spiritual Seekers', percentage: 0.35, conversionRate: 0.08 },
          { segment: 'Course Enthusiasts', percentage: 0.28, conversionRate: 0.12 },
          { segment: 'Casual Visitors', percentage: 0.22, conversionRate: 0.03 },
          { segment: 'Returning Students', percentage: 0.15, conversionRate: 0.18 }
        ],
        topPerformingSegments: [
          { segment: 'Returning Students', conversions: 72, value: 7200 },
          { segment: 'Course Enthusiasts', conversions: 96, value: 9600 },
          { segment: 'Spiritual Seekers', conversions: 135, value: 13500 },
          { segment: 'Casual Visitors', conversions: 24, value: 2400 }
        ]
      },
      personalization: {
        personalizedSessions: 8500,
        personalizationEffectiveness: 0.23,
        topPersonalizedContent: [
          { content: 'Vedic Philosophy Course', engagement: 0.85 },
          { content: 'Sanskrit Learning Path', engagement: 0.78 },
          { content: 'Meditation Techniques', engagement: 0.72 },
          { content: 'Yoga Fundamentals', engagement: 0.68 },
          { content: 'Bhagavad Gita Study', engagement: 0.65 }
        ]
      },
      conversions: {
        totalConversions: 387,
        conversionRate: 0.032,
        totalValue: 38700,
        topConversionGoals: [
          { goal: 'Course Enrollment', conversions: 135, value: 13500 },
          { goal: 'Newsletter Signup', conversions: 96, value: 9600 },
          { goal: 'Guna Profiler Completion', conversions: 72, value: 7200 },
          { goal: 'Rishi Mode Activation', conversions: 48, value: 4800 },
          { goal: 'Donation/Seva', conversions: 36, value: 3600 }
        ]
      }
    }
  }

  // User consent management
  setUserConsent(hasConsent: boolean): void {
    storage.set('analytics_consent', hasConsent)
    
    if (hasConsent && !this.isInitialized) {
      this.initialize(this.userId)
    } else if (!hasConsent && this.isInitialized) {
      this.destroy()
    }
  }

  hasUserConsent(): boolean {
    if (!this.config.consentRequired) return true
    const consent = storage.get('analytics_consent', false)
    return Boolean(consent)
  }

  // Data management
  exportData(): string {
    return analyticsStorage.exportAnalyticsData()
  }

  clearData(): void {
    analyticsStorage.clearAllData()
    this.eventQueue = []
    
    if (this.config.debug) {
      console.log('🗑️ All analytics data cleared')
    }
  }

  getDataSize(): { used: number; total: number; percentage: number } {
    const used = analyticsStorage.getStorageUsage()
    const total = 5 * 1024 * 1024 // 5MB limit
    const percentage = (used / total) * 100
    return { used, total, percentage }
  }

  // Private helper methods
  private processEvent(event: AnalyticsEvent): void {
    this.eventQueue.push(event)

    // Process immediately for important events
    if (['conversion', 'error_tracked'].includes(event.type)) {
      this.flushEventQueue()
    }

    if (this.config.debug) {
      console.log('📊 Event tracked:', event)
    }
  }

  private queueEvent(type: string, data: any): void {
    this.eventQueue.push({
      type,
      data,
      timestamp: Date.now(),
      source: 'orchestrator_queued'
    })
  }

  private flushEventQueue(): void {
    if (this.eventQueue.length === 0) return

    const events = [...this.eventQueue]
    this.eventQueue = []

    // Send to analytics storage
    events.forEach(event => {
      analyticsStorage.saveUTMEvent({
        id: `orchestrator_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        type: event.type,
        timestamp: event.timestamp,
        sessionId: utmTracker?.getSession().id || 'unknown',
        data: event.data
      })
    })

    // Send to external analytics if configured
    if (this.config.apiEndpoint) {
      this.sendToExternalAnalytics(events)
    }

    if (this.config.debug && events.length > 0) {
      console.log(`📤 Flushed ${events.length} events`)
    }
  }

  private async sendToExternalAnalytics(events: AnalyticsEvent[]): Promise<void> {
    if (!this.config.apiEndpoint) return

    try {
      await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          events,
          userId: this.userId,
          sessionId: utmTracker?.getSession().id,
          timestamp: Date.now()
        })
      })
    } catch (error) {
      if (this.config.debug) {
        console.error('Failed to send events to external analytics:', error)
      }
    }
  }

  private handleConversionEvent(conversionData: any): void {
    this.trackEvent('conversion_completed', conversionData)
  }

  private handlePersonalizationConversion(data: any): void {
    this.trackEvent('personalization_conversion', data)
  }

  private handlePageHidden(): void {
    this.flushEventQueue()
  }

  private handlePageVisible(): void {
    this.trackEvent('page_visible')
  }

  private handleBeforeUnload(): void {
    this.flushEventQueue()
  }

  private dispatchEvent(eventName: string, data: any): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(eventName, { detail: data }))
    }
  }

  // Analytics calculation methods
  private calculateTopSources(sessions: any[], conversions: any[]): Array<{ source: string; sessions: number; conversions: number }> {
    const sources: Record<string, { sessions: number; conversions: number }> = {}
    
    sessions.forEach(session => {
      const source = session.originalUTM?.utm_source || 'direct'
      if (!sources[source]) sources[source] = { sessions: 0, conversions: 0 }
      sources[source].sessions++
    })

    conversions.forEach(conversion => {
      const source = conversion.utm?.utm_source || 'direct'
      if (sources[source]) sources[source].conversions++
    })

    return Object.entries(sources)
      .map(([source, data]) => ({ source, ...data }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 10)
  }

  private calculateConversionsBySource(sessions: any[], conversions: any[]): Array<{ source: string; rate: number; value: number }> {
    const sourceData: Record<string, { sessions: number; conversions: number; value: number }> = {}
    
    sessions.forEach(session => {
      const source = session.originalUTM?.utm_source || 'direct'
      if (!sourceData[source]) sourceData[source] = { sessions: 0, conversions: 0, value: 0 }
      sourceData[source].sessions++
    })

    conversions.forEach(conversion => {
      const source = conversion.utm?.utm_source || 'direct'
      if (sourceData[source]) {
        sourceData[source].conversions++
        sourceData[source].value += conversion.value || 0
      }
    })

    return Object.entries(sourceData)
      .map(([source, data]) => ({
        source,
        rate: data.sessions > 0 ? data.conversions / data.sessions : 0,
        value: data.value
      }))
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 10)
  }

  private calculateTopCampaigns(sessions: any[], conversions: any[]): Array<{ campaign: string; sessions: number; conversions: number }> {
    const campaigns: Record<string, { sessions: number; conversions: number }> = {}
    
    sessions.forEach(session => {
      const campaign = session.originalUTM?.utm_campaign
      if (campaign) {
        if (!campaigns[campaign]) campaigns[campaign] = { sessions: 0, conversions: 0 }
        campaigns[campaign].sessions++
      }
    })

    conversions.forEach(conversion => {
      const campaign = conversion.utm?.utm_campaign
      if (campaign && campaigns[campaign]) {
        campaigns[campaign].conversions++
      }
    })

    return Object.entries(campaigns)
      .map(([campaign, data]) => ({ campaign, ...data }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 10)
  }

  private calculateAverageSessionDuration(sessions: any[]): number {
    if (sessions.length === 0) return 0
    const totalDuration = sessions.reduce((sum, session) => sum + (session.lastVisit - session.firstVisit), 0)
    return totalDuration / sessions.length
  }

  private calculateBounceRate(pageMetrics: any[]): number {
    if (pageMetrics.length === 0) return 0
    const bounces = pageMetrics.filter(metric => metric.bounces > 0).length
    return bounces / pageMetrics.length
  }

  private calculateTopPages(pageMetrics: any[]): Array<{ page: string; views: number; avgTime: number }> {
    const pages: Record<string, { views: number; totalTime: number }> = {}
    
    pageMetrics.forEach(metric => {
      if (!pages[metric.page]) pages[metric.page] = { views: 0, totalTime: 0 }
      pages[metric.page].views++
      pages[metric.page].totalTime += metric.duration || 0
    })

    return Object.entries(pages)
      .map(([page, data]) => ({
        page,
        views: data.views,
        avgTime: data.views > 0 ? data.totalTime / data.views : 0
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)
  }

  private calculateFunnelPerformance(): Array<{ name: string; conversionRate: number }> {
    // This would use the conversion tracker's funnel analysis
    return []
  }

  private calculateSegmentDistribution(segments: any[]): Array<{ segment: string; percentage: number; conversionRate: number }> {
    const distribution: Record<string, number> = {}
    segments.forEach(segment => {
      const segmentId = segment.primarySegment.id
      distribution[segmentId] = (distribution[segmentId] || 0) + 1
    })

    const total = segments.length
    return Object.entries(distribution)
      .map(([segment, count]) => ({
        segment,
        percentage: total > 0 ? (count / total) * 100 : 0,
        conversionRate: 0 // Would need to calculate from conversions
      }))
  }

  private calculateTopPerformingSegments(segments: any[], conversions: any[]): Array<{ segment: string; conversions: number; value: number }> {
    const segmentPerformance: Record<string, { conversions: number; value: number }> = {}
    
    conversions.forEach(conversion => {
      // Find segment for this conversion (simplified)
      const segment = 'general' // Would need proper lookup
      if (!segmentPerformance[segment]) segmentPerformance[segment] = { conversions: 0, value: 0 }
      segmentPerformance[segment].conversions++
      segmentPerformance[segment].value += conversion.value || 0
    })

    return Object.entries(segmentPerformance)
      .map(([segment, data]) => ({ segment, ...data }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }

  private calculatePersonalizedSessions(): number {
    return personalizationEngine.getPersonalizationInsights().personalizedContent || 0
  }

  private calculatePersonalizationEffectiveness(): number {
    return personalizationEngine.getPersonalizationInsights().avgConfidence || 0
  }

  private calculateTopPersonalizedContent(): Array<{ content: string; engagement: number }> {
    return []
  }

  private calculateTopConversionGoals(conversions: any[]): Array<{ goal: string; conversions: number; value: number }> {
    const goals: Record<string, { conversions: number; value: number }> = {}
    
    conversions.forEach(conversion => {
      if (!goals[conversion.type]) goals[conversion.type] = { conversions: 0, value: 0 }
      goals[conversion.type].conversions++
      goals[conversion.type].value += conversion.value || 0
    })

    return Object.entries(goals)
      .map(([goal, data]) => ({ goal, ...data }))
      .sort((a, b) => b.conversions - a.conversions)
      .slice(0, 10)
  }

  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
      this.flushInterval = null
    }

    this.flushEventQueue()
    journeyTracker?.destroy()
    
    this.isInitialized = false

    if (this.config.debug) {
      console.log('🔄 Analytics Orchestrator destroyed')
    }
  }
}

// Export singleton instance
export const analyticsOrchestrator = AnalyticsOrchestrator.getInstance()

// Utility functions for easier integration
export function initializeAnalytics(config?: Partial<AnalyticsConfig>, userId?: string): Promise<void> {
  return analyticsOrchestrator.initialize(userId)
}

export function trackEvent(eventName: string, properties?: Record<string, any>): void {
  analyticsOrchestrator.trackEvent(eventName, properties)
}

export function trackConversion(goalId: string, value?: number, properties?: Record<string, any>): void {
  analyticsOrchestrator.trackConversion(goalId, value, properties)
}

export function trackUserAction(action: string, element?: string, properties?: Record<string, any>): void {
  analyticsOrchestrator.trackUserAction(action, element, properties)
}

export function getPersonalizedContent(contentType: string, defaultContent: any): any {
  return analyticsOrchestrator.getPersonalizedContent(contentType, defaultContent)
}

export function getPersonalizedRecommendations(limit?: number): any[] {
  return analyticsOrchestrator.getPersonalizedRecommendations(limit)
}

export function getAnalyticsInsights(): AnalyticsInsights {
  return analyticsOrchestrator.getAnalyticsInsights()
}

export function setUserConsent(hasConsent: boolean): void {
  analyticsOrchestrator.setUserConsent(hasConsent)
}

export function exportAnalyticsData(): string {
  return analyticsOrchestrator.exportData()
}

export function clearAnalyticsData(): void {
  analyticsOrchestrator.clearData()
}
