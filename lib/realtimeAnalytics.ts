'use client'

import { useState, useEffect } from 'react'

export interface RealTimeData {
  activeUsers: number
  currentSessions: number
  lastMinuteEvents: number
  recentConversions: Array<{
    id: string
    type: string
    value: number
    timestamp: number
    source: string
  }>
  topPages: Array<{
    page: string
    views: number
    avgTime: number
  }>
  deviceBreakdown: {
    desktop: number
    mobile: number
    tablet: number
  }
  trafficSources: Array<{
    source: string
    sessions: number
    percentage: number
  }>
  timestamp: number
}

export interface RealTimeConfig {
  updateInterval: number
  enableSSE: boolean
  enablePolling: boolean
  maxRetries: number
  retryDelay: number
}

class RealTimeAnalytics {
  private static instance: RealTimeAnalytics | null = null
  private config: RealTimeConfig
  private eventSource: EventSource | null = null
  private pollingInterval: NodeJS.Timeout | null = null
  private listeners: Map<string, Set<(data: RealTimeData) => void>> = new Map()
  private retryCount = 0
  private isConnected = false

  private constructor(config: Partial<RealTimeConfig> = {}) {
    this.config = {
      updateInterval: 5000, // 5 seconds
      enableSSE: true,
      enablePolling: true,
      maxRetries: 5,
      retryDelay: 1000,
      ...config
    }
  }

  static getInstance(config?: Partial<RealTimeConfig>): RealTimeAnalytics {
    if (!RealTimeAnalytics.instance) {
      RealTimeAnalytics.instance = new RealTimeAnalytics(config)
    }
    return RealTimeAnalytics.instance
  }

  async connect(): Promise<void> {
    if (this.isConnected) return

    try {
      if (this.config.enableSSE) {
        await this.connectSSE()
      } else if (this.config.enablePolling) {
        this.startPolling()
      }

      this.isConnected = true
      console.log('✅ Real-time analytics connected')
    } catch (error) {
      console.error('❌ Failed to connect to real-time analytics:', error)
      this.handleConnectionError()
    }
  }

  private async connectSSE(): Promise<void> {
    try {
      this.eventSource = new EventSource('/api/analytics/realtime')
      
      this.eventSource.onopen = () => {
        console.log('🔗 SSE connection established')
        this.retryCount = 0
      }

      this.eventSource.onmessage = (event) => {
        try {
          const data: RealTimeData = JSON.parse(event.data)
          this.notifyListeners('realtime', data)
        } catch (error) {
          console.error('Error parsing SSE data:', error)
        }
      }

      this.eventSource.onerror = (error) => {
        console.error('SSE connection error:', error)
        this.handleConnectionError()
      }

    } catch (error) {
      console.error('Failed to create SSE connection:', error)
      throw error
    }
  }

  private startPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval)
    }

    this.pollingInterval = setInterval(async () => {
      try {
        const data = await this.fetchRealTimeData()
        this.notifyListeners('realtime', data)
      } catch (error) {
        console.error('Polling error:', error)
        this.handleConnectionError()
      }
    }, this.config.updateInterval)
  }

  private async fetchRealTimeData(): Promise<RealTimeData> {
    const response = await fetch('/api/analytics/dashboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer admin-token'
      },
      body: JSON.stringify({
        action: 'realtime'
      })
    })

    if (!response.ok) {
      throw new Error('Failed to fetch real-time data')
    }

    const result = await response.json()
    return result.data
  }

  private handleConnectionError(): void {
    this.isConnected = false

    if (this.retryCount < this.config.maxRetries) {
      this.retryCount++
      console.log(`🔄 Retrying connection (${this.retryCount}/${this.config.maxRetries})...`)
      
      setTimeout(() => {
        this.connect()
      }, this.config.retryDelay * this.retryCount)
    } else {
      console.error('❌ Max retries reached, falling back to polling')
      this.startPolling()
    }
  }

  subscribe(eventType: string, callback: (data: RealTimeData) => void): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set())
    }

    this.listeners.get(eventType)!.add(callback)

    // Return unsubscribe function
    return () => {
      const eventListeners = this.listeners.get(eventType)
      if (eventListeners) {
        eventListeners.delete(callback)
        if (eventListeners.size === 0) {
          this.listeners.delete(eventType)
        }
      }
    }
  }

  private notifyListeners(eventType: string, data: RealTimeData): void {
    const eventListeners = this.listeners.get(eventType)
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error('Error in real-time listener:', error)
        }
      })
    }
  }

  disconnect(): void {
    this.isConnected = false

    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
    }

    if (this.pollingInterval) {
      clearInterval(this.pollingInterval)
      this.pollingInterval = null
    }

    this.listeners.clear()
    console.log('🔌 Real-time analytics disconnected')
  }

  // Utility methods for manual data fetching
  async getCurrentData(): Promise<RealTimeData> {
    return this.fetchRealTimeData()
  }

  async getHistoricalData(period: string = '30'): Promise<any> {
    const response = await fetch(`/api/analytics/dashboard?period=${period}`, {
      headers: {
        'Authorization': 'Bearer admin-token'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch historical data')
    }

    const result = await response.json()
    return result.data
  }

  // Performance monitoring
  getConnectionStatus(): { connected: boolean; retryCount: number; method: string } {
    return {
      connected: this.isConnected,
      retryCount: this.retryCount,
      method: this.eventSource ? 'SSE' : this.pollingInterval ? 'Polling' : 'None'
    }
  }
}

// Export singleton instance
export const realtimeAnalytics = RealTimeAnalytics.getInstance()

// React hook for real-time data
export function useRealTimeAnalytics(updateInterval: number = 5000) {
  const [data, setData] = useState<RealTimeData | null>(null)
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting')

  useEffect(() => {
    let unsubscribe: (() => void) | null = null

    const connect = async () => {
      try {
        setStatus('connecting')
        
        // Configure with custom update interval
        const analytics = RealTimeAnalytics.getInstance({ updateInterval })
        
        unsubscribe = analytics.subscribe('realtime', (newData) => {
          setData(newData)
          setStatus('connected')
        })

        await analytics.connect()
      } catch (error) {
        console.error('Failed to connect to real-time analytics:', error)
        setStatus('error')
      }
    }

    connect()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
      realtimeAnalytics.disconnect()
    }
  }, [updateInterval])

  return { data, status, connectionInfo: realtimeAnalytics.getConnectionStatus() }
}

// Utility functions for easier integration
export function connectRealTimeAnalytics(config?: Partial<RealTimeConfig>): Promise<void> {
  const analytics = RealTimeAnalytics.getInstance(config)
  return analytics.connect()
}

export function disconnectRealTimeAnalytics(): void {
  realtimeAnalytics.disconnect()
}

export function subscribeToRealTimeData(callback: (data: RealTimeData) => void): () => void {
  return realtimeAnalytics.subscribe('realtime', callback)
}

export function getRealTimeConnectionStatus() {
  return realtimeAnalytics.getConnectionStatus()
}
