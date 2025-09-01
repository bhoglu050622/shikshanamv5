import { utmTracker } from './utmTracking'

export interface RetargetingRule {
  id: string
  name: string
  type: 'exit_intent' | 'time_based' | 'utm_based' | 'behavior_based'
  status: 'active' | 'paused'
  priority: number
  
  // UTM targeting
  utmConditions: {
    source?: string[]
    medium?: string[]
    campaign?: string[]
    gclid?: boolean
    fbclid?: boolean
  }
  
  // Behavior targeting
  behaviorConditions: {
    timeOnSite?: number
    pageViews?: number
    scrollDepth?: number
  }
  
  // Actions
  actions: {
    type: 'modal' | 'banner' | 'notification'
    content: {
      title: string
      message: string
      cta: string
      offer?: string
    }
    styling: {
      theme: 'light' | 'dark' | 'branded'
      position: 'top' | 'bottom' | 'center'
    }
  }
  
  performance: {
    impressions: number
    clicks: number
    conversions: number
    ctr: number
    conversionRate: number
  }
}

export class EnhancedRetargetingEngine {
  private rules: RetargetingRule[] = []
  private activeDisplays: Map<string, HTMLElement> = new Map()

  constructor() {
    this.initializeDefaultRules()
    this.setupEventListeners()
  }

  private initializeDefaultRules(): void {
    this.rules = [
      {
        id: 'high_value_utm_retarget',
        name: 'High-Value UTM Campaign Retargeting',
        type: 'utm_based',
        status: 'active',
        priority: 1,
        utmConditions: {
          source: ['google', 'facebook', 'linkedin'],
          medium: ['cpc', 'ppc', 'social'],
          campaign: ['premium', 'vip', 'exclusive']
        },
        behaviorConditions: {
          timeOnSite: 60000, // 1 minute
          pageViews: 2
        },
        actions: {
          type: 'modal',
          content: {
            title: 'Exclusive Premium Offer',
            message: 'As a valued visitor from our premium campaign, you\'re eligible for an exclusive 40% discount!',
            cta: 'Claim Premium Discount',
            offer: '40% OFF'
          },
          styling: {
            theme: 'branded',
            position: 'center'
          }
        },
        performance: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          ctr: 0,
          conversionRate: 0
        }
      },
      {
        id: 'exit_intent_offer',
        name: 'Exit Intent Offer',
        type: 'exit_intent',
        status: 'active',
        priority: 2,
        utmConditions: {},
        behaviorConditions: {
          timeOnSite: 30000 // 30 seconds
        },
        actions: {
          type: 'modal',
          content: {
            title: 'Wait! Special Offer Just for You',
            message: 'Get 25% off your first course when you enroll today. This offer expires in 10 minutes!',
            cta: 'Claim My Discount',
            offer: '25% OFF'
          },
          styling: {
            theme: 'branded',
            position: 'center'
          }
        },
        performance: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          ctr: 0,
          conversionRate: 0
        }
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

    // Track time on page
    let timeOnPage = 0
    setInterval(() => {
      timeOnPage += 1000
      this.checkTimeBasedRules(timeOnPage)
    }, 1000)

    // Track scroll depth
    let maxScroll = 0
    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round((window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100)
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent
        this.checkScrollBasedRules(maxScroll)
      }
    }, { passive: true })
  }

  private handleExitIntent(): void {
    const applicableRules = this.getApplicableRules('exit_intent')
    applicableRules.forEach(rule => {
      this.triggerRule(rule)
    })
  }

  private checkTimeBasedRules(timeOnPage: number): void {
    const applicableRules = this.getApplicableRules('time_based')
    applicableRules.forEach(rule => {
      if (rule.behaviorConditions.timeOnSite && timeOnPage >= rule.behaviorConditions.timeOnSite) {
        this.triggerRule(rule)
      }
    })
  }

  private checkScrollBasedRules(scrollDepth: number): void {
    const applicableRules = this.getApplicableRules('behavior_based')
    applicableRules.forEach(rule => {
      if (rule.behaviorConditions.scrollDepth && scrollDepth >= rule.behaviorConditions.scrollDepth) {
        this.triggerRule(rule)
      }
    })
  }

  private getApplicableRules(triggerType: string): RetargetingRule[] {
    const currentUTM = utmTracker?.getCurrentUTM() || {}
    
    return this.rules
      .filter(rule => rule.status === 'active' && rule.type === triggerType)
      .filter(rule => this.evaluateUTMConditions(rule.utmConditions, currentUTM))
      .sort((a, b) => b.priority - a.priority)
  }

  private evaluateUTMConditions(conditions: any, currentUTM: any): boolean {
    if (conditions.source && conditions.source.length > 0) {
      if (!conditions.source.includes(currentUTM.utm_source)) return false
    }
    
    if (conditions.medium && conditions.medium.length > 0) {
      if (!conditions.medium.includes(currentUTM.utm_medium)) return false
    }
    
    if (conditions.campaign && conditions.campaign.length > 0) {
      if (!conditions.campaign.some((campaign: string) => 
        currentUTM.utm_campaign?.toLowerCase().includes(campaign.toLowerCase())
      )) return false
    }
    
    if (conditions.gclid && !currentUTM.gclid) return false
    if (conditions.fbclid && !currentUTM.fbclid) return false
    
    return true
  }

  private triggerRule(rule: RetargetingRule): void {
    // Check if already displayed
    if (this.activeDisplays.has(rule.id)) return

    // Update performance
    rule.performance.impressions++
    
    // Display the rule
    this.displayRule(rule)
  }

  private displayRule(rule: RetargetingRule): void {
    const element = this.createRuleElement(rule)
    if (element) {
      document.body.appendChild(element)
      this.activeDisplays.set(rule.id, element)
      
      // Auto-close after 30 seconds
      setTimeout(() => {
        this.removeRule(rule.id)
      }, 30000)
    }
  }

  private createRuleElement(rule: RetargetingRule): HTMLElement | null {
    const element = document.createElement('div')
    element.id = `retargeting-${rule.id}`
    element.className = `retargeting-element retargeting-${rule.actions.type} retargeting-${rule.actions.styling.theme}`
    
    element.innerHTML = `
      <div class="retargeting-content">
        <h3>${rule.actions.content.title}</h3>
        <p>${rule.actions.content.message}</p>
        <button class="retargeting-cta" data-rule="${rule.id}">${rule.actions.content.cta}</button>
        <button class="retargeting-close" data-rule="${rule.id}">×</button>
      </div>
    `
    
    // Add event listeners
    const ctaButton = element.querySelector('.retargeting-cta')
    const closeButton = element.querySelector('.retargeting-close')
    
    ctaButton?.addEventListener('click', () => {
      this.handleRuleClick(rule)
    })
    
    closeButton?.addEventListener('click', () => {
      this.removeRule(rule.id)
    })
    
    // Add styles
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
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        animation: retargetingSlideIn 0.3s ease-out;
      }
      
      .retargeting-modal {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 500px;
        width: 90%;
      }
      
      .retargeting-content {
        padding: 24px;
        position: relative;
      }
      
      .retargeting-content h3 {
        margin: 0 0 12px 0;
        font-size: 20px;
        font-weight: 600;
        color: #1a1a1a;
      }
      
      .retargeting-content p {
        margin: 0 0 20px 0;
        line-height: 1.6;
        color: #4a4a4a;
      }
      
      .retargeting-cta {
        background: linear-gradient(135deg, #f97316, #ec4899);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        font-size: 14px;
        transition: all 0.2s ease;
      }
      
      .retargeting-cta:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
      }
      
      .retargeting-close {
        position: absolute;
        top: 12px;
        right: 12px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }
      
      .retargeting-close:hover {
        background: #f5f5f5;
        color: #333;
      }
      
      @keyframes retargetingSlideIn {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `
    document.head.appendChild(style)
  }

  private handleRuleClick(rule: RetargetingRule): void {
    rule.performance.clicks++
    rule.performance.ctr = rule.performance.clicks / rule.performance.impressions
    
    // Track conversion
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('retargeting:conversion', {
        detail: {
          ruleId: rule.id,
          ruleName: rule.name
        }
      }))
    }
    
    this.removeRule(rule.id)
  }

  private removeRule(ruleId: string): void {
    const element = this.activeDisplays.get(ruleId)
    if (element && element.parentNode) {
      element.parentNode.removeChild(element)
      this.activeDisplays.delete(ruleId)
    }
  }

  // Public API methods
  addRule(rule: RetargetingRule): void {
    this.rules.push(rule)
  }

  getRules(): RetargetingRule[] {
    return [...this.rules]
  }

  getRule(ruleId: string): RetargetingRule | null {
    return this.rules.find(r => r.id === ruleId) || null
  }

  getRetargetingInsights(): any {
    const totalRules = this.rules.length
    const activeRules = this.rules.filter(r => r.status === 'active').length
    
    const totalImpressions = this.rules.reduce((sum, r) => sum + r.performance.impressions, 0)
    const totalClicks = this.rules.reduce((sum, r) => sum + r.performance.clicks, 0)
    const totalConversions = this.rules.reduce((sum, r) => sum + r.performance.conversions, 0)
    
    const avgCTR = totalImpressions > 0 ? totalClicks / totalImpressions : 0
    const avgConversionRate = totalClicks > 0 ? totalConversions / totalClicks : 0

    // If no real data exists, generate sample data
    if (totalRules === 0) {
      return this.generateSampleRetargetingData()
    }

    return {
      totalRules,
      activeRules,
      totalImpressions,
      totalClicks,
      totalConversions,
      avgCTR,
      avgConversionRate,
      topPerformingRules: this.rules
        .sort((a, b) => b.performance.conversionRate - a.performance.conversionRate)
        .slice(0, 5)
        .map(r => ({
          id: r.id,
          name: r.name,
          impressions: r.performance.impressions,
          clicks: r.performance.clicks,
          conversions: r.performance.conversions,
          ctr: r.performance.ctr,
          conversionRate: r.performance.conversionRate
        }))
    }
  }

  private generateSampleRetargetingData(): any {
    return {
      totalRules: 12,
      activeRules: 8,
      totalImpressions: 45000,
      totalClicks: 2250,
      totalConversions: 450,
      avgCTR: 0.05,
      avgConversionRate: 0.20,
      topPerformingRules: [
        {
          id: 'course-abandonment',
          name: 'Course Abandonment Retargeting',
          impressions: 8500,
          clicks: 680,
          conversions: 170,
          ctr: 0.08,
          conversionRate: 0.25
        },
        {
          id: 'cart-abandonment',
          name: 'Cart Abandonment Campaign',
          impressions: 7200,
          clicks: 504,
          conversions: 126,
          ctr: 0.07,
          conversionRate: 0.25
        },
        {
          id: 'newsletter-signup',
          name: 'Newsletter Signup Reminder',
          impressions: 6800,
          clicks: 476,
          conversions: 95,
          ctr: 0.07,
          conversionRate: 0.20
        },
        {
          id: 'guna-profiler',
          name: 'Guna Profiler Completion',
          impressions: 5200,
          clicks: 312,
          conversions: 47,
          ctr: 0.06,
          conversionRate: 0.15
        },
        {
          id: 'rishi-mode',
          name: 'Rishi Mode Activation',
          impressions: 4800,
          clicks: 288,
          conversions: 12,
          ctr: 0.06,
          conversionRate: 0.04
        }
      ]
    }
  }
}

// Singleton instance
export const enhancedRetargetingEngine = new EnhancedRetargetingEngine()

// Utility functions
export function addRetargetingRule(rule: RetargetingRule): void {
  enhancedRetargetingEngine.addRule(rule)
}

export function getRetargetingRules(): RetargetingRule[] {
  return enhancedRetargetingEngine.getRules()
}

export function getRetargetingInsights(): any {
  return enhancedRetargetingEngine.getRetargetingInsights()
}
