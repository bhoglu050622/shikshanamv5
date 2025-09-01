import { NextRequest, NextResponse } from 'next/server'
import { graphyAPI, isJWTExpired, shouldRefreshJWT } from '@/lib/graphy'
import { cookies } from 'next/headers'
import { getToken } from 'next-auth/jwt'

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const cookieGraphyJWT = cookieStore.get('graphy_jwt')?.value

    // Try to read Graphy JWT from NextAuth token as a fallback
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    const sessionGraphyJWT = (token as any)?.graphyJWT as string | undefined

    const effectiveJWT = cookieGraphyJWT || sessionGraphyJWT

    if (!effectiveJWT) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Check if JWT needs refresh
    // For now, we'll use the JWT token directly
    // In production, you'd decode the JWT to check expiry
    const coursesResponse = await graphyAPI.getUserCourses(effectiveJWT)
    
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
