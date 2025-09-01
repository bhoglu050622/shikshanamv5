import { RishiProfile } from '@/data/rishiModeData'

export interface RishiAnalyticsEvent {
  id: string
  sessionId: string
  userId?: string
  eventType: string
  timestamp: number
  data: Record<string, any>
  userAgent?: string
  page: string
}

export interface QuizAnalytics {
  questionId: string
  answer: string
  timeSpent: number
  changedAnswer: boolean
  timestamp: number
}

export interface ProfileAnalytics {
  darshana: string
  chakra: string
  archetype: string
  quizDuration: number
  answersChanged: number
  timestamp: number
}

export interface CourseInteractionAnalytics {
  courseId: string
  courseTitle: string
  action: 'view' | 'click' | 'enroll' | 'wishlist'
  source: 'rishi_recommendations' | 'course_catalog' | 'search'
  recommendationScore?: number
  timestamp: number
}

export interface UserJourneyStep {
  step: string
  timestamp: number
  duration?: number
  completed: boolean
  exitPoint?: boolean
}

export interface RishiSession {
  sessionId: string
  userId?: string
  startTime: number
  endTime?: number
  journey: UserJourneyStep[]
  quizAnswers: QuizAnalytics[]
  profileResult?: ProfileAnalytics
  courseInteractions: CourseInteractionAnalytics[]
  conversionEvents: string[]
  deviceInfo: {
    isMobile: boolean
    browser: string
    os: string
  }
}

export class RishiAnalyticsTracker {
  private sessionId: string
  private session: RishiSession
  private startTime: number
  private stepStartTime: number
  private events: RishiAnalyticsEvent[] = []

  constructor(userId?: string) {
    this.sessionId = this.generateSessionId()
    this.startTime = Date.now()
    this.stepStartTime = this.startTime
    
    this.session = {
      sessionId: this.sessionId,
      userId,
      startTime: this.startTime,
      journey: [],
      quizAnswers: [],
      courseInteractions: [],
      conversionEvents: [],
      deviceInfo: this.getDeviceInfo()
    }

    this.trackEvent('session_start', {})
  }

  private generateSessionId(): string {
    return `rishi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getDeviceInfo() {
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : ''
    return {
      isMobile: /Mobile|Android|iPhone|iPad/.test(userAgent),
      browser: this.getBrowser(userAgent),
      os: this.getOS(userAgent)
    }
  }

  private getBrowser(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari')) return 'Safari'
    if (userAgent.includes('Edge')) return 'Edge'
    return 'Unknown'
  }

  private getOS(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows'
    if (userAgent.includes('Mac')) return 'macOS'
    if (userAgent.includes('Linux')) return 'Linux'
    if (userAgent.includes('Android')) return 'Android'
    if (userAgent.includes('iOS')) return 'iOS'
    return 'Unknown'
  }

  // Core tracking method
  trackEvent(eventType: string, data: Record<string, any>, page: string = 'rishi-mode') {
    const event: RishiAnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      sessionId: this.sessionId,
      userId: this.session.userId,
      eventType,
      timestamp: Date.now(),
      data,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      page
    }

    this.events.push(event)
    
    // Send to analytics service (placeholder)
    this.sendToAnalytics(event)
  }

  // Journey tracking
  trackJourneyStep(step: string, completed: boolean = true) {
    const now = Date.now()
    const duration = now - this.stepStartTime

    const journeyStep: UserJourneyStep = {
      step,
      timestamp: now,
      duration,
      completed
    }

    this.session.journey.push(journeyStep)
    this.trackEvent('journey_step', journeyStep)
    
    this.stepStartTime = now
  }

  trackJourneyExit(step: string) {
    const now = Date.now()
    const duration = now - this.stepStartTime

    const exitStep: UserJourneyStep = {
      step,
      timestamp: now,
      duration,
      completed: false,
      exitPoint: true
    }

    this.session.journey.push(exitStep)
    this.trackEvent('journey_exit', exitStep)
  }

  // Quiz tracking
  trackQuizAnswer(questionId: string, answer: string, timeSpent: number, changedAnswer: boolean = false) {
    const quizData: QuizAnalytics = {
      questionId,
      answer,
      timeSpent,
      changedAnswer,
      timestamp: Date.now()
    }

    this.session.quizAnswers.push(quizData)
    this.trackEvent('quiz_answer', quizData)
  }

  trackQuizCompletion(totalTime: number, answersChanged: number) {
    this.trackEvent('quiz_completed', {
      totalTime,
      answersChanged,
      totalQuestions: this.session.quizAnswers.length
    })
  }

  // Profile result tracking
  trackProfileGeneration(profile: RishiProfile, quizDuration: number, answersChanged: number) {
    const profileData: ProfileAnalytics = {
      darshana: profile.darshana,
      chakra: profile.chakra,
      archetype: profile.archetype,
      quizDuration,
      answersChanged,
      timestamp: Date.now()
    }

    this.session.profileResult = profileData
    this.trackEvent('profile_generated', profileData)
  }

  // Course interaction tracking
  trackCourseInteraction(
    courseId: string,
    courseTitle: string,
    action: 'view' | 'click' | 'enroll' | 'wishlist',
    source: 'rishi_recommendations' | 'course_catalog' | 'search',
    recommendationScore?: number
  ) {
    const interaction: CourseInteractionAnalytics = {
      courseId,
      courseTitle,
      action,
      source,
      recommendationScore,
      timestamp: Date.now()
    }

    this.session.courseInteractions.push(interaction)
    this.trackEvent('course_interaction', interaction)

    // Track conversion events
    if (action === 'enroll') {
      this.session.conversionEvents.push('course_enrollment')
      this.trackEvent('conversion', { type: 'course_enrollment', courseId, source })
    }
  }

  // Recommendation tracking
  trackRecommendationView(recommendations: any[], category: string) {
    this.trackEvent('recommendations_viewed', {
      category,
      count: recommendations.length,
      courseIds: recommendations.map(r => r.course.id),
      averageScore: recommendations.reduce((sum, r) => sum + r.score.score, 0) / recommendations.length
    })
  }

  trackRecommendationClick(courseId: string, position: number, score: number, category: string) {
    this.trackEvent('recommendation_clicked', {
      courseId,
      position,
      score,
      category
    })
  }

  // User engagement tracking
  trackTimeOnStep(step: string, timeSpent: number) {
    this.trackEvent('time_on_step', { step, timeSpent })
  }

  trackScrollDepth(step: string, depth: number) {
    this.trackEvent('scroll_depth', { step, depth })
  }

  trackButtonClick(buttonText: string, step: string) {
    this.trackEvent('button_click', { buttonText, step })
  }

  // Session completion
  endSession() {
    const endTime = Date.now()
    const totalDuration = endTime - this.startTime

    this.session.endTime = endTime
    
    this.trackEvent('session_end', {
      totalDuration,
      stepsCompleted: this.session.journey.filter(s => s.completed).length,
      totalSteps: this.session.journey.length,
      coursesViewed: this.session.courseInteractions.filter(i => i.action === 'view').length,
      conversions: this.session.conversionEvents.length
    })

    // Send complete session data
    this.sendSessionData()
  }

  // Analytics data methods
  getSessionData(): RishiSession {
    return { ...this.session }
  }

  getEvents(): RishiAnalyticsEvent[] {
    return [...this.events]
  }

  // Send data to analytics service
  private async sendToAnalytics(event: RishiAnalyticsEvent) {
    try {
      // In development, log to console
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Rishi Analytics:', event)
        return
      }

      // In production, send to analytics service
      await fetch('/api/analytics/rishi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      })
    } catch (error) {
      console.error('Analytics tracking failed:', error)
    }
  }

  private async sendSessionData() {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Rishi Session Complete:', this.session)
        return
      }

      await fetch('/api/analytics/rishi/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.session)
      })
    } catch (error) {
      console.error('Session data upload failed:', error)
    }
  }
}

// Utility functions for analytics insights
export function calculateConversionRate(sessions: RishiSession[]): number {
  const totalSessions = sessions.length
  const convertedSessions = sessions.filter(s => s.conversionEvents.length > 0).length
  return totalSessions > 0 ? convertedSessions / totalSessions : 0
}

export function getPopularDarshanas(sessions: RishiSession[]): Record<string, number> {
  const darshanaCounts: Record<string, number> = {}
  
  sessions.forEach(session => {
    if (session.profileResult) {
      const darshana = session.profileResult.darshana
      darshanaCounts[darshana] = (darshanaCounts[darshana] || 0) + 1
    }
  })

  return darshanaCounts
}

export function getAverageQuizTime(sessions: RishiSession[]): number {
  const completedQuizzes = sessions.filter(s => s.profileResult?.quizDuration)
  if (completedQuizzes.length === 0) return 0

  const totalTime = completedQuizzes.reduce((sum, s) => sum + (s.profileResult?.quizDuration || 0), 0)
  return totalTime / completedQuizzes.length
}

export function getDropoffPoints(sessions: RishiSession[]): Record<string, number> {
  const dropoffs: Record<string, number> = {}

  sessions.forEach(session => {
    const exitPoints = session.journey.filter(step => step.exitPoint)
    exitPoints.forEach(point => {
      dropoffs[point.step] = (dropoffs[point.step] || 0) + 1
    })
  })

  return dropoffs
}

export function getCoursePerformance(sessions: RishiSession[]): Record<string, {
  views: number
  clicks: number
  enrollments: number
  conversionRate: number
}> {
  const courseStats: Record<string, { views: number; clicks: number; enrollments: number }> = {}

  sessions.forEach(session => {
    session.courseInteractions.forEach(interaction => {
      const courseId = interaction.courseId
      if (!courseStats[courseId]) {
        courseStats[courseId] = { views: 0, clicks: 0, enrollments: 0 }
      }

      switch (interaction.action) {
        case 'view':
          courseStats[courseId].views++
          break
        case 'click':
          courseStats[courseId].clicks++
          break
        case 'enroll':
          courseStats[courseId].enrollments++
          break
      }
    })
  })

  // Calculate conversion rates
  const performance: Record<string, {
    views: number
    clicks: number
    enrollments: number
    conversionRate: number
  }> = {}

  Object.entries(courseStats).forEach(([courseId, stats]) => {
    performance[courseId] = {
      ...stats,
      conversionRate: stats.views > 0 ? stats.enrollments / stats.views : 0
    }
  })

  return performance
}

// Export singleton instance
export const rishiAnalytics = typeof window !== 'undefined' ? new RishiAnalyticsTracker() : null
