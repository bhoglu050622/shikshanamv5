'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity, 
  Users, 
  MousePointer, 
  ShoppingCart, 
  Mail, 
  Heart,
  Eye,
  Clock,
  TrendingUp,
  Zap
} from 'lucide-react'

interface ActivityEvent {
  id: string
  type: 'page_view' | 'conversion' | 'user_action' | 'error' | 'system'
  title: string
  description: string
  timestamp: number
  user?: string
  value?: number
  source?: string
  icon?: React.ReactNode
  color?: string
}

interface RealTimeFeedProps {
  maxEvents?: number
  autoScroll?: boolean
  className?: string
}

export function RealTimeFeed({ maxEvents = 10, autoScroll = true, className = '' }: RealTimeFeedProps) {
  const [events, setEvents] = useState<ActivityEvent[]>([])
  const [isConnected, setIsConnected] = useState(false)

  // Generate mock real-time events
  const generateMockEvent = (): ActivityEvent => {
    const eventTypes = [
      {
        type: 'page_view' as const,
        title: 'Page View',
        description: 'User viewed a page',
        icon: <Eye className="w-4 h-4" />,
        color: 'blue'
      },
      {
        type: 'conversion' as const,
        title: 'Conversion',
        description: 'User completed a goal',
        icon: <ShoppingCart className="w-4 h-4" />,
        color: 'green'
      },
      {
        type: 'user_action' as const,
        title: 'User Action',
        description: 'User performed an action',
        icon: <MousePointer className="w-4 h-4" />,
        color: 'purple'
      },
      {
        type: 'error' as const,
        title: 'Error',
        description: 'An error occurred',
        icon: <Activity className="w-4 h-4" />,
        color: 'red'
      }
    ]

    const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
    const pages = ['/courses', '/guna-profiler', '/rishi-mode', '/about', '/contact']
    const actions = ['clicked', 'scrolled', 'hovered', 'submitted', 'downloaded']
    const users = ['Anonymous', 'User_123', 'Visitor_456', 'Guest_789']

    let description = randomType.description
    let value: number | undefined

    switch (randomType.type) {
      case 'page_view':
        description = `User viewed ${pages[Math.floor(Math.random() * pages.length)]}`
        break
      case 'conversion':
        description = `Course enrollment completed`
        value = Math.floor(Math.random() * 2000) + 500
        break
      case 'user_action':
        description = `User ${actions[Math.floor(Math.random() * actions.length)]} on page`
        break
      case 'error':
        description = '404 error on /invalid-page'
        break
    }

    return {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      type: randomType.type,
      title: randomType.title,
      description,
      timestamp: Date.now(),
      user: users[Math.floor(Math.random() * users.length)],
      value,
      source: 'direct',
      icon: randomType.icon,
      color: randomType.color
    }
  }

  useEffect(() => {
    // Simulate real-time connection
    setIsConnected(true)

    // Generate initial events
    const initialEvents = Array.from({ length: 5 }, () => generateMockEvent())
    setEvents(initialEvents)

    // Simulate real-time updates
    const interval = setInterval(() => {
      const newEvent = generateMockEvent()
      setEvents(prev => {
        const updated = [newEvent, ...prev.slice(0, maxEvents - 1)]
        return updated
      })
    }, 3000) // New event every 3 seconds

    return () => clearInterval(interval)
  }, [maxEvents])

  const getTimeAgo = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return `${Math.floor(diff / 86400000)}d ago`
  }

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      red: 'bg-red-50 border-red-200 text-red-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800',
      orange: 'bg-orange-50 border-orange-200 text-orange-800'
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-900">Real-Time Activity</h3>
          <div className={`flex items-center space-x-1 text-xs ${
            isConnected ? 'text-green-600' : 'text-red-600'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span>{isConnected ? 'Live' : 'Disconnected'}</span>
          </div>
        </div>
        <Zap className="w-5 h-5 text-yellow-500" />
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`p-3 rounded-lg border ${getColorClasses(event.color || 'blue')}`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {event.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{event.title}</p>
                    <span className="text-xs opacity-75">{getTimeAgo(event.timestamp)}</span>
                  </div>
                  <p className="text-sm opacity-90 mt-1">{event.description}</p>
                  {event.user && (
                    <p className="text-xs opacity-75 mt-1">User: {event.user}</p>
                  )}
                  {event.value && (
                    <div className="flex items-center space-x-1 mt-1">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-xs font-medium">₹{event.value.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {events.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No activity yet</p>
        </div>
      )}
    </div>
  )
}

// Live Metrics Component
interface LiveMetricsProps {
  className?: string
}

export function LiveMetrics({ className = '' }: LiveMetricsProps) {
  const [metrics, setMetrics] = useState({
    activeUsers: 0,
    currentSessions: 0,
    lastMinuteEvents: 0,
    conversionRate: 0
  })

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics({
        activeUsers: Math.floor(Math.random() * 50) + 10,
        currentSessions: Math.floor(Math.random() * 20) + 5,
        lastMinuteEvents: Math.floor(Math.random() * 100) + 20,
        conversionRate: Math.random() * 5 + 1 // 1-6%
      })
    }

    updateMetrics()
    const interval = setInterval(updateMetrics, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Live Metrics</h3>
        <div className="flex items-center space-x-1 text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Active Users</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.activeUsers}</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Activity className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Sessions</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.currentSessions}</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Events/min</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.lastMinuteEvents}</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-gray-600">Conv. Rate</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.conversionRate.toFixed(1)}%</p>
        </div>
      </div>
    </div>
  )
}

// Recent Conversions Component
interface RecentConversion {
  id: string
  type: string
  value: number
  user: string
  timestamp: number
  source: string
}

interface RecentConversionsProps {
  className?: string
}

export function RecentConversions({ className = '' }: RecentConversionsProps) {
  const [conversions, setConversions] = useState<RecentConversion[]>([])

  useEffect(() => {
    const generateConversion = (): RecentConversion => ({
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      type: Math.random() > 0.5 ? 'Course Enrollment' : 'Newsletter Signup',
      value: Math.random() > 0.5 ? Math.floor(Math.random() * 2000) + 500 : 0,
      user: `User_${Math.floor(Math.random() * 1000)}`,
      timestamp: Date.now() - Math.random() * 300000, // Within last 5 minutes
      source: ['Google', 'Direct', 'Facebook', 'Email'][Math.floor(Math.random() * 4)]
    })

    // Generate initial conversions
    const initialConversions = Array.from({ length: 5 }, generateConversion)
    setConversions(initialConversions)

    // Add new conversion every 10 seconds
    const interval = setInterval(() => {
      const newConversion = generateConversion()
      setConversions(prev => [newConversion, ...prev.slice(0, 9)]) // Keep max 10
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Conversions</h3>
        <ShoppingCart className="w-5 h-5 text-green-600" />
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {conversions.map((conversion) => (
            <motion.div
              key={conversion.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{conversion.type}</p>
                  <p className="text-xs text-gray-600">by {conversion.user}</p>
                </div>
              </div>
              <div className="text-right">
                {conversion.value > 0 && (
                  <p className="text-sm font-bold text-green-600">₹{conversion.value.toLocaleString()}</p>
                )}
                <p className="text-xs text-gray-500">{conversion.source}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {conversions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No recent conversions</p>
        </div>
      )}
    </div>
  )
}
