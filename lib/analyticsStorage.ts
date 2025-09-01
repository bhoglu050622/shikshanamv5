import { UTMSession, UTMParameters } from './utmTracking'
import { JourneyStep, PageMetrics, UserBehaviorPattern } from './journeyTracking'
import { storage } from '@/lib/utils'

export interface AnalyticsData {
  utm: {
    sessions: UTMSession[]
    currentSession: UTMSession | null
    events: UTMEvent[]
  }
  journey: {
    steps: JourneyStep[]
    pageMetrics: PageMetrics[]
    behaviorPatterns: UserBehaviorPattern[]
  }
  conversions: ConversionEvent[]
  experiments: ABTestData[]
  personalization: PersonalizationData
  retargeting: RetargetingData[]
}

export interface UTMEvent {
  id: string
  type: string
  timestamp: number
  sessionId: string
  data: any
}

export interface ConversionEvent {
  id: string
  sessionId: string
  userId?: string
  type: string
  value?: number
  currency?: string
  timestamp: number
  utm: UTMParameters
  trafficSource: any
  journeySteps: number
  timeToConvert: number
  touchpoints: string[]
  attribution: AttributionData
}

export interface AttributionData {
  firstTouch: { source: string; medium: string; campaign?: string; timestamp: number }
  lastTouch: { source: string; medium: string; campaign?: string; timestamp: number }
  allTouchpoints: Array<{ source: string; medium: string; campaign?: string; timestamp: number; weight: number }>
  attributionModel: 'first-touch' | 'last-touch' | 'linear' | 'time-decay' | 'position-based' | 'custom'
  attributedValue: number
}

export interface ABTestData {
  id: string
  name: string
  variant: string
  userId?: string
  sessionId: string
  startTime: number
  endTime?: number
  conversions: string[]
  interactions: any[]
  outcome: 'control' | 'variant_a' | 'variant_b' | 'variant_c'
}

export interface PersonalizationData {
  userId?: string
  sessionId: string
  segments: string[]
  preferences: UserPreferences
  contentViewed: ContentInteraction[]
  recommendations: RecommendationHistory[]
  dynamicContent: DynamicContentData[]
}

export interface UserPreferences {
  contentTypes: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  language: string
  priceRange: { min: number; max: number }
  categories: string[]
  instructors: string[]
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading'
  timeCommitment: 'light' | 'moderate' | 'intensive'
}

export interface ContentInteraction {
  contentId: string
  contentType: string
  action: string
  timestamp: number
  duration?: number
  completion?: number
  rating?: number
}

export interface RecommendationHistory {
  recommendationId: string
  algorithm: string
  items: string[]
  timestamp: number
  interactions: string[]
  conversions: string[]
  feedback?: 'positive' | 'negative' | 'neutral'
}

export interface DynamicContentData {
  contentId: string
  variation: string
  personalizationRules: string[]
  displayTime: number
  interactions: string[]
  effectiveness: number
}

export interface RetargetingData {
  userId?: string
  sessionId: string
  segments: string[]
  abandonedActions: string[]
  triggers: RetargetingTrigger[]
  campaigns: RetargetingCampaign[]
  suppressions: string[]
}

export interface RetargetingTrigger {
  id: string
  type: 'exit_intent' | 'time_based' | 'page_based' | 'behavior_based'
  condition: any
  fired: boolean
  timestamp?: number
}

export interface RetargetingCampaign {
  id: string
  name: string
  segments: string[]
  messages: string[]
  schedule: any
  active: boolean
  conversions: number
}

export class AnalyticsStorageManager {
  private static readonly STORAGE_KEYS = {
    UTM_SESSIONS: 'utm_sessions',
    UTM_EVENTS: 'utm_events',
    JOURNEY_STEPS: 'journey_steps',
    PAGE_METRICS: 'page_metrics',
    BEHAVIOR_PATTERNS: 'behavior_patterns',
    CONVERSIONS: 'conversions',
    AB_TESTS: 'ab_tests',
    PERSONALIZATION: 'personalization',
    RETARGETING: 'retargeting',
    USER_PREFERENCES: 'user_preferences',
    ANALYTICS_CONFIG: 'analytics_config'
  }

  private static readonly MAX_STORAGE_ITEMS = {
    UTM_SESSIONS: 50,
    UTM_EVENTS: 1000,
    JOURNEY_STEPS: 2000,
    PAGE_METRICS: 500,
    BEHAVIOR_PATTERNS: 100,
    CONVERSIONS: 200,
    AB_TESTS: 50,
    RETARGETING: 100
  }

  private static readonly RETENTION_DAYS = {
    UTM_SESSIONS: 90,
    UTM_EVENTS: 30,
    JOURNEY_STEPS: 30,
    PAGE_METRICS: 7,
    BEHAVIOR_PATTERNS: 60,
    CONVERSIONS: 365,
    AB_TESTS: 180,
    RETARGETING: 30
  }

  // UTM Storage Methods
  saveUTMSession(session: UTMSession): void {
    const sessions = this.getUTMSessions()
    const existingIndex = sessions.findIndex(s => s.id === session.id)
    
    if (existingIndex >= 0) {
      sessions[existingIndex] = session
    } else {
      sessions.push(session)
    }

    const cleanedSessions = this.cleanupOldUTMSessions(sessions, 'UTM_SESSIONS')
    storage.set(AnalyticsStorageManager.STORAGE_KEYS.UTM_SESSIONS, cleanedSessions)
  }

  getUTMSessions(): UTMSession[] {
    return storage.get(AnalyticsStorageManager.STORAGE_KEYS.UTM_SESSIONS, []) || []
  }

  saveUTMEvent(event: UTMEvent): void {
    const events = this.getUTMEvents()
    events.push(event)
    const cleanedEvents = this.cleanupOldData(events, 'UTM_EVENTS')
    storage.set(AnalyticsStorageManager.STORAGE_KEYS.UTM_EVENTS, cleanedEvents)
  }

  getUTMEvents(): UTMEvent[] {
    return storage.get(AnalyticsStorageManager.STORAGE_KEYS.UTM_EVENTS, []) || []
  }

  // Journey Storage Methods
  saveJourneySteps(steps: JourneyStep[]): void {
    const cleanedSteps = this.cleanupOldData(steps, 'JOURNEY_STEPS')
    storage.set(AnalyticsStorageManager.STORAGE_KEYS.JOURNEY_STEPS, cleanedSteps)
  }

  getJourneySteps(): JourneyStep[] {
    return storage.get(AnalyticsStorageManager.STORAGE_KEYS.JOURNEY_STEPS, []) || []
  }

  savePageMetrics(metrics: PageMetrics[]): void {
    const cleanedMetrics = this.cleanupOldPageMetrics(metrics, 'PAGE_METRICS')
    storage.set(AnalyticsStorageManager.STORAGE_KEYS.PAGE_METRICS, cleanedMetrics)
  }

  getPageMetrics(): PageMetrics[] {
    return storage.get(AnalyticsStorageManager.STORAGE_KEYS.PAGE_METRICS, []) || []
  }

  saveBehaviorPattern(pattern: UserBehaviorPattern): void {
    const patterns = this.getBehaviorPatterns()
    const existingIndex = patterns.findIndex(p => p.sessionId === pattern.sessionId)
    
    if (existingIndex >= 0) {
      patterns[existingIndex] = pattern
    } else {
      patterns.push(pattern)
    }

    const cleanedPatterns = this.cleanupOldDataNoTimestamp(patterns, 'BEHAVIOR_PATTERNS')
    storage.set(AnalyticsStorageManager.STORAGE_KEYS.BEHAVIOR_PATTERNS, cleanedPatterns)
  }

  getBehaviorPatterns(): UserBehaviorPattern[] {
    return storage.get(AnalyticsStorageManager.STORAGE_KEYS.BEHAVIOR_PATTERNS, []) || []
  }

  // Conversion Storage Methods
  saveConversion(conversion: ConversionEvent): void {
    const conversions = this.getConversions()
    conversions.push(conversion)
    const cleanedConversions = this.cleanupOldData(conversions, 'CONVERSIONS')
    storage.set(AnalyticsStorageManager.STORAGE_KEYS.CONVERSIONS, cleanedConversions)
  }

  getConversions(): ConversionEvent[] {
    return storage.get(AnalyticsStorageManager.STORAGE_KEYS.CONVERSIONS, []) || []
  }

  // A/B Testing Storage Methods
  saveABTest(test: ABTestData): void {
    const tests = this.getABTests()
    const existingIndex = tests.findIndex(t => t.id === test.id)
    
    if (existingIndex >= 0) {
      tests[existingIndex] = test
    } else {
      tests.push(test)
    }

    const cleanedTests = this.cleanupOldABTests(tests, 'AB_TESTS')
    storage.set(AnalyticsStorageManager.STORAGE_KEYS.AB_TESTS, cleanedTests)
  }

  getABTests(): ABTestData[] {
    return storage.get(AnalyticsStorageManager.STORAGE_KEYS.AB_TESTS, []) || []
  }

  // Personalization Storage Methods
  savePersonalizationData(data: PersonalizationData): void {
    storage.set(AnalyticsStorageManager.STORAGE_KEYS.PERSONALIZATION, data)
  }

  getPersonalizationData(): PersonalizationData | null {
    return storage.get(AnalyticsStorageManager.STORAGE_KEYS.PERSONALIZATION, null)
  }

  // User Preferences Storage Methods
  saveUserPreferences(preferences: UserPreferences): void {
    storage.set(AnalyticsStorageManager.STORAGE_KEYS.USER_PREFERENCES, preferences)
  }

  getUserPreferences(): UserPreferences | null {
    return storage.get(AnalyticsStorageManager.STORAGE_KEYS.USER_PREFERENCES, null)
  }

  // Retargeting Storage Methods
  saveRetargetingData(data: RetargetingData[]): void {
    const cleanedData = this.cleanupOldDataNoTimestamp(data, 'RETARGETING')
    storage.set(AnalyticsStorageManager.STORAGE_KEYS.RETARGETING, cleanedData)
  }

  getRetargetingData(): RetargetingData[] {
    return storage.get(AnalyticsStorageManager.STORAGE_KEYS.RETARGETING, []) || []
  }

  // Utility Methods
  clearAllData(): void {
    Object.values(AnalyticsStorageManager.STORAGE_KEYS).forEach(key => {
      storage.remove(key)
    })
  }

  getStorageUsage(): number {
    return storage.getTotalSize()
  }

  cleanupStorage(): void {
    storage.cleanup()
  }

  private cleanupOldData<T extends { timestamp?: number }>(data: T[], type: keyof typeof AnalyticsStorageManager.MAX_STORAGE_ITEMS): T[] {
    const maxItems = AnalyticsStorageManager.MAX_STORAGE_ITEMS[type]
    const retentionDays = AnalyticsStorageManager.RETENTION_DAYS[type]
    const cutoffTime = Date.now() - (retentionDays * 24 * 60 * 60 * 1000)

    // Remove old items based on timestamp
    const filtered = data.filter(item => {
      return item.timestamp && item.timestamp > cutoffTime
    })

    // Limit to max items if still over limit
    if (filtered.length > maxItems) {
      const sorted = filtered.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      return sorted.slice(0, maxItems)
    }

    return filtered
  }

  private cleanupOldUTMSessions(sessions: UTMSession[], type: keyof typeof AnalyticsStorageManager.MAX_STORAGE_ITEMS): UTMSession[] {
    const maxItems = AnalyticsStorageManager.MAX_STORAGE_ITEMS[type]
    const retentionDays = AnalyticsStorageManager.RETENTION_DAYS[type]
    const cutoffTime = Date.now() - (retentionDays * 24 * 60 * 60 * 1000)

    // Remove old sessions based on lastVisit
    const filtered = sessions.filter(session => {
      return session.lastVisit > cutoffTime
    })

    // Limit to max items if still over limit
    if (filtered.length > maxItems) {
      const sorted = filtered.sort((a, b) => b.lastVisit - a.lastVisit)
      return sorted.slice(0, maxItems)
    }

    return filtered
  }

  private cleanupOldPageMetrics(metrics: PageMetrics[], type: keyof typeof AnalyticsStorageManager.MAX_STORAGE_ITEMS): PageMetrics[] {
    const maxItems = AnalyticsStorageManager.MAX_STORAGE_ITEMS[type]
    const retentionDays = AnalyticsStorageManager.RETENTION_DAYS[type]
    const cutoffTime = Date.now() - (retentionDays * 24 * 60 * 60 * 1000)

    // Remove old metrics based on entryTime
    const filtered = metrics.filter(metric => {
      return metric.entryTime > cutoffTime
    })

    // Limit to max items if still over limit
    if (filtered.length > maxItems) {
      const sorted = filtered.sort((a, b) => b.entryTime - a.entryTime)
      return sorted.slice(0, maxItems)
    }

    return filtered
  }

  private cleanupOldDataNoTimestamp<T>(data: T[], type: keyof typeof AnalyticsStorageManager.MAX_STORAGE_ITEMS): T[] {
    const maxItems = AnalyticsStorageManager.MAX_STORAGE_ITEMS[type]

    // Just limit to max items since we can't filter by timestamp
    if (data.length > maxItems) {
      return data.slice(0, maxItems)
    }

    return data
  }

  private cleanupOldABTests(tests: ABTestData[], type: keyof typeof AnalyticsStorageManager.MAX_STORAGE_ITEMS): ABTestData[] {
    const maxItems = AnalyticsStorageManager.MAX_STORAGE_ITEMS[type]
    const retentionDays = AnalyticsStorageManager.RETENTION_DAYS[type]
    const cutoffTime = Date.now() - (retentionDays * 24 * 60 * 60 * 1000)

    // Remove old tests based on startTime
    const filtered = tests.filter(test => {
      return test.startTime > cutoffTime
    })

    // Limit to max items if still over limit
    if (filtered.length > maxItems) {
      const sorted = filtered.sort((a, b) => b.startTime - a.startTime)
      return sorted.slice(0, maxItems)
    }

    return filtered
  }

  getAllAnalyticsData(): AnalyticsData {
    return {
      utm: {
        sessions: this.getUTMSessions(),
        currentSession: this.getCurrentUTMSession(),
        events: this.getUTMEvents()
      },
      journey: {
        steps: this.getJourneySteps(),
        pageMetrics: this.getPageMetrics(),
        behaviorPatterns: this.getBehaviorPatterns()
      },
      conversions: this.getConversions(),
      experiments: this.getABTests(),
      personalization: this.getPersonalizationData() || this.createDefaultPersonalizationData(),
      retargeting: this.getRetargetingData()
    }
  }

  private getCurrentUTMSession(): UTMSession | null {
    const sessions = this.getUTMSessions()
    if (sessions.length === 0) return null
    
    // Return the most recent session
    return sessions.reduce((latest, session) => 
      session.lastVisit > latest.lastVisit ? session : latest
    )
  }

  private createDefaultPersonalizationData(): PersonalizationData {
    return {
      sessionId: `session_${Date.now()}`,
      segments: [],
      preferences: {
        contentTypes: [],
        difficulty: 'beginner',
        language: 'en',
        priceRange: { min: 0, max: 10000 },
        categories: [],
        instructors: [],
        learningStyle: 'visual',
        timeCommitment: 'moderate'
      },
      contentViewed: [],
      recommendations: [],
      dynamicContent: []
    }
  }

  exportAnalyticsData(): string {
    const data = this.getAllAnalyticsData()
    return JSON.stringify(data, null, 2)
  }

  importAnalyticsData(jsonData: string): boolean {
    try {
      const data: AnalyticsData = JSON.parse(jsonData)
      
      // Save each data type
      data.utm.sessions.forEach(session => this.saveUTMSession(session))
      data.utm.events.forEach(event => this.saveUTMEvent(event))
      this.saveJourneySteps(data.journey.steps)
      this.savePageMetrics(data.journey.pageMetrics)
      data.journey.behaviorPatterns.forEach(pattern => this.saveBehaviorPattern(pattern))
      data.conversions.forEach(conversion => this.saveConversion(conversion))
      data.experiments.forEach(test => this.saveABTest(test))
      this.savePersonalizationData(data.personalization)
      this.saveRetargetingData(data.retargeting)
      
      return true
    } catch (error) {
      console.error('Failed to import analytics data:', error)
      return false
    }
  }

  optimizeStorage(): void {
    const usage = this.getStorageUsage()
    
    if (usage > 80) { // Changed from percentage to raw number for storage.getTotalSize()
      console.warn('Analytics storage usage high, cleaning up...')
      
      // More aggressive cleanup
      Object.keys(AnalyticsStorageManager.MAX_STORAGE_ITEMS).forEach(type => {
        const maxItems = Math.floor(AnalyticsStorageManager.MAX_STORAGE_ITEMS[type as keyof typeof AnalyticsStorageManager.MAX_STORAGE_ITEMS] * 0.7)
        
        switch (type) {
          case 'UTM_SESSIONS':
            const sessions = this.getUTMSessions()
            if (sessions.length > maxItems) {
              const reduced = sessions.slice(-maxItems)
              storage.set(AnalyticsStorageManager.STORAGE_KEYS.UTM_SESSIONS, reduced)
            }
            break
          case 'UTM_EVENTS':
            const events = this.getUTMEvents()
            if (events.length > maxItems) {
              const reduced = events.slice(-maxItems)
              storage.set(AnalyticsStorageManager.STORAGE_KEYS.UTM_EVENTS, reduced)
            }
            break
          // Add other cleanup cases as needed
        }
      })
    }
  }
}

// Singleton instance
export const analyticsStorage = new AnalyticsStorageManager()

// Utility functions
export function saveAnalyticsEvent(type: string, data: any): void {
  const event: UTMEvent = {
    id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    type,
    timestamp: Date.now(),
    sessionId: 'current',
    data
  }
  analyticsStorage.saveUTMEvent(event)
}

export function getAnalyticsInsights(): any {
  const data = analyticsStorage.getAllAnalyticsData()
  
  return {
    totalSessions: data.utm.sessions.length,
    totalConversions: data.conversions.length,
    conversionRate: data.utm.sessions.length > 0 ? 
      (data.conversions.length / data.utm.sessions.length) * 100 : 0,
    topTrafficSources: getTopTrafficSources(data.utm.sessions),
    averageSessionDuration: getAverageSessionDuration(data.utm.sessions),
    topPages: getTopPages(data.journey.pageMetrics),
    userSegments: getUserSegmentDistribution(data.journey.behaviorPatterns)
  }
}

function getTopTrafficSources(sessions: UTMSession[]): Array<{ source: string; count: number }> {
  const sources: Record<string, number> = {}
  
  sessions.forEach(session => {
    const source = session.originalUTM.utm_source || 'direct'
    sources[source] = (sources[source] || 0) + 1
  })
  
  return Object.entries(sources)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}

function getAverageSessionDuration(sessions: UTMSession[]): number {
  if (sessions.length === 0) return 0
  
  const totalDuration = sessions.reduce((sum, session) => {
    return sum + (session.lastVisit - session.firstVisit)
  }, 0)
  
  return totalDuration / sessions.length
}

function getTopPages(metrics: PageMetrics[]): Array<{ page: string; views: number }> {
  const pages: Record<string, number> = {}
  
  metrics.forEach(metric => {
    pages[metric.page] = (pages[metric.page] || 0) + 1
  })
  
  return Object.entries(pages)
    .map(([page, views]) => ({ page, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10)
}

function getUserSegmentDistribution(patterns: UserBehaviorPattern[]): Array<{ segment: string; count: number }> {
  const segments: Record<string, number> = {}
  
  patterns.forEach(pattern => {
    const segment = pattern.segment.name
    segments[segment] = (segments[segment] || 0) + 1
  })
  
  return Object.entries(segments)
    .map(([segment, count]) => ({ segment, count }))
    .sort((a, b) => b.count - a.count)
}
