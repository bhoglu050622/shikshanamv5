import { NextRequest, NextResponse } from 'next/server'
import { graphyAPI, GraphyAuthResponse } from '@/lib/graphy'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, googleToken } = body

    let authResponse: GraphyAuthResponse

    if (googleToken) {
      // Google OAuth flow
      authResponse = await graphyAPI.authenticateWithGoogle(googleToken)
    } else if (email && password) {
      // Email login flow
      authResponse = await graphyAPI.authenticateWithEmail(email, password)
    } else {
      return NextResponse.json(
        { error: 'Missing required credentials' },
        { status: 400 }
      )
    }

    if (!authResponse.success) {
      return NextResponse.json(
        { error: authResponse.message || 'Authentication failed' },
        { status: 401 }
      )
    }

    const { user, jwt } = authResponse.data

    // Set lifetime session cookie (no expiry)
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
      // No maxAge = session cookie that persists until browser closes or explicitly cleared
    })

    // Set Graphy JWT cookie (24h expiry)
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
    console.error('Graphy authentication error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const authToken = cookieStore.get('auth_token')
    const graphyJWT = cookieStore.get('graphy_jwt')

    if (!authToken || !graphyJWT) {
      return NextResponse.json({ authenticated: false })
    }

    // Validate Graphy JWT
    const jwtValidation = await graphyAPI.validateJWT(graphyJWT.value)
    
    if (!jwtValidation.valid) {
      // Clear invalid cookies
      cookieStore.delete('auth_token')
      cookieStore.delete('graphy_jwt')
      return NextResponse.json({ authenticated: false })
    }

    const userData = JSON.parse(authToken.value)
    
    return NextResponse.json({
      authenticated: true,
      user: userData
    })

  } catch (error) {
    console.error('Session validation error:', error)
    return NextResponse.json({ authenticated: false })
  }
}

export async function DELETE() {
  try {
    const cookieStore = cookies()
    
    // Clear all auth cookies
    cookieStore.delete('auth_token')
    cookieStore.delete('graphy_jwt')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}
