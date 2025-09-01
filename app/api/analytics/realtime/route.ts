import { NextRequest } from 'next/server'

// Store active connections for broadcasting
const connections = new Set<ReadableStreamDefaultController>()

// Helper function to generate real-time data
function generateRealTimeData() {
  const now = Date.now()
  
  return {
    activeUsers: Math.floor(Math.random() * 50) + 10,
    currentSessions: Math.floor(Math.random() * 20) + 5,
    lastMinuteEvents: Math.floor(Math.random() * 100) + 20,
    recentConversions: [
      {
        id: `conv_${now}_${Math.random().toString(36).substr(2, 6)}`,
        type: 'course_enrollment',
        value: 1500,
        timestamp: now - Math.random() * 60000, // Within last minute
        source: 'google'
      },
      {
        id: `conv_${now}_${Math.random().toString(36).substr(2, 6)}`,
        type: 'newsletter_signup',
        value: 0,
        timestamp: now - Math.random() * 120000, // Within last 2 minutes
        source: 'direct'
      }
    ].slice(0, 3), // Only show 3 most recent
    topPages: [
      { page: '/courses', views: Math.floor(Math.random() * 50) + 20, avgTime: 240000 },
      { page: '/guna-profiler', views: Math.floor(Math.random() * 30) + 10, avgTime: 300000 },
      { page: '/rishi-mode', views: Math.floor(Math.random() * 20) + 5, avgTime: 180000 }
    ],
    deviceBreakdown: {
      desktop: Math.floor(Math.random() * 30) + 15,
      mobile: Math.floor(Math.random() * 20) + 8,
      tablet: Math.floor(Math.random() * 5) + 2
    },
    trafficSources: [
      { source: 'Direct', sessions: Math.floor(Math.random() * 20) + 10, percentage: 40 },
      { source: 'Google', sessions: Math.floor(Math.random() * 15) + 8, percentage: 30 },
      { source: 'Facebook', sessions: Math.floor(Math.random() * 10) + 5, percentage: 20 },
      { source: 'Email', sessions: Math.floor(Math.random() * 5) + 2, percentage: 10 }
    ],
    timestamp: now
  }
}

// Helper function to send SSE data
function sendSSEData(controller: ReadableStreamDefaultController, data: any) {
  const message = `data: ${JSON.stringify(data)}\n\n`
  controller.enqueue(new TextEncoder().encode(message))
}

// Helper function to send SSE event
function sendSSEEvent(controller: ReadableStreamDefaultController, event: string, data: any) {
  const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
  controller.enqueue(new TextEncoder().encode(message))
}

export async function GET(request: NextRequest) {
  // Check authentication
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response('Unauthorized', { status: 401 })
  }

  const token = authHeader.substring(7)
  if (token !== 'admin-token') {
    return new Response('Invalid token', { status: 401 })
  }

  // Set up SSE headers
  const headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  }

  // Create readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Add connection to active connections
      connections.add(controller)

      // Send initial connection message
      sendSSEEvent(controller, 'connected', {
        message: 'Real-time analytics connected',
        timestamp: Date.now()
      })

      // Send initial data
      const initialData = generateRealTimeData()
      sendSSEData(controller, initialData)

      // Set up periodic data updates
      const interval = setInterval(() => {
        try {
          const data = generateRealTimeData()
          sendSSEData(controller, data)
        } catch (error) {
          console.error('Error sending SSE data:', error)
          controller.close()
        }
      }, 5000) // Update every 5 seconds

      // Handle client disconnect
      request.signal.addEventListener('abort', () => {
        clearInterval(interval)
        connections.delete(controller)
        controller.close()
      })

      // Handle stream close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval)
        connections.delete(controller)
      })
    }
  })

  return new Response(stream, { headers })
}

// POST endpoint for manual data updates
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'broadcast':
        // Broadcast data to all connected clients
        const message = JSON.stringify(data || generateRealTimeData())
        connections.forEach(controller => {
          try {
            sendSSEData(controller, JSON.parse(message))
          } catch (error) {
            console.error('Error broadcasting to client:', error)
            connections.delete(controller)
          }
        })

        return new Response(JSON.stringify({
          success: true,
          message: `Broadcasted to ${connections.size} clients`
        }), {
          headers: { 'Content-Type': 'application/json' }
        })

      case 'ping':
        // Send ping to all clients
        connections.forEach(controller => {
          try {
            sendSSEEvent(controller, 'ping', { timestamp: Date.now() })
          } catch (error) {
            console.error('Error pinging client:', error)
            connections.delete(controller)
          }
        })

        return new Response(JSON.stringify({
          success: true,
          message: `Pinged ${connections.size} clients`
        }), {
          headers: { 'Content-Type': 'application/json' }
        })

      default:
        return new Response(JSON.stringify({
          error: 'Invalid action'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
    }

  } catch (error) {
    console.error('SSE POST error:', error)
    return new Response(JSON.stringify({
      error: 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
