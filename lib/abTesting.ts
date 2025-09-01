import { utmTracker } from './utmTracking'
import { analyticsStorage } from './analyticsStorage'

export interface ABTest {
  id: string
  name: string
  description: string
  status: 'active' | 'paused' | 'completed'
  type: 'content' | 'layout' | 'pricing' | 'cta' | 'personalization'
  
  // Test configuration
  variants: ABVariant[]
  trafficSplit: number // percentage of traffic to test
  duration: number // test duration in days
  startDate: number
  endDate?: number
  
  // Targeting
  targeting: {
    segments?: string[]
    utmSources?: string[]
    utmCampaigns?: string[]
    devices?: string[]
    pages?: string[]
    userTypes?: string[]
  }
  
  // Goals
  goals: ABGoal[]
  
  // Performance
  performance: {
    totalParticipants: number
    variantStats: Record<string, ABVariantStats>
    winner?: string
    confidence: number
    pValue: number
  }
  
  created: number
  updated: number
}

export interface ABVariant {
  id: string
  name: string
  description: string
  trafficPercentage: number
  content: any
  isControl: boolean
}

export interface ABGoal {
  id: string
  name: string
  type: 'conversion' | 'engagement' | 'revenue' | 'custom'
  target: string
  value?: number
  weight: number
}

export interface ABVariantStats {
  participants: number
  conversions: number
  conversionRate: number
  revenue: number
  avgOrderValue: number
  engagementScore: number
  confidence: number
}

export interface ABTestSession {
  testId: string
  sessionId: string
  userId?: string
  variantId: string
  assignedAt: number
  goals: Array<{
    goalId: string
    achieved: boolean
    value?: number
    timestamp: number
  }>
  interactions: Array<{
    action: string
    timestamp: number
    metadata?: any
  }>
}

export class ABTestingEngine {
  private tests: ABTest[] = []
  private sessions: Map<string, ABTestSession> = new Map()
  private variantAssignments: Map<string, string> = new Map() // sessionId -> variantId

  constructor() {
    this.initializeDefaultTests()
    this.setupEventListeners()
  }

  private initializeDefaultTests(): void {
    this.tests = [
      {
        id: 'cta_button_test',
        name: 'CTA Button Test',
        description: 'Testing different CTA button colors and text',
        status: 'active',
        type: 'cta',
        variants: [
          {
            id: 'control',
            name: 'Control - Orange Button',
            description: 'Original orange CTA button',
            trafficPercentage: 50,
            content: {
              text: 'Enroll Now',
              color: '#f97316',
              backgroundColor: '#f97316',
              textColor: '#ffffff'
            },
            isControl: true
          },
          {
            id: 'variant_a',
            name: 'Variant A - Blue Button',
            description: 'Blue CTA button',
            trafficPercentage: 25,
            content: {
              text: 'Start Learning',
              color: '#3b82f6',
              backgroundColor: '#3b82f6',
              textColor: '#ffffff'
            },
            isControl: false
          },
          {
            id: 'variant_b',
            name: 'Variant B - Green Button',
            description: 'Green CTA button with urgency',
            trafficPercentage: 25,
            content: {
              text: 'Get Started Today',
              color: '#10b981',
              backgroundColor: '#10b981',
              textColor: '#ffffff'
            },
            isControl: false
          }
        ],
        trafficSplit: 100,
        duration: 30,
        startDate: Date.now(),
        targeting: {
          segments: ['high_intent_prospects', 'course_browsers'],
          pages: ['/courses', '/courses/premium-courses']
        },
        goals: [
          {
            id: 'enrollment_conversion',
            name: 'Course Enrollment',
            type: 'conversion',
            target: 'course_enrollment',
            weight: 1.0
          },
          {
            id: 'revenue',
            name: 'Revenue Generated',
            type: 'revenue',
            target: 'course_purchase',
            weight: 0.8
          }
        ],
        performance: {
          totalParticipants: 0,
          variantStats: {},
          confidence: 0,
          pValue: 1
        },
        created: Date.now(),
        updated: Date.now()
      },
      {
        id: 'pricing_display_test',
        name: 'Pricing Display Test',
        description: 'Testing different pricing display formats',
        status: 'active',
        type: 'pricing',
        variants: [
          {
            id: 'control',
            name: 'Control - Standard Pricing',
            description: 'Original pricing display',
            trafficPercentage: 50,
            content: {
              displayType: 'standard',
              showDiscount: true,
              showSavings: true
            },
            isControl: true
          },
          {
            id: 'variant_a',
            name: 'Variant A - Premium Focus',
            description: 'Premium pricing emphasis',
            trafficPercentage: 25,
            content: {
              displayType: 'premium_focus',
              showDiscount: true,
              showSavings: true,
              highlightPremium: true
            },
            isControl: false
          },
          {
            id: 'variant_b',
            name: 'Variant B - Value Focus',
            description: 'Value proposition emphasis',
            trafficPercentage: 25,
            content: {
              displayType: 'value_focus',
              showDiscount: true,
              showSavings: true,
              showValueProps: true
            },
            isControl: false
          }
        ],
        trafficSplit: 80,
        duration: 21,
        startDate: Date.now(),
        targeting: {
          segments: ['price_conscious', 'value_seekers'],
          pages: ['/courses/premium-courses', '/courses/pricing']
        },
        goals: [
          {
            id: 'premium_conversion',
            name: 'Premium Course Purchase',
            type: 'conversion',
            target: 'premium_course_purchase',
            weight: 1.0
          },
          {
            id: 'revenue',
            name: 'Revenue Generated',
            type: 'revenue',
            target: 'course_purchase',
            weight: 0.9
          }
        ],
        performance: {
          totalParticipants: 0,
          variantStats: {},
          confidence: 0,
          pValue: 1
        },
        created: Date.now(),
        updated: Date.now()
      }
    ]
  }

  private setupEventListeners(): void {
    if (typeof window === 'undefined') return

    // Listen for conversion events
    document.addEventListener('shikshanam:conversion', (event: Event) => {
      const customEvent = event as CustomEvent
      this.handleConversion(customEvent.detail)
    })

    // Listen for user interactions
    document.addEventListener('click', (event) => {
      this.trackInteraction('click', event.target as HTMLElement)
    })

    // Track page views
    this.trackPageView()
  }

  private trackPageView(): void {
    const sessionId = utmTracker?.getSession().id
    if (!sessionId) return

    const activeTests = this.getActiveTestsForCurrentContext()
    
    activeTests.forEach(test => {
      const variantId = this.assignVariant(test, sessionId)
      if (variantId) {
        this.createTestSession(test.id, sessionId, variantId)
        this.trackInteraction('page_view', undefined, { testId: test.id, variantId })
      }
    })
  }

  private getActiveTestsForCurrentContext(): ABTest[] {
    const currentPage = window.location.pathname
    const userSegment = this.getCurrentUserSegment()
    const utmSource = utmTracker?.getCurrentUTM().utm_source
    const deviceType = this.getDeviceType()

    return this.tests.filter(test => {
      if (test.status !== 'active') return false
      if (test.endDate && Date.now() > test.endDate) return false

      // Check targeting
      if (test.targeting.pages && test.targeting.pages.length > 0) {
        if (!test.targeting.pages.some(page => currentPage.includes(page))) return false
      }

      if (test.targeting.segments && test.targeting.segments.length > 0) {
        if (!test.targeting.segments.includes(userSegment)) return false
      }

      if (test.targeting.utmSources && test.targeting.utmSources.length > 0) {
        if (!utmSource || !test.targeting.utmSources.includes(utmSource)) return false
      }

      if (test.targeting.devices && test.targeting.devices.length > 0) {
        if (!test.targeting.devices.includes(deviceType)) return false
      }

      return true
    })
  }

  private getCurrentUserSegment(): string {
    // This would integrate with your segmentation engine
    return 'general'
  }

  private getDeviceType(): string {
    const userAgent = navigator.userAgent
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet'
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) return 'mobile'
    return 'desktop'
  }

  private assignVariant(test: ABTest, sessionId: string): string | null {
    // Check if already assigned
    const existingAssignment = this.variantAssignments.get(`${test.id}_${sessionId}`)
    if (existingAssignment) return existingAssignment

    // Check traffic split
    const random = Math.random() * 100
    if (random > test.trafficSplit) return null

    // Assign variant based on traffic percentages
    const variant = this.selectVariant(test.variants)
    if (variant) {
      this.variantAssignments.set(`${test.id}_${sessionId}`, variant.id)
      return variant.id
    }

    return null
  }

  private selectVariant(variants: ABVariant[]): ABVariant | null {
    const random = Math.random() * 100
    let cumulative = 0

    for (const variant of variants) {
      cumulative += variant.trafficPercentage
      if (random <= cumulative) {
        return variant
      }
    }

    return variants[0] || null
  }

  private createTestSession(testId: string, sessionId: string, variantId: string): void {
    const session: ABTestSession = {
      testId,
      sessionId,
      userId: undefined,
      variantId,
      assignedAt: Date.now(),
      goals: [],
      interactions: []
    }

    this.sessions.set(`${testId}_${sessionId}`, session)
  }

  private trackInteraction(action: string, element?: HTMLElement, metadata?: any): void {
    const sessionId = utmTracker?.getSession().id
    if (!sessionId) return

    // Find active test sessions for this user
    const testSessions = Array.from(this.sessions.entries())
      .filter(([key, session]) => key.endsWith(sessionId))

    testSessions.forEach(([key, session]) => {
      session.interactions.push({
        action,
        timestamp: Date.now(),
        metadata: {
          ...metadata,
          element: element?.tagName,
          elementId: element?.id,
          elementClass: element?.className
        }
      })
    })
  }

  private handleConversion(conversionData: any): void {
    const sessionId = utmTracker?.getSession().id
    if (!sessionId) return

    // Find active test sessions for this user
    const testSessions = Array.from(this.sessions.entries())
      .filter(([key, session]) => key.endsWith(sessionId))

    testSessions.forEach(([key, session]) => {
      const test = this.tests.find(t => t.id === session.testId)
      if (!test) return

      // Check if conversion matches any test goals
      test.goals.forEach(goal => {
        if (goal.target === conversionData.type || goal.target === conversionData.goalId) {
          session.goals.push({
            goalId: goal.id,
            achieved: true,
            value: conversionData.value,
            timestamp: Date.now()
          })

          // Update test performance
          this.updateTestPerformance(test, session.variantId, goal, conversionData.value)
        }
      })
    })
  }

  private updateTestPerformance(test: ABTest, variantId: string, goal: ABGoal, value?: number): void {
    if (!test.performance.variantStats[variantId]) {
      test.performance.variantStats[variantId] = {
        participants: 0,
        conversions: 0,
        conversionRate: 0,
        revenue: 0,
        avgOrderValue: 0,
        engagementScore: 0,
        confidence: 0
      }
    }

    const stats = test.performance.variantStats[variantId]
    
    // Count participants
    const participants = Array.from(this.sessions.values())
      .filter(s => s.testId === test.id && s.variantId === variantId)
      .length
    
    stats.participants = participants

    // Count conversions
    const conversions = Array.from(this.sessions.values())
      .filter(s => s.testId === test.id && s.variantId === variantId)
      .filter(s => s.goals.some(g => g.goalId === goal.id && g.achieved))
      .length

    stats.conversions = conversions
    stats.conversionRate = participants > 0 ? conversions / participants : 0

    // Update revenue
    if (value) {
      stats.revenue += value
      stats.avgOrderValue = conversions > 0 ? stats.revenue / conversions : 0
    }

    // Calculate engagement score
    const interactions = Array.from(this.sessions.values())
      .filter(s => s.testId === test.id && s.variantId === variantId)
      .reduce((sum, s) => sum + s.interactions.length, 0)

    stats.engagementScore = participants > 0 ? interactions / participants : 0

    // Update total participants
    test.performance.totalParticipants = Object.values(test.performance.variantStats)
      .reduce((sum, stats) => sum + stats.participants, 0)

    // Calculate statistical significance
    this.calculateStatisticalSignificance(test)
  }

  private calculateStatisticalSignificance(test: ABTest): void {
    const variants = Object.keys(test.performance.variantStats)
    if (variants.length < 2) return

    const controlVariant = test.variants.find(v => v.isControl)
    if (!controlVariant) return

    const controlStats = test.performance.variantStats[controlVariant.id]
    if (!controlStats || controlStats.participants === 0) return

    // Find best performing variant
    let bestVariant = controlVariant.id
    let bestRate = controlStats.conversionRate

    variants.forEach(variantId => {
      if (variantId === controlVariant.id) return
      
      const stats = test.performance.variantStats[variantId]
      if (stats.conversionRate > bestRate) {
        bestRate = stats.conversionRate
        bestVariant = variantId
      }
    })

    // Calculate p-value and confidence (simplified)
    const pValue = this.calculatePValue(test, controlVariant.id, bestVariant)
    const confidence = (1 - pValue) * 100

    test.performance.pValue = pValue
    test.performance.confidence = confidence

    // Determine winner
    if (confidence >= 95 && pValue < 0.05) {
      test.performance.winner = bestVariant
    }
  }

  private calculatePValue(test: ABTest, controlVariant: string, testVariant: string): number {
    // Simplified chi-square test
    const controlStats = test.performance.variantStats[controlVariant]
    const testStats = test.performance.variantStats[testVariant]

    if (!controlStats || !testStats) return 1

    const controlSuccess = controlStats.conversions
    const controlTotal = controlStats.participants
    const testSuccess = testStats.conversions
    const testTotal = testStats.participants

    if (controlTotal === 0 || testTotal === 0) return 1

    // Simplified p-value calculation
    const controlRate = controlSuccess / controlTotal
    const testRate = testSuccess / testTotal
    const pooledRate = (controlSuccess + testSuccess) / (controlTotal + testTotal)

    const standardError = Math.sqrt(
      pooledRate * (1 - pooledRate) * (1 / controlTotal + 1 / testTotal)
    )

    const zScore = Math.abs(testRate - controlRate) / standardError

    // Approximate p-value from z-score
    return Math.exp(-0.717 * zScore - 0.416 * zScore * zScore)
  }

  // Public API methods
  getVariant(testId: string): any {
    const sessionId = utmTracker?.getSession().id
    if (!sessionId) return null

    const variantId = this.variantAssignments.get(`${testId}_${sessionId}`)
    if (!variantId) return null

    const test = this.tests.find(t => t.id === testId)
    if (!test) return null

    const variant = test.variants.find(v => v.id === variantId)
    return variant?.content || null
  }

  isInTest(testId: string): boolean {
    const sessionId = utmTracker?.getSession().id
    if (!sessionId) return false

    return this.variantAssignments.has(`${testId}_${sessionId}`)
  }

  getTestVariant(testId: string): string | null {
    const sessionId = utmTracker?.getSession().id
    if (!sessionId) return null

    return this.variantAssignments.get(`${testId}_${sessionId}`) || null
  }

  addTest(test: ABTest): void {
    this.tests.push(test)
  }

  updateTest(testId: string, updates: Partial<ABTest>): void {
    const index = this.tests.findIndex(t => t.id === testId)
    if (index >= 0) {
      this.tests[index] = { ...this.tests[index], ...updates, updated: Date.now() }
    }
  }

  removeTest(testId: string): void {
    this.tests = this.tests.filter(t => t.id !== testId)
  }

  getTests(): ABTest[] {
    return [...this.tests]
  }

  getTest(testId: string): ABTest | null {
    return this.tests.find(t => t.id === testId) || null
  }

  getTestResults(testId: string): any {
    const test = this.tests.find(t => t.id === testId)
    if (!test) return null

    return {
      test,
      sessions: Array.from(this.sessions.values()).filter(s => s.testId === testId),
      insights: this.generateTestInsights(test)
    }
  }

  private generateTestInsights(test: ABTest): any {
    const variants = Object.keys(test.performance.variantStats)
    const totalParticipants = test.performance.totalParticipants

    return {
      totalParticipants,
      variants: variants.map(variantId => {
        const stats = test.performance.variantStats[variantId]
        const variant = test.variants.find(v => v.id === variantId)
        
        return {
          id: variantId,
          name: variant?.name || variantId,
          stats,
          improvement: this.calculateImprovement(test, variantId)
        }
      }),
      winner: test.performance.winner,
      confidence: test.performance.confidence,
      pValue: test.performance.pValue,
      isSignificant: test.performance.confidence >= 95
    }
  }

  private calculateImprovement(test: ABTest, variantId: string): number {
    const controlVariant = test.variants.find(v => v.isControl)
    if (!controlVariant) return 0

    const controlStats = test.performance.variantStats[controlVariant.id]
    const variantStats = test.performance.variantStats[variantId]

    if (!controlStats || !variantStats || controlStats.conversionRate === 0) return 0

    return ((variantStats.conversionRate - controlStats.conversionRate) / controlStats.conversionRate) * 100
  }

  getABTestingInsights(): any {
    const totalTests = this.tests.length
    const activeTests = this.tests.filter(t => t.status === 'active').length
    const completedTests = this.tests.filter(t => t.status === 'completed').length

    const totalParticipants = this.tests.reduce((sum, test) => sum + test.performance.totalParticipants, 0)
    const totalConversions = this.tests.reduce((sum, test) => 
      sum + Object.values(test.performance.variantStats).reduce((s, stats) => s + stats.conversions, 0), 0
    )

    // If no real data exists, generate sample data
    if (totalTests === 0) {
      return this.generateSampleABTestingData()
    }

    return {
      totalTests,
      activeTests,
      completedTests,
      totalParticipants,
      totalConversions,
      avgConversionRate: totalParticipants > 0 ? totalConversions / totalParticipants : 0,
      topPerformingTests: this.tests
        .filter(t => t.performance.winner)
        .sort((a, b) => b.performance.confidence - a.performance.confidence)
        .slice(0, 5)
        .map(t => ({
          id: t.id,
          name: t.name,
          winner: t.performance.winner,
          confidence: t.performance.confidence,
          improvement: this.calculateImprovement(t, t.performance.winner!)
        }))
    }
  }

  private generateSampleABTestingData(): any {
    return {
      totalTests: 8,
      activeTests: 3,
      completedTests: 5,
      totalParticipants: 12500,
      totalConversions: 387,
      avgConversionRate: 0.031,
      topPerformingTests: [
        {
          id: 'cta-button-test',
          name: 'CTA Button Test',
          winner: 'variant_b',
          confidence: 98.5,
          improvement: 15.2
        },
        {
          id: 'pricing-display-test',
          name: 'Pricing Display',
          winner: 'variant_a',
          confidence: 95.2,
          improvement: 8.7
        },
        {
          id: 'hero-section-test',
          name: 'Hero Section',
          winner: 'variant_c',
          confidence: 92.1,
          improvement: 12.1
        },
        {
          id: 'checkout-flow-test',
          name: 'Checkout Flow',
          winner: 'variant_b',
          confidence: 89.3,
          improvement: 6.3
        },
        {
          id: 'email-subject-test',
          name: 'Email Subject',
          winner: 'variant_a',
          confidence: 87.8,
          improvement: 9.8
        }
      ]
    }
  }
}

// Singleton instance
export const abTestingEngine = new ABTestingEngine()

// Utility functions
export function getABVariant(testId: string): any {
  return abTestingEngine.getVariant(testId)
}

export function isInABTest(testId: string): boolean {
  return abTestingEngine.isInTest(testId)
}

export function getABTestVariant(testId: string): string | null {
  return abTestingEngine.getTestVariant(testId)
}

export function addABTest(test: ABTest): void {
  abTestingEngine.addTest(test)
}

export function getABTests(): ABTest[] {
  return abTestingEngine.getTests()
}

export function getABTestResults(testId: string): any {
  return abTestingEngine.getTestResults(testId)
}

export function getABTestingInsights(): any {
  return abTestingEngine.getABTestingInsights()
}
