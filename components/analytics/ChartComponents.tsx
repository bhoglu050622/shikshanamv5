'use client'

import { motion } from 'framer-motion'
import { 
  BarChart3, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Users,
  Eye,
  Clock
} from 'lucide-react'

interface ChartData {
  label: string
  value: number
  color?: string
  percentage?: number
}

interface TimeSeriesData {
  date: string
  value: number
  label?: string
}

interface ChartProps {
  data: ChartData[] | TimeSeriesData[]
  title: string
  type: 'bar' | 'line' | 'pie' | 'area'
  height?: number
  showTooltips?: boolean
  animate?: boolean
  className?: string
}

// Bar Chart Component
export function BarChart({ data, title, height = 200, showTooltips = true, animate = true, className = '' }: ChartProps) {
  const maxValue = Math.max(...data.map(d => 'value' in d ? d.value : 0))
  
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <BarChart3 className="w-5 h-5 text-gray-500" />
      </div>
      
      <div className="h-64 flex items-end justify-between space-x-2">
        {data.map((item, index) => {
          const value = 'value' in item ? item.value : 0
          const label = 'label' in item ? item.label : item.date
          const heightPercentage = maxValue > 0 ? (value / maxValue) * 100 : 0
          
          return (
            <motion.div
              key={index}
              initial={animate ? { opacity: 0, scaleY: 0 } : {}}
              animate={animate ? { opacity: 1, scaleY: 1 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex-1 flex flex-col items-center group relative"
            >
              <div className="w-full bg-blue-100 rounded-t transition-all duration-300 hover:bg-blue-200">
                <motion.div
                  className="w-full bg-blue-600 rounded-t transition-all duration-300 hover:bg-blue-700"
                  style={{ height: `${heightPercentage}%` }}
                  whileHover={{ scaleY: 1.05 }}
                />
              </div>
              
              {showTooltips && (
                <div className="absolute bottom-full mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {label}: {value.toLocaleString()}
                </div>
              )}
              
              <span className="text-xs text-gray-500 mt-2 text-center">
                {typeof label === 'string' && label.length > 10 ? label.substring(0, 8) + '...' : label}
              </span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// Line Chart Component
export function LineChart({ data, title, height = 200, showTooltips = true, animate = true, className = '' }: ChartProps) {
  const maxValue = Math.max(...data.map(d => 'value' in d ? d.value : 0))
  const minValue = Math.min(...data.map(d => 'value' in d ? d.value : 0))
  const range = maxValue - minValue
  
  const points = data.map((item, index) => {
    const value = 'value' in item ? item.value : 0
    const x = (index / (data.length - 1)) * 100
    const y = range > 0 ? 100 - ((value - minValue) / range) * 100 : 50
    return { x, y, value, label: 'label' in item ? item.label : item.date }
  })
  
  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ')
  
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <LineChartIcon className="w-5 h-5 text-gray-500" />
      </div>
      
      <div className="relative h-64">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="#e5e7eb"
              strokeWidth="0.5"
            />
          ))}
          
          {/* Line path */}
          <motion.path
            d={pathData}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            initial={animate ? { pathLength: 0 } : {}}
            animate={animate ? { pathLength: 1 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
          />
          
          {/* Data points */}
          {points.map((point, index) => (
            <motion.circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="2"
              fill="#3b82f6"
              initial={animate ? { scale: 0 } : {}}
              animate={animate ? { scale: 1 } : {}}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="cursor-pointer hover:r-3 transition-all duration-200"
            />
          ))}
        </svg>
        
        {/* Tooltips */}
        {showTooltips && points.map((point, index) => (
          <div
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
          >
            <div className="px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
              {point.label}: {point.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Pie Chart Component
export function PieChart({ data, title, height = 200, showTooltips = true, animate = true, className = '' }: ChartProps) {
  const total = data.reduce((sum, item) => sum + ('value' in item ? item.value : 0), 0)
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
  
  let currentAngle = 0
  const segments = data.map((item, index) => {
    const value = 'value' in item ? item.value : 0
    const percentage = total > 0 ? (value / total) * 100 : 0
    const angle = (percentage / 100) * 360
    const startAngle = currentAngle
    currentAngle += angle
    
    const startRadians = (startAngle - 90) * (Math.PI / 180)
    const endRadians = (currentAngle - 90) * (Math.PI / 180)
    
    const x1 = 50 + 40 * Math.cos(startRadians)
    const y1 = 50 + 40 * Math.sin(startRadians)
    const x2 = 50 + 40 * Math.cos(endRadians)
    const y2 = 50 + 40 * Math.sin(endRadians)
    
    const largeArcFlag = angle > 180 ? 1 : 0
    
    const pathData = [
      `M 50 50`,
      `L ${x1} ${y1}`,
      `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ')
    
    return {
      pathData,
      percentage,
      color: colors[index % colors.length],
      label: 'label' in item ? item.label : item.date,
      value
    }
  })
  
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <PieChartIcon className="w-5 h-5 text-gray-500" />
      </div>
      
      <div className="flex items-center space-x-8">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {segments.map((segment, index) => (
              <motion.path
                key={index}
                d={segment.pathData}
                fill={segment.color}
                initial={animate ? { scale: 0 } : {}}
                animate={animate ? { scale: 1 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
              />
            ))}
          </svg>
        </div>
        
        <div className="flex-1 space-y-2">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-sm text-gray-900">{segment.label}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900">
                  {segment.value.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500 ml-1">
                  ({segment.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Metric Card Component
interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  trend?: 'up' | 'down' | 'neutral'
  icon?: React.ReactNode
  color?: string
  className?: string
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  trend = 'neutral', 
  icon, 
  color = 'blue',
  className = '' 
}: MetricCardProps) {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600'
  }
  
  const bgColorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200'
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-sm border p-6 ${bgColorClasses[color as keyof typeof bgColorClasses]} ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {icon && <div className={colorClasses[color as keyof typeof colorClasses]}>{icon}</div>}
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        </div>
        {change !== undefined && (
          <div className={`flex items-center space-x-1 text-sm ${
            trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : trend === 'down' ? (
              <TrendingDown className="w-4 h-4" />
            ) : null}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </motion.div>
  )
}

// Data Table Component
interface DataTableProps {
  data: Array<Record<string, any>>
  columns: Array<{
    key: string
    label: string
    render?: (value: any, row: any) => React.ReactNode
  }>
  title: string
  className?: string
}

export function DataTable({ data, columns, title, className = '' }: DataTableProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="text-left py-3 px-4 text-sm font-medium text-gray-900"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
              >
                {columns.map((column) => (
                  <td key={column.key} className="py-3 px-4 text-sm text-gray-900">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Progress Bar Component
interface ProgressBarProps {
  label: string
  value: number
  max: number
  color?: string
  showPercentage?: boolean
  className?: string
}

export function ProgressBar({ 
  label, 
  value, 
  max, 
  color = 'blue', 
  showPercentage = true, 
  className = '' 
}: ProgressBarProps) {
  const percentage = max > 0 ? (value / max) * 100 : 0
  
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    purple: 'bg-purple-600',
    orange: 'bg-orange-600'
  }
  
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-900">{label}</span>
        {showPercentage && (
          <span className="text-sm text-gray-600">{percentage.toFixed(1)}%</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className={`h-2 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </div>
    </div>
  )
}
