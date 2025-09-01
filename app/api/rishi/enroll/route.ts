import { NextRequest, NextResponse } from 'next/server'
import { getCourseById } from '@/lib/courseData'

export interface RishiEnrollmentRequest {
  email: string
  whatsapp?: string
  courseId: string
  source: 'rishi_recommendations' | 'rishi_profile'
  rishiProfile?: {
    darshana: string
    archetype: string
    sessionId: string
  }
  recommendationScore?: number
  userPreferences?: {
    level: string
    interests: string[]
  }
}

export interface RishiEnrollmentResponse {
  success: boolean
  message: string
  data?: {
    enrollmentId: string
    courseDetails: any
    rishiDiscount?: {
      applied: boolean
      percentage: number
      originalPrice: number
      discountedPrice: number
    }
    nextSteps: string[]
    personalizedMessage: string
  }
  error?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: RishiEnrollmentRequest = await request.json()
    const { email, whatsapp, courseId, source, rishiProfile, recommendationScore, userPreferences } = body

    // Validate required fields
    if (!email || !courseId) {
      return NextResponse.json({
        success: false,
        error: 'Email and course ID are required',
        message: 'Please provide valid email and course information'
      } as RishiEnrollmentResponse, { status: 400 })
    }

    // Get course details
    const course = getCourseById(courseId)
    if (!course) {
      return NextResponse.json({
        success: false,
        error: 'Course not found',
        message: 'The selected course could not be found'
      } as RishiEnrollmentResponse, { status: 404 })
    }

    // Calculate Rishi-specific discount
    const rishiDiscount = calculateRishiDiscount(courseId, rishiProfile, recommendationScore)
    
    // Generate enrollment ID
    const enrollmentId = generateEnrollmentId(source, rishiProfile?.darshana)

    // Create personalized message based on Rishi profile
    const personalizedMessage = generatePersonalizedMessage(course, rishiProfile)

    // Generate next steps
    const nextSteps = generateNextSteps(course, rishiProfile)

    // Log enrollment for analytics
    await logRishiEnrollment({
      enrollmentId,
      email,
      courseId,
      source,
      rishiProfile,
      recommendationScore,
      discount: rishiDiscount,
      timestamp: Date.now()
    })

    // Here you would typically:
    // 1. Save to database with Rishi-specific metadata
    // 2. Apply any Rishi member discounts
    // 3. Send personalized confirmation email
    // 4. Trigger follow-up sequences based on Darshana
    // 5. Update recommendation algorithms with enrollment data

    console.log('Rishi enrollment processed:', {
      enrollmentId,
      email,
      courseId,
      source,
      darshana: rishiProfile?.darshana,
      discount: rishiDiscount
    })

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500))

    const response: RishiEnrollmentResponse = {
      success: true,
      message: 'Enrollment successful! Welcome to your personalized learning journey.',
      data: {
        enrollmentId,
        courseDetails: course,
        rishiDiscount,
        nextSteps,
        personalizedMessage
      }
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('Rishi enrollment error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'We encountered an issue processing your enrollment. Please try again.'
    } as RishiEnrollmentResponse, { status: 500 })
  }
}

function calculateRishiDiscount(
  courseId: string,
  rishiProfile?: { darshana: string; archetype: string },
  recommendationScore?: number
): { applied: boolean; percentage: number; originalPrice: number; discountedPrice: number } | undefined {
  const course = getCourseById(courseId)
  if (!course) return undefined

  let discount = 0
  let applied = false

  // Base Rishi member discount
  if (rishiProfile) {
    discount = 10 // 10% base discount for Rishi mode users
    applied = true
  }

  // High recommendation score bonus
  if (recommendationScore && recommendationScore >= 0.8) {
    discount += 5 // Additional 5% for high-match courses
  }

  // Darshana-specific course bonus
  if (rishiProfile && 'school' in course && course.school?.toLowerCase() === rishiProfile.darshana.toLowerCase()) {
    discount += 10 // Additional 10% for perfect darshana match
  }

  // Cap discount at 25%
  discount = Math.min(discount, 25)

  // Helper function to safely get course price
  const getCoursePrice = (course: any): number => {
    if ('price' in course) {
      return course.price || 0
    }
    return 0 // Free masterclasses have no price
  }

  if (discount > 0) {
    const originalPrice = getCoursePrice(course)
    const discountedPrice = Math.round(originalPrice * (1 - discount / 100))
    
    return {
      applied: true,
      percentage: discount,
      originalPrice,
      discountedPrice
    }
  }

  return {
    applied: false,
    percentage: 0,
    originalPrice: getCoursePrice(course),
    discountedPrice: getCoursePrice(course)
  }
}

function generateEnrollmentId(source: string, darshana?: string): string {
  const timestamp = Date.now()
  const sourceCode = source === 'rishi_recommendations' ? 'RR' : 'RP'
  const darshanCode = darshana ? darshana.substring(0, 2).toUpperCase() : 'GN'
  const randomId = Math.random().toString(36).substr(2, 6).toUpperCase()
  
  return `${sourceCode}-${darshanCode}-${timestamp}-${randomId}`
}

function generatePersonalizedMessage(course: any, rishiProfile?: { darshana: string; archetype: string }): string {
  if (!rishiProfile) {
    return `Welcome to ${course.title}! We're excited to guide you on this learning journey.`
  }

  const { darshana, archetype } = rishiProfile

  const messages: Record<string, string> = {
    'nyaya': `As a Logical Sage aligned with Nyaya, this course will help you deepen your analytical understanding and systematic thinking.`,
    'vedanta': `As a Unity Seeker following Vedanta, this course will support your journey toward self-realization and ultimate truth.`,
    'yoga': `As a Disciplined Practitioner on the Yoga path, this course will enhance your systematic practice and mind-body mastery.`,
    'sankhya': `As an Analytical Observer aligned with Sankhya, this course will expand your pattern recognition and discriminative wisdom.`,
    'vaisheshika': `As a Natural Philosopher following Vaisheshika, this course will deepen your understanding of material reality and natural laws.`,
    'mimamsa': `As a Ritual Expert aligned with Mimamsa, this course will enhance your understanding of sacred traditions and their deeper meanings.`
  }

  const personalizedMessage = messages[darshana.toLowerCase()] || messages['vedanta']
  
  return `Welcome to ${course.title}, ${archetype}! ${personalizedMessage} Your unique philosophical perspective will enrich this learning experience.`
}

function generateNextSteps(course: any, rishiProfile?: { darshana: string }): string[] {
  const baseSteps = [
    'Check your email for course access details',
    'Join the course WhatsApp group',
    'Download course materials',
    'Mark your calendar for live sessions'
  ]

  if (!rishiProfile) return baseSteps

  const darshanSteps: Record<string, string[]> = {
    'nyaya': [
      'Join the Nyaya Logic Circle for discussions',
      'Prepare questions for analytical debates',
      'Review prerequisite logical concepts'
    ],
    'vedanta': [
      'Join the Vedanta Seekers Circle',
      'Begin daily self-inquiry practice',
      'Prepare for deep contemplative study'
    ],
    'yoga': [
      'Join the Yoga Practitioners Circle',
      'Establish daily practice routine',
      'Prepare your meditation space'
    ],
    'sankhya': [
      'Join the Sankhya Observers Circle',
      'Start pattern observation exercises',
      'Review fundamental dualistic concepts'
    ],
    'vaisheshika': [
      'Join the Natural Philosophy Circle',
      'Begin nature observation practices',
      'Review material science fundamentals'
    ]
  }

  const specificSteps = darshanSteps[rishiProfile.darshana.toLowerCase()] || []
  return [...baseSteps, ...specificSteps]
}

async function logRishiEnrollment(data: any): Promise<void> {
  try {
    // In development, just log
    if (process.env.NODE_ENV === 'development') {
      console.log('📝 Rishi Enrollment Logged:', data)
      return
    }

    // In production, save to analytics database
    await fetch('/api/analytics/rishi/enrollment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  } catch (error) {
    console.error('Failed to log Rishi enrollment:', error)
  }
}
