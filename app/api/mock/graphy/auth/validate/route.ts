import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Mock JWT validation - always return valid for development
    const mockUser = {
      id: 'user_123',
      email: 'user@example.com',
      name: 'Test User',
      phone: '+1234567890',
      avatar: 'https://ui-avatars.com/api/?name=Test+User&background=random'
    }

    return NextResponse.json({
      success: true,
      data: {
        user: mockUser
      },
      message: 'JWT is valid'
    })
  } catch (error) {
    console.error('Mock Graphy JWT validation error:', error)
    return NextResponse.json({
      success: false,
      message: 'JWT validation failed'
    }, { status: 401 })
  }
}
