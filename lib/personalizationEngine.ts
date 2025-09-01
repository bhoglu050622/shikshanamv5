import { UTMParameters, TrafficSource, utmTracker } from './utmTracking'
import { UserBehaviorPattern, journeyTracker } from './journeyTracking'
import { segmentationEngine, getCurrentUserSegment, getPersonalizationForUser } from './behavioralSegmentation'
import { analyticsStorage, UserPreferences } from './analyticsStorage'
import { getAllCourses, Course } from './courseData'

export interface PersonalizationRule {
  id: string
  name: string
  description: string
  priority: number
  conditions: PersonalizationCondition[]
  actions: PersonalizationAction[]
  active: boolean
  startDate: number
  endDate?: number
  testGroup?: string
}

export interface PersonalizationCondition {
  type: 'segment' | 'utm' | 'behavior' | 'device' | 'time' | 'page' | 'custom'
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in'
  field: string
  value: any
  weight: number
}

export interface PersonalizationAction {
  type: 'content' | 'layout' | 'messaging' | 'offer' | 'redirect' | 'modal' | 'banner' | 'cta'
  target: string
  content: any
  variation?: string
  priority: number
}

export interface PersonalizedContent {
  id: string
  type: 'hero' | 'cta' | 'course_recommendation' | 'testimonial' | 'offer' | 'banner' | 'modal'
  content: any
  rules: string[]
  metadata: {
    source: string
    confidence: number
    segment: string
    utm_source?: string
    timestamp: number
  }
}

export interface ContentVariation {
  id: string
  name: string
  content: any
  targetSegments: string[]
  performance: {
    impressions: number
    clicks: number
    conversions: number
    ctr: number
    conversionRate: number
  }
}

export interface PersonalizationContext {
  userId?: string
  sessionId: string
  page: string
  utm: UTMParameters
  trafficSource: TrafficSource | null
  segment: string
  behavior: UserBehaviorPattern | null
  preferences: UserPreferences | null
  device: string
  timeOfDay: number
  dayOfWeek: number
  visitCount: number
  isReturningUser: boolean
}

export interface ContentRecommendation {
  courseId: string
  course: Course
  score: number
  reasons: string[]
  personalizedMessage: string
  urgency: 'low' | 'medium' | 'high'
  pricing: {
    original: number
    discounted?: number
    discount?: number
    urgencyMessage?: string
  }
}

export interface DynamicMessage {
  id: string
  type: 'welcome' | 'value_prop' | 'urgency' | 'social_proof' | 'objection_handling'
  message: string
  context: string
  personalization: {
    name?: string
    source?: string
    segment?: string
    previousAction?: string
  }
}

export class PersonalizationEngine {
  private rules: PersonalizationRule[] = []
  private contentVariations: Map<string, ContentVariation[]> = new Map()
  private personalizedSessions: Map<string, PersonalizedContent[]> = new Map()

  constructor() {
    this.initializeDefaultRules()
    this.initializeContentVariations()
    this.setupPersonalizationTracking()
  }

  private initializeDefaultRules(): void {
    this.rules = [
      // High-Intent Users
      {
        id: 'high_intent_urgency',
        name: 'High Intent Urgency',
        description: 'Show urgency messaging to high-intent users',
        priority: 1,
        conditions: [
          { type: 'segment', operator: 'equals', field: 'primary_segment', value: 'high_intent_prospects', weight: 1.0 }
        ],
        actions: [
          { type: 'banner', target: 'top_banner', content: { message: 'Limited Time: 20% off all courses!', urgency: 'high' }, priority: 1 },
          { type: 'cta', target: 'primary_cta', content: { text: 'Enroll Now - Limited Spots!', style: 'urgent' }, priority: 1 }
        ],
        active: true,
        startDate: Date.now()
      },

      // Paid Traffic First-Time Visitors
      {
        id: 'paid_welcome_sequence',
        name: 'Paid Welcome Sequence',
        description: 'Welcome messaging for paid traffic',
        priority: 2,
        conditions: [
          { type: 'utm', operator: 'in', field: 'traffic_type', value: ['paid'], weight: 0.6 },
          { type: 'behavior', operator: 'equals', field: 'visit_count', value: 1, weight: 0.4 }
        ],
        actions: [
          { type: 'modal', target: 'welcome_modal', content: { 
            title: 'Welcome to Shikshanam!', 
            message: 'Get 15% off your first course',
            cta: 'Claim Your Discount'
          }, priority: 1 },
          { type: 'content', target: 'hero_section', content: { 
            headline: 'Transform Your Life with Ancient Wisdom',
            subheadline: 'Join thousands of students on their spiritual journey'
          }, priority: 1 }
        ],
        active: true,
        startDate: Date.now()
      },

      // Social Media Users
      {
        id: 'social_community_focus',
        name: 'Social Community Focus',
        description: 'Community-focused messaging for social users',
        priority: 3,
        conditions: [
          { type: 'utm', operator: 'in', field: 'traffic_type', value: ['social'], weight: 1.0 }
        ],
        actions: [
          { type: 'content', target: 'hero_section', content: {
            headline: 'Join Our Spiritual Community',
            subheadline: 'Connect with like-minded seekers worldwide',
            socialProof: true
          }, priority: 1 },
          { type: 'banner', target: 'community_banner', content: {
            message: 'Follow us for daily wisdom and join our community discussions'
          }, priority: 1 }
        ],
        active: true,
        startDate: Date.now()
      },

      // Mobile Users
      {
        id: 'mobile_optimization',
        name: 'Mobile Optimization',
        description: 'Optimized experience for mobile users',
        priority: 4,
        conditions: [
          { type: 'device', operator: 'equals', field: 'device_type', value: 'mobile', weight: 1.0 }
        ],
        actions: [
          { type: 'layout', target: 'main_layout', content: { 
            mobileOptimized: true,
            quickActions: true
          }, priority: 1 },
          { type: 'cta', target: 'floating_cta', content: {
            text: 'Quick Enroll',
            position: 'bottom_fixed'
          }, priority: 1 }
        ],
        active: true,
        startDate: Date.now()
      },

      // Return Visitors
      {
        id: 'returning_user_personalization',
        name: 'Returning User Personalization',
        description: 'Personalized experience for returning users',
        priority: 5,
        conditions: [
          { type: 'behavior', operator: 'greater_than', field: 'visit_count', value: 1, weight: 1.0 }
        ],
        actions: [
          { type: 'content', target: 'hero_section', content: {
            headline: 'Welcome Back!',
            subheadline: 'Continue your spiritual journey',
            showProgress: true
          }, priority: 1 },
          { type: 'content', target: 'recommendations', content: {
            title: 'Recommended for You',
            showPersonalized: true
          }, priority: 1 }
        ],
        active: true,
        startDate: Date.now()
      },

      // Email Campaign Users
      {
        id: 'email_campaign_continuity',
        name: 'Email Campaign Continuity',
        description: 'Maintain messaging continuity from email campaigns',
        priority: 6,
        conditions: [
          { type: 'utm', operator: 'equals', field: 'utm_medium', value: 'email', weight: 1.0 }
        ],
        actions: [
          { type: 'content', target: 'hero_section', content: {
            maintainEmailMessaging: true,
            showEmailOffer: true
          }, priority: 1 }
        ],
        active: true,
        startDate: Date.now()
      },

      // Time-based Personalization
      {
        id: 'time_based_messaging',
        name: 'Time-based Messaging',
        description: 'Adjust messaging based on time of day',
        priority: 7,
        conditions: [
          { type: 'time', operator: 'greater_than', field: 'hour', value: 18, weight: 1.0 }
        ],
        actions: [
          { type: 'content', target: 'hero_section', content: {
            headline: 'Evening Wisdom Session',
            subheadline: 'Perfect time for reflection and learning'
          }, priority: 1 }
        ],
        active: true,
        startDate: Date.now()
      }
    ]
  }

  private initializeContentVariations(): void {
    // Hero Section Variations
    this.contentVariations.set('hero_section', [
      {
        id: 'hero_default',
        name: 'Default Hero',
        content: {
          headline: 'Discover India\'s Timeless Wisdom',
          subheadline: 'Premium courses built around the Six Darshanas',
          cta: 'Start Your Journey'
        },
        targetSegments: ['general'],
        performance: { impressions: 0, clicks: 0, conversions: 0, ctr: 0, conversionRate: 0 }
      },
      {
        id: 'hero_urgency',
        name: 'Urgency Hero',
        content: {
          headline: 'Transform Your Life Today',
          subheadline: 'Limited time offer - Ancient wisdom at modern prices',
          cta: 'Claim Your Spot',
          urgency: true
        },
        targetSegments: ['high_intent_prospects'],
        performance: { impressions: 0, clicks: 0, conversions: 0, ctr: 0, conversionRate: 0 }
      },
      {
        id: 'hero_social',
        name: 'Social Community Hero',
        content: {
          headline: 'Join Our Spiritual Community',
          subheadline: 'Connect with thousands of wisdom seekers',
          cta: 'Join Community',
          socialProof: true
        },
        targetSegments: ['social_browsers'],
        performance: { impressions: 0, clicks: 0, conversions: 0, ctr: 0, conversionRate: 0 }
      }
    ])

    // CTA Variations
    this.contentVariations.set('primary_cta', [
      {
        id: 'cta_default',
        name: 'Default CTA',
        content: { text: 'Start Learning', style: 'primary' },
        targetSegments: ['general'],
        performance: { impressions: 0, clicks: 0, conversions: 0, ctr: 0, conversionRate: 0 }
      },
      {
        id: 'cta_urgent',
        name: 'Urgent CTA',
        content: { text: 'Enroll Now - Limited Time!', style: 'urgent' },
        targetSegments: ['high_intent_prospects'],
        performance: { impressions: 0, clicks: 0, conversions: 0, ctr: 0, conversionRate: 0 }
      },
      {
        id: 'cta_free',
        name: 'Free Trial CTA',
        content: { text: 'Try Free for 7 Days', style: 'secondary' },
        targetSegments: ['paid_first_visitors'],
        performance: { impressions: 0, clicks: 0, conversions: 0, ctr: 0, conversionRate: 0 }
      }
    ])
  }

  private setupPersonalizationTracking(): void {
    if (typeof document === 'undefined') return
    
    // Track personalized content performance
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      if (target.hasAttribute('data-personalized')) {
        this.trackPersonalizationInteraction(target.getAttribute('data-personalized')!, 'click')
      }
    })

    // Track content impressions
    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.target.hasAttribute('data-personalized')) {
            this.trackPersonalizationInteraction(
              entry.target.getAttribute('data-personalized')!, 
              'impression'
            )
          }
        })
      }, { threshold: 0.5 })

      // Observe personalized elements
      setTimeout(() => {
        document.querySelectorAll('[data-personalized]').forEach(el => observer.observe(el))
      }, 1000)
    }
  }

  getPersonalizationContext(): PersonalizationContext {
    const utmSession = utmTracker?.getSession()
    const utmParams = utmTracker?.getCurrentUTM() || {}
    const trafficSource = utmTracker?.getTrafficSource()
    const userSegment = getCurrentUserSegment()
    const behavior = journeyTracker?.getUserBehaviorPattern()
    const preferences = analyticsStorage.getUserPreferences()

    return {
      sessionId: utmSession?.id || 'unknown',
      page: window.location.pathname,
      utm: utmParams,
      trafficSource: trafficSource || null,
      segment: userSegment?.primarySegment.id || 'general',
      behavior: behavior || null,
      preferences,
      device: utmSession?.device.type || 'desktop',
      timeOfDay: new Date().getHours(),
      dayOfWeek: new Date().getDay(),
      visitCount: utmSession?.visitCount || 1,
      isReturningUser: (utmSession?.visitCount || 1) > 1
    }
  }

  personalizeContent(contentType: string, defaultContent: any): PersonalizedContent {
    const context = this.getPersonalizationContext()
    const applicableRules = this.getApplicableRules(context)
    
    let personalizedContent = defaultContent
    let appliedRules: string[] = []
    let confidence = 0.5
    
    // Apply rules in priority order
    applicableRules.forEach(rule => {
      const ruleActions = rule.actions.filter(action => 
        action.type === 'content' && action.target === contentType
      )
      
      ruleActions.forEach(action => {
        personalizedContent = { ...personalizedContent, ...action.content }
        appliedRules.push(rule.id)
        confidence = Math.min(confidence + 0.2, 1.0)
      })
    })

    // Check for content variations
    const variations = this.contentVariations.get(contentType) || []
    const bestVariation = this.selectBestVariation(variations, context)
    
    if (bestVariation) {
      personalizedContent = { ...personalizedContent, ...bestVariation.content }
      confidence = Math.min(confidence + 0.3, 1.0)
    }

    const result: PersonalizedContent = {
      id: `personalized_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      type: contentType as any,
      content: personalizedContent,
      rules: appliedRules,
      metadata: {
        source: 'personalization_engine',
        confidence,
        segment: context.segment,
        utm_source: context.utm.utm_source,
        timestamp: Date.now()
      }
    }

    // Store for tracking
    const sessionContent = this.personalizedSessions.get(context.sessionId) || []
    sessionContent.push(result)
    this.personalizedSessions.set(context.sessionId, sessionContent)

    return result
  }

  private getApplicableRules(context: PersonalizationContext): PersonalizationRule[] {
    return this.rules
      .filter(rule => rule.active)
      .filter(rule => this.evaluateRuleConditions(rule, context))
      .sort((a, b) => a.priority - b.priority)
  }

  private evaluateRuleConditions(rule: PersonalizationRule, context: PersonalizationContext): boolean {
    if (rule.conditions.length === 0) return true

    let totalScore = 0
    let totalWeight = 0

    for (const condition of rule.conditions) {
      const score = this.evaluateCondition(condition, context)
      totalScore += score * condition.weight
      totalWeight += condition.weight
    }

    const finalScore = totalWeight > 0 ? totalScore / totalWeight : 0
    return finalScore >= 0.7 // 70% threshold
  }

  private evaluateCondition(condition: PersonalizationCondition, context: PersonalizationContext): number {
    const value = this.extractContextValue(condition, context)
    
    if (value === null || value === undefined) return 0

    switch (condition.operator) {
      case 'equals':
        return value === condition.value ? 1 : 0
      case 'contains':
        return String(value).toLowerCase().includes(String(condition.value).toLowerCase()) ? 1 : 0
      case 'greater_than':
        return Number(value) > Number(condition.value) ? 1 : 0
      case 'less_than':
        return Number(value) < Number(condition.value) ? 1 : 0
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(value) ? 1 : 0
      case 'not_in':
        return Array.isArray(condition.value) && !condition.value.includes(value) ? 1 : 0
      default:
        return 0
    }
  }

  private extractContextValue(condition: PersonalizationCondition, context: PersonalizationContext): any {
    switch (condition.type) {
      case 'segment':
        return condition.field === 'primary_segment' ? context.segment : null
      case 'utm':
        switch (condition.field) {
          case 'traffic_type':
            return context.trafficSource?.type
          case 'utm_source':
            return context.utm.utm_source
          case 'utm_medium':
            return context.utm.utm_medium
          case 'utm_campaign':
            return context.utm.utm_campaign
          default:
            return context.utm[condition.field as keyof UTMParameters]
        }
      case 'behavior':
        switch (condition.field) {
          case 'visit_count':
            return context.visitCount
          case 'is_returning':
            return context.isReturningUser
          case 'engagement_level':
            return context.behavior?.engagementLevel
          case 'intent_score':
            return context.behavior?.intentScore
          default:
            return null
        }
      case 'device':
        return condition.field === 'device_type' ? context.device : null
      case 'time':
        switch (condition.field) {
          case 'hour':
            return context.timeOfDay
          case 'day_of_week':
            return context.dayOfWeek
          default:
            return null
        }
      case 'page':
        return condition.field === 'current_page' ? context.page : null
      default:
        return null
    }
  }

  private selectBestVariation(variations: ContentVariation[], context: PersonalizationContext): ContentVariation | null {
    // Filter variations by target segments
    const applicableVariations = variations.filter(variation => 
      variation.targetSegments.includes(context.segment) || 
      variation.targetSegments.includes('general')
    )

    if (applicableVariations.length === 0) return null

    // Select based on performance (simplified - could use more sophisticated algorithms)
    return applicableVariations.reduce((best, current) => {
      const currentScore = current.performance.conversionRate || 0
      const bestScore = best.performance.conversionRate || 0
      return currentScore > bestScore ? current : best
    }, applicableVariations[0])
  }

  generatePersonalizedRecommendations(limit: number = 6): ContentRecommendation[] {
    const context = this.getPersonalizationContext()
    const allCourses = getAllCourses()
    const userSegment = getCurrentUserSegment()
    const personalization = getPersonalizationForUser()
    
    const recommendations: ContentRecommendation[] = allCourses
      .map(course => {
        const score = this.calculateRecommendationScore(course, context, userSegment?.primarySegment.id)
        const reasons = this.generateRecommendationReasons(course, context)
        const personalizedMessage = this.generatePersonalizedMessage(course, context)
        const pricing = this.calculatePersonalizedPricing(course, context)
        
        return {
          courseId: course.id,
          course,
          score,
          reasons,
          personalizedMessage,
          urgency: this.calculateUrgency(course, context),
          pricing
        }
      })
      .filter(rec => rec.score > 0.3)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

    return recommendations
  }

  private calculateRecommendationScore(course: Course, context: PersonalizationContext, segmentId?: string): number {
    let score = 0.5 // Base score

    // Segment-based scoring
    if (segmentId === 'high_intent_prospects') {
      score += 0.2
    } else if (segmentId === 'paid_first_visitors' && course.level === 'Beginner') {
      score += 0.3
    }

    // UTM-based scoring
    if (context.utm.utm_campaign?.includes(course.school.toLowerCase())) {
      score += 0.2
    }

    // Behavior-based scoring
    if (context.behavior?.preferredContent.includes(course.school.toLowerCase())) {
      score += 0.25
    }

    // Device-based scoring
    if (context.device === 'mobile' && course.duration && course.duration.includes('short')) {
      score += 0.1
    }

    return Math.min(score, 1.0)
  }

  private generateRecommendationReasons(course: Course, context: PersonalizationContext): string[] {
    const reasons: string[] = []

    if (context.utm.utm_campaign?.includes(course.school.toLowerCase())) {
      reasons.push(`Matches your interest in ${course.school}`)
    }

    if (context.behavior?.preferredContent.includes(course.school.toLowerCase())) {
      reasons.push('Based on your browsing history')
    }

    if (context.isReturningUser) {
      reasons.push('Perfect for your learning journey')
    }

    if (course.level === 'Beginner' && context.visitCount === 1) {
      reasons.push('Great starting point for beginners')
    }

    return reasons
  }

  private generatePersonalizedMessage(course: Course, context: PersonalizationContext): string {
    if (context.utm.utm_source === 'email') {
      return 'As promised in our email, here\'s your personalized course recommendation'
    }

    if (context.isReturningUser) {
      return 'Welcome back! Continue your spiritual journey with this course'
    }

    if (context.trafficSource?.type === 'social') {
      return 'Join thousands of students who started their journey with this course'
    }

    return 'This course is specially recommended for you'
  }

  private calculateUrgency(course: Course, context: PersonalizationContext): 'low' | 'medium' | 'high' {
    if (context.segment === 'high_intent_prospects') {
      return 'high'
    }

    if (context.trafficSource?.type === 'paid' && context.visitCount === 1) {
      return 'medium'
    }

    return 'low'
  }

  private calculatePersonalizedPricing(course: Course, context: PersonalizationContext): any {
    const pricing = {
      original: course.price,
      discounted: undefined as number | undefined,
      discount: undefined as number | undefined,
      urgencyMessage: undefined as string | undefined
    }

    // Apply segment-based discounts
    if (context.segment === 'paid_first_visitors') {
      pricing.discount = 15
      pricing.discounted = course.price * 0.85
      pricing.urgencyMessage = 'First-time visitor discount - Limited time!'
    } else if (context.segment === 'high_intent_prospects') {
      pricing.discount = 20
      pricing.discounted = course.price * 0.8
      pricing.urgencyMessage = 'Exclusive 20% off - Act now!'
    } else if (context.trafficSource?.type === 'email') {
      pricing.discount = 10
      pricing.discounted = course.price * 0.9
      pricing.urgencyMessage = 'Email subscriber discount'
    }

    return pricing
  }

  generateDynamicMessage(messageType: string, context?: any): DynamicMessage {
    const personalizationContext = this.getPersonalizationContext()
    
    const messages = {
      welcome: this.generateWelcomeMessage(personalizationContext),
      value_prop: this.generateValuePropositionMessage(personalizationContext),
      urgency: this.generateUrgencyMessage(personalizationContext),
      social_proof: this.generateSocialProofMessage(personalizationContext),
      objection_handling: this.generateObjectionHandlingMessage(personalizationContext)
    }

    return messages[messageType as keyof typeof messages] || messages.welcome
  }

  private generateWelcomeMessage(context: PersonalizationContext): DynamicMessage {
    let message = 'Welcome to Shikshanam!'
    let personalization: any = {}

    if (context.trafficSource?.type === 'email') {
      message = 'Welcome back from our email!'
      personalization.source = 'email'
    } else if (context.trafficSource?.type === 'social') {
      message = 'Welcome from social media!'
      personalization.source = context.trafficSource.source
    } else if (context.isReturningUser) {
      message = 'Welcome back to Shikshanam!'
      personalization.segment = 'returning_user'
    }

    return {
      id: `welcome_${Date.now()}`,
      type: 'welcome',
      message,
      context: context.segment,
      personalization
    }
  }

  private generateValuePropositionMessage(context: PersonalizationContext): DynamicMessage {
    let message = 'Transform your life with ancient wisdom'

    if (context.segment === 'high_intent_prospects') {
      message = 'Join thousands who have transformed their lives through our proven methods'
    } else if (context.segment === 'social_browsers') {
      message = 'Connect with a community of wisdom seekers and grow together'
    } else if (context.device === 'mobile') {
      message = 'Learn ancient wisdom anywhere, anytime - perfect for your mobile lifestyle'
    }

    return {
      id: `value_prop_${Date.now()}`,
      type: 'value_prop',
      message,
      context: context.segment,
      personalization: { segment: context.segment }
    }
  }

  private generateUrgencyMessage(context: PersonalizationContext): DynamicMessage {
    let message = 'Limited time offer - don\'t miss out!'

    if (context.segment === 'high_intent_prospects') {
      message = 'Only a few spots left - secure your place now!'
    } else if (context.trafficSource?.type === 'paid') {
      message = 'Special discount for new visitors - ends soon!'
    }

    return {
      id: `urgency_${Date.now()}`,
      type: 'urgency',
      message,
      context: context.segment,
      personalization: { segment: context.segment }
    }
  }

  private generateSocialProofMessage(context: PersonalizationContext): DynamicMessage {
    let message = 'Join over 10,000 students who have transformed their lives'

    if (context.trafficSource?.type === 'social') {
      message = 'See what your community is saying about our courses'
    } else if (context.isReturningUser) {
      message = 'Students like you have achieved amazing results'
    }

    return {
      id: `social_proof_${Date.now()}`,
      type: 'social_proof',
      message,
      context: context.segment,
      personalization: { segment: context.segment }
    }
  }

  private generateObjectionHandlingMessage(context: PersonalizationContext): DynamicMessage {
    let message = 'Try risk-free with our 30-day money-back guarantee'

    if (context.segment === 'low_engagement') {
      message = 'Not sure? Start with our free resources and see the difference'
    } else if (context.device === 'mobile') {
      message = 'Learn at your own pace - perfect for busy schedules'
    }

    return {
      id: `objection_${Date.now()}`,
      type: 'objection_handling',
      message,
      context: context.segment,
      personalization: { segment: context.segment }
    }
  }

  private trackPersonalizationInteraction(contentId: string, action: string): void {
    const event = {
      contentId,
      action,
      timestamp: Date.now(),
      sessionId: this.getPersonalizationContext().sessionId,
      page: window.location.pathname
    }

    // Update content performance
    this.updateContentPerformance(contentId, action)
    
    // Save to analytics
    analyticsStorage.saveUTMEvent({
      id: `personalization_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      type: 'personalization_interaction',
      timestamp: Date.now(),
      sessionId: event.sessionId,
      data: event
    })
  }

  private updateContentPerformance(contentId: string, action: string): void {
    // Find and update the appropriate content variation
    this.contentVariations.forEach((variations, type) => {
      const variation = variations.find(v => v.id === contentId)
      if (variation) {
        if (action === 'impression') {
          variation.performance.impressions++
        } else if (action === 'click') {
          variation.performance.clicks++
          variation.performance.ctr = variation.performance.impressions > 0 
            ? variation.performance.clicks / variation.performance.impressions 
            : 0
        } else if (action === 'conversion') {
          variation.performance.conversions++
          variation.performance.conversionRate = variation.performance.impressions > 0 
            ? variation.performance.conversions / variation.performance.impressions 
            : 0
        }
      }
    })
  }

  // Public API methods
  getPersonalizedContent(contentType: string, defaultContent: any): any {
    return this.personalizeContent(contentType, defaultContent).content
  }

  getPersonalizedRecommendations(limit?: number): ContentRecommendation[] {
    return this.generatePersonalizedRecommendations(limit)
  }

  getPersonalizedMessage(messageType: string): string {
    return this.generateDynamicMessage(messageType).message
  }

  addPersonalizationRule(rule: PersonalizationRule): void {
    this.rules.push(rule)
  }

  updatePersonalizationRule(ruleId: string, updates: Partial<PersonalizationRule>): void {
    const index = this.rules.findIndex(r => r.id === ruleId)
    if (index >= 0) {
      this.rules[index] = { ...this.rules[index], ...updates }
    }
  }

  getPersonalizationInsights(): any {
    const context = this.getPersonalizationContext()
    const sessionContent = this.personalizedSessions.get(context.sessionId) || []
    
    return {
      currentSegment: context.segment,
      personalizedContent: sessionContent.length,
      appliedRules: Array.from(new Set(sessionContent.flatMap(c => c.rules))),
      avgConfidence: sessionContent.length > 0 
        ? sessionContent.reduce((sum, c) => sum + c.metadata.confidence, 0) / sessionContent.length 
        : 0,
      contentPerformance: this.getContentPerformanceInsights(),
      context
    }
  }

  private getContentPerformanceInsights(): any {
    const performance: any = {}
    
    this.contentVariations.forEach((variations, type) => {
      performance[type] = variations.map(v => ({
        id: v.id,
        name: v.name,
        ...v.performance
      }))
    })
    
    return performance
  }
}

// Singleton instance
export const personalizationEngine = new PersonalizationEngine()

// Utility functions
export function getPersonalizedContent(contentType: string, defaultContent: any): any {
  return personalizationEngine.getPersonalizedContent(contentType, defaultContent)
}

export function getPersonalizedRecommendations(limit?: number): ContentRecommendation[] {
  return personalizationEngine.getPersonalizedRecommendations(limit)
}

export function getPersonalizedMessage(messageType: string): string {
  return personalizationEngine.getPersonalizedMessage(messageType)
}

export function getPersonalizationInsights(): any {
  return personalizationEngine.getPersonalizationInsights()
}

export function trackPersonalizationConversion(contentId: string): void {
  // This would be called when a personalized content leads to conversion
  if (typeof document !== 'undefined') {
    const event = new CustomEvent('personalization:conversion', {
      detail: { contentId }
    })
    document.dispatchEvent(event)
  }
}
