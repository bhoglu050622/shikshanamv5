import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Basic health check
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      // Check if critical environment variables are set
      env: {
        nextauthUrl: !!process.env.NEXTAUTH_URL,
        nextauthSecret: !!process.env.NEXTAUTH_SECRET,
        googleClientId: !!process.env.GOOGLE_CLIENT_ID,
        graphyBaseUrl: !!process.env.GRAPHY_BASE_URL,
        nodeEnv: process.env.NODE_ENV
      }
    }

    return NextResponse.json(healthStatus, { status: 200 })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json(
      { 
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed'
      },
      { status: 500 }
    )
  }
}
