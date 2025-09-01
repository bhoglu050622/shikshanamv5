import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, whatsapp, courseId } = body

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Send confirmation email
    // 3. Send WhatsApp message if provided
    // 4. Update seat availability

    console.log('Registration received:', { email, whatsapp, courseId })

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Registration successful! You will receive confirmation details shortly.',
      data: {
        email,
        whatsapp: whatsapp || null,
        courseId: courseId || null,
        registrationId: `REG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
