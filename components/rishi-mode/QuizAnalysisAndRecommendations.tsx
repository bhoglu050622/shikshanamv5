'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Sparkles, Target, Users, Award, ArrowRight, ChevronRight, Star, Heart, Brain, Zap, ExternalLink, Clock, User } from 'lucide-react'
import { quizRecommendationEngine, type UnifiedRecommendations, type QuizMetadata } from '@/lib/quizRecommendationEngine'
import { useAnalytics } from '@/components/AnalyticsProvider'
import { GunaScores } from '@/types/guna-profiler'
import { storage } from '@/lib/utils'
import { i18nContent } from '@/lib/i18n'
import { getQuizCompletionStatus } from '@/lib/gunaProfilerUtils'

interface QuizAnalysisAndRecommendationsProps {
  quizType: 'guna-profiler' | 'shiva-consciousness' | 'both'
  className?: string
}

interface GunaProfile {
  dominantGuna: keyof GunaScores
  scores: GunaScores
  percentages: GunaScores
  archetype: string
  description: string
}

interface ShivaProfile {
  archetype: string
  darshana: string
  guna: string
  characteristics: string[]
}

export default function QuizAnalysisAndRecommendations({ 
  quizType, 
  className = '' 
}: QuizAnalysisAndRecommendationsProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [gunaProfile, setGunaProfile] = useState<GunaProfile | null>(null)
  const [shivaProfile, setShivaProfile] = useState<ShivaProfile | null>(null)
  const [recommendations, setRecommendations] = useState<UnifiedRecommendations | null>(null)
  const analytics = useAnalytics()
  const trackEvent = analytics?.trackEvent || (() => {})

  useEffect(() => {
    const loadProfiles = () => {
      setIsLoading(true)
      try {
        // Get quiz completion status
        const completionStatus = getQuizCompletionStatus()
        
        // Load Guna Profile if available
        if (quizType === 'guna-profiler' || quizType === 'both') {
          if (completionStatus.guna.completed) {
            const savedState = storage.get('gunaProfilerState')
            if (savedState && savedState.dominantGuna) {
              const language = savedState.language || 'en'
              const content = i18nContent[language as keyof typeof i18nContent]
              const dominantGuna = savedState.dominantGuna as keyof GunaScores
              
              setGunaProfile({
                dominantGuna,
                scores: savedState.scores || { sattva: 0, rajas: 0, tamas: 0 },
                percentages: savedState.percentages || { sattva: 0, rajas: 0, tamas: 0 },
                archetype: content.results.archetypes[savedState.personalityArchetypeCode]?.archetype || 'Your Archetype',
                description: content.results.archetypes[savedState.personalityArchetypeCode]?.description || 'Personalized description.'
              })
            }
          }
        }

        // Load Shiva Profile if available
        if (quizType === 'shiva-consciousness' || quizType === 'both') {
          if (completionStatus.shiva.completed) {
            const savedRishiState = storage.get('rishiModeState')
            if (savedRishiState && savedRishiState.rishiProfile) {
              setShivaProfile({
                archetype: savedRishiState.rishiProfile.archetype,
                darshana: savedRishiState.rishiProfile.darshana,
                guna: savedRishiState.rishiProfile.guna,
                characteristics: savedRishiState.rishiProfile.characteristics || []
              })
            }
          }
        }

        // Generate recommendations
        const recs = quizRecommendationEngine.generateUnifiedRecommendations()
        setRecommendations(recs)
        
        // Track recommendation generation
        trackEvent('quiz_analysis_recommendations_generated', {
          quiz_type: quizType,
          has_guna: !!gunaProfile,
          has_shiva: !!shivaProfile,
          course_count: recs.courses.length,
          book_count: recs.books.length,
          has_analysis: !!recs.analysis,
          has_combined_analysis: !!recs.combinedAnalysis
        })
      } catch (error) {
        console.error('Error loading profiles and recommendations:', error)
        // Set fallback recommendations if there's an error
        setRecommendations({
          courses: [],
          books: [],
          analysis: 'We\'re preparing your personalized recommendations. Please try refreshing the page.',
          hasQuizHistory: false
        })
      } finally {
        setIsLoading(false)
      }
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(loadProfiles, 100)
    return () => clearTimeout(timer)
  }, [quizType, trackEvent])

  const handleQuizStart = (quiz: QuizMetadata) => {
    trackEvent('quiz_started_from_recommendations', {
      quiz_id: quiz.id,
      quiz_name: quiz.name
    })
    
    if (quiz.id === 'guna-profiler') {
      window.location.href = '/guna-profiler'
    } else if (quiz.id === 'shiva-consciousness') {
      window.location.href = '/rishi-mode?quiz=shiva-consciousness-enhanced'
    }
  }

  const handleCourseClick = (courseId: string) => {
    trackEvent('course_clicked_from_recommendations', {
      course_id: courseId,
      source: 'quiz_analysis'
    })
    window.location.href = `/courses/premium-courses#${courseId}`
  }

  const handleBookClick = (bookTitle: string, author: string) => {
    trackEvent('book_clicked_from_recommendations', {
      book_title: bookTitle,
      author,
      source: 'quiz_analysis'
    })
    const searchQuery = encodeURIComponent(`${bookTitle} ${author}`)
    window.open(`https://www.google.com/search?q=${searchQuery}+book`, '_blank')
  }

  if (isLoading) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading your personalized analysis...</p>
      </div>
    )
  }

  if (!recommendations) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <p className="text-gray-600 dark:text-gray-400">Unable to load recommendations. Please try refreshing the page.</p>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Mixed Analysis Screen */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-6 h-6" />
            <h3 className="text-xl font-bold">Your Spiritual Analysis</h3>
          </div>
          <p className="text-purple-100">Personalized insights based on your spiritual profile</p>
        </div>

        {/* Analysis Content */}
        <div className="p-6 space-y-6">
          {/* Spiritual Analysis */}
          {recommendations.analysis && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Profile Analysis</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{recommendations.analysis}</p>
                </div>
              </div>
            </div>
          )}

          {/* Combined Analysis */}
          {recommendations.combinedAnalysis && quizType === 'both' && (
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Comprehensive Analysis</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{recommendations.combinedAnalysis}</p>
                </div>
              </div>
            </div>
          )}

          {/* Next Quiz Recommendation */}
          {recommendations.nextQuiz && quizType !== 'both' && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Complete Your Analysis</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                    {quizType === 'guna-profiler' 
                      ? "Take the Shiva Consciousness quiz for deeper insights."
                      : "Take the Guna Profiler to understand your energy balance."
                    }
                  </p>
                  <button
                    onClick={() => handleQuizStart(recommendations.nextQuiz!)}
                    className="bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    {quizType === 'guna-profiler' ? 'Take Shiva Quiz' : 'Take Guna Quiz'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Course Recommendations */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5" />
              <h3 className="font-bold">Recommended Courses</h3>
            </div>
          </div>
          
          <div className="p-4 space-y-3">
            {recommendations.courses.length > 0 ? (
              recommendations.courses.slice(0, 2).map((course, index) => (
                <motion.div
                  key={course.course.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md transition-shadow bg-gray-50 dark:bg-gray-700/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${
                          course.matchType === 'perfect' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : course.matchType === 'high'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}>
                          {course.matchType === 'perfect' ? 'Perfect' : 
                           course.matchType === 'high' ? 'High' : 'Good'}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 truncate">
                        {course.course.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {course.reason}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                          ₹{course.course.price}
                        </span>
                        <button
                          onClick={() => handleCourseClick(course.course.id)}
                          className="bg-purple-600 dark:bg-purple-500 text-white px-3 py-1 rounded text-xs hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-6">
                <BookOpen className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Complete your assessment for personalized course recommendations
                </p>
                <button
                  onClick={() => window.location.href = '/courses/premium-courses'}
                  className="bg-purple-600 dark:bg-purple-500 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
                >
                  Browse Courses
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Book Recommendations */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 p-4 text-white">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5" />
              <h3 className="font-bold">Recommended Books</h3>
            </div>
          </div>
          
          <div className="p-4 space-y-3">
            {recommendations.books.length > 0 ? (
              recommendations.books.slice(0, 2).map((book, index) => (
                <motion.div
                  key={book.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md transition-shadow bg-gray-50 dark:bg-gray-700/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${
                          book.difficulty === 'beginner' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : book.difficulty === 'intermediate'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {book.difficulty.charAt(0).toUpperCase() + book.difficulty.slice(1)}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 truncate">
                        {book.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        by {book.author}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {book.reason}
                      </p>
                      <button
                        onClick={() => handleBookClick(book.title, book.author)}
                        className="bg-blue-600 dark:bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center gap-1"
                      >
                        Find Book <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-6">
                <BookOpen className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Complete your assessment for personalized book recommendations
                </p>
                <button
                  onClick={() => window.open('https://www.google.com/search?q=spiritual+books+vedanta+philosophy', '_blank')}
                  className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  Explore Books
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
