import { UTMSession, TrafficSource, utmTracker } from './utmTracking'
import { UserBehaviorPattern, JourneyStep, journeyTracker } from './journeyTracking'
import { analyticsStorage, ConversionEvent } from './analyticsStorage'

import { storage } from '@/lib/utils'

export interface SegmentDefinition {
  id: string
  name: string
  description: string
  criteria: SegmentCriteria[]
  priority: number
  activeFrom: number
  activeTo?: number
  targeting: SegmentTargeting
  personalization: SegmentPersonalization
}

export interface SegmentCriteria {
  type: 'utm' | 'behavior' | 'engagement' | 'demographic' | 'temporal' | 'device' | 'conversion'
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between' | 'in' | 'not_in'
  field: string
  value: any
  weight: number
}

export interface SegmentTargeting {
  contentTypes: string[]
  campaigns: string[]
  channels: string[]
  messages: string[]
  offers: string[]
  priority: number
}

export interface SegmentPersonalization {
  recommendationAlgorithm: 'collaborative' | 'content_based' | 'hybrid' | 'popular'
  contentFilter: string[]
  priceAdjustment: number
  urgencyLevel: 'low' | 'medium' | 'high'
  communicationStyle: 'formal' | 'casual' | 'enthusiastic' | 'educational'
  visualStyle: 'minimal' | 'rich' | 'traditional' | 'modern'
}

export interface UserSegmentMatch {
  userId?: string
  sessionId: string
  segments: Array<{
    segment: SegmentDefinition
    score: number
    matchedCriteria: SegmentCriteria[]
    confidence: number
  }>
  primarySegment: SegmentDefinition
  timestamp: number
}

export interface SegmentPerformance {
  segmentId: string
  users: number
  sessions: number
  conversions: number
  conversionRate: number
  averageValue: number
  engagementScore: number
  churnRate: number
  retentionRate: number
  lifetimeValue: number
}

export class BehavioralSegmentationEngine {
  private segments: SegmentDefinition[] = []
  private userSegments: Map<string, UserSegmentMatch> = new Map()

  constructor() {
    this.initializeDefaultSegments()
    this.loadUserSegments()
  }

  private initializeDefaultSegments(): void {
    this.segments = [
      // High-Intent Prospects
      {
        id: 'high_intent_prospects',
        name: 'High-Intent Prospects',
        description: 'Users showing strong purchase intent through behavior',
        criteria: [
          { type: 'engagement', operator: 'greater_than', field: 'intentScore', value: 0.7, weight: 0.4 },
          { type: 'behavior', operator: 'greater_than', field: 'timeOnSite', value: 300000, weight: 0.3 },
          { type: 'behavior', operator: 'greater_than', field: 'pageViews', value: 5, weight: 0.2 },
          { type: 'behavior', operator: 'contains', field: 'actions', value: 'cta_click', weight: 0.1 }
        ],
        priority: 1,
        activeFrom: Date.now(),
        targeting: {
          contentTypes: ['premium_courses', 'live_sessions', 'masterclasses'],
          campaigns: ['conversion_focused', 'limited_time_offer'],
          channels: ['email', 'retargeting', 'phone'],
          messages: ['urgency', 'value_proposition', 'social_proof'],
          offers: ['discount_20', 'free_consultation', 'money_back_guarantee'],
          priority: 10
        },
        personalization: {
          recommendationAlgorithm: 'hybrid',
          contentFilter: ['advanced', 'premium'],
          priceAdjustment: 0.8,
          urgencyLevel: 'high',
          communicationStyle: 'enthusiastic',
          visualStyle: 'rich'
        }
      },

      // Paid Traffic First-Time Visitors
      {
        id: 'paid_first_visitors',
        name: 'Paid First-Time Visitors',
        description: 'New users from paid advertising campaigns',
        criteria: [
          { type: 'utm', operator: 'in', field: 'trafficType', value: ['paid'], weight: 0.4 },
          { type: 'behavior', operator: 'equals', field: 'visitCount', value: 1, weight: 0.3 },
          { type: 'temporal', operator: 'less_than', field: 'sessionAge', value: 3600000, weight: 0.3 }
        ],
        priority: 2,
        activeFrom: Date.now(),
        targeting: {
          contentTypes: ['intro_courses', 'free_content', 'webinars'],
          campaigns: ['welcome_series', 'nurture_sequence'],
          channels: ['email', 'on_site_popup', 'retargeting'],
          messages: ['welcome', 'value_introduction', 'trust_building'],
          offers: ['free_trial', 'welcome_discount', 'free_ebook'],
          priority: 8
        },
        personalization: {
          recommendationAlgorithm: 'popular',
          contentFilter: ['beginner', 'popular'],
          priceAdjustment: 0.9,
          urgencyLevel: 'medium',
          communicationStyle: 'educational',
          visualStyle: 'modern'
        }
      },

      // Social Media Browsers
      {
        id: 'social_browsers',
        name: 'Social Media Browsers',
        description: 'Users from social media platforms with browsing behavior',
        criteria: [
          { type: 'utm', operator: 'in', field: 'trafficType', value: ['social'], weight: 0.4 },
          { type: 'engagement', operator: 'less_than', field: 'engagementLevel', value: 0.5, weight: 0.3 },
          { type: 'behavior', operator: 'less_than', field: 'timeOnSite', value: 120000, weight: 0.3 }
        ],
        priority: 3,
        activeFrom: Date.now(),
        targeting: {
          contentTypes: ['viral_content', 'bite_sized_learning', 'inspirational'],
          campaigns: ['social_engagement', 'viral_marketing'],
          channels: ['social_retargeting', 'influencer_content'],
          messages: ['inspiring', 'community_focused', 'shareable'],
          offers: ['social_discount', 'refer_friend', 'social_proof'],
          priority: 6
        },
        personalization: {
          recommendationAlgorithm: 'content_based',
          contentFilter: ['trending', 'social_friendly'],
          priceAdjustment: 1.0,
          urgencyLevel: 'low',
          communicationStyle: 'casual',
          visualStyle: 'minimal'
        }
      },

      // Email Subscribers
      {
        id: 'email_subscribers',
        name: 'Email Subscribers',
        description: 'Users coming from email campaigns',
        criteria: [
          { type: 'utm', operator: 'in', field: 'trafficType', value: ['email'], weight: 0.4 },
          { type: 'utm', operator: 'contains', field: 'utm_source', value: 'email', weight: 0.3 },
          { type: 'behavior', operator: 'greater_than', field: 'engagementScore', value: 0.4, weight: 0.3 }
        ],
        priority: 4,
        activeFrom: Date.now(),
        targeting: {
          contentTypes: ['featured_courses', 'newsletter_content', 'exclusive_offers'],
          campaigns: ['email_nurture', 'loyalty_program'],
          channels: ['email', 'personalized_landing'],
          messages: ['personalized', 'exclusive', 'value_driven'],
          offers: ['subscriber_discount', 'early_access', 'exclusive_content'],
          priority: 7
        },
        personalization: {
          recommendationAlgorithm: 'hybrid',
          contentFilter: ['subscriber_exclusive'],
          priceAdjustment: 0.85,
          urgencyLevel: 'medium',
          communicationStyle: 'formal',
          visualStyle: 'traditional'
        }
      },

      // Mobile Users
      {
        id: 'mobile_users',
        name: 'Mobile-First Users',
        description: 'Users primarily browsing on mobile devices',
        criteria: [
          { type: 'device', operator: 'equals', field: 'deviceType', value: 'mobile', weight: 0.4 },
          { type: 'behavior', operator: 'greater_than', field: 'mobileSessionRatio', value: 0.8, weight: 0.3 },
          { type: 'engagement', operator: 'greater_than', field: 'scrollDepth', value: 60, weight: 0.3 }
        ],
        priority: 5,
        activeFrom: Date.now(),
        targeting: {
          contentTypes: ['mobile_optimized', 'short_form', 'audio_content'],
          campaigns: ['mobile_first', 'app_promotion'],
          channels: ['push_notification', 'sms', 'mobile_banner'],
          messages: ['mobile_friendly', 'quick_access', 'on_the_go'],
          offers: ['mobile_discount', 'app_exclusive', 'quick_enroll'],
          priority: 5
        },
        personalization: {
          recommendationAlgorithm: 'collaborative',
          contentFilter: ['mobile_friendly'],
          priceAdjustment: 1.0,
          urgencyLevel: 'medium',
          communicationStyle: 'casual',
          visualStyle: 'minimal'
        }
      },

      // Return Visitors
      {
        id: 'return_visitors',
        name: 'Return Visitors',
        description: 'Users who have visited before but haven\'t converted',
        criteria: [
          { type: 'behavior', operator: 'greater_than', field: 'visitCount', value: 2, weight: 0.4 },
          { type: 'conversion', operator: 'equals', field: 'hasConverted', value: false, weight: 0.3 },
          { type: 'engagement', operator: 'greater_than', field: 'totalTimeOnSite', value: 600000, weight: 0.3 }
        ],
        priority: 6,
        activeFrom: Date.now(),
        targeting: {
          contentTypes: ['advanced_content', 'case_studies', 'testimonials'],
          campaigns: ['retargeting', 'nurture_advanced'],
          channels: ['retargeting_display', 'email', 'social_retargeting'],
          messages: ['objection_handling', 'success_stories', 'limited_time'],
          offers: ['return_visitor_discount', 'consultation', 'trial_extension'],
          priority: 7
        },
        personalization: {
          recommendationAlgorithm: 'content_based',
          contentFilter: ['returning_user_content'],
          priceAdjustment: 0.9,
          urgencyLevel: 'high',
          communicationStyle: 'formal',
          visualStyle: 'rich'
        }
      },

      // Course Browsers
      {
        id: 'course_browsers',
        name: 'Course Browsers',
        description: 'Users actively browsing course catalog',
        criteria: [
          { type: 'behavior', operator: 'contains', field: 'visitedPages', value: '/courses/', weight: 0.4 },
          { type: 'behavior', operator: 'greater_than', field: 'coursePageViews', value: 3, weight: 0.3 },
          { type: 'engagement', operator: 'greater_than', field: 'timeOnCoursePages', value: 180000, weight: 0.3 }
        ],
        priority: 7,
        activeFrom: Date.now(),
        targeting: {
          contentTypes: ['course_previews', 'instructor_interviews', 'curriculum_details'],
          campaigns: ['course_promotion', 'enrollment_push'],
          channels: ['course_page_popup', 'email', 'retargeting'],
          messages: ['course_benefits', 'instructor_credentials', 'student_success'],
          offers: ['course_discount', 'bundle_deal', 'payment_plan'],
          priority: 8
        },
        personalization: {
          recommendationAlgorithm: 'collaborative',
          contentFilter: ['course_related'],
          priceAdjustment: 0.85,
          urgencyLevel: 'medium',
          communicationStyle: 'educational',
          visualStyle: 'rich'
        }
      },

      // Low Engagement Visitors
      {
        id: 'low_engagement',
        name: 'Low Engagement Visitors',
        description: 'Users with minimal interaction and short session duration',
        criteria: [
          { type: 'engagement', operator: 'less_than', field: 'engagementScore', value: 0.3, weight: 0.4 },
          { type: 'behavior', operator: 'less_than', field: 'timeOnSite', value: 60000, weight: 0.3 },
          { type: 'behavior', operator: 'equals', field: 'bounceRate', value: true, weight: 0.3 }
        ],
        priority: 8,
        activeFrom: Date.now(),
        targeting: {
          contentTypes: ['engaging_content', 'quick_wins', 'curiosity_driven'],
          campaigns: ['re_engagement', 'value_demonstration'],
          channels: ['exit_intent_popup', 'retargeting_display'],
          messages: ['attention_grabbing', 'quick_value', 'curiosity_gap'],
          offers: ['free_resource', 'quiz', 'interactive_content'],
          priority: 3
        },
        personalization: {
          recommendationAlgorithm: 'popular',
          contentFilter: ['engaging', 'quick_value'],
          priceAdjustment: 1.1,
          urgencyLevel: 'low',
          communicationStyle: 'enthusiastic',
          visualStyle: 'minimal'
        }
      }
    ]
  }

  private loadUserSegments(): void {
    const stored = storage.get('user_segments')
    if (stored) {
      this.userSegments = new Map(Object.entries(stored))
    }
  }

  private saveUserSegments(): void {
    const data = Object.fromEntries(this.userSegments)
    storage.set('user_segments', data)
  }

  segmentUser(userId?: string, sessionId?: string): UserSegmentMatch {
    const utmSession = utmTracker?.getSession()
    const behaviorPattern = journeyTracker?.getUserBehaviorPattern()
    const journeySteps = journeyTracker?.getJourneySteps() || []
    
    const currentSessionId = sessionId || utmSession?.id || 'unknown'
    
    // Calculate segment matches
    const segmentMatches = this.segments.map(segment => {
      const score = this.calculateSegmentScore(segment, utmSession, behaviorPattern, journeySteps)
      const matchedCriteria = this.getMatchedCriteria(segment, utmSession, behaviorPattern, journeySteps)
      
      return {
        segment,
        score,
        matchedCriteria,
        confidence: this.calculateConfidence(score, matchedCriteria.length, segment.criteria.length)
      }
    }).filter(match => match.score > 0.3) // Only include segments with reasonable match
    
    // Sort by score and priority
    segmentMatches.sort((a, b) => {
      if (Math.abs(a.score - b.score) < 0.1) {
        return a.segment.priority - b.segment.priority
      }
      return b.score - a.score
    })

    const userSegmentMatch: UserSegmentMatch = {
      userId,
      sessionId: currentSessionId,
      segments: segmentMatches,
      primarySegment: segmentMatches[0]?.segment || this.getDefaultSegment(),
      timestamp: Date.now()
    }

    this.userSegments.set(currentSessionId, userSegmentMatch)
    this.saveUserSegments()

    return userSegmentMatch
  }

  private calculateSegmentScore(
    segment: SegmentDefinition,
    utmSession?: UTMSession | null,
    behaviorPattern?: UserBehaviorPattern | null,
    journeySteps?: JourneyStep[]
  ): number {
    let totalScore = 0
    let totalWeight = 0

    for (const criteria of segment.criteria) {
      const score = this.evaluateCriteria(criteria, utmSession, behaviorPattern, journeySteps)
      totalScore += score * criteria.weight
      totalWeight += criteria.weight
    }

    return totalWeight > 0 ? totalScore / totalWeight : 0
  }

  private evaluateCriteria(
    criteria: SegmentCriteria,
    utmSession?: UTMSession | null,
    behaviorPattern?: UserBehaviorPattern | null,
    journeySteps?: JourneyStep[]
  ): number {
    const value = this.extractValue(criteria, utmSession, behaviorPattern, journeySteps)
    
    if (value === null || value === undefined) return 0

    switch (criteria.operator) {
      case 'equals':
        return value === criteria.value ? 1 : 0
      
      case 'contains':
        if (Array.isArray(value)) {
          return value.some(v => String(v).toLowerCase().includes(String(criteria.value).toLowerCase())) ? 1 : 0
        }
        return String(value).toLowerCase().includes(String(criteria.value).toLowerCase()) ? 1 : 0
      
      case 'greater_than':
        return Number(value) > Number(criteria.value) ? 1 : 0
      
      case 'less_than':
        return Number(value) < Number(criteria.value) ? 1 : 0
      
      case 'between':
        const [min, max] = criteria.value
        const numValue = Number(value)
        return numValue >= min && numValue <= max ? 1 : 0
      
      case 'in':
        return criteria.value.includes(value) ? 1 : 0
      
      case 'not_in':
        return !criteria.value.includes(value) ? 1 : 0
      
      default:
        return 0
    }
  }

  private extractValue(
    criteria: SegmentCriteria,
    utmSession?: UTMSession | null,
    behaviorPattern?: UserBehaviorPattern | null,
    journeySteps?: JourneyStep[]
  ): any {
    switch (criteria.type) {
      case 'utm':
        if (!utmSession) return null
        switch (criteria.field) {
          case 'trafficType':
            return utmTracker?.getTrafficSource()?.type
          case 'utm_source':
            return utmSession.latestUTM.utm_source
          case 'utm_medium':
            return utmSession.latestUTM.utm_medium
          case 'utm_campaign':
            return utmSession.latestUTM.utm_campaign
          default:
            return utmSession.latestUTM[criteria.field as keyof typeof utmSession.latestUTM]
        }
      
      case 'behavior':
        if (!behaviorPattern && !utmSession) return null
        switch (criteria.field) {
          case 'visitCount':
            return utmSession?.visitCount
          case 'timeOnSite':
            return behaviorPattern?.timeOnSite
          case 'pageViews':
            return behaviorPattern?.pageViews
          case 'sessionAge':
            return utmSession ? Date.now() - utmSession.firstVisit : null
          case 'bounceRate':
            return (behaviorPattern?.pageViews || 0) <= 1
          case 'visitedPages':
            return journeySteps?.map(s => s.page) || []
          case 'coursePageViews':
            return journeySteps?.filter(s => s.page.includes('/courses/')).length || 0
          case 'timeOnCoursePages':
            return journeySteps?.filter(s => s.page.includes('/courses/'))
              .reduce((sum, s) => sum + (s.duration || 0), 0) || 0
          case 'actions':
            return journeySteps?.map(s => s.action) || []
          case 'mobileSessionRatio':
            return utmSession?.device.type === 'mobile' ? 1 : 0
          case 'totalTimeOnSite':
            return utmSession ? utmSession.lastVisit - utmSession.firstVisit : 0
          default:
            return null
        }
      
      case 'engagement':
        if (!behaviorPattern) return null
        switch (criteria.field) {
          case 'engagementLevel':
            const level = behaviorPattern.engagementLevel
            return level === 'very_high' ? 1 : level === 'high' ? 0.8 : level === 'medium' ? 0.5 : 0.2
          case 'intentScore':
            return behaviorPattern.intentScore
          case 'engagementScore':
            const engLevel = behaviorPattern.engagementLevel
            return engLevel === 'very_high' ? 0.95 : engLevel === 'high' ? 0.8 : engLevel === 'medium' ? 0.5 : 0.2
          case 'scrollDepth':
            return journeyTracker?.getCurrentPageMetrics()?.maxScrollDepth || 0
          default:
            return null
        }
      
      case 'device':
        if (!utmSession) return null
        switch (criteria.field) {
          case 'deviceType':
            return utmSession.device.type
          case 'browser':
            return utmSession.device.browser
          case 'os':
            return utmSession.device.os
          default:
            return null
        }
      
      case 'conversion':
        const conversions = analyticsStorage.getConversions()
        const sessionConversions = conversions.filter(c => c.sessionId === utmSession?.id)
        switch (criteria.field) {
          case 'hasConverted':
            return sessionConversions.length > 0
          case 'conversionCount':
            return sessionConversions.length
          case 'conversionValue':
            return sessionConversions.reduce((sum, c) => sum + (c.value || 0), 0)
          default:
            return null
        }
      
      case 'temporal':
        switch (criteria.field) {
          case 'sessionAge':
            return utmSession ? Date.now() - utmSession.firstVisit : null
          case 'timeOfDay':
            return new Date().getHours()
          case 'dayOfWeek':
            return new Date().getDay()
          default:
            return null
        }
      
      default:
        return null
    }
  }

  private getMatchedCriteria(
    segment: SegmentDefinition,
    utmSession?: UTMSession | null,
    behaviorPattern?: UserBehaviorPattern | null,
    journeySteps?: JourneyStep[]
  ): SegmentCriteria[] {
    return segment.criteria.filter(criteria => 
      this.evaluateCriteria(criteria, utmSession, behaviorPattern, journeySteps) > 0
    )
  }

  private calculateConfidence(score: number, matchedCount: number, totalCount: number): number {
    const matchRatio = totalCount > 0 ? matchedCount / totalCount : 0
    return (score * 0.7) + (matchRatio * 0.3)
  }

  private getDefaultSegment(): SegmentDefinition {
    return this.segments.find(s => s.id === 'low_engagement') || this.segments[0]
  }

  getUserSegment(sessionId: string): UserSegmentMatch | null {
    return this.userSegments.get(sessionId) || null
  }

  getAllUserSegments(): UserSegmentMatch[] {
    return Array.from(this.userSegments.values())
  }

  getSegmentPerformance(segmentId: string): SegmentPerformance {
    const userSegments = this.getAllUserSegments()
    const segmentUsers = userSegments.filter(us => us.primarySegment.id === segmentId)
    const conversions = analyticsStorage.getConversions()
    const segmentConversions = conversions.filter(c => 
      segmentUsers.some(us => us.sessionId === c.sessionId)
    )

    return {
      segmentId,
      users: segmentUsers.length,
      sessions: segmentUsers.length, // Assuming 1 session per user for now
      conversions: segmentConversions.length,
      conversionRate: segmentUsers.length > 0 ? segmentConversions.length / segmentUsers.length : 0,
      averageValue: segmentConversions.length > 0 ? 
        segmentConversions.reduce((sum, c) => sum + (c.value || 0), 0) / segmentConversions.length : 0,
      engagementScore: this.calculateAverageEngagement(segmentUsers),
      churnRate: 0, // Would need historical data
      retentionRate: 0, // Would need historical data
      lifetimeValue: 0 // Would need historical data
    }
  }

  private calculateAverageEngagement(userSegments: UserSegmentMatch[]): number {
    if (userSegments.length === 0) return 0
    
    // This is a simplified calculation - in practice you'd want more sophisticated metrics
    return userSegments.reduce((sum, us) => {
      const primaryScore = us.segments.find(s => s.segment.id === us.primarySegment.id)?.score || 0
      return sum + primaryScore
    }, 0) / userSegments.length
  }

  addCustomSegment(segment: SegmentDefinition): void {
    this.segments.push(segment)
  }

  removeSegment(segmentId: string): void {
    this.segments = this.segments.filter(s => s.id !== segmentId)
  }

  updateSegment(segmentId: string, updates: Partial<SegmentDefinition>): void {
    const index = this.segments.findIndex(s => s.id === segmentId)
    if (index >= 0) {
      this.segments[index] = { ...this.segments[index], ...updates }
    }
  }

  getSegmentInsights(): any {
    const allSegments = this.getAllUserSegments()
    const segmentDistribution: Record<string, number> = {}
    
    allSegments.forEach(us => {
      const segmentId = us.primarySegment.id
      segmentDistribution[segmentId] = (segmentDistribution[segmentId] || 0) + 1
    })

    return {
      totalUsers: allSegments.length,
      segmentDistribution,
      topPerformingSegments: Object.entries(segmentDistribution)
        .map(([id, count]) => ({ id, count, ...this.getSegmentPerformance(id) }))
        .sort((a, b) => b.conversionRate - a.conversionRate)
        .slice(0, 5),
      segmentPerformance: this.segments.map(s => this.getSegmentPerformance(s.id))
    }
  }
}

// Singleton instance
export const segmentationEngine = new BehavioralSegmentationEngine()

// Utility functions
export function segmentCurrentUser(): UserSegmentMatch {
  return segmentationEngine.segmentUser()
}

export function getCurrentUserSegment(): UserSegmentMatch | null {
  const sessionId = utmTracker?.getSession().id
  return sessionId ? segmentationEngine.getUserSegment(sessionId) : null
}

export function getPersonalizationForUser(): SegmentPersonalization | null {
  const userSegment = getCurrentUserSegment()
  return userSegment?.primarySegment.personalization || null
}

export function getTargetingForUser(): SegmentTargeting | null {
  const userSegment = getCurrentUserSegment()
  return userSegment?.primarySegment.targeting || null
}

export function isUserInSegment(segmentId: string): boolean {
  const userSegment = getCurrentUserSegment()
  return userSegment?.segments.some(s => s.segment.id === segmentId) || false
}

export function getUserSegmentScore(segmentId: string): number {
  const userSegment = getCurrentUserSegment()
  const segment = userSegment?.segments.find(s => s.segment.id === segmentId)
  return segment?.score || 0
}
