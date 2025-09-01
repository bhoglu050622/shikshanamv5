import { UTMParameters, TrafficSource, utmTracker } from './utmTracking'
import { JourneyStep, journeyTracker } from './journeyTracking'
import { analyticsStorage, ConversionEvent, AttributionData } from './analyticsStorage'
import { segmentationEngine } from './behavioralSegmentation'

export interface ConversionGoal {
  id: string
  name: string
  description: string
  type: 'macro' | 'micro'
  value: number
  currency: string
  category: string
  priority: number
  trackingMethod: 'event' | 'page' | 'custom'
  conditions: ConversionCondition[]
  attribution: AttributionSettings
  active: boolean
}

export interface ConversionCondition {
  type: 'page_visit' | 'element_click' | 'form_submit' | 'time_spent' | 'scroll_depth' | 'custom_event'
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than'
  value: string | number
  weight: number
}

export interface AttributionSettings {
  model: 'first-touch' | 'last-touch' | 'linear' | 'time-decay' | 'position-based' | 'custom'
  lookbackWindow: number // in days
  customWeights?: { [position: string]: number }
  crossDevice: boolean
}

export interface ConversionFunnel {
  id: string
  name: string
  steps: FunnelStep[]
  conversionGoal: string
  timeWindow: number // in milliseconds
}

export interface FunnelStep {
  id: string
  name: string
  description: string
  conditions: ConversionCondition[]
  isRequired: boolean
  order: number
}

export interface FunnelAnalysis {
  funnelId: string
  totalUsers: number
  stepCompletions: Array<{
    stepId: string
    users: number
    completionRate: number
    dropOffRate: number
    averageTime: number
  }>
  conversionRate: number
  averageTimeToConvert: number
  dropOffPoints: string[]
  topConvertingPaths: Array<{
    path: string[]
    users: number
    conversionRate: number
  }>
}

export interface ConversionAttribution {
  conversionId: string
  touchpoints: TouchPoint[]
  attributedValues: { [model: string]: number }
  primaryAttribution: TouchPoint
  assistingTouchpoints: TouchPoint[]
  timeToConvert: number
  pathLength: number
}

export interface TouchPoint {
  id: string
  timestamp: number
  source: string
  medium: string
  campaign?: string
  content?: string
  term?: string
  position: number
  timeFromPrevious?: number
  value: number
  attribution: { [model: string]: number }
}

export interface ConversionCohort {
  cohortId: string
  startDate: number
  endDate: number
  users: string[]
  conversions: ConversionEvent[]
  retentionRates: { [period: string]: number }
  lifetimeValue: number
  segments: string[]
}

export class ConversionTracker {
  private goals: ConversionGoal[] = []
  private funnels: ConversionFunnel[] = []
  private activeConversions: Map<string, Partial<ConversionEvent>> = new Map()
  private touchpoints: Map<string, TouchPoint[]> = new Map() // sessionId -> touchpoints

  constructor() {
    this.initializeDefaultGoals()
    this.initializeDefaultFunnels()
    this.setupConversionTracking()
  }

  private initializeDefaultGoals(): void {
    this.goals = [
      // Macro Conversions
      {
        id: 'course_enrollment',
        name: 'Course Enrollment',
        description: 'User enrolls in a paid course',
        type: 'macro',
        value: 2000,
        currency: 'INR',
        category: 'revenue',
        priority: 1,
        trackingMethod: 'event',
        conditions: [
          { type: 'custom_event', operator: 'equals', value: 'course_enrolled', weight: 1.0 }
        ],
        attribution: {
          model: 'position-based',
          lookbackWindow: 30,
          customWeights: { first: 0.4, last: 0.4, middle: 0.2 },
          crossDevice: true
        },
        active: true
      },
      {
        id: 'premium_membership',
        name: 'Premium Membership',
        description: 'User upgrades to premium membership',
        type: 'macro',
        value: 5000,
        currency: 'INR',
        category: 'revenue',
        priority: 1,
        trackingMethod: 'event',
        conditions: [
          { type: 'custom_event', operator: 'equals', value: 'premium_upgrade', weight: 1.0 }
        ],
        attribution: {
          model: 'first-touch',
          lookbackWindow: 60,
          crossDevice: true
        },
        active: true
      },

      // Micro Conversions
      {
        id: 'newsletter_signup',
        name: 'Newsletter Signup',
        description: 'User subscribes to newsletter',
        type: 'micro',
        value: 50,
        currency: 'INR',
        category: 'lead',
        priority: 2,
        trackingMethod: 'event',
        conditions: [
          { type: 'form_submit', operator: 'contains', value: 'newsletter', weight: 1.0 }
        ],
        attribution: {
          model: 'last-touch',
          lookbackWindow: 7,
          crossDevice: false
        },
        active: true
      },
      {
        id: 'free_resource_download',
        name: 'Free Resource Download',
        description: 'User downloads free resource',
        type: 'micro',
        value: 25,
        currency: 'INR',
        category: 'engagement',
        priority: 3,
        trackingMethod: 'event',
        conditions: [
          { type: 'custom_event', operator: 'equals', value: 'resource_downloaded', weight: 1.0 }
        ],
        attribution: {
          model: 'last-touch',
          lookbackWindow: 3,
          crossDevice: false
        },
        active: true
      },
      {
        id: 'course_preview_watched',
        name: 'Course Preview Watched',
        description: 'User watches complete course preview',
        type: 'micro',
        value: 15,
        currency: 'INR',
        category: 'engagement',
        priority: 4,
        trackingMethod: 'event',
        conditions: [
          { type: 'custom_event', operator: 'equals', value: 'video_complete', weight: 0.7 },
          { type: 'page_visit', operator: 'contains', value: '/courses/', weight: 0.3 }
        ],
        attribution: {
          model: 'linear',
          lookbackWindow: 1,
          crossDevice: false
        },
        active: true
      },
      {
        id: 'high_engagement_session',
        name: 'High Engagement Session',
        description: 'User has highly engaged session',
        type: 'micro',
        value: 10,
        currency: 'INR',
        category: 'engagement',
        priority: 5,
        trackingMethod: 'custom',
        conditions: [
          { type: 'time_spent', operator: 'greater_than', value: 300000, weight: 0.4 }, // 5 minutes
          { type: 'scroll_depth', operator: 'greater_than', value: 75, weight: 0.3 },
          { type: 'custom_event', operator: 'equals', value: 'cta_click', weight: 0.3 }
        ],
        attribution: {
          model: 'last-touch',
          lookbackWindow: 1,
          crossDevice: false
        },
        active: true
      }
    ]
  }

  private initializeDefaultFunnels(): void {
    this.funnels = [
      {
        id: 'course_enrollment_funnel',
        name: 'Course Enrollment Funnel',
        conversionGoal: 'course_enrollment',
        timeWindow: 30 * 24 * 60 * 60 * 1000, // 30 days
        steps: [
          {
            id: 'landing_page_visit',
            name: 'Landing Page Visit',
            description: 'User visits the website',
            isRequired: true,
            order: 1,
            conditions: [
              { type: 'page_visit', operator: 'equals', value: '/', weight: 1.0 }
            ]
          },
          {
            id: 'course_browse',
            name: 'Course Browsing',
            description: 'User browses course catalog',
            isRequired: false,
            order: 2,
            conditions: [
              { type: 'page_visit', operator: 'contains', value: '/courses', weight: 1.0 }
            ]
          },
          {
            id: 'course_detail_view',
            name: 'Course Detail View',
            description: 'User views specific course details',
            isRequired: true,
            order: 3,
            conditions: [
              { type: 'page_visit', operator: 'contains', value: '/courses/', weight: 0.8 },
              { type: 'time_spent', operator: 'greater_than', value: 60000, weight: 0.2 } // 1 minute
            ]
          },
          {
            id: 'enrollment_intent',
            name: 'Enrollment Intent',
            description: 'User shows intent to enroll',
            isRequired: false,
            order: 4,
            conditions: [
              { type: 'element_click', operator: 'contains', value: 'enroll', weight: 1.0 }
            ]
          },
          {
            id: 'enrollment_complete',
            name: 'Enrollment Complete',
            description: 'User completes enrollment',
            isRequired: true,
            order: 5,
            conditions: [
              { type: 'custom_event', operator: 'equals', value: 'course_enrolled', weight: 1.0 }
            ]
          }
        ]
      },
      {
        id: 'lead_generation_funnel',
        name: 'Lead Generation Funnel',
        conversionGoal: 'newsletter_signup',
        timeWindow: 7 * 24 * 60 * 60 * 1000, // 7 days
        steps: [
          {
            id: 'website_visit',
            name: 'Website Visit',
            description: 'User visits any page',
            isRequired: true,
            order: 1,
            conditions: [
              { type: 'page_visit', operator: 'contains', value: '/', weight: 1.0 }
            ]
          },
          {
            id: 'content_engagement',
            name: 'Content Engagement',
            description: 'User engages with content',
            isRequired: false,
            order: 2,
            conditions: [
              { type: 'scroll_depth', operator: 'greater_than', value: 50, weight: 0.5 },
              { type: 'time_spent', operator: 'greater_than', value: 120000, weight: 0.5 } // 2 minutes
            ]
          },
          {
            id: 'newsletter_intent',
            name: 'Newsletter Interest',
            description: 'User shows interest in newsletter',
            isRequired: false,
            order: 3,
            conditions: [
              { type: 'element_click', operator: 'contains', value: 'newsletter', weight: 1.0 }
            ]
          },
          {
            id: 'form_completion',
            name: 'Form Completion',
            description: 'User completes newsletter signup',
            isRequired: true,
            order: 4,
            conditions: [
              { type: 'form_submit', operator: 'contains', value: 'newsletter', weight: 1.0 }
            ]
          }
        ]
      }
    ]
  }

  private setupConversionTracking(): void {
    // Track touchpoints from UTM and journey data
    this.trackTouchpoint()
    
    // Set up periodic conversion checking
    setInterval(() => {
      this.checkForConversions()
    }, 10000) // Check every 10 seconds

    // Track page visibility for session endings
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.processSessionConversions()
        }
      })
    }

    // Track before page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.processSessionConversions()
      })
    }
  }

  private trackTouchpoint(): void {
    const utmSession = utmTracker?.getSession()
    const trafficSource = utmTracker?.getTrafficSource()
    
    if (!utmSession || !trafficSource) return

    const sessionId = utmSession.id
    const touchpoints = this.touchpoints.get(sessionId) || []
    
    const currentTouchpoint: TouchPoint = {
      id: `tp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: Date.now(),
      source: trafficSource.source,
      medium: trafficSource.medium,
      campaign: utmSession.latestUTM.utm_campaign,
      content: utmSession.latestUTM.utm_content,
      term: utmSession.latestUTM.utm_term,
      position: touchpoints.length + 1,
      timeFromPrevious: touchpoints.length > 0 ? 
        Date.now() - touchpoints[touchpoints.length - 1].timestamp : 0,
      value: 0, // Will be calculated later
      attribution: {}
    }

    touchpoints.push(currentTouchpoint)
    this.touchpoints.set(sessionId, touchpoints)
  }

  trackCustomConversion(
    goalId: string,
    value?: number,
    customData?: Record<string, any>
  ): void {
    const goal = this.goals.find(g => g.id === goalId)
    if (!goal || !goal.active) return

    const utmSession = utmTracker?.getSession()
    const userSegment = segmentationEngine.segmentUser()
    const journeySteps = journeyTracker?.getJourneySteps() || []

    const conversion: ConversionEvent = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      sessionId: utmSession?.id || 'unknown',
      userId: customData?.userId,
      type: goalId,
      value: value || goal.value,
      currency: goal.currency,
      timestamp: Date.now(),
      utm: utmSession?.originalUTM || {},
      trafficSource: utmTracker?.getTrafficSource(),
      journeySteps: journeySteps.length,
      timeToConvert: utmSession ? Date.now() - utmSession.firstVisit : 0,
      touchpoints: this.getTouchpointIds(utmSession?.id || ''),
      attribution: this.calculateAttribution(goalId, utmSession?.id || '')
    }

    analyticsStorage.saveConversion(conversion)
    this.notifyConversion(conversion)
  }

  private checkForConversions(): void {
    const journeySteps = journeyTracker?.getJourneySteps() || []
    const currentMetrics = journeyTracker?.getCurrentPageMetrics()
    
    if (!currentMetrics) return

    // Check each active goal
    this.goals.filter(g => g.active).forEach(goal => {
      if (this.evaluateGoalConditions(goal, journeySteps, currentMetrics)) {
        this.trackCustomConversion(goal.id)
      }
    })
  }

  private evaluateGoalConditions(
    goal: ConversionGoal,
    journeySteps: JourneyStep[],
    currentMetrics: any
  ): boolean {
    let totalScore = 0
    let totalWeight = 0

    for (const condition of goal.conditions) {
      const score = this.evaluateCondition(condition, journeySteps, currentMetrics)
      totalScore += score * condition.weight
      totalWeight += condition.weight
    }

    const finalScore = totalWeight > 0 ? totalScore / totalWeight : 0
    return finalScore >= 0.8 // 80% threshold for conversion
  }

  private evaluateCondition(
    condition: ConversionCondition,
    journeySteps: JourneyStep[],
    currentMetrics: any
  ): number {
    switch (condition.type) {
      case 'page_visit':
        const hasVisited = journeySteps.some(step => {
          switch (condition.operator) {
            case 'equals':
              return step.page === condition.value
            case 'contains':
              return step.page.includes(String(condition.value))
            default:
              return false
          }
        })
        return hasVisited ? 1 : 0

      case 'element_click':
        const hasClicked = journeySteps.some(step => {
          if (!step.action.includes('click')) return false
          switch (condition.operator) {
            case 'contains':
              return step.element?.includes(String(condition.value)) || false
            case 'equals':
              return step.element === condition.value
            default:
              return false
          }
        })
        return hasClicked ? 1 : 0

      case 'form_submit':
        const hasSubmitted = journeySteps.some(step => {
          if (!step.action.includes('form_submit')) return false
          switch (condition.operator) {
            case 'contains':
              return step.element?.includes(String(condition.value)) || false
            default:
              return false
          }
        })
        return hasSubmitted ? 1 : 0

      case 'time_spent':
        const timeSpent = currentMetrics.duration || 0
        switch (condition.operator) {
          case 'greater_than':
            return timeSpent > Number(condition.value) ? 1 : 0
          case 'less_than':
            return timeSpent < Number(condition.value) ? 1 : 0
          default:
            return 0
        }

      case 'scroll_depth':
        const scrollDepth = currentMetrics.maxScrollDepth || 0
        switch (condition.operator) {
          case 'greater_than':
            return scrollDepth > Number(condition.value) ? 1 : 0
          default:
            return 0
        }

      case 'custom_event':
        const hasEvent = journeySteps.some(step => {
          switch (condition.operator) {
            case 'equals':
              return step.action === condition.value
            case 'contains':
              return step.action.includes(String(condition.value))
            default:
              return false
          }
        })
        return hasEvent ? 1 : 0

      default:
        return 0
    }
  }

  private calculateAttribution(goalId: string, sessionId: string): AttributionData {
    const goal = this.goals.find(g => g.id === goalId)
    const touchpoints = this.touchpoints.get(sessionId) || []
    
    if (!goal || touchpoints.length === 0) {
      return {
        firstTouch: { source: 'direct', medium: 'none', timestamp: Date.now() },
        lastTouch: { source: 'direct', medium: 'none', timestamp: Date.now() },
        allTouchpoints: [],
        attributionModel: 'last-touch',
        attributedValue: goal?.value || 0
      }
    }

    const first = touchpoints[0]
    const last = touchpoints[touchpoints.length - 1]
    
    // Calculate attribution values based on model
    const attributedValues = this.calculateAttributionValues(touchpoints, goal)
    
    return {
      firstTouch: {
        source: first.source,
        medium: first.medium,
        campaign: first.campaign,
        timestamp: first.timestamp
      },
      lastTouch: {
        source: last.source,
        medium: last.medium,
        campaign: last.campaign,
        timestamp: last.timestamp
      },
      allTouchpoints: touchpoints.map((tp, index) => ({
        source: tp.source,
        medium: tp.medium,
        campaign: tp.campaign,
        timestamp: tp.timestamp,
        weight: attributedValues[index] || 0
      })),
      attributionModel: goal.attribution.model,
      attributedValue: goal.value
    }
  }

  private calculateAttributionValues(touchpoints: TouchPoint[], goal: ConversionGoal): number[] {
    const totalValue = goal.value
    const values = new Array(touchpoints.length).fill(0)
    
    switch (goal.attribution.model) {
      case 'first-touch':
        values[0] = totalValue
        break
        
      case 'last-touch':
        values[values.length - 1] = totalValue
        break
        
      case 'linear':
        const linearValue = totalValue / touchpoints.length
        values.fill(linearValue)
        break
        
      case 'time-decay':
        const halfLife = 7 * 24 * 60 * 60 * 1000 // 7 days
        let totalWeight = 0
        const weights = touchpoints.map(tp => {
          const age = Date.now() - tp.timestamp
          const weight = Math.exp(-age / halfLife)
          totalWeight += weight
          return weight
        })
        weights.forEach((weight, index) => {
          values[index] = (weight / totalWeight) * totalValue
        })
        break
        
      case 'position-based':
        const customWeights = goal.attribution.customWeights
        if (customWeights && touchpoints.length >= 2) {
          values[0] = totalValue * (customWeights.first || 0.4)
          values[values.length - 1] = totalValue * (customWeights.last || 0.4)
          const middleValue = totalValue * (customWeights.middle || 0.2)
          const middleCount = touchpoints.length - 2
          if (middleCount > 0) {
            const middleEach = middleValue / middleCount
            for (let i = 1; i < touchpoints.length - 1; i++) {
              values[i] = middleEach
            }
          }
        } else {
          values[values.length - 1] = totalValue // Fallback to last-touch
        }
        break
        
      default:
        values[values.length - 1] = totalValue
    }
    
    return values
  }

  private getTouchpointIds(sessionId: string): string[] {
    const touchpoints = this.touchpoints.get(sessionId) || []
    return touchpoints.map(tp => tp.id)
  }

  private processSessionConversions(): void {
    // Process any pending conversions before session ends
    this.checkForConversions()
  }

  private notifyConversion(conversion: ConversionEvent): void {
    // Send conversion data to analytics
    utmTracker?.trackConversion(conversion.type, conversion.value, conversion.currency)
    
    // Custom event for other systems to listen to
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('shikshanam:conversion', {
        detail: conversion
      }))
    }
  }

  // Funnel Analysis
  analyzeFunnel(funnelId: string): FunnelAnalysis {
    const funnel = this.funnels.find(f => f.id === funnelId)
    if (!funnel) throw new Error(`Funnel ${funnelId} not found`)

    const allSessions = analyticsStorage.getUTMSessions()
    const allJourneySteps = analyticsStorage.getJourneySteps()
    const conversions = analyticsStorage.getConversions()

    const funnelUsers = this.identifyFunnelUsers(funnel, allSessions, allJourneySteps)
    const stepCompletions = this.calculateStepCompletions(funnel, funnelUsers, allJourneySteps)
    
    return {
      funnelId,
      totalUsers: funnelUsers.length,
      stepCompletions,
      conversionRate: this.calculateFunnelConversionRate(funnel, funnelUsers, conversions),
      averageTimeToConvert: this.calculateAverageTimeToConvert(funnel, funnelUsers, conversions),
      dropOffPoints: this.identifyDropOffPoints(stepCompletions),
      topConvertingPaths: this.identifyTopConvertingPaths(funnel, funnelUsers, allJourneySteps)
    }
  }

  private identifyFunnelUsers(
    funnel: ConversionFunnel,
    sessions: any[],
    journeySteps: JourneyStep[]
  ): string[] {
    // Identify users who entered the funnel (completed first step)
    const firstStep = funnel.steps.find(s => s.order === 1)
    if (!firstStep) return []

    const users = new Set<string>()
    
    sessions.forEach(session => {
      const sessionSteps = journeySteps.filter(js => js.sessionId === session.id)
      if (this.userCompletedStep(firstStep, sessionSteps)) {
        users.add(session.id)
      }
    })

    return Array.from(users)
  }

  private userCompletedStep(step: FunnelStep, journeySteps: JourneyStep[]): boolean {
    // Check if user completed this funnel step
    return step.conditions.every(condition => {
      return this.evaluateCondition(condition, journeySteps, {})
    })
  }

  private calculateStepCompletions(
    funnel: ConversionFunnel,
    funnelUsers: string[],
    allJourneySteps: JourneyStep[]
  ): Array<{
    stepId: string
    users: number
    completionRate: number
    dropOffRate: number
    averageTime: number
  }> {
    const results = []
    let previousUsers = funnelUsers.length

    for (const step of funnel.steps.sort((a, b) => a.order - b.order)) {
      const completedUsers = funnelUsers.filter(userId => {
        const userSteps = allJourneySteps.filter(js => js.sessionId === userId)
        return this.userCompletedStep(step, userSteps)
      })

      const completionRate = previousUsers > 0 ? completedUsers.length / previousUsers : 0
      const dropOffRate = 1 - completionRate

      results.push({
        stepId: step.id,
        users: completedUsers.length,
        completionRate,
        dropOffRate,
        averageTime: this.calculateAverageStepTime(step, completedUsers, allJourneySteps)
      })

      previousUsers = completedUsers.length
    }

    return results
  }

  private calculateAverageStepTime(
    step: FunnelStep,
    users: string[],
    allJourneySteps: JourneyStep[]
  ): number {
    const times = users.map(userId => {
      const userSteps = allJourneySteps.filter(js => js.sessionId === userId)
      // Find when user completed this step
      // This is simplified - in practice you'd want more sophisticated time calculation
      return userSteps.find(js => this.stepMatchesJourneyStep(step, js))?.duration || 0
    }).filter(time => time > 0)

    return times.length > 0 ? times.reduce((sum, time) => sum + time, 0) / times.length : 0
  }

  private stepMatchesJourneyStep(step: FunnelStep, journeyStep: JourneyStep): boolean {
    // Simplified matching logic
    return step.conditions.some(condition => {
      switch (condition.type) {
        case 'page_visit':
          return journeyStep.page.includes(String(condition.value))
        case 'custom_event':
          return journeyStep.action === condition.value
        default:
          return false
      }
    })
  }

  private calculateFunnelConversionRate(
    funnel: ConversionFunnel,
    funnelUsers: string[],
    conversions: ConversionEvent[]
  ): number {
    const funnelConversions = conversions.filter(c => 
      c.type === funnel.conversionGoal && funnelUsers.includes(c.sessionId)
    )
    
    return funnelUsers.length > 0 ? funnelConversions.length / funnelUsers.length : 0
  }

  private calculateAverageTimeToConvert(
    funnel: ConversionFunnel,
    funnelUsers: string[],
    conversions: ConversionEvent[]
  ): number {
    const funnelConversions = conversions.filter(c => 
      c.type === funnel.conversionGoal && funnelUsers.includes(c.sessionId)
    )
    
    const times = funnelConversions.map(c => c.timeToConvert).filter(t => t > 0)
    return times.length > 0 ? times.reduce((sum, time) => sum + time, 0) / times.length : 0
  }

  private identifyDropOffPoints(stepCompletions: any[]): string[] {
    return stepCompletions
      .filter(step => step.dropOffRate > 0.3) // 30% drop-off threshold
      .sort((a, b) => b.dropOffRate - a.dropOffRate)
      .map(step => step.stepId)
  }

  private identifyTopConvertingPaths(
    funnel: ConversionFunnel,
    funnelUsers: string[],
    allJourneySteps: JourneyStep[]
  ): Array<{ path: string[]; users: number; conversionRate: number }> {
    // Simplified implementation - would need more sophisticated path analysis
    const paths: Map<string, { users: Set<string>; conversions: number }> = new Map()
    
    funnelUsers.forEach(userId => {
      const userSteps = allJourneySteps
        .filter(js => js.sessionId === userId)
        .sort((a, b) => a.timestamp - b.timestamp)
      
      const pathKey = userSteps.map(s => s.page).join(' -> ')
      
      if (!paths.has(pathKey)) {
        paths.set(pathKey, { users: new Set(), conversions: 0 })
      }
      
      paths.get(pathKey)!.users.add(userId)
    })

    return Array.from(paths.entries())
      .map(([path, data]) => ({
        path: path.split(' -> '),
        users: data.users.size,
        conversionRate: data.users.size > 0 ? data.conversions / data.users.size : 0
      }))
      .sort((a, b) => b.conversionRate - a.conversionRate)
      .slice(0, 5)
  }

  // Public API methods
  getConversionGoals(): ConversionGoal[] {
    return [...this.goals]
  }

  addConversionGoal(goal: ConversionGoal): void {
    this.goals.push(goal)
  }

  updateConversionGoal(goalId: string, updates: Partial<ConversionGoal>): void {
    const index = this.goals.findIndex(g => g.id === goalId)
    if (index >= 0) {
      this.goals[index] = { ...this.goals[index], ...updates }
    }
  }

  getConversionInsights(): any {
    const conversions = analyticsStorage.getConversions()
    const sessions = analyticsStorage.getUTMSessions()
    
    return {
      totalConversions: conversions.length,
      conversionRate: sessions.length > 0 ? conversions.length / sessions.length : 0,
      totalConversionValue: conversions.reduce((sum, c) => sum + (c.value || 0), 0),
      topConversionGoals: this.getTopConversionGoals(conversions),
      conversionsBySource: this.getConversionsBySource(conversions),
      funnelPerformance: this.funnels.map(f => {
        const analysis = this.analyzeFunnel(f.id)
        return {
          ...analysis
        }
      })
    }
  }

  private getTopConversionGoals(conversions: ConversionEvent[]): Array<{ type: string; count: number; value: number }> {
    const goalCounts: Record<string, { count: number; value: number }> = {}
    
    conversions.forEach(c => {
      if (!goalCounts[c.type]) {
        goalCounts[c.type] = { count: 0, value: 0 }
      }
      goalCounts[c.type].count++
      goalCounts[c.type].value += c.value || 0
    })
    
    return Object.entries(goalCounts)
      .map(([type, data]) => ({ type, ...data }))
      .sort((a, b) => b.count - a.count)
  }

  private getConversionsBySource(conversions: ConversionEvent[]): Array<{ source: string; count: number; value: number }> {
    const sourceCounts: Record<string, { count: number; value: number }> = {}
    
    conversions.forEach(c => {
      const source = c.trafficSource?.source || 'direct'
      if (!sourceCounts[source]) {
        sourceCounts[source] = { count: 0, value: 0 }
      }
      sourceCounts[source].count++
      sourceCounts[source].value += c.value || 0
    })
    
    return Object.entries(sourceCounts)
      .map(([source, data]) => ({ source, ...data }))
      .sort((a, b) => b.value - a.value)
  }
}

// Singleton instance
export const conversionTracker = new ConversionTracker()

// Utility functions
export function trackConversion(goalId: string, value?: number, customData?: Record<string, any>): void {
  conversionTracker.trackCustomConversion(goalId, value, customData)
}

export function getConversionGoals(): ConversionGoal[] {
  return conversionTracker.getConversionGoals()
}

export function analyzeFunnel(funnelId: string): FunnelAnalysis {
  return conversionTracker.analyzeFunnel(funnelId)
}

export function getConversionInsights(): any {
  return conversionTracker.getConversionInsights()
}
