import { NextRequest, NextResponse } from 'next/server'
import { graphyAPI } from '@/lib/graphy'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { accessToken } = body

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token required' },
        { status: 400 }
      )
    }

    // Authenticate with Graphy using Google access token
    const authResponse = await graphyAPI.authenticateWithGoogle(accessToken)
    
    if (!authResponse.success) {
      return NextResponse.json(
        { error: authResponse.message || 'Graphy authentication failed' },
        { status: 401 }
      )
    }

    const { user, jwt } = authResponse.data

    // Set Graphy session cookies
    const cookieStore = cookies()
    cookieStore.set('auth_token', JSON.stringify({
      email: user.email,
      name: user.name,
      id: user.id,
      avatar: user.avatar
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    cookieStore.set('graphy_jwt', jwt.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60, // 24 hours
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar
      }
    })

  } catch (error) {
    console.error('Google callback error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
