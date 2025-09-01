import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const enrollmentData = await request.json()
    
    // In development, log enrollment details
    if (process.env.NODE_ENV === 'development') {
      console.log('📝 Rishi Enrollment Analytics:', {
        enrollmentId: enrollmentData.enrollmentId,
        courseId: enrollmentData.courseId,
        source: enrollmentData.source,
        darshana: enrollmentData.rishiProfile?.darshana,
        recommendationScore: enrollmentData.recommendationScore,
        discount: enrollmentData.discount,
        timestamp: new Date(enrollmentData.timestamp).toISOString()
      })
      
      return NextResponse.json({ success: true, message: 'Enrollment logged' })
    }

    // In production, process enrollment analytics
    await processEnrollmentAnalytics(enrollmentData)
    
    return NextResponse.json({ success: true, message: 'Enrollment analytics processed' })

  } catch (error) {
    console.error('Enrollment analytics error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process enrollment analytics' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || '30d'
    const darshana = searchParams.get('darshana')
    const courseId = searchParams.get('courseId')

    // Generate enrollment analytics report
    const analytics = await generateEnrollmentAnalytics(timeframe, darshana, courseId)
    
    return NextResponse.json({
      success: true,
      data: analytics,
      filters: { timeframe, darshana, courseId }
    })

  } catch (error) {
    console.error('Enrollment analytics retrieval error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve enrollment analytics' },
      { status: 500 }
    )
  }
}

async function processEnrollmentAnalytics(data: any) {
  // Process enrollment for various analytics purposes
  
  // 1. Update recommendation algorithm performance
  await updateRecommendationPerformance(data)
  
  // 2. Track darshana-based conversion patterns
  await trackDarshanaConversions(data)
  
  // 3. Analyze pricing and discount effectiveness
  await analyzePricingEffectiveness(data)
  
  // 4. Update course popularity metrics
  await updateCourseMetrics(data)
  
  // 5. Track source attribution
  await trackSourceAttribution(data)
  
  console.log('Enrollment analytics processed:', {
    enrollmentId: data.enrollmentId,
    patterns: 'analyzed',
    metrics: 'updated'
  })
}

async function updateRecommendationPerformance(data: any) {
  if (!data.recommendationScore) return
  
  // Track how well our recommendation algorithm performs
  // High scores that convert validate the algorithm
  const { recommendationScore, courseId, rishiProfile } = data
  
  console.log('Recommendation performance update:', {
    courseId,
    score: recommendationScore,
    darshana: rishiProfile?.darshana,
    converted: true
  })
  
  // In production, you would:
  // - Update ML model weights
  // - Adjust scoring algorithms
  // - Track prediction accuracy
  // - Optimize for conversion
}

async function trackDarshanaConversions(data: any) {
  if (!data.rishiProfile?.darshana) return
  
  const { darshana } = data.rishiProfile
  const { courseId, source } = data
  
  console.log('Darshana conversion tracked:', {
    darshana,
    courseId,
    source,
    timestamp: data.timestamp
  })
  
  // Track patterns like:
  // - Which darshanas convert best to which courses
  // - Time-based conversion patterns
  // - Source effectiveness by darshana
  // - Cross-darshana course appeal
}

async function analyzePricingEffectiveness(data: any) {
  const { discount, courseId, rishiProfile } = data
  
  if (discount?.applied) {
    console.log('Discount effectiveness:', {
      courseId,
      discountPercentage: discount.percentage,
      originalPrice: discount.originalPrice,
      finalPrice: discount.discountedPrice,
      darshana: rishiProfile?.darshana
    })
    
    // Analyze:
    // - Discount sensitivity by darshana
    // - Optimal discount percentages
    // - Revenue impact of Rishi discounts
    // - Price elasticity patterns
  }
}

async function updateCourseMetrics(data: any) {
  const { courseId, source, rishiProfile } = data
  
  console.log('Course metrics update:', {
    courseId,
    source,
    darshana: rishiProfile?.darshana,
    enrollmentSource: 'rishi_mode'
  })
  
  // Update:
  // - Course popularity by darshana
  // - Rishi Mode attribution
  // - Course recommendation success rates
  // - Cross-selling opportunities
}

async function trackSourceAttribution(data: any) {
  const { source, enrollmentId, rishiProfile } = data
  
  console.log('Source attribution:', {
    source,
    enrollmentId,
    channel: 'rishi_mode',
    darshana: rishiProfile?.darshana
  })
  
  // Track:
  // - Rishi Mode vs traditional funnel performance
  // - Profile vs recommendation page conversions
  // - Attribution modeling for Rishi journeys
  // - Multi-touch attribution
}

async function generateEnrollmentAnalytics(
  timeframe: string,
  darshana?: string | null,
  courseId?: string | null
) {
  // Generate mock analytics data for development
  // In production, this would query your database
  
  const baseMetrics = {
    totalEnrollments: 234,
    rishiModeEnrollments: 89,
    rishiConversionRate: 0.38,
    averageDiscount: 15.5,
    revenueAttribution: 145320
  }
  
  const byDarshana = {
    'Vedanta': { enrollments: 28, avgScore: 0.84, avgDiscount: 18.2 },
    'Yoga': { enrollments: 22, avgScore: 0.79, avgDiscount: 16.8 },
    'Nyaya': { enrollments: 15, avgScore: 0.88, avgDiscount: 17.5 },
    'Sankhya': { enrollments: 12, avgScore: 0.76, avgDiscount: 14.3 },
    'Vaisheshika': { enrollments: 8, avgScore: 0.82, avgDiscount: 15.7 },
    'Mimamsa': { enrollments: 4, avgScore: 0.74, avgDiscount: 13.8 }
  }
  
  const topCourses = [
    { 
      courseId: 'ac-001', 
      title: 'Vedanta Fundamentals', 
      enrollments: 23, 
      avgScore: 0.86,
      primaryDarshana: 'Vedanta'
    },
    { 
      courseId: 'ac-002', 
      title: 'Yoga Darshan', 
      enrollments: 19, 
      avgScore: 0.82,
      primaryDarshana: 'Yoga'
    },
    { 
      courseId: 'ac-003', 
      title: 'Sanskrit for Beginners', 
      enrollments: 15, 
      avgScore: 0.75,
      primaryDarshana: 'Mixed'
    }
  ]
  
  const sourceBreakdown = {
    'rishi_recommendations': {
      enrollments: 67,
      conversionRate: 0.42,
      avgScore: 0.81
    },
    'rishi_profile': {
      enrollments: 22,
      conversionRate: 0.28,
      avgScore: 0.73
    }
  }
  
  // Filter by darshana if specified
  if (darshana) {
    const darshanStats = byDarshana[darshana as keyof typeof byDarshana]
    return {
      ...baseMetrics,
      filteredBy: 'darshana',
      darshana,
      darshanStats,
      topCourses: topCourses.filter(c => c.primaryDarshana === darshana || c.primaryDarshana === 'Mixed')
    }
  }
  
  // Filter by course if specified
  if (courseId) {
    const courseStats = topCourses.find(c => c.courseId === courseId)
    return {
      ...baseMetrics,
      filteredBy: 'course',
      courseId,
      courseStats,
      darshanBreakdown: Object.entries(byDarshana)
        .map(([d, stats]) => ({ darshana: d, ...stats }))
        .sort((a, b) => b.enrollments - a.enrollments)
    }
  }
  
  return {
    ...baseMetrics,
    byDarshana,
    topCourses,
    sourceBreakdown,
    timeframe,
    generatedAt: new Date().toISOString()
  }
}
