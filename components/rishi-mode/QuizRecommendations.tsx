'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Sparkles, Target, Users, Award, ArrowRight, ChevronRight, Star, Heart, Brain, Zap, ExternalLink, Clock, User, ChevronDown, ChevronUp } from 'lucide-react'
import { quizRecommendationEngine, type UnifiedRecommendations, type QuizMetadata } from '@/lib/quizRecommendationEngine'
import { useAnalytics } from '@/components/AnalyticsProvider'

interface QuizRecommendationsProps {
  onQuizStart?: (quizId: string) => void
  className?: string
}

export default function QuizRecommendations({ onQuizStart, className = '' }: QuizRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<UnifiedRecommendations | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState({
    nextQuiz: true,
    courses: true,
    books: true,
    analysis: true
  })
  const analytics = useAnalytics()
  const trackEvent = analytics?.trackEvent || (() => {})

  useEffect(() => {
    const loadRecommendations = () => {
      setIsLoading(true)
      try {
        const recs = quizRecommendationEngine.generateUnifiedRecommendations()
        console.log('Generated recommendations:', recs)
        setRecommendations(recs)
        
        // Track recommendation generation
        trackEvent('quiz_recommendations_generated', {
          quiz_count: recs.nextQuiz ? 1 : 0,
          course_count: recs.courses.length,
          book_count: recs.books.length,
          has_analysis: !!recs.analysis
        })
      } catch (error) {
        console.error('Error generating recommendations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(loadRecommendations, 100)
    return () => clearTimeout(timer)
  }, [trackEvent])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
    
    trackEvent('recommendation_section_toggled', {
      section,
      action: expandedSections[section] ? 'collapsed' : 'expanded'
    })
  }

  const handleQuizStart = (quiz: QuizMetadata) => {
    console.log('handleQuizStart called with quiz:', quiz)
    
    trackEvent('next_quiz_started', {
      quiz_id: quiz.id,
      quiz_name: quiz.name,
      from_recommendations: true
    })
    
    if (onQuizStart) {
      console.log('Calling onQuizStart with quizId:', quiz.id)
      onQuizStart(quiz.id)
    } else {
      console.log('Using default navigation for quizId:', quiz.id)
      // Default navigation
      if (quiz.id === 'guna-profiler') {
        window.location.href = '/guna-profiler'
      } else if (quiz.id === 'shiva-consciousness') {
        // Stay on current page and trigger quiz
        window.location.reload()
      }
    }
  }

  const handleCourseClick = (courseId: string, courseTitle: string) => {
    trackEvent('recommended_course_clicked', {
      course_id: courseId,
      course_title: courseTitle,
      source: 'quiz_recommendations'
    })
    
    // Navigate to course page
    window.location.href = `/courses/premium-courses#${courseId}`
  }

  const handleBookClick = (bookTitle: string, author: string) => {
    trackEvent('recommended_book_clicked', {
      book_title: bookTitle,
      author,
      source: 'quiz_recommendations'
    })
    
    // Open external book search
    const searchQuery = encodeURIComponent(`${bookTitle} ${author}`)
    window.open(`https://www.google.com/search?q=${searchQuery}+book`, '_blank')
  }

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
        />
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
      {/* Analysis Section */}
      {recommendations.analysis && (
        <CollapsibleSection
          title="Your Spiritual Analysis"
          isExpanded={expandedSections.analysis}
          onToggle={() => toggleSection('analysis')}
          icon={<Brain className="w-5 h-5" />}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800"
          >
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{recommendations.analysis}</p>
          </motion.div>
        </CollapsibleSection>
      )}

      {/* Next Quiz Section */}
      {recommendations.nextQuiz && (
        <CollapsibleSection
          title="Continue Your Journey"
          isExpanded={expandedSections.nextQuiz}
          onToggle={() => toggleSection('nextQuiz')}
          icon={<Target className="w-5 h-5" />}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-green-700 dark:text-green-300" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {recommendations.nextQuiz.name}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{recommendations.nextQuiz.description}</p>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation() // Prevent event bubbling
                    console.log('Start Quiz button clicked for:', recommendations.nextQuiz?.name)
                    handleQuizStart(recommendations.nextQuiz!)
                  }}
                  className="inline-flex items-center px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 active:bg-green-800 dark:active:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 cursor-pointer z-10 relative shadow-sm hover:shadow-md"
                  type="button"
                  aria-label={`Start ${recommendations.nextQuiz?.name} quiz`}
                >
                  Start Quiz
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          </motion.div>
        </CollapsibleSection>
      )}

      {/* Course Recommendations */}
      {recommendations.courses.length > 0 && (
        <CollapsibleSection
          title="Recommended Courses"
          isExpanded={expandedSections.courses}
          onToggle={() => toggleSection('courses')}
          icon={<Award className="w-5 h-5" />}
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {recommendations.courses.map((rec, index) => (
                <motion.div
                  key={rec.course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        rec.category === 'primary' 
                          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200' 
                          : rec.category === 'secondary'
                          ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}>
                        {rec.category === 'primary' ? 'Perfect Match' : 
                         rec.category === 'secondary' ? 'Great Fit' : 'Explore'}
                      </span>
                      <div className="flex items-center text-yellow-600 dark:text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm ml-1 font-medium">{Math.round(rec.matchScore * 100)}%</span>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {rec.course.title}
                    </h3>
                    
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
                      {rec.reason}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {rec.course.duration}
                      </span>
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {rec.course.acharya}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        ₹{rec.course.price.toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleCourseClick(rec.course.id, rec.course.title)}
                        className="px-3 py-1 bg-blue-600 dark:bg-blue-500 text-white text-sm rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium"
                      >
                        View Course
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CollapsibleSection>
      )}

      {/* Book Recommendations */}
      {recommendations.books.length > 0 && (
        <CollapsibleSection
          title="Recommended Books"
          isExpanded={expandedSections.books}
          onToggle={() => toggleSection('books')}
          icon={<BookOpen className="w-5 h-5" />}
        >
          <div className="space-y-4">
            <AnimatePresence>
              {recommendations.books.map((book, index) => (
                <motion.div
                  key={`${book.title}-${book.author}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-orange-700 dark:text-orange-300" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{book.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">by {book.author}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{book.reason}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            book.difficulty === 'beginner' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200' :
                            book.difficulty === 'intermediate' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200' :
                            'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'
                          }`}>
                            {book.difficulty}
                          </span>
                          <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">{book.category}</span>
                        </div>
                        <button
                          onClick={() => handleBookClick(book.title, book.author)}
                          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                        >
                          Find Book
                          <ExternalLink className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CollapsibleSection>
      )}
    </div>
  )
}

// Collapsible Section Component
interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
  isExpanded: boolean
  onToggle: () => void
  icon: React.ReactNode
}

function CollapsibleSection({ title, children, isExpanded, onToggle, icon }: CollapsibleSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        type="button"
      >
        <div className="flex items-center space-x-3">
          <div className="text-gray-600 dark:text-gray-400">
            {icon}
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
        </div>
        <div className="text-gray-500 dark:text-gray-400">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 relative">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
