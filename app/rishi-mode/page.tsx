'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Sparkles, Target, Users, Award, ArrowRight, ChevronRight, Star, Heart, Brain, Zap, ExternalLink, Clock, User, CheckCircle } from 'lucide-react'
import { quizQuestions, rishiProfiles, type RishiProfile, type QuizQuestion } from '@/data/rishiModeData'
import { recommendationEngine, type EnhancedRecommendation } from '@/lib/rishiRecommendations'
import { RishiAnalyticsTracker } from '@/lib/rishiAnalytics'
import { useAnalytics, usePageTracking, usePersonalization, ConversionTracker } from '@/components/AnalyticsProvider'
import { GunaScores, GunaCtaContent, GunaChallenge } from '@/types/guna-profiler'
import { i18nContent } from '@/lib/i18n'
import QuizRecommendations from '@/components/rishi-mode/QuizRecommendations'
import QuizAnalysisAndRecommendations from '@/components/rishi-mode/QuizAnalysisAndRecommendations'
import { storage } from '@/lib/utils'
import ShivaConsciousnessQuiz from '@/components/rishi-mode/ShivaConsciousnessQuiz'
import { checkQuizHistory, getQuizCompletionStatus, getRecommendedNextStep } from '@/lib/gunaProfilerUtils'

interface GunaProfile {
  archetype: string
  description: string
  dominantGuna: keyof GunaScores
  recommendations: {
    dietary: string[]
    activities: string[]
    challenge: GunaChallenge
  }
  cta: GunaCtaContent
}

export default function RishiModePage() {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [rishiProfile, setRishiProfile] = useState<RishiProfile | null>(null)
  const [gunaProfile, setGunaProfile] = useState<GunaProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<EnhancedRecommendation[]>([])
  const [analytics, setAnalytics] = useState<RishiAnalyticsTracker | null>(null)
  const [enrolling, setEnrolling] = useState<string | null>(null)
  const [questionStartTimes, setQuestionStartTimes] = useState<Record<string, number>>({})
  const [quizCompletion, setQuizCompletion] = useState({ guna: false, shivaConsciousness: false })
  const [isCombinedProfileView, setIsCombinedProfileView] = useState(false)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [recommendedBooks, setRecommendedBooks] = useState<any[]>([])
  const [selectedQuiz, setSelectedQuiz] = useState<'guna-profiler' | 'shiva-consciousness-enhanced' | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const [hasCompletedQuizzes, setHasCompletedQuizzes] = useState(false)

  // New analytics hooks
  const analyticsContext = useAnalytics()
  const trackEvent = analyticsContext?.trackEvent || (() => {})
  const trackConversion = analyticsContext?.trackConversion || (() => {})
  const getPersonalizedContent = analyticsContext?.getPersonalizedContent || ((contentType: string, defaultContent: any) => defaultContent)
  const getPersonalizedRecommendations = analyticsContext?.getPersonalizedRecommendations || (() => [])
  const { getContent } = usePersonalization()
  
  // Track page view
  usePageTracking('rishi-mode')

  const steps = [
    { id: 'welcome', title: 'Welcome to Rishi Mode' },
    { id: 'quiz-selection', title: 'Choose Your Path' },
    { id: 'quiz', title: 'Discover Your Path' },
    { id: 'profile', title: 'Your Rishi Profile' },
    { id: 'recommendations', title: 'Your Personalized Journey' }
  ]

  // Initialize analytics on component mount
  useEffect(() => {
    const tracker = new RishiAnalyticsTracker()
    setAnalytics(tracker)
    tracker.trackJourneyStep('welcome')
    
    return () => {
      if (tracker) {
        tracker.endSession()
      }
    }
  }, [])

  // Check quiz completion status on mount
  useEffect(() => {
    const completionStatus = getQuizCompletionStatus()
    const history = checkQuizHistory()
    
    setQuizCompletion({
      guna: completionStatus.guna.completed,
      shivaConsciousness: completionStatus.shiva.completed
    })
    
    setHasCompletedQuizzes(history.hasAnyHistory)
    
    // Load existing profiles if available
    if (completionStatus.guna.completed) {
      const savedState = storage.get('gunaProfilerState')
      if (savedState && savedState.dominantGuna) {
        const language = savedState.language || 'en'
        const content = i18nContent[language as keyof typeof i18nContent]
        const dominantGuna = savedState.dominantGuna as keyof GunaScores
        const profileData: GunaProfile = {
          archetype: content.results.archetypes[savedState.personalityArchetypeCode]?.archetype || 'Your Archetype',
          description: content.results.archetypes[savedState.personalityArchetypeCode]?.description || 'Personalized description.',
          dominantGuna: dominantGuna,
          recommendations: {
            dietary: content.recommendations.dietary[dominantGuna],
            activities: content.recommendations.activities[dominantGuna],
            challenge: content.recommendations.challenges[dominantGuna],
          },
          cta: content.cta[dominantGuna],
        }
        setGunaProfile(profileData)
      }
    }
    
    if (completionStatus.shiva.completed) {
      const savedRishiState = storage.get('rishiModeState')
      if (savedRishiState && savedRishiState.rishiProfile) {
        setRishiProfile(savedRishiState.rishiProfile)
        setAnswers(savedRishiState.answers || {})
      }
    }
  }, [])

  // Handle URL parameters for direct quiz access and from quiz completion
  useEffect(() => {
    const quizParam = searchParams.get('quiz')
    const fromParam = searchParams.get('from')
    
    if (quizParam === 'shiva-consciousness-enhanced') {
      setSelectedQuiz('shiva-consciousness-enhanced')
      setCurrentStep(2) // Go directly to quiz
    } else if (fromParam) {
      // User is coming from a completed quiz
      if (fromParam === 'guna-profiler') {
        setSelectedQuiz('guna-profiler')
        setCurrentStep(steps.findIndex(s => s.id === 'recommendations'))
      } else if (fromParam === 'shiva-consciousness') {
        setSelectedQuiz('shiva-consciousness-enhanced')
        setCurrentStep(steps.findIndex(s => s.id === 'recommendations'))
      }
    }
  }, [searchParams])

  // Auto-navigate to recommendations if user has completed quizzes
  useEffect(() => {
    const fromParam = searchParams.get('from')
    if ((fromParam && (quizCompletion.guna || quizCompletion.shivaConsciousness)) || 
        (quizCompletion.guna && quizCompletion.shivaConsciousness)) {
      setCurrentStep(steps.findIndex(s => s.id === 'recommendations'))
    }
  }, [quizCompletion, searchParams])

  const calculateProfile = () => {
    const darshanaCounts: Record<string, number> = {}
    
    Object.values(answers).forEach(answer => {
      darshanaCounts[answer] = (darshanaCounts[answer] || 0) + 1
    })
    
    const dominantDarshana = Object.entries(darshanaCounts).reduce((a, b) => 
      darshanaCounts[a[0]] > darshanaCounts[b[0]] ? a : b
    )[0]
    
    return rishiProfiles[dominantDarshana]
  }

  const generateRecommendations = (profile: RishiProfile) => {
    const recs = recommendationEngine.generateRecommendations(profile, {
      level: 'Beginner', // Could be made dynamic based on user input
      interests: [],
      completedCourses: []
    }, 8)
    
    // Get personalized recommendations from new system
    const personalizedRecs = getPersonalizedRecommendations(8)
    
    // Track recommendation generation
    trackEvent('recommendations_generated', {
      profile_type: profile.archetype,
      darshana: profile.darshana,
      recommendation_count: recs.length,
      personalized_count: personalizedRecs.length,
      source: 'rishi_profile_completion'
    })
    
    setRecommendations(recs)
    
    if (analytics) {
      analytics.trackRecommendationView(recs, 'primary')
    }
  }

  const generateCombinedRecommendations = () => {
    if (!rishiProfile || !gunaProfile) return

    setIsCombinedProfileView(true)

    const combinedProfile = {
      ...rishiProfile,
      guna: gunaProfile.dominantGuna || rishiProfile.guna,
    }

    const recs = recommendationEngine.generateRecommendations(combinedProfile, {
      level: 'Beginner',
      interests: [],
      completedCourses: []
    }, 10)
    setRecommendations(recs)

    setAnalysis(`Your Rishi profile as a ${rishiProfile.archetype} combined with your dominant ${gunaProfile.dominantGuna} Guna provides a unique spiritual blueprint. Your philosophical inclination towards ${rishiProfile.darshana} suggests a path of wisdom and insight, while your Guna balance influences your energetic and emotional tendencies. This combination indicates a journey that should balance intellectual pursuits with grounding practices to maintain equilibrium.`)

    setRecommendedBooks([
      { title: 'The Upanishads', author: 'Eknath Easwaran', reason: `Essential for your ${rishiProfile.darshana} studies.` },
      { title: 'The Bhagavad Gita', author: 'Translated by Stephen Mitchell', reason: 'Provides deep insights into the nature of action and duty, relevant to your Guna profile.' },
      { title: 'Yoga Sutras of Patanjali', author: 'Sri Swami Satchidananda', reason: 'A practical guide for disciplined practice, aligning with your path.' }
    ])

    if (analytics) {
      analytics.trackRecommendationView(recs, 'combined')
    }
  }

  const getQuizType = (): 'guna-profiler' | 'shiva-consciousness' | 'both' => {
    const gunaCompleted = quizCompletion.guna
    const shivaCompleted = quizCompletion.shivaConsciousness
    
    if (gunaCompleted && shivaCompleted) {
      return 'both'
    } else if (gunaCompleted) {
      return 'guna-profiler'
    } else if (shivaCompleted) {
      return 'shiva-consciousness'
    } else {
      return 'guna-profiler' // Default fallback
    }
  }

  const handleAnswer = (questionId: string, value: string) => {
    const now = Date.now()
    const startTime = questionStartTimes[questionId] || now
    const timeSpent = now - startTime
    const changedAnswer = answers[questionId] !== undefined && answers[questionId] !== value
    
    setAnswers(prev => ({ ...prev, [questionId]: value }))
    
    if (analytics) {
      analytics.trackQuizAnswer(questionId, value, timeSpent, changedAnswer)
    }
    
    // Set start time for next question if this is the first answer for this question
    if (!questionStartTimes[questionId]) {
      setQuestionStartTimes(prev => ({ ...prev, [questionId]: now }))
    }
  }

  const handleNext = () => {
    if (currentStep === 2 && Object.keys(answers).length === quizQuestions.length) {
      const quizStartTime = questionStartTimes[quizQuestions[0].id] || Date.now()
      const quizDuration = Date.now() - quizStartTime
      const answersChanged = Object.values(answers).filter((_, i) => 
        Object.values(questionStartTimes)[i] !== undefined
      ).length
      
      if (analytics) {
        analytics.trackQuizCompletion(quizDuration, answersChanged)
        analytics.trackJourneyStep('quiz', true)
      }
      
      setIsLoading(true)
      setTimeout(() => {
        const profile = calculateProfile()
        setRishiProfile(profile)
        generateRecommendations(profile)
        
        if (analytics) {
          analytics.trackProfileGeneration(profile, quizDuration, answersChanged)
          analytics.trackJourneyStep('profile', true)
        }
        
        // Save state to localStorage
        const rishiState = {
          rishiProfile: profile,
          answers: answers,
          timestamp: Date.now(),
        }
        storage.set('rishiModeState', rishiState)
        setQuizCompletion(prev => ({ ...prev, shivaConsciousness: true }))
        
        setIsLoading(false)
        setCurrentStep(3)
      }, 2000)
    } else if (currentStep < steps.length - 1) {
      if (analytics) {
        analytics.trackJourneyStep(steps[currentStep].id, true)
      }
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleStartQuiz = () => {
    // Track with original analytics
    if (analytics) {
      analytics.trackJourneyStep('welcome', true)
      analytics.trackButtonClick('Begin Your Journey', 'welcome')
    }
    
    // Track with new analytics system
    trackEvent('rishi_quiz_started', {
      source: 'welcome_page',
      step: 'quiz_selection',
      previous_visits: quizCompletion.guna || quizCompletion.shivaConsciousness
    })
    
    const nextStep = getRecommendedNextStep()
    
    if (nextStep === 'recommendations') {
      // User has completed all quizzes, go directly to recommendations
      setCurrentStep(steps.findIndex(s => s.id === 'recommendations'))
    } else {
      // User needs to complete quizzes, go to quiz selection
      setCurrentStep(1)
    }
  }

  const handleQuizSelection = (quizType: 'guna-profiler' | 'shiva-consciousness-enhanced') => {
    // Prevent multiple clicks
    if (isNavigating) {
      return;
    }
    
    setIsNavigating(true)
    setSelectedQuiz(quizType)
    
    // Track quiz selection
    trackEvent('quiz_selected', {
      quiz_type: quizType,
      is_retake: quizType === 'guna-profiler' ? quizCompletion.guna : quizCompletion.shivaConsciousness,
      source: 'rishi_mode_selection'
    })
    
    if (quizType === 'guna-profiler') {
      // Navigate to Guna Profiler
      window.location.href = '/guna-profiler';
    } else if (quizType === 'shiva-consciousness-enhanced') {
      // Move to Shiva Consciousness quiz step
      setCurrentStep(2);
      setIsNavigating(false);
    }
  }

  const handleRetakeQuiz = (quizType: 'guna-profiler' | 'shiva-consciousness-enhanced') => {
    // Clear the specific quiz data before retaking
    if (quizType === 'guna-profiler') {
      storage.remove('gunaProfilerState')
      setQuizCompletion(prev => ({ ...prev, guna: false }))
    } else {
      storage.remove('rishiModeState')
      setQuizCompletion(prev => ({ ...prev, shivaConsciousness: false }))
    }
    
    // Track retake action
    trackEvent('quiz_retake_initiated', {
      quiz_type: quizType,
      source: 'rishi_mode'
    })
    
    // Proceed with quiz selection
    handleQuizSelection(quizType)
  }

  const handleViewCombinedResults = () => {
    generateCombinedRecommendations()
    setCurrentStep(steps.findIndex(s => s.id === 'recommendations'))
  }

  const handleViewExistingResults = () => {
    // Track viewing existing results
    trackEvent('existing_results_viewed', {
      has_guna: quizCompletion.guna,
      has_shiva: quizCompletion.shivaConsciousness,
      source: 'rishi_mode'
    })
    
    // Go directly to recommendations
    setCurrentStep(steps.findIndex(s => s.id === 'recommendations'))
  }

  const handleCourseInteraction = async (courseId: string, action: 'view' | 'click' | 'enroll', recommendation: EnhancedRecommendation) => {
    if (analytics) {
      analytics.trackCourseInteraction(
        courseId,
        recommendation.course.title,
        action,
        'rishi_recommendations',
        recommendation.score.score
      )
    }

    if (action === 'enroll') {
      await handleEnrollment(recommendation)
    }
  }

  const handleEnrollment = async (recommendation: EnhancedRecommendation) => {
    setEnrolling(recommendation.course.id)
    
    // Track enrollment attempt
    trackEvent('course_enrollment_attempt', {
      course_id: recommendation.course.id,
      course_title: recommendation.course.title,
      recommendation_score: recommendation.score.score,
      source: 'rishi_recommendations',
      profile_type: rishiProfile?.archetype,
      darshana: rishiProfile?.darshana
    })
    
    try {
      const response = await fetch('/api/rishi/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'user@example.com', // In real app, get from auth
          courseId: recommendation.course.id,
          source: 'rishi_recommendations',
          rishiProfile: rishiProfile ? {
            darshana: rishiProfile.darshana,
            archetype: rishiProfile.archetype,
            sessionId: analytics?.getSessionData().sessionId || ''
          } : undefined,
          recommendationScore: recommendation.score.score,
          userPreferences: {
            level: 'Beginner',
            interests: []
          }
        })
      })

      const result = await response.json()
      
      if (result.success) {
        // Track successful enrollment conversion
        trackConversion('course_enrollment', recommendation.course.price, {
          course_id: recommendation.course.id,
          course_title: recommendation.course.title,
          source: 'rishi_recommendations',
          profile_type: rishiProfile?.archetype,
          darshana: rishiProfile?.darshana,
          recommendation_score: recommendation.score.score
        })

        alert(`🎉 Successfully enrolled in ${recommendation.course.title}! ${result.data.personalizedMessage}`)
      } else {
        // Track failed enrollment
        trackEvent('course_enrollment_failed', {
          course_id: recommendation.course.id,
          error_message: result.message,
          source: 'rishi_recommendations'
        })
        
        alert(`Enrollment failed: ${result.message}`)
      }
    } catch (error) {
      console.error('Enrollment error:', error)
      
      // Track enrollment error
      trackEvent('course_enrollment_error', {
        course_id: recommendation.course.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        source: 'rishi_recommendations'
      })
      
      alert('Enrollment failed. Please try again.')
    } finally {
      setEnrolling(null)
    }
  }

  const isQuizComplete = Object.keys(answers).length === quizQuestions.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-light/20 to-secondary-light/20 dark:from-primary-dark/20 dark:to-secondary-dark/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Sparkles className="w-8 h-8 text-primary-light dark:text-primary-dark" />
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark bg-clip-text text-transparent">
                Rishi Mode
              </h1>
              <Sparkles className="w-8 h-8 text-secondary-light dark:text-secondary-dark" />
            </div>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover your philosophical path through ancient wisdom
            </p>
          </motion.div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center justify-center space-x-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                index <= currentStep 
                  ? 'bg-primary-light dark:bg-primary-dark border-primary-light dark:border-primary-dark text-white' 
                  : 'border-gray-300 dark:border-gray-600 text-gray-400'
              }`}>
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-2 ${
                  index < currentStep ? 'bg-primary-light dark:bg-primary-dark' : 'bg-gray-300 dark:bg-gray-600'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

        
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-xl">
                <div className="w-24 h-24 bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark rounded-full flex items-center justify-center mx-auto mb-8">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                
                {hasCompletedQuizzes ? (
                  // User has completed quizzes - show personalized welcome
                  <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                      Welcome Back to Rishi Mode
                    </h2>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                      <div className="flex items-center justify-center mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
                        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                          Your Spiritual Profile is Complete
                        </h3>
                      </div>
                      <p className="text-green-700 dark:text-green-300 text-sm">
                        You've already completed {quizCompletion.guna && quizCompletion.shivaConsciousness ? 'both quizzes' : 
                        quizCompletion.guna ? 'the Guna Profiler' : 'the Shiva Consciousness quiz'}. 
                        Continue your journey with personalized recommendations and insights.
                      </p>
                    </div>
                    
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                      Discover deeper insights, refined recommendations, and continue your spiritual evolution with our enhanced analysis.
                    </p>
                  </>
                ) : (
                  // New user - show standard welcome
                  <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                      Welcome to Rishi Mode
                    </h2>
                    
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                      Discover your philosophical path through ancient wisdom. Take our spiritual assessments to unlock personalized insights and recommendations.
                    </p>
                  </>
                )}

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Deep Analysis</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Get a comprehensive analysis of your spiritual alignment</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Refined Recommendations</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Get more targeted course and book recommendations</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Personalized Learning Path</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Get a customized learning journey based on your archetype</p>
                  </div>
                </div>

                <ConversionTracker
                  goalId="rishi_mode_start"
                  value={10}
                  trigger="click"
                  properties={{
                    source: 'welcome_page',
                    profile_type: hasCompletedQuizzes ? 'returning_user' : 'initial_visitor'
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleStartQuiz();
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark text-white rounded-xl font-semibold text-lg hover:from-primary-light/90 hover:to-secondary-light/90 dark:hover:from-primary-dark/90 dark:hover:to-secondary-dark/90 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center mx-auto"
                    style={{ 
                      pointerEvents: 'auto',
                      position: 'relative',
                      zIndex: 10
                    }}
                  >
                    {hasCompletedQuizzes ? 'Continue Journey' : 'Begin Your Journey'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </ConversionTracker>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && gunaProfile && (
            <motion.div
              key="guna-recommendations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GunaResultsComponent profile={gunaProfile} />
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="quiz-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl relative z-10"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {hasCompletedQuizzes ? 'Continue Your Journey' : 'Choose Your Path'}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {hasCompletedQuizzes 
                    ? 'Select which assessment you\'d like to retake or continue to your personalized recommendations'
                    : 'Select which quiz you\'d like to take to discover your spiritual path'
                  }
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Guna Profiler Card */}
                <motion.div
                  className={`p-8 border-2 rounded-xl transition-all duration-300 text-left relative z-20 ${
                    quizCompletion.guna 
                      ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/10' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/10 hover:shadow-lg cursor-pointer'
                  }`}
                  style={{ position: 'relative', zIndex: 20 }}
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                  
                  <div className="flex items-center justify-center mb-3">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                      Guna Profiler
                    </h3>
                    {quizCompletion.guna && (
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 ml-2" />
                    )}
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed mb-4">
                    Discover your dominant guna (fundamental quality) and understand your natural tendencies through Ayurvedic wisdom.
                  </p>
                  
                  {quizCompletion.guna ? (
                    <div className="text-center">
                      <div className="bg-green-100 dark:bg-green-800/30 rounded-lg p-3 mb-4">
                        <p className="text-green-800 dark:text-green-200 text-sm font-medium">
                          ✓ Completed
                        </p>
                      </div>
                                             <button
                         onClick={() => handleRetakeQuiz('guna-profiler')}
                         disabled={isNavigating}
                         className="text-green-600 dark:text-green-400 font-semibold hover:text-green-700 dark:hover:text-green-300 transition-colors"
                       >
                         Retake Quiz
                       </button>
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleQuizSelection('guna-profiler')}
                      disabled={isNavigating}
                      className="w-full text-center"
                    >
                      <span className="inline-flex items-center text-green-600 dark:text-green-400 font-semibold group-hover:translate-x-1 transition-transform">
                        Start Quiz <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </motion.button>
                  )}
                </motion.div>

                {/* Shiva Consciousness Card */}
                <motion.div
                  className={`p-8 border-2 rounded-xl transition-all duration-300 text-left relative z-20 ${
                    quizCompletion.shivaConsciousness 
                      ? 'border-orange-300 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/10' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:shadow-lg cursor-pointer'
                  }`}
                  style={{ position: 'relative', zIndex: 20 }}
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                  
                  <div className="flex items-center justify-center mb-3">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                      Enhanced Shiva Consciousness
                    </h3>
                    {quizCompletion.shivaConsciousness && (
                      <CheckCircle className="w-6 h-6 text-orange-600 dark:text-orange-400 ml-2" />
                    )}
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed mb-4">
                    Get a more comprehensive analysis with 20 profound questions revealing your sacred archetype and deeper insights.
                  </p>
                  
                  {quizCompletion.shivaConsciousness ? (
                    <div className="text-center">
                      <div className="bg-orange-100 dark:bg-orange-800/30 rounded-lg p-3 mb-4">
                        <p className="text-orange-800 dark:text-orange-200 text-sm font-medium">
                          ✓ Completed
                        </p>
                      </div>
                                             <button
                         onClick={() => handleRetakeQuiz('shiva-consciousness-enhanced')}
                         disabled={isNavigating}
                         className="text-orange-600 dark:text-orange-400 font-semibold hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
                       >
                         Retake Quiz
                       </button>
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleQuizSelection('shiva-consciousness-enhanced')}
                      disabled={isNavigating}
                      className="w-full text-center"
                    >
                      <span className="inline-flex items-center text-orange-600 dark:text-orange-400 font-semibold group-hover:translate-x-1 transition-transform">
                        Start Quiz <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </motion.button>
                  )}
                </motion.div>
              </div>

              {/* Progress indicator and action buttons */}
              <div className="mt-8 text-center">
                {/* Progress indicator */}
                <div className="mb-6">
                  <div className="flex items-center justify-center space-x-4 mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      quizCompletion.guna ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {quizCompletion.guna ? <CheckCircle className="w-5 h-5" /> : '1'}
                    </div>
                    <div className="w-16 h-0.5 bg-gray-300"></div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      quizCompletion.shivaConsciousness ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {quizCompletion.shivaConsciousness ? <CheckCircle className="w-5 h-5" /> : '2'}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {quizCompletion.guna && quizCompletion.shivaConsciousness 
                      ? 'Both assessments completed! 🎉'
                      : `${quizCompletion.guna ? '1' : '0'} of 2 assessments completed`
                    }
                  </p>
                </div>

                {/* Action buttons */}
                {quizCompletion.guna && quizCompletion.shivaConsciousness ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleViewExistingResults}
                    className="px-8 py-4 bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark text-white rounded-xl font-semibold text-lg hover:from-primary-light/90 hover:to-secondary-light/90 dark:hover:from-primary-dark/90 dark:hover:to-secondary-dark/90 transition-all duration-200"
                  >
                    Continue to Recommendations
                    <ArrowRight className="w-5 h-5 ml-2 inline" />
                  </motion.button>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Complete both assessments for a comprehensive spiritual profile
                  </p>
                )}
              </div>
            </motion.div>
          )}



          {currentStep === 2 && selectedQuiz === 'shiva-consciousness-enhanced' && (
            <ShivaConsciousnessQuiz />
          )}

          {currentStep === 3 && rishiProfile && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
            >
              <div className="text-center mb-8">
                <div className={`w-24 h-24 bg-gradient-to-r ${rishiProfile.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <Star className="w-12 h-12 text-white" />
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Your Rishi Profile
                </h2>
                
                <div className={`inline-block px-6 py-2 bg-gradient-to-r ${rishiProfile.color} text-white rounded-full font-semibold mb-4`}>
                  {rishiProfile.archetype}
                </div>
                
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  {rishiProfile.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-primary-light dark:text-primary-dark" />
                    Your Darshana
                  </h3>
                  <p className="text-2xl font-bold text-primary-light dark:text-primary-dark">
                    {rishiProfile.darshana}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    The school of philosophy that resonates with your nature
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-secondary-light dark:text-secondary-dark" />
                    Your Chakra
                  </h3>
                  <p className="text-2xl font-bold text-secondary-light dark:text-secondary-dark">
                    {rishiProfile.chakra}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    The energy center that guides your spiritual journey
                  </p>
                </div>
              </div>

              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="px-8 py-4 bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark text-white rounded-xl font-semibold text-lg hover:from-primary-light/90 hover:to-secondary-light/90 transition-all duration-200"
                >
                  See My Recommendations
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="recommendations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Your Personalized Journey
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Based on your spiritual profile, here are your personalized recommendations
                </p>
              </div>

              {/* Dynamic Quiz Analysis and Recommendations System */}
              <QuizAnalysisAndRecommendations 
                quizType={getQuizType()}
                className="mb-8"
              />

              {/* Enhanced Community Section */}
              <div className="bg-gradient-to-r from-primary-light/10 to-secondary-light/10 dark:from-primary-dark/10 dark:to-secondary-dark/10 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-primary-light dark:text-primary-dark" />
                  Join Your Rishi Circle
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Connect with fellow spiritual practitioners and deepen your understanding together.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Virtual Meetups</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Study Groups</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Rishi Badges</p>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    trackEvent('rishi_journey_started', {
                      source: 'recommendations_page',
                      quiz_type: getQuizType(),
                      has_recommendations: recommendations.length > 0
                    })
                    window.location.href = '/courses/premium-courses'
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark text-white rounded-xl font-semibold text-lg hover:from-primary-light/90 hover:to-secondary-light/90 dark:hover:from-primary-dark/90 dark:hover:to-secondary-dark/90 transition-all duration-200"
                >
                  Begin Your Learning Journey
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function GunaResultsComponent({ profile }: { profile: GunaProfile }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Your Personalized Journey
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Based on your <span className="font-semibold text-primary-light dark:text-primary-dark">{profile.dominantGuna}</span> alignment, here are your recommended paths
        </p>
      </div>

      <div className="space-y-8">
        {/* Archetype Card */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">{profile.archetype}</h3>
          <p className="text-center text-gray-600 dark:text-gray-300">{profile.description}</p>
        </div>
        
        {/* Recommendations Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Dietary */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h4 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-4">Dietary Suggestions</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              {profile.recommendations.dietary.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>

          {/* Activities */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h4 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">Activity Suggestions</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              {profile.recommendations.activities.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        </div>
        
        {/* Challenge */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-3">Your Challenge</h4>
          <p className="font-semibold text-gray-800 dark:text-white">{profile.recommendations.challenge.challenge}</p>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{profile.recommendations.challenge.solution}</p>
        </div>
        
        {/* CTA */}
        <div className="bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">{profile.cta.title}</h3>
          <p className="mb-4">{profile.cta.subtitle}</p>
          <button className="bg-white text-primary-light dark:text-primary-dark font-bold py-2 px-6 rounded-lg">
            {profile.cta.button}
          </button>
        </div>
      </div>
    </div>
  )
}
