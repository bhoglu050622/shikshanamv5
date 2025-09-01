import { NextRequest, NextResponse } from 'next/server'
import { graphyAPI, isJWTExpired, shouldRefreshJWT } from '@/lib/graphy'
import { cookies } from 'next/headers'

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const authToken = cookieStore.get('auth_token')
    const graphyJWT = cookieStore.get('graphy_jwt')

    if (!authToken || !graphyJWT) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Check if JWT needs refresh
    // For now, we'll use the JWT token directly
    // In production, you'd decode the JWT to check expiry
    const coursesResponse = await graphyAPI.getUserCourses(graphyJWT.value)
    
    if (!coursesResponse.success) {
      return NextResponse.json(
        { error: coursesResponse.message || 'Failed to fetch courses' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      courses: coursesResponse.data
    })

  } catch (error) {
    console.error('Fetch courses error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}
