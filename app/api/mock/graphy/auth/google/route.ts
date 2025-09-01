import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { google_token } = body

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock successful response
    const mockResponse = {
      success: true,
      data: {
        user: {
          id: `mock_user_${Date.now()}`,
          email: 'user@example.com',
          name: 'Mock User',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          phone: undefined
        },
        jwt: {
          token: `mock_jwt_${Date.now()}`,
          expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours from now
        }
      },
      message: 'Mock authentication successful'
    }

    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error('Mock Google auth error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Mock authentication failed' 
      },
      { status: 500 }
    )
  }
}
