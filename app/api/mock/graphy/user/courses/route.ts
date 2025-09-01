import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock courses data
    const mockCourses = [
      {
        id: 'course_1',
        title: 'Introduction to Vedanta',
        description: 'Learn the fundamental principles of Vedantic philosophy',
        thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
        progress: 75,
        is_completed: false,
        last_accessed: new Date().toISOString()
      },
      {
        id: 'course_2',
        title: 'Bhagavad Gita - Chapter 1',
        description: 'Deep dive into the first chapter of the Bhagavad Gita',
        thumbnail: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=300&h=200&fit=crop',
        progress: 30,
        is_completed: false,
        last_accessed: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      },
      {
        id: 'course_3',
        title: 'Meditation Techniques',
        description: 'Practical meditation techniques for daily practice',
        thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
        progress: 100,
        is_completed: true,
        last_accessed: new Date(Date.now() - 172800000).toISOString() // 2 days ago
      }
    ]

    const mockResponse = {
      success: true,
      data: mockCourses,
      message: 'Mock courses retrieved successfully'
    }

    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error('Mock courses error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to retrieve courses' 
      },
      { status: 500 }
    )
  }
}
