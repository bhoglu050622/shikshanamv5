'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  Clock, 
  MousePointer,
  BarChart3,
  Activity,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Settings,
  Download as DownloadIcon
} from 'lucide-react'
import { MetricCard, BarChart, PieChart, DataTable, ProgressBar } from '@/components/analytics/ChartComponents'
import { RealTimeFeed, LiveMetrics, RecentConversions } from '@/components/analytics/RealTimeFeed'

interface DashboardData {
  period: string
  metrics: {
    uniqueVisitors: { value: string; growth: number; trend: 'up' | 'down' }
    pageViews: { value: string; growth: number; trend: 'up' | 'down' }
    sessions: { value: string; growth: number; trend: 'up' | 'down' }
    bounceRate: { value: string; growth: number; trend: 'up' | 'down' }
    sessionDuration: { value: string; growth: number; trend: 'up' | 'down' }
  }
  timeSeries: Array<{
    date: string
    visitors: number
    pageViews: number
    sessions: number
    bounceRate: number
    sessionDuration: number
  }>
  topPages: Array<{
    page: string
    entryPages: number
    exitPages: number
    hostname: string
    channel: string
  }>
  topReferrers: Array<{
    referrer: string
    sources: number
    mediums: number
    campaigns: number
  }>
  utm: {
    topSources: Array<{ source: string; sessions: number; conversions: number }>
    conversionsBySource: Array<{ source: string; rate: number; value: number }>
    topCampaigns: Array<{ campaign: string; sessions: number; conversions: number }>
  }
  journey: {
    averageSessionDuration: number
    bounceRate: number
    topPages: Array<{ page: string; views: number; avgTime: number }>
    conversionFunnels: Array<{ name: string; conversionRate: number }>
  }
  conversions: {
    totalConversions: number
    conversionRate: number
    totalValue: number
    topConversionGoals: Array<{ goal: string; conversions: number; value: number }>
  }
  timestamp: number
}

interface DeviceData {
  device: string
  sessions: number
  percentage: number
  icon: React.ReactNode
}

export default function AnalyticsDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState('30')
  const [selectedSegment, setSelectedSegment] = useState('all')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analytics/dashboard?period=${selectedPeriod}`, {
        headers: {
          'Authorization': 'Bearer admin-token'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      const result = await response.json()
      if (result.success) {
        setDashboardData(result.data)
        setLastUpdated(new Date())
        setError(null)
      } else {
        throw new Error(result.error || 'Failed to fetch data')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedPeriod])

  // Auto-refresh setup
  useEffect(() => {
    fetchDashboardData()

    if (autoRefresh) {
      const interval = setInterval(fetchDashboardData, 30000) // Refresh every 30 seconds
      return () => clearInterval(interval)
    }
  }, [fetchDashboardData, autoRefresh])

  // Device data for visualization
  const deviceData: DeviceData[] = [
    { device: 'Desktop', sessions: 4500, percentage: 65, icon: <Monitor className="w-4 h-4" /> },
    { device: 'Mobile', sessions: 2100, percentage: 30, icon: <Smartphone className="w-4 h-4" /> },
    { device: 'Tablet', sessions: 300, percentage: 5, icon: <Tablet className="w-4 h-4" /> }
  ]

  // Traffic source data
  const trafficSources = [
    { source: 'Direct', sessions: 2300, percentage: 33 },
    { source: 'Organic Search', sessions: 1800, percentage: 26 },
    { source: 'Social Media', sessions: 1200, percentage: 17 },
    { source: 'Email', sessions: 800, percentage: 12 },
    { source: 'Referral', sessions: 600, percentage: 9 },
    { source: 'Paid Search', sessions: 300, percentage: 3 }
  ]

  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center relative z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center relative z-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!dashboardData) return null

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-sm text-gray-500">
                Real-time insights and performance metrics
                {lastUpdated && (
                  <span className="ml-2">
                    • Last updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Auto-refresh toggle */}
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded"
                />
                <span>Auto-refresh</span>
              </label>
              
              {/* Export button */}
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/analytics/dashboard', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer admin-token'
                      },
                      body: JSON.stringify({
                        action: 'export',
                        period: selectedPeriod,
                        segment: selectedSegment
                      })
                    })
                    
                    if (response.ok) {
                      const result = await response.json()
                      // Create and download file
                      const blob = new Blob([JSON.stringify(dashboardData, null, 2)], { type: 'application/json' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `analytics-${selectedPeriod}-${selectedSegment}-${Date.now()}.json`
                      document.body.appendChild(a)
                      a.click()
                      document.body.removeChild(a)
                      URL.revokeObjectURL(url)
                    }
                  } catch (error) {
                    console.error('Export failed:', error)
                  }
                }}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <DownloadIcon className="w-4 h-4" />
                <span>Export</span>
              </button>
              
              {/* Refresh button */}
              <button
                onClick={fetchDashboardData}
                disabled={loading}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              
              {/* Settings button */}
              <button className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 relative z-20">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="live">Live (Today)</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="60">Last 60 days</option>
                <option value="90">Last 90 days</option>
                <option value="lifetime">Lifetime</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Traffic</option>
                <option value="organic">Organic Search</option>
                <option value="direct">Direct Traffic</option>
                <option value="social">Social Media</option>
                <option value="email">Email</option>
                <option value="paid">Paid Traffic</option>
              </select>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8 relative z-20">
          <AnimatePresence>
            {Object.entries(dashboardData.metrics).map(([key, metric], index) => (
              <MetricCard
                key={key}
                title={key.replace(/([A-Z])/g, ' $1').trim()}
                value={metric.value}
                change={metric.growth}
                trend={metric.trend}
                icon={
                  key === 'uniqueVisitors' ? <Users className="w-5 h-5" /> :
                  key === 'pageViews' ? <Eye className="w-5 h-5" /> :
                  key === 'sessions' ? <Activity className="w-5 h-5" /> :
                  key === 'bounceRate' ? <MousePointer className="w-5 h-5" /> :
                  <Clock className="w-5 h-5" />
                }
                color={
                  key === 'uniqueVisitors' ? 'blue' :
                  key === 'pageViews' ? 'green' :
                  key === 'sessions' ? 'purple' :
                  key === 'bounceRate' ? 'orange' :
                  'indigo'
                }
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Traffic Overview Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Traffic Overview</h3>
              <BarChart3 className="w-5 h-5 text-gray-500" />
            </div>
            <div className="h-64 flex items-end justify-between space-x-2">
              {dashboardData.timeSeries.slice(-7).map((day, index) => (
                <div key={day.date} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-blue-100 rounded-t" style={{
                    height: `${(day.visitors / Math.max(...dashboardData.timeSeries.slice(-7).map(d => d.visitors))) * 200}px`
                  }}>
                    <div className="w-full bg-blue-600 rounded-t transition-all duration-300 hover:bg-blue-700"
                         style={{
                           height: `${(day.visitors / Math.max(...dashboardData.timeSeries.slice(-7).map(d => d.visitors))) * 200}px`
                         }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 mt-2">
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Device Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Device Distribution</h3>
              <BarChart3 className="w-5 h-5 text-gray-500" />
            </div>
            <div className="space-y-4">
              {deviceData.map((device, index) => (
                <div key={device.device} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-gray-600">{device.icon}</div>
                    <span className="text-sm font-medium text-gray-900">{device.device}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${device.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {device.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Pages and Referrers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Pages */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Pages</h3>
            <div className="space-y-4">
              {dashboardData.topPages.slice(0, 8).map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{page.page}</p>
                    <p className="text-xs text-gray-500">{page.channel}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{page.entryPages.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">entries</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Referrers */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Referrers</h3>
            <div className="space-y-4">
              {dashboardData.topReferrers.slice(0, 8).map((referrer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{referrer.referrer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{referrer.sources.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">sessions</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conversion Analytics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Conversion Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{dashboardData.conversions.totalConversions}</p>
              <p className="text-sm text-gray-600">Total Conversions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{(dashboardData.conversions.conversionRate * 100).toFixed(2)}%</p>
              <p className="text-sm text-gray-600">Conversion Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">₹{dashboardData.conversions.totalValue.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Value</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Top Conversion Goals</h4>
            {dashboardData.conversions.topConversionGoals.map((goal, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-900">{goal.goal}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{goal.conversions} conversions</span>
                  <span className="text-sm font-medium text-gray-900">₹{goal.value.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-Time Components */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <LiveMetrics />
          <RealTimeFeed maxEvents={8} />
          <RecentConversions />
        </div>

        {/* UTM Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">UTM Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Top Sources</h4>
              <div className="space-y-3">
                {dashboardData.utm.topSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-900 capitalize">{source.source}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">{source.sessions} sessions</span>
                      <span className="text-sm font-medium text-green-600">{source.conversions} conversions</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Top Campaigns</h4>
              <div className="space-y-3">
                {dashboardData.utm.topCampaigns.map((campaign, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-900">{campaign.campaign}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">{campaign.sessions} sessions</span>
                      <span className="text-sm font-medium text-green-600">{campaign.conversions} conversions</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
