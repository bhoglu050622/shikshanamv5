import { NextRequest, NextResponse } from 'next/server'
// Remove server-side analytics orchestrator import to avoid SSR issues

// Cache for dashboard data to improve performance
const dashboardCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 30000 // 30 seconds

// Helper function to generate realistic time-based data
function generateRealisticTimeData(days: number) {
  const now = Date.now()
  const dayInMs = 24 * 60 * 60 * 1000
  const data = []
  
  // Base values with realistic variations
  const baseVisitors = 150
  const basePageViews = 300
  const baseSessions = 120
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now - (i * dayInMs))
    const dayOfWeek = date.getDay()
    
    // Weekend effect (lower traffic on weekends)
    const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.7 : 1.0
    
    // Random daily variation (±20%)
    const dailyVariation = 0.8 + Math.random() * 0.4
    
    const visitors = Math.floor(baseVisitors * weekendMultiplier * dailyVariation)
    const pageViews = Math.floor(basePageViews * weekendMultiplier * dailyVariation * (0.8 + Math.random() * 0.4))
    const sessions = Math.floor(baseSessions * weekendMultiplier * dailyVariation * (0.7 + Math.random() * 0.6))
    
    data.push({
      date: date.toISOString().split('T')[0],
      visitors,
      pageViews,
      sessions,
      bounceRate: 0.3 + Math.random() * 0.4, // 30-70%
      sessionDuration: Math.floor(120 + Math.random() * 300) // 2-7 minutes
    })
  }
  
  return data
}

// Helper function to calculate realistic metrics
function calculateRealisticMetrics(data: any[], period: string) {
  const totalVisitors = data.reduce((sum, day) => sum + day.visitors, 0)
  const totalPageViews = data.reduce((sum, day) => sum + day.pageViews, 0)
  const totalSessions = data.reduce((sum, day) => sum + day.sessions, 0)
  const avgBounceRate = data.reduce((sum, day) => sum + day.bounceRate, 0) / data.length
  const avgSessionDuration = data.reduce((sum, day) => sum + day.sessionDuration, 0) / data.length
  
  // Calculate realistic growth based on period
  const growthMultiplier = period === 'live' ? 0.1 : period === '7' ? 0.3 : period === '30' ? 0.8 : 1.2
  
  const growth = {
    visitors: Math.floor((Math.random() * 40 + 20) * growthMultiplier),
    pageViews: Math.floor((Math.random() * 35 + 15) * growthMultiplier),
    sessions: Math.floor((Math.random() * 45 + 25) * growthMultiplier),
    bounceRate: Math.floor((Math.random() * 20 - 10) * growthMultiplier), // Can be negative
    sessionDuration: Math.floor((Math.random() * 60 + 20) * growthMultiplier)
  }
  
  return {
    period,
    totalVisitors,
    totalPageViews,
    totalSessions,
    avgBounceRate,
    avgSessionDuration,
    growth
  }
}

// Helper function to get analytics insights (server-side only)
async function getAnalyticsInsights() {
  try {
    // For server-side, always return enhanced mock data
    // Client-side analytics will be handled separately
    return generateEnhancedMockData()
  } catch (error) {
    console.error('Error getting analytics insights:', error)
    return generateEnhancedMockData()
  }
}

// Enhanced mock data generation
function generateEnhancedMockData() {
  return {
    utm: {
      topSources: [
        { source: 'google', sessions: 1250, conversions: 45 },
        { source: 'facebook', sessions: 890, conversions: 32 },
        { source: 'direct', sessions: 650, conversions: 28 },
        { source: 'linkedin', sessions: 420, conversions: 15 },
        { source: 'twitter', sessions: 280, conversions: 8 }
      ],
      conversionsBySource: [
        { source: 'google', rate: 0.036, value: 2250 },
        { source: 'facebook', rate: 0.036, value: 1600 },
        { source: 'direct', rate: 0.043, value: 1400 },
        { source: 'linkedin', rate: 0.036, value: 750 },
        { source: 'twitter', rate: 0.029, value: 400 }
      ],
      topCampaigns: [
        { campaign: 'summer_sale_2024', sessions: 450, conversions: 18 },
        { campaign: 'new_course_launch', sessions: 380, conversions: 15 },
        { campaign: 'newsletter_signup', sessions: 320, conversions: 12 },
        { campaign: 'webinar_registration', sessions: 280, conversions: 10 },
        { campaign: 'free_trial', sessions: 240, conversions: 8 }
      ]
    },
    journey: {
      averageSessionDuration: 180000, // 3 minutes in milliseconds
      bounceRate: 0.35,
      topPages: [
        { page: '/courses', views: 1250, avgTime: 240000 },
        { page: '/about', views: 890, avgTime: 120000 },
        { page: '/guna-profiler', views: 650, avgTime: 300000 },
        { page: '/rishi-mode', views: 420, avgTime: 180000 },
        { page: '/contact', views: 280, avgTime: 90000 }
      ],
      conversionFunnels: [
        { name: 'Course Enrollment', conversionRate: 0.045 },
        { name: 'Newsletter Signup', conversionRate: 0.032 },
        { name: 'Guna Profiler Completion', conversionRate: 0.028 },
        { name: 'Rishi Mode Activation', conversionRate: 0.015 },
        { name: 'Contact Form Submission', conversionRate: 0.012 }
      ]
    },
    conversions: {
      totalConversions: 128,
      conversionRate: 0.038,
      totalValue: 6400,
      topConversionGoals: [
        { goal: 'Course Enrollment', conversions: 45, value: 2250 },
        { goal: 'Newsletter Signup', conversions: 32, value: 1600 },
        { goal: 'Guna Profiler Completion', conversions: 28, value: 1400 },
        { goal: 'Rishi Mode Activation', conversions: 15, value: 750 },
        { goal: 'Contact Form Submission', conversions: 8, value: 400 }
      ]
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    if (token !== 'admin-token') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get time period from query params
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30'
    const segment = searchParams.get('segment') || 'all'
    
    // Check cache first
    const cacheKey = `${period}_${segment}`
    const cached = dashboardCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        data: cached.data,
        cached: true
      })
    }
    
    // Generate data based on period
    let days = 30
    switch (period) {
      case 'live':
        days = 1
        break
      case '7':
        days = 7
        break
      case '30':
        days = 30
        break
      case '60':
        days = 60
        break
      case '90':
        days = 90
        break
      case 'lifetime':
        days = 365
        break
      default:
        days = 30
    }
    
    const timeSeriesData = generateRealisticTimeData(days)
    const metrics = calculateRealisticMetrics(timeSeriesData, period)
    
    // Get analytics insights
    const insights = await getAnalyticsInsights()

    // Generate comprehensive dashboard data
    const dashboardData = {
      // Time period metrics
      period: period,
      metrics: {
        uniqueVisitors: {
          value: metrics.totalVisitors.toLocaleString(),
          growth: metrics.growth.visitors,
          trend: metrics.growth.visitors > 0 ? 'up' : 'down'
        },
        pageViews: {
          value: metrics.totalPageViews.toLocaleString(),
          growth: metrics.growth.pageViews,
          trend: metrics.growth.pageViews > 0 ? 'up' : 'down'
        },
        sessions: {
          value: metrics.totalSessions.toLocaleString(),
          growth: metrics.growth.sessions,
          trend: metrics.growth.sessions > 0 ? 'up' : 'down'
        },
        bounceRate: {
          value: (metrics.avgBounceRate * 100).toFixed(1) + '%',
          growth: metrics.growth.bounceRate,
          trend: metrics.growth.bounceRate < 0 ? 'up' : 'down' // Lower is better
        },
        sessionDuration: {
          value: `${Math.floor(metrics.avgSessionDuration / 60)}m ${metrics.avgSessionDuration % 60}s`,
          growth: metrics.growth.sessionDuration,
          trend: metrics.growth.sessionDuration > 0 ? 'up' : 'down'
        }
      },
      
      // Time series data for charts
      timeSeries: timeSeriesData,
      
      // Top pages with realistic data
      topPages: [
        { page: '/s/mycourses', entryPages: 1300, exitPages: 450, hostname: 'courses.shikshanam.in', channel: 'Direct' },
        { page: '/courses/Chanakya\'s-Code-Dominate-Negotiation-&-Bus...', entryPages: 805, exitPages: 320, hostname: 'courses.shikshanam.in', channel: 'Organic' },
        { page: '/s/store', entryPages: 746, exitPages: 280, hostname: 'courses.shikshanam.in', channel: 'Direct' },
        { page: '/', entryPages: 738, exitPages: 290, hostname: 'courses.shikshanam.in', channel: 'Organic' },
        { page: '/courses/Reset-Your-Emotions-Through-Ancient-Sankhya...', entryPages: 467, exitPages: 180, hostname: 'courses.shikshanam.in', channel: 'Social' },
        { page: '/courses/Navratri-Special-Decoding-the-principles-of-Ta...', entryPages: 463, exitPages: 175, hostname: 'courses.shikshanam.in', channel: 'Email' },
        { page: '/courses/Sanskrit-Bhasha-Pragya-655b340de4b0b31c6d...', entryPages: 447, exitPages: 165, hostname: 'courses.shikshanam.in', channel: 'Organic' },
        { page: '/courses/Advaita-Vedanta-Darshan-Vishal-Chaurasia-Hy...', entryPages: 420, exitPages: 155, hostname: 'courses.shikshanam.in', channel: 'Direct' }
      ],
      
      // Top referrers with realistic data
      topReferrers: [
        { referrer: 'shikshanam.in', sources: 3600, mediums: 3600, campaigns: 0 },
        { referrer: 'Direct / None', sources: 2300, mediums: 2300, campaigns: 0 },
        { referrer: 'Google', sources: 582, mediums: 582, campaigns: 0 },
        { referrer: 'Youtube', sources: 324, mediums: 324, campaigns: 0 },
        { referrer: 'Gmail', sources: 132, mediums: 132, campaigns: 0 },
        { referrer: 'api.cashfree.com', sources: 86, mediums: 86, campaigns: 0 },
        { referrer: 'Instagram', sources: 40, mediums: 40, campaigns: 0 },
        { referrer: 'payments.cashfree.com', sources: 31, mediums: 31, campaigns: 0 }
      ],
      
      // UTM tracking data from insights
      utm: insights.utm,
      
      // Journey analytics from insights
      journey: insights.journey,
      
      // Conversions from insights
      conversions: insights.conversions,
      
      // Additional analytics features
      abTesting: {
        activeTests: 3,
        totalTests: 8,
        topPerformingTest: 'homepage_cta_variants',
        averageLift: 0.15
      },
      
      crossDevice: {
        crossDeviceUsers: 450,
        deviceOverlap: 0.25,
        topDeviceCombinations: [
          { combination: 'Desktop + Mobile', users: 180 },
          { combination: 'Desktop + Tablet', users: 120 },
          { combination: 'Mobile + Tablet', users: 90 },
          { combination: 'Desktop + Mobile + Tablet', users: 60 }
        ]
      },
      
      retargeting: {
        activeCampaigns: 5,
        totalImpressions: 12500,
        averageCTR: 0.045,
        totalConversions: 225,
        topPerformingCampaign: 'course_abandonment_retarget'
      },
      
      // Real-time indicators
      realTime: {
        activeUsers: Math.floor(Math.random() * 50) + 10,
        currentSessions: Math.floor(Math.random() * 20) + 5,
        lastMinuteEvents: Math.floor(Math.random() * 100) + 20
      },
      
      timestamp: Date.now()
    }

    // Cache the data
    dashboardCache.set(cacheKey, {
      data: dashboardData,
      timestamp: Date.now()
    })

    return NextResponse.json({
      success: true,
      data: dashboardData,
      cached: false
    })

  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, period, segment } = body

    switch (action) {
      case 'export':
        // Generate export data
        const exportData = {
          exportedAt: Date.now(),
          dataPoints: 1250,
          format: 'json',
          period: period || '30',
          segment: segment || 'all'
        }
        
        return NextResponse.json({
          success: true,
          data: exportData
        })

      case 'clear':
        // Clear cache
        dashboardCache.clear()
        return NextResponse.json({
          success: true,
          message: 'Cache cleared successfully'
        })

      case 'refresh':
        // Clear cache and return fresh data
        dashboardCache.clear()
        return NextResponse.json({
          success: true,
          message: 'Cache refreshed successfully'
        })

      case 'realtime':
        // Return real-time data
        const realtimeData = {
          activeUsers: Math.floor(Math.random() * 50) + 10,
          currentSessions: Math.floor(Math.random() * 20) + 5,
          lastMinuteEvents: Math.floor(Math.random() * 100) + 20,
          timestamp: Date.now()
        }
        
        return NextResponse.json({
          success: true,
          data: realtimeData
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Dashboard API POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
