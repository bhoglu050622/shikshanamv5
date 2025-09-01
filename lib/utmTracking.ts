import { storage } from '@/lib/utils'

export interface UTMParameters {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  utm_id?: string
  utm_source_platform?: string
  utm_creative_format?: string
  utm_marketing_tactic?: string
  gclid?: string // Google Ads click ID
  fbclid?: string // Facebook click ID
  msclkid?: string // Microsoft Ads click ID
  ttclid?: string // TikTok click ID
  li_fat_id?: string // LinkedIn click ID
}

export interface UTMSession {
  id: string
  firstVisit: number
  lastVisit: number
  visitCount: number
  originalUTM: UTMParameters
  latestUTM: UTMParameters
  allUTMSources: UTMParameters[]
  landingPage: string
  referrer: string
  userAgent: string
  ipCountry?: string
  device: {
    type: 'mobile' | 'tablet' | 'desktop'
    os: string
    browser: string
  }
}

export interface TrafficSource {
  type: 'organic' | 'direct' | 'social' | 'email' | 'paid' | 'referral'
  source: string
  medium: string
  campaign?: string
  confidence: number
}

export class UTMTracker {
  private static readonly STORAGE_KEY = 'utm_data'
  private static readonly SESSION_KEY = 'utm_session'
  private static readonly ATTRIBUTION_WINDOW = 30 * 24 * 60 * 60 * 1000 // 30 days

  private session: UTMSession
  private currentPageStart: number = Date.now()

  constructor() {
    this.session = this.initializeSession()
    this.trackPageView()
  }

  private initializeSession(): UTMSession {
    const existingSession = this.getStoredSession()
    const currentUTM = this.extractUTMFromURL()
    const now = Date.now()

    if (existingSession && this.isSessionValid(existingSession)) {
      // Update existing session
      const updatedSession: UTMSession = {
        ...existingSession,
        lastVisit: now,
        visitCount: existingSession.visitCount + 1,
        latestUTM: Object.keys(currentUTM).length > 0 ? currentUTM : existingSession.latestUTM,
        allUTMSources: Object.keys(currentUTM).length > 0 
          ? [...existingSession.allUTMSources, currentUTM]
          : existingSession.allUTMSources
      }
      this.saveSession(updatedSession)
      return updatedSession
    } else {
      // Create new session
      const newSession: UTMSession = {
        id: this.generateSessionId(),
        firstVisit: now,
        lastVisit: now,
        visitCount: 1,
        originalUTM: currentUTM,
        latestUTM: currentUTM,
        allUTMSources: Object.keys(currentUTM).length > 0 ? [currentUTM] : [],
        landingPage: this.getCurrentPage(),
        referrer: typeof document !== 'undefined' ? document.referrer || 'direct' : 'direct',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        device: this.getDeviceInfo()
      }
      this.saveSession(newSession)
      return newSession
    }
  }

  private extractUTMFromURL(): UTMParameters {
    if (typeof window === 'undefined') return {}
    const params = new URLSearchParams(window.location.search)
    const utm: UTMParameters = {}

    // Standard UTM parameters
    const utmKeys = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'utm_id', 'utm_source_platform', 'utm_creative_format', 'utm_marketing_tactic'
    ]

    utmKeys.forEach(key => {
      const value = params.get(key)
      if (value) {
        utm[key as keyof UTMParameters] = value
      }
    })

    // Click IDs
    const clickIds = ['gclid', 'fbclid', 'msclkid', 'ttclid', 'li_fat_id']
    clickIds.forEach(id => {
      const value = params.get(id)
      if (value) {
        utm[id as keyof UTMParameters] = value
      }
    })

    return utm
  }

  private getStoredSession(): UTMSession | null {
    return storage.get(UTMTracker.SESSION_KEY, null)
  }

  private saveSession(session: UTMSession): void {
    storage.set(UTMTracker.SESSION_KEY, session)
  }

  private isSessionValid(session: UTMSession): boolean {
    const now = Date.now()
    return (now - session.lastVisit) < UTMTracker.ATTRIBUTION_WINDOW
  }

  private generateSessionId(): string {
    return `utm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getCurrentPage(): string {
    if (typeof window === 'undefined') return '/'
    return window.location.pathname + window.location.search
  }

  private getDeviceInfo() {
    if (typeof navigator === 'undefined') return { type: 'desktop' as const, os: 'Unknown', browser: 'Unknown' }
    const userAgent = navigator.userAgent
    let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop'
    
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      deviceType = 'tablet'
    } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
      deviceType = 'mobile'
    }

    return {
      type: deviceType,
      os: this.getOS(userAgent),
      browser: this.getBrowser(userAgent)
    }
  }

  private getOS(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows'
    if (userAgent.includes('Mac')) return 'macOS'
    if (userAgent.includes('Linux')) return 'Linux'
    if (userAgent.includes('Android')) return 'Android'
    if (userAgent.includes('iOS')) return 'iOS'
    return 'Unknown'
  }

  private getBrowser(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari')) return 'Safari'
    if (userAgent.includes('Edge')) return 'Edge'
    return 'Unknown'
  }

  private trackPageView(): void {
    const pageView = {
      timestamp: Date.now(),
      page: this.getCurrentPage(),
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      utm: this.session.latestUTM,
      sessionId: this.session.id
    }

    this.saveEvent('page_view', pageView)
  }

  private saveEvent(eventType: string, data: any): void {
    const events = this.getStoredEvents()
    events.push({
      id: `${eventType}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      type: eventType,
      timestamp: Date.now(),
      sessionId: this.session.id,
      data
    })

    // Keep only last 1000 events
    if (events.length > 1000) {
      events.splice(0, events.length - 1000)
    }

    storage.set(UTMTracker.STORAGE_KEY, events)
  }

  private getStoredEvents(): any[] {
    return storage.get(UTMTracker.STORAGE_KEY, []) || []
  }

  // Public methods
  getSession(): UTMSession {
    return { ...this.session }
  }

  getCurrentUTM(): UTMParameters {
    return { ...this.session.latestUTM }
  }

  getOriginalUTM(): UTMParameters {
    return { ...this.session.originalUTM }
  }

  getTrafficSource(): TrafficSource {
    const utm = this.session.latestUTM
    const referrer = this.session.referrer

    // Paid traffic
    if (utm.utm_medium === 'cpc' || utm.utm_medium === 'ppc' || utm.gclid || utm.fbclid || utm.msclkid) {
      return {
        type: 'paid',
        source: utm.utm_source || 'unknown',
        medium: utm.utm_medium || 'cpc',
        campaign: utm.utm_campaign,
        confidence: 0.95
      }
    }

    // Social media
    const socialPlatforms = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok', 'pinterest']
    if (utm.utm_medium === 'social' || socialPlatforms.some(platform => 
      utm.utm_source?.toLowerCase().includes(platform) || referrer.toLowerCase().includes(platform)
    )) {
      return {
        type: 'social',
        source: utm.utm_source || this.extractDomainFromReferrer(referrer),
        medium: utm.utm_medium || 'social',
        campaign: utm.utm_campaign,
        confidence: 0.9
      }
    }

    // Email
    if (utm.utm_medium === 'email' || utm.utm_source === 'email' || utm.utm_source?.includes('newsletter')) {
      return {
        type: 'email',
        source: utm.utm_source || 'email',
        medium: utm.utm_medium || 'email',
        campaign: utm.utm_campaign,
        confidence: 0.95
      }
    }

    // Organic search
    const searchEngines = ['google', 'bing', 'yahoo', 'duckduckgo', 'baidu']
    if (utm.utm_medium === 'organic' || searchEngines.some(engine => 
      referrer.toLowerCase().includes(engine)
    )) {
      return {
        type: 'organic',
        source: utm.utm_source || this.extractDomainFromReferrer(referrer),
        medium: utm.utm_medium || 'organic',
        confidence: 0.85
      }
    }

    // Referral
    if (referrer && referrer !== 'direct' && typeof window !== 'undefined' && !referrer.includes(window.location.hostname)) {
      return {
        type: 'referral',
        source: this.extractDomainFromReferrer(referrer),
        medium: utm.utm_medium || 'referral',
        campaign: utm.utm_campaign,
        confidence: 0.8
      }
    }

    // Direct
    return {
      type: 'direct',
      source: 'direct',
      medium: 'none',
      confidence: 0.9
    }
  }

  private extractDomainFromReferrer(referrer: string): string {
    try {
      return new URL(referrer).hostname
    } catch {
      return 'unknown'
    }
  }

  trackEvent(eventName: string, properties: Record<string, any> = {}): void {
    this.saveEvent(eventName, {
      ...properties,
      utm: this.session.latestUTM,
      trafficSource: this.getTrafficSource(),
      page: this.getCurrentPage()
    })
  }

  trackConversion(conversionType: string, value?: number, currency?: string): void {
    const conversionData = {
      type: conversionType,
      value,
      currency,
      utm: this.session.originalUTM,
      currentUTM: this.session.latestUTM,
      trafficSource: this.getTrafficSource(),
      sessionDuration: Date.now() - this.session.firstVisit,
      pageViews: this.getPageViewCount(),
      page: this.getCurrentPage()
    }

    this.saveEvent('conversion', conversionData)
  }

  trackPageExit(): void {
    const timeOnPage = Date.now() - this.currentPageStart
    this.saveEvent('page_exit', {
      timeOnPage,
      page: this.getCurrentPage(),
      utm: this.session.latestUTM
    })
  }

  getPageViewCount(): number {
    const events = this.getStoredEvents()
    return events.filter(e => e.type === 'page_view' && e.sessionId === this.session.id).length
  }

  getSessionDuration(): number {
    return Date.now() - this.session.firstVisit
  }

  getAllEvents(): any[] {
    return this.getStoredEvents()
  }

  clearData(): void {
    storage.remove(UTMTracker.STORAGE_KEY)
    storage.remove(UTMTracker.SESSION_KEY)
  }

  // Campaign attribution helpers
  isFromCampaign(campaignName: string): boolean {
    return this.session.allUTMSources.some(utm => 
      utm.utm_campaign?.toLowerCase().includes(campaignName.toLowerCase())
    )
  }

  isFromSource(sourceName: string): boolean {
    return this.session.allUTMSources.some(utm => 
      utm.utm_source?.toLowerCase().includes(sourceName.toLowerCase())
    )
  }

  getAttributionPath(): string[] {
    return this.session.allUTMSources.map(utm => 
      `${utm.utm_source || 'unknown'}_${utm.utm_medium || 'unknown'}`
    )
  }
}

// Singleton instance
export const utmTracker = typeof window !== 'undefined' ? new UTMTracker() : null

// Utility functions
export function getUTMParameters(): UTMParameters {
  return utmTracker?.getCurrentUTM() || {}
}

export function getTrafficSource(): TrafficSource | null {
  return utmTracker?.getTrafficSource() || null
}

export function isFromPaidTraffic(): boolean {
  const source = utmTracker?.getTrafficSource()
  return source?.type === 'paid' || false
}

export function isFromSocialMedia(): boolean {
  const source = utmTracker?.getTrafficSource()
  return source?.type === 'social' || false
}

export function isFromEmail(): boolean {
  const source = utmTracker?.getTrafficSource()
  return source?.type === 'email' || false
}

export function getSessionInfo(): UTMSession | null {
  return utmTracker?.getSession() || null
}

export function trackCustomEvent(eventName: string, properties?: Record<string, any>): void {
  utmTracker?.trackEvent(eventName, properties)
}

export function trackConversion(type: string, value?: number, currency?: string): void {
  utmTracker?.trackConversion(type, value, currency)
}
