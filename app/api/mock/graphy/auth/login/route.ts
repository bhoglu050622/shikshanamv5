import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Mock authentication logic
    if (email && password) {
      // Simulate successful authentication
      const mockUser = {
        id: 'user_123',
        email: email,
        name: email.split('@')[0], // Use email prefix as name
        phone: '+1234567890',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=random`
      }

      const mockJWT = {
        token: 'mock_jwt_token_' + Date.now(),
        expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours from now
      }

      return NextResponse.json({
        success: true,
        data: {
          user: mockUser,
          jwt: mockJWT
        },
        message: 'Login successful'
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Invalid credentials'
      }, { status: 401 })
    }
  } catch (error) {
    console.error('Mock Graphy login error:', error)
    return NextResponse.json({
      success: false,
      message: 'Authentication failed'
    }, { status: 500 })
  }
}
