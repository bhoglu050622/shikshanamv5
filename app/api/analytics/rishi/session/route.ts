import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const sessionData = await request.json()
    
    // In development, log session summary
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Rishi Session Completed:', {
        sessionId: sessionData.sessionId,
        userId: sessionData.userId,
        duration: sessionData.endTime - sessionData.startTime,
        stepsCompleted: sessionData.journey.filter((s: any) => s.completed).length,
        totalSteps: sessionData.journey.length,
        darshana: sessionData.profileResult?.darshana,
        coursesInteracted: sessionData.courseInteractions.length,
        conversions: sessionData.conversionEvents.length,
        device: sessionData.deviceInfo
      })
      
      return NextResponse.json({ success: true, message: 'Session data logged' })
    }

    // In production, you would:
    // 1. Save complete session to database
    // 2. Process for insights and patterns
    // 3. Update user profiles
    // 4. Trigger follow-up actions
    // 5. Calculate session quality metrics

    await processSessionData(sessionData)
    
    return NextResponse.json({ success: true, message: 'Session data processed' })

  } catch (error) {
    console.error('Session processing error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process session data' },
      { status: 500 }
    )
  }
}

async function processSessionData(session: any) {
  // Calculate session metrics
  const duration = session.endTime - session.startTime
  const completionRate = session.journey.filter((s: any) => s.completed).length / session.journey.length
  const hasConversion = session.conversionEvents.length > 0
  
  // Identify user behavior patterns
  const userPattern = analyzeUserPattern(session)
  
  // Process based on session outcome
  if (hasConversion) {
    await processConvertedSession(session, userPattern)
  } else {
    await processNonConvertedSession(session, userPattern)
  }
  
  // Update global metrics
  await updateGlobalMetrics(session, userPattern)
  
  console.log('Session processed:', {
    sessionId: session.sessionId,
    duration,
    completionRate,
    hasConversion,
    pattern: userPattern
  })
}

function analyzeUserPattern(session: any) {
  const journey = session.journey
  const quizAnswers = session.quizAnswers
  const courseInteractions = session.courseInteractions
  
  // Analyze engagement level
  const totalDuration = session.endTime - session.startTime
  const avgTimePerStep = totalDuration / journey.length
  
  let engagementLevel: 'high' | 'medium' | 'low'
  if (avgTimePerStep > 60000) engagementLevel = 'high' // > 1 minute per step
  else if (avgTimePerStep > 30000) engagementLevel = 'medium' // > 30 seconds
  else engagementLevel = 'low'
  
  // Analyze completion behavior
  const completedSteps = journey.filter((s: any) => s.completed).length
  const completionRate = completedSteps / journey.length
  
  // Analyze decision making
  const changedAnswers = quizAnswers.filter((a: any) => a.changedAnswer).length
  const isDecisive = changedAnswers / quizAnswers.length < 0.2
  
  // Analyze course interest
  const courseViews = courseInteractions.filter((i: any) => i.action === 'view').length
  const courseClicks = courseInteractions.filter((i: any) => i.action === 'click').length
  const courseEngagement = courseViews > 0 ? courseClicks / courseViews : 0
  
  return {
    engagementLevel,
    completionRate,
    isDecisive,
    courseEngagement,
    darshana: session.profileResult?.darshana,
    deviceType: session.deviceInfo.isMobile ? 'mobile' : 'desktop'
  }
}

async function processConvertedSession(session: any, pattern: any) {
  // User completed Rishi Mode and enrolled in a course
  console.log('Processing converted session:', {
    sessionId: session.sessionId,
    conversions: session.conversionEvents,
    pattern
  })
  
  // Actions for converted users:
  // 1. Send welcome sequence
  // 2. Add to darshana-specific nurture flow
  // 3. Schedule follow-up check-ins
  // 4. Update recommendation models with successful pattern
  // 5. Track long-term engagement
}

async function processNonConvertedSession(session: any, pattern: any) {
  // User completed Rishi Mode but didn't enroll
  console.log('Processing non-converted session:', {
    sessionId: session.sessionId,
    exitPoint: session.journey.find((s: any) => s.exitPoint)?.step,
    pattern
  })
  
  // Actions for non-converted users:
  // 1. Trigger re-engagement email sequence
  // 2. Offer time-limited discounts
  // 3. Send personalized course recommendations
  // 4. Invite to free masterclasses
  // 5. Add to nurture sequence based on darshana
}

async function updateGlobalMetrics(session: any, pattern: any) {
  // Update aggregated metrics for platform optimization
  
  // Example metrics to track:
  // - Darshana popularity trends
  // - Device usage patterns
  // - Optimal session length
  // - Best performing recommendation scores
  // - Seasonal/temporal patterns
  
  console.log('Updating global metrics with session data')
}
