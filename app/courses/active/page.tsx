'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Play, Clock, CheckCircle, ArrowLeft } from 'lucide-react'
import { useShikshanamAuth } from '@/lib/useShikshanamAuth'
import { GraphyCourse } from '@/lib/graphy'
import Link from 'next/link'

export default function ActiveCoursesPage() {
  const { user, isAuthenticated, isLoading, courses, checkAuthStatus } = useShikshanamAuth()
  const [localCourses, setLocalCourses] = useState<GraphyCourse[]>([])

  useEffect(() => {
    if (isAuthenticated) {
      setLocalCourses(courses)
    }
  }, [isAuthenticated, courses])

  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light dark:border-primary-dark mx-auto mb-4"></div>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Loading your courses...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <BookOpen className="w-16 h-16 text-primary-light dark:text-primary-dark mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
            Access Denied
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
            Please log in to view your active courses.
          </p>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark text-white font-medium hover:from-primary-light/90 hover:to-secondary-light/90 dark:hover:from-primary-dark/90 dark:hover:to-secondary-dark/90 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-light/10 to-secondary-light/10 dark:from-primary-dark/10 dark:to-secondary-dark/10 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/"
                className="inline-flex items-center space-x-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
              <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
                My Learning Hub
              </h1>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                Welcome back, {user?.name}! Continue your spiritual journey.
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Active Courses
              </div>
              <div className="text-2xl font-bold text-primary-light dark:text-primary-dark">
                {localCourses.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {localCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
              No Active Courses
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
              You haven't enrolled in any courses yet. Start your spiritual journey today!
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark text-white font-medium hover:from-primary-light/90 hover:to-secondary-light/90 dark:hover:from-primary-dark/90 dark:hover:to-secondary-dark/90 transition-all duration-200"
            >
              <Play className="w-4 h-4" />
              <span>Browse Courses</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {localCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-200"
              >
                {/* Course Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-primary-light/20 to-secondary-light/20 dark:from-primary-dark/20 dark:to-secondary-dark/20">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-primary-light dark:text-primary-dark" />
                    </div>
                  )}
                  
                  {/* Progress Badge */}
                  <div className="absolute top-3 right-3">
                    {course.is_completed ? (
                      <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Completed</span>
                      </div>
                    ) : (
                      <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {course.progress}% Complete
                      </div>
                    )}
                  </div>
                </div>

                {/* Course Info */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Last Accessed */}
                  <div className="flex items-center justify-between text-xs text-text-secondary-light dark:text-text-secondary-dark">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Last accessed</span>
                    </div>
                    <span>
                      {new Date(course.last_accessed).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Continue Button */}
                  <button className="w-full mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark text-white font-medium hover:from-primary-light/90 hover:to-secondary-light/90 dark:hover:from-primary-dark/90 dark:hover:to-secondary-dark/90 transition-all duration-200 flex items-center justify-center space-x-2">
                    <Play className="w-4 h-4" />
                    <span>{course.is_completed ? 'Review Course' : 'Continue Learning'}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
