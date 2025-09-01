import { UTMParameters, TrafficSource, utmTracker } from './utmTracking'
import { UserBehaviorPattern, journeyTracker } from './journeyTracking'
import { segmentationEngine, getCurrentUserSegment } from './behavioralSegmentation'
import { analyticsStorage, ConversionEvent } from './analyticsStorage'
import { personalizationEngine } from './personalizationEngine'

export interface RetargetingCampaign {
  id: string
  name: string
  description: string
  type: 'exit_intent' | 'time_based' | 'behavior_based' | 'utm_based' | 'abandonment'
  status: 'active' | 'paused' | 'draft'
  priority: number
  triggers: RetargetingTrigger[]
  conditions: RetargetingCondition[]
  actions: RetargetingAction[]
  targeting: RetargetingTargeting
  schedule: RetargetingSchedule
  performance: RetargetingPerformance
  created: number
  updated: number
}

export interface RetargetingTrigger {
  id: string
  type: 'page_exit' | 'time_on_page' | 'scroll_depth' | 'inactivity' | 'utm_campaign' | 'conversion_abandonment'
  conditions: {
    operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains'
    value: any
    timeWindow?: number // in milliseconds
  }[]
  frequency: 'once' | 'daily' | 'weekly' | 'always'
  cooldown: number // in milliseconds
}

export interface RetargetingCondition {
  type: 'segment' | 'utm' | 'behavior' | 'device' | 'time' | 'location'
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in'
  field: string
  value: any
  weight: number
}

export interface RetargetingAction {
  type: 'modal' | 'banner' | 'notification' | 'redirect' | 'email_trigger' | 'sms_trigger'
  content: {
    title?: string
    message: string
    cta?: string
    offer?: string
    image?: string
    urgency?: boolean
  }
  styling: {
    theme: 'light' | 'dark' | 'branded'
    position?: 'top' | 'bottom' | 'center' | 'corner'
    animation?: 'slide' | 'fade' | 'pop'
  }
  behavior: {
    autoClose?: number // in milliseconds
    requireAction?: boolean
    persistent?: boolean
  }
}

export interface RetargetingTargeting {
  segments: string[]
  utmSources: string[]
  utmCampaigns: string[]
  devices: string[]
  locations: string[]
  excludeSegments: string[]
  frequency: 'once' | 'daily' | 'weekly'
  maxImpressions: number
  maxConversions: number
}

export interface RetargetingSchedule {
  startDate: number
  endDate?: number
  activeDays: number[] // 0-6 (Sunday-Saturday)
  activeHours: number[] // 0-23
  timezone: string
}

export interface RetargetingPerformance {
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  conversionRate: number
  revenue: number
  cost: number
  roi: number
  lastTriggered: number
}

export interface RetargetingSession {
  sessionId: string
  userId?: string
  campaigns: Array<{
    campaignId: string
    triggered: number
    displayed: number
    clicked: number
    converted: number
    dismissed: number
  }>
  triggers: Array<{
    triggerId: string
    campaignId: string
    timestamp: number
    context: any
  }>
}

export class RetargetingEngine {
  private campaigns: RetargetingCampaign[] = []
  private activeSessions: Map<string, RetargetingSession> = new Map()
  private triggerHistory: Map<string, number> = new Map() // triggerId -> lastTriggered
  private displayQueue: Array<{ campaign: RetargetingCampaign; context: any }> = []

  constructor() {
    this.initializeDefaultCampaigns()
    this.setupEventListeners()
    this.startRetargetingLoop()
  }

  private initializeDefaultCampaigns(): void {
    this.campaigns = [
      // Exit Intent - High Value Offer
      {
        id: 'exit_intent_premium',
        name: 'Exit Intent Premium Offer',
        description: 'Show premium offer when user tries to leave',
        type: 'exit_intent',
        status: 'active',
        priority: 1,
        triggers: [
          {
            id: 'exit_intent_trigger',
            type: 'page_exit',
            conditions: [
              { operator: 'greater_than', value: 30000 } // 30 seconds on page
            ],
            frequency: 'once',
            cooldown: 24 * 60 * 60 * 1000 // 24 hours
          }
        ],
        conditions: [
          { type: 'segment', operator: 'in', field: 'segment', value: ['high_intent_prospects', 'paid_first_visitors'], weight: 1.0 }
        ],
        actions: [
          {
            type: 'modal',
            content: {
              title: 'Wait! Special Offer Just for You',
              message: 'Get 25% off your first course when you enroll today. This offer expires in 10 minutes!',
              cta: 'Claim My Discount',
              offer: '25% OFF',
              urgency: true
            },
            styling: {
              theme: 'branded',
              position: 'center',
              animation: 'pop'
            },
            behavior: {
              autoClose: 30000,
              requireAction: true,
              persistent: true
            }
          }
        ],
        targeting: {
          segments: ['high_intent_prospects', 'paid_first_visitors'],
          utmSources: [],
          utmCampaigns: [],
          devices: ['desktop', 'tablet'],
          locations: [],
          excludeSegments: ['low_engagement'],
          frequency: 'once',
          maxImpressions: 1000,
          maxConversions: 100
        },
        schedule: {
          startDate: Date.now(),
          activeDays: [0, 1, 2, 3, 4, 5, 6],
          activeHours: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
          timezone: 'UTC'
        },
        performance: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          ctr: 0,
          conversionRate: 0,
          revenue: 0,
          cost: 0,
          roi: 0,
          lastTriggered: 0
        },
        created: Date.now(),
        updated: Date.now()
      },

      // UTM Campaign Retargeting
      {
        id: 'utm_campaign_retarget',
        name: 'UTM Campaign Retargeting',
        description: 'Retarget users from specific UTM campaigns',
        type: 'utm_based',
        status: 'active',
        priority: 2,
        triggers: [
          {
            id: 'utm_retarget_trigger',
            type: 'utm_campaign',
            conditions: [
              { operator: 'contains', value: 'summer_sale' }
            ],
            frequency: 'daily',
            cooldown: 2 * 60 * 60 * 1000 // 2 hours
          }
        ],
        conditions: [
          { type: 'utm', operator: 'contains', field: 'utm_campaign', value: 'summer_sale', weight: 1.0 }
        ],
        actions: [
          {
            type: 'banner',
            content: {
              title: 'Summer Sale Extended!',
              message: 'The summer sale you saw is still active. Don\'t miss out on 30% off all courses!',
              cta: 'Shop Now',
              offer: '30% OFF',
              urgency: true
            },
            styling: {
              theme: 'branded',
              position: 'top',
              animation: 'slide'
            },
            behavior: {
              autoClose: 60000,
              requireAction: false,
              persistent: false
            }
          }
        ],
        targeting: {
          segments: [],
          utmSources: [],
          utmCampaigns: ['summer_sale', 'back_to_school'],
          devices: ['desktop', 'tablet', 'mobile'],
          locations: [],
          excludeSegments: [],
          frequency: 'daily',
          maxImpressions: 500,
          maxConversions: 50
        },
        schedule: {
          startDate: Date.now(),
          activeDays: [0, 1, 2, 3, 4, 5, 6],
          activeHours: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
          timezone: 'UTC'
        },
        performance: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          ctr: 0,
          conversionRate: 0,
          revenue: 0,
          cost: 0,
          roi: 0,
          lastTriggered: 0
        },
        created: Date.now(),
        updated: Date.now()
      },

      // Abandoned Cart Retargeting
      {
        id: 'abandoned_cart_retarget',
        name: 'Abandoned Cart Retargeting',
        description: 'Retarget users who started enrollment but didn\'t complete',
        type: 'abandonment',
        status: 'active',
        priority: 3,
        triggers: [
          {
            id: 'cart_abandonment_trigger',
            type: 'conversion_abandonment',
            conditions: [
              { operator: 'equals', value: 'course_enrollment', timeWindow: 30 * 60 * 1000 } // 30 minutes
            ],
            frequency: 'once',
            cooldown: 6 * 60 * 60 * 1000 // 6 hours
          }
        ],
        conditions: [
          { type: 'behavior', operator: 'contains', field: 'actions', value: 'enrollment_started', weight: 1.0 }
        ],
        actions: [
          {
            type: 'notification',
            content: {
              title: 'Complete Your Enrollment',
              message: 'You were so close! Complete your course enrollment and start learning today.',
              cta: 'Finish Enrollment',
              urgency: true
            },
            styling: {
              theme: 'light',
              position: 'corner',
              animation: 'fade'
            },
            behavior: {
              autoClose: 45000,
              requireAction: false,
              persistent: false
            }
          }
        ],
        targeting: {
          segments: ['high_intent_prospects'],
          utmSources: [],
          utmCampaigns: [],
          devices: ['desktop', 'tablet', 'mobile'],
          locations: [],
          excludeSegments: [],
          frequency: 'once',
          maxImpressions: 200,
          maxConversions: 20
        },
        schedule: {
          startDate: Date.now(),
          activeDays: [0, 1, 2, 3, 4, 5, 6],
          activeHours: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
          timezone: 'UTC'
        },
        performance: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          ctr: 0,
          conversionRate: 0,
          revenue: 0,
          cost: 0,
          roi: 0,
          lastTriggered: 0
        },
        created: Date.now(),
        updated: Date.now()
      },

      // Time-based Retargeting
      {
        id: 'time_based_urgency',
        name: 'Time-based Urgency',
        description: 'Show urgency messages based on time spent on site',
        type: 'time_based',
        status: 'active',
        priority: 4,
        triggers: [
          {
            id: 'time_urgency_trigger',
            type: 'time_on_page',
            conditions: [
              { operator: 'greater_than', value: 300000 } // 5 minutes
            ],
            frequency: 'once',
            cooldown: 60 * 60 * 1000 // 1 hour
          }
        ],
        conditions: [
          { type: 'behavior', operator: 'greater_than', field: 'timeOnSite', value: 300000, weight: 1.0 }
        ],
        actions: [
          {
            type: 'banner',
            content: {
              title: 'Limited Time Offer',
              message: 'You\'ve been exploring for a while. Take advantage of our limited-time 15% discount!',
              cta: 'Get Discount',
              offer: '15% OFF',
              urgency: true
            },
            styling: {
              theme: 'dark',
              position: 'bottom',
              animation: 'slide'
            },
            behavior: {
              autoClose: 30000,
              requireAction: false,
              persistent: false
            }
          }
        ],
        targeting: {
          segments: ['course_browsers', 'return_visitors'],
          utmSources: [],
          utmCampaigns: [],
          devices: ['desktop', 'tablet', 'mobile'],
          locations: [],
          excludeSegments: ['low_engagement'],
          frequency: 'once',
          maxImpressions: 300,
          maxConversions: 30
        },
        schedule: {
          startDate: Date.now(),
          activeDays: [0, 1, 2, 3, 4, 5, 6],
          activeHours: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
          timezone: 'UTC'
        },
        performance: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          ctr: 0,
          conversionRate: 0,
          revenue: 0,
          cost: 0,
          roi: 0,
          lastTriggered: 0
        },
        created: Date.now(),
        updated: Date.now()
      }
    ]
  }

  private setupEventListeners(): void {
    if (typeof window === 'undefined') return

    // Exit intent detection
    document.addEventListener('mouseleave', (event) => {
      if (event.clientY <= 0) {
        this.handleExitIntent()
      }
    })

    // Page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.handlePageHidden()
      }
    })

    // Before unload
    window.addEventListener('beforeunload', () => {
      this.handlePageUnload()
    })

    // Track time on page
    let timeOnPage = 0
    setInterval(() => {
      timeOnPage += 1000
      this.checkTimeBasedTriggers(timeOnPage)
    }, 1000)

    // Track scroll depth
    let maxScroll = 0
    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round((window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100)
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent
        this.checkScrollBasedTriggers(maxScroll)
      }
    }, { passive: true })
  }

  private startRetargetingLoop(): void {
    setInterval(() => {
      this.processDisplayQueue()
    }, 5000) // Check every 5 seconds
  }

  private handleExitIntent(): void {
    const context = this.getRetargetingContext()
    const applicableCampaigns = this.getApplicableCampaigns('exit_intent', context)
    
    applicableCampaigns.forEach(campaign => {
      this.triggerCampaign(campaign, context)
    })
  }

  private handlePageHidden(): void {
    const context = this.getRetargetingContext()
    const applicableCampaigns = this.getApplicableCampaigns('page_hidden', context)
    
    applicableCampaigns.forEach(campaign => {
      this.triggerCampaign(campaign, context)
    })
  }

  private handlePageUnload(): void {
    const context = this.getRetargetingContext()
    const applicableCampaigns = this.getApplicableCampaigns('page_unload', context)
    
    applicableCampaigns.forEach(campaign => {
      this.triggerCampaign(campaign, context)
    })
  }

  private checkTimeBasedTriggers(timeOnPage: number): void {
    const context = this.getRetargetingContext()
    const applicableCampaigns = this.getApplicableCampaigns('time_based', context)
    
    applicableCampaigns.forEach(campaign => {
      const trigger = campaign.triggers.find(t => t.type === 'time_on_page')
      if (trigger && this.evaluateTriggerConditions(trigger, { timeOnPage })) {
        this.triggerCampaign(campaign, context)
      }
    })
  }

  private checkScrollBasedTriggers(scrollDepth: number): void {
    const context = this.getRetargetingContext()
    const applicableCampaigns = this.getApplicableCampaigns('scroll_based', context)
    
    applicableCampaigns.forEach(campaign => {
      const trigger = campaign.triggers.find(t => t.type === 'scroll_depth')
      if (trigger && this.evaluateTriggerConditions(trigger, { scrollDepth })) {
        this.triggerCampaign(campaign, context)
      }
    })
  }

  private getRetargetingContext(): any {
    const utmSession = utmTracker?.getSession()
    const userSegment = getCurrentUserSegment()
    const behavior = journeyTracker?.getUserBehaviorPattern()
    const utmParams = utmTracker?.getCurrentUTM() || {}
    const trafficSource = utmTracker?.getTrafficSource()

    return {
      sessionId: utmSession?.id,
      userId: undefined,
      segment: userSegment?.primarySegment.id,
      utm: utmParams,
      trafficSource,
      behavior,
      device: utmSession?.device.type,
      page: window.location.pathname,
      timeOnPage: Date.now() - (utmSession?.firstVisit || Date.now()),
      visitCount: utmSession?.visitCount || 1,
      timestamp: Date.now()
    }
  }

  private getApplicableCampaigns(triggerType: string, context: any): RetargetingCampaign[] {
    return this.campaigns
      .filter(campaign => campaign.status === 'active')
      .filter(campaign => this.isCampaignScheduled(campaign))
      .filter(campaign => this.evaluateCampaignConditions(campaign, context))
      .filter(campaign => this.isWithinTargeting(campaign, context))
      .filter(campaign => this.isWithinFrequency(campaign, context))
      .sort((a, b) => b.priority - a.priority)
  }

  private isCampaignScheduled(campaign: RetargetingCampaign): boolean {
    const now = new Date()
    const currentDay = now.getDay()
    const currentHour = now.getHours()
    
    return campaign.schedule.activeDays.includes(currentDay) &&
           campaign.schedule.activeHours.includes(currentHour)
  }

  private evaluateCampaignConditions(campaign: RetargetingCampaign, context: any): boolean {
    if (campaign.conditions.length === 0) return true

    let totalScore = 0
    let totalWeight = 0

    for (const condition of campaign.conditions) {
      const score = this.evaluateCondition(condition, context)
      totalScore += score * condition.weight
      totalWeight += condition.weight
    }

    return totalWeight > 0 ? (totalScore / totalWeight) >= 0.7 : true
  }

  private evaluateCondition(condition: RetargetingCondition, context: any): number {
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

  private extractContextValue(condition: RetargetingCondition, context: any): any {
    switch (condition.type) {
      case 'segment':
        return condition.field === 'segment' ? context.segment : null
      case 'utm':
        return context.utm[condition.field as keyof typeof context.utm]
      case 'behavior':
        return context.behavior?.[condition.field as keyof typeof context.behavior]
      case 'device':
        return condition.field === 'device_type' ? context.device : null
      case 'time':
        return condition.field === 'time_on_page' ? context.timeOnPage : null
      default:
        return null
    }
  }

  private isWithinTargeting(campaign: RetargetingCampaign, context: any): boolean {
    const targeting = campaign.targeting

    // Check segments
    if (targeting.segments.length > 0 && !targeting.segments.includes(context.segment)) {
      return false
    }

    // Check excluded segments
    if (targeting.excludeSegments.includes(context.segment)) {
      return false
    }

    // Check UTM sources
    if (targeting.utmSources.length > 0 && !targeting.utmSources.includes(context.utm.utm_source)) {
      return false
    }

    // Check UTM campaigns
    if (targeting.utmCampaigns.length > 0 && !targeting.utmCampaigns.includes(context.utm.utm_campaign)) {
      return false
    }

    // Check devices
    if (targeting.devices.length > 0 && !targeting.devices.includes(context.device)) {
      return false
    }

    return true
  }

  private isWithinFrequency(campaign: RetargetingCampaign, context: any): boolean {
    const sessionId = context.sessionId
    const session = this.activeSessions.get(sessionId)
    
    if (!session) return true

    const campaignSession = session.campaigns.find(c => c.campaignId === campaign.id)
    if (!campaignSession) return true

    switch (campaign.targeting.frequency) {
      case 'once':
        return campaignSession.triggered === 0
      case 'daily':
        const today = new Date().toDateString()
        const lastTriggered = new Date(campaignSession.triggered).toDateString()
        return today !== lastTriggered
      case 'weekly':
        const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
        return campaignSession.triggered < weekAgo
      default:
        return true
    }
  }

  private evaluateTriggerConditions(trigger: RetargetingTrigger, data: any): boolean {
    return trigger.conditions.every(condition => {
      // For trigger conditions, we evaluate based on the trigger type and data
      const value = data[trigger.type] || data.value
      
      switch (condition.operator) {
        case 'equals':
          return value === condition.value
        case 'greater_than':
          return Number(value) > Number(condition.value)
        case 'less_than':
          return Number(value) < Number(condition.value)
        case 'contains':
          return String(value).includes(String(condition.value))
        case 'not_contains':
          return !String(value).includes(String(condition.value))
        default:
          return false
      }
    })
  }

  private triggerCampaign(campaign: RetargetingCampaign, context: any): void {
    const sessionId = context.sessionId
    
    // Check cooldown
    const lastTriggered = this.triggerHistory.get(campaign.id) || 0
    const now = Date.now()
    
    if (now - lastTriggered < campaign.triggers[0]?.cooldown) {
      return
    }

    // Check performance limits
    if (campaign.performance.impressions >= campaign.targeting.maxImpressions) {
      return
    }

    // Add to display queue
    this.displayQueue.push({ campaign, context })
    
    // Update trigger history
    this.triggerHistory.set(campaign.id, now)
    
    // Update session
    this.updateSession(sessionId, campaign.id, 'triggered')
    
    // Update performance
    campaign.performance.lastTriggered = now
  }

  private processDisplayQueue(): void {
    if (this.displayQueue.length === 0) return

    const { campaign, context } = this.displayQueue.shift()!
    
    // Display the campaign
    this.displayCampaign(campaign, context)
    
    // Update performance
    campaign.performance.impressions++
    campaign.performance.ctr = campaign.performance.clicks / campaign.performance.impressions
    campaign.performance.conversionRate = campaign.performance.conversions / campaign.performance.impressions
  }

  private displayCampaign(campaign: RetargetingCampaign, context: any): void {
    const action = campaign.actions[0]
    if (!action) return

    // Create and display the retargeting element
    const element = this.createRetargetingElement(action, campaign.id)
    document.body.appendChild(element)

    // Track display
    this.trackCampaignDisplay(campaign, context)
    
    // Set up auto-close if configured
    if (action.behavior.autoClose) {
      setTimeout(() => {
        if (element.parentNode) {
          element.parentNode.removeChild(element)
        }
      }, action.behavior.autoClose)
    }
  }

  private createRetargetingElement(action: RetargetingAction, campaignId: string): HTMLElement {
    const element = document.createElement('div')
    element.id = `retargeting-${campaignId}`
    element.className = `retargeting-element retargeting-${action.type} retargeting-${action.styling.theme}`
    
    element.innerHTML = `
      <div class="retargeting-content">
        ${action.content.title ? `<h3>${action.content.title}</h3>` : ''}
        <p>${action.content.message}</p>
        ${action.content.cta ? `<button class="retargeting-cta" data-campaign="${campaignId}">${action.content.cta}</button>` : ''}
        ${action.behavior.requireAction ? '' : '<button class="retargeting-close" data-campaign="' + campaignId + '">×</button>'}
      </div>
    `

    // Add event listeners
    const ctaButton = element.querySelector('.retargeting-cta')
    const closeButton = element.querySelector('.retargeting-close')

    ctaButton?.addEventListener('click', () => {
      this.handleCampaignClick(campaignId)
      element.remove()
    })

    closeButton?.addEventListener('click', () => {
      this.handleCampaignDismiss(campaignId)
      element.remove()
    })

    // Add CSS styles
    this.addRetargetingStyles()

    return element
  }

  private addRetargetingStyles(): void {
    if (document.getElementById('retargeting-styles')) return

    const style = document.createElement('style')
    style.id = 'retargeting-styles'
    style.textContent = `
      .retargeting-element {
        position: fixed;
        z-index: 10000;
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        padding: 20px;
        max-width: 400px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .retargeting-modal {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      
      .retargeting-banner {
        width: 100%;
        left: 0;
        right: 0;
      }
      
      .retargeting-banner.retargeting-top {
        top: 0;
      }
      
      .retargeting-banner.retargeting-bottom {
        bottom: 0;
      }
      
      .retargeting-notification {
        top: 20px;
        right: 20px;
      }
      
      .retargeting-content h3 {
        margin: 0 0 10px 0;
        font-size: 18px;
        font-weight: 600;
      }
      
      .retargeting-content p {
        margin: 0 0 15px 0;
        line-height: 1.5;
      }
      
      .retargeting-cta {
        background: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
      }
      
      .retargeting-cta:hover {
        background: #0056b3;
      }
      
      .retargeting-close {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #666;
      }
      
      .retargeting-close:hover {
        color: #333;
      }
    `
    document.head.appendChild(style)
  }

  private handleCampaignClick(campaignId: string): void {
    const campaign = this.campaigns.find(c => c.id === campaignId)
    if (!campaign) return

    // Update performance
    campaign.performance.clicks++
    campaign.performance.ctr = campaign.performance.clicks / campaign.performance.impressions

    // Update session
    const sessionId = utmTracker?.getSession().id
    if (sessionId) {
      this.updateSession(sessionId, campaignId, 'clicked')
    }

    // Track conversion if applicable
    this.trackCampaignConversion(campaign)
  }

  private handleCampaignDismiss(campaignId: string): void {
    const sessionId = utmTracker?.getSession().id
    if (sessionId) {
      this.updateSession(sessionId, campaignId, 'dismissed')
    }
  }

  private updateSession(sessionId: string, campaignId: string, action: string): void {
    let session = this.activeSessions.get(sessionId)
    
    if (!session) {
      session = {
        sessionId,
        campaigns: [],
        triggers: []
      }
      this.activeSessions.set(sessionId, session)
    }

    let campaignSession = session.campaigns.find(c => c.campaignId === campaignId)
    
    if (!campaignSession) {
      campaignSession = {
        campaignId,
        triggered: 0,
        displayed: 0,
        clicked: 0,
        converted: 0,
        dismissed: 0
      }
      session.campaigns.push(campaignSession)
    }

    switch (action) {
      case 'triggered':
        campaignSession.triggered = Date.now()
        break
      case 'displayed':
        campaignSession.displayed++
        break
      case 'clicked':
        campaignSession.clicked++
        break
      case 'converted':
        campaignSession.converted++
        break
      case 'dismissed':
        campaignSession.dismissed++
        break
    }
  }

  private trackCampaignDisplay(campaign: RetargetingCampaign, context: any): void {
    // Track with analytics system
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('retargeting:display', {
        detail: {
          campaignId: campaign.id,
          campaignName: campaign.name,
          context
        }
      }))
    }
  }

  private trackCampaignConversion(campaign: RetargetingCampaign): void {
    campaign.performance.conversions++
    campaign.performance.conversionRate = campaign.performance.conversions / campaign.performance.impressions

    // Track with analytics system
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('retargeting:conversion', {
        detail: {
          campaignId: campaign.id,
          campaignName: campaign.name
        }
      }))
    }
  }

  // Public API methods
  addCampaign(campaign: RetargetingCampaign): void {
    this.campaigns.push(campaign)
  }

  updateCampaign(campaignId: string, updates: Partial<RetargetingCampaign>): void {
    const index = this.campaigns.findIndex(c => c.id === campaignId)
    if (index >= 0) {
      this.campaigns[index] = { ...this.campaigns[index], ...updates, updated: Date.now() }
    }
  }

  removeCampaign(campaignId: string): void {
    this.campaigns = this.campaigns.filter(c => c.id !== campaignId)
  }

  getCampaigns(): RetargetingCampaign[] {
    return [...this.campaigns]
  }

  getCampaign(campaignId: string): RetargetingCampaign | null {
    return this.campaigns.find(c => c.id === campaignId) || null
  }

  getRetargetingInsights(): any {
    const totalCampaigns = this.campaigns.length
    const activeCampaigns = this.campaigns.filter(c => c.status === 'active').length
    
    const totalImpressions = this.campaigns.reduce((sum, c) => sum + c.performance.impressions, 0)
    const totalClicks = this.campaigns.reduce((sum, c) => sum + c.performance.clicks, 0)
    const totalConversions = this.campaigns.reduce((sum, c) => sum + c.performance.conversions, 0)
    
    const avgCTR = totalImpressions > 0 ? totalClicks / totalImpressions : 0
    const avgConversionRate = totalClicks > 0 ? totalConversions / totalClicks : 0

    return {
      totalCampaigns,
      activeCampaigns,
      totalImpressions,
      totalClicks,
      totalConversions,
      avgCTR,
      avgConversionRate,
      topPerformingCampaigns: this.campaigns
        .sort((a, b) => b.performance.conversionRate - a.performance.conversionRate)
        .slice(0, 5)
        .map(c => ({
          id: c.id,
          name: c.name,
          impressions: c.performance.impressions,
          clicks: c.performance.clicks,
          conversions: c.performance.conversions,
          ctr: c.performance.ctr,
          conversionRate: c.performance.conversionRate
        }))
    }
  }
}

// Singleton instance
export const retargetingEngine = new RetargetingEngine()

// Utility functions
export function addRetargetingCampaign(campaign: RetargetingCampaign): void {
  retargetingEngine.addCampaign(campaign)
}

export function getRetargetingCampaigns(): RetargetingCampaign[] {
  return retargetingEngine.getCampaigns()
}

export function getRetargetingInsights(): any {
  return retargetingEngine.getRetargetingInsights()
}
