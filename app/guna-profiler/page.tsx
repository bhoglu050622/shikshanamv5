'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sun, 
  Flame, 
  Mountain, 
  Star, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Share2,
  MessageCircle,
  Clock,
  Mail,
  Phone,
  User,
  Eye,
  EyeOff,
  MessageSquare
} from 'lucide-react'

import { GunaScores, GunaState, AppStage, UserDetails } from '@/types/guna-profiler'
import { gunaQuestions, gunaArchetypes, UPSELL_COURSE_URL } from '@/data/gunaProfilerData'
import { i18nContent } from '@/lib/i18n'
import { 
  calculateGunaProfile, 
  shuffleArray, 
  isValidEmail, 
  isValidMobile, 
  generateSessionId,
  formatQuestionForLanguage,
  getShareText,
  animateCounter,
  checkQuizHistory,
  shouldRedirectToRishiMode
} from '@/lib/gunaProfilerUtils'
import { Modal, ShareModal } from '@/components/guna-profiler/Modal'
import ImmediateRecommendations from '@/components/guna-profiler/ImmediateRecommendations'
import EnterRishiModeButton from '@/components/guna-profiler/EnterRishiModeButton'
import { storage } from '@/lib/utils'

const LOCAL_STORAGE_KEY = 'gunaProfilerState'

const GUNA_COLORS = {
  sattva: {
    icon: 'text-amber-500',
    progress: 'bg-gradient-to-r from-amber-400 to-amber-500',
  },
  rajas: {
    icon: 'text-pink-500',
    progress: 'bg-gradient-to-r from-pink-400 to-pink-500',
  },
  tamas: {
    icon: 'text-violet-500',
    progress: 'bg-gradient-to-r from-violet-400 to-violet-500',
  },
}

export default function GunaProfilerPage() {
  // Core state
  const [stage, setStage] = useState<AppStage>('initial')
  const [language, setLanguage] = useState<'en' | 'hi'>('en')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, keyof GunaScores>>({})
  const [scores, setScores] = useState<GunaScores>({ sattva: 0, rajas: 0, tamas: 0 })
  const [personalityArchetypeCode, setPersonalityArchetypeCode] = useState('')
  const [gunaTraitCode, setGunaTraitCode] = useState('')
  const [dominantGuna, setDominantGuna] = useState<keyof GunaScores>('sattva')
  const [sessionId, setSessionId] = useState('')
  const [shuffledOptions, setShuffledOptions] = useState<any[]>([])
  
  // User details and OTP
  const [userDetails, setUserDetails] = useState<UserDetails>({ name: '', email: '', mobile: '' })
  
  // UI state
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(false)
  const [feedbackRating, setFeedbackRating] = useState(0)
  const [feedbackComments, setFeedbackComments] = useState('')
  
  // Modal states
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    options: {}
  })
  const [shareModalOpen, setShareModalOpen] = useState(false)
  
  // Refs
  const reportCounterRef = useRef<HTMLDivElement>(null)
  
  // Form validation errors
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    mobile: false
  })

  const t = i18nContent[language]
  const router = useRouter()

  // Load state from local storage on mount
  useEffect(() => {
    const savedState = storage.get(LOCAL_STORAGE_KEY)
    if (savedState) {
      setStage(savedState.stage || 'initial')
      setLanguage(savedState.language || 'en')
      setCurrentQuestionIndex(savedState.currentQuestionIndex || 0)
      setAnswers(savedState.answers || {})
      setScores(savedState.scores || { sattva: 0, rajas: 0, tamas: 0 })
      setPersonalityArchetypeCode(savedState.personalityArchetypeCode || '')
      setGunaTraitCode(savedState.gunaTraitCode || '')
      setDominantGuna(savedState.dominantGuna || 'sattva')
      setUserDetails(savedState.userDetails || { name: '', email: '', mobile: '' })
      setSessionId(savedState.sessionId || generateSessionId())
    } else {
      setSessionId(generateSessionId())
    }

    // Check for quiz history and redirect to Rishi Mode if user has completed quizzes before
    const history = checkQuizHistory()
    
    // If user has completed any quiz before, redirect to Rishi Mode
    if (history.hasAnyHistory && !savedState) {
      router.push('/rishi-mode?from=guna-profiler')
    }
  }, [router])

  // Save state to local storage on change
  useEffect(() => {
    const stateToSave = {
      stage,
      language,
      currentQuestionIndex,
      answers,
      scores,
      personalityArchetypeCode,
      gunaTraitCode,
      dominantGuna,
      userDetails,
      sessionId,
      timestamp: Date.now(),
    }
    // Avoid saving initial state until user starts
    if (stage !== 'initial' || Object.keys(answers).length > 0) {
      storage.set(LOCAL_STORAGE_KEY, stateToSave)
    }
  }, [
    stage,
    language,
    currentQuestionIndex,
    answers,
    scores,
    personalityArchetypeCode,
    gunaTraitCode,
    dominantGuna,
    userDetails,
    sessionId,
  ])


  // Initialize session
  useEffect(() => {
    // Start counter animation
    if (reportCounterRef.current) {
      animateCounter(reportCounterRef.current, 15000, 1000)
    }
  }, [])

  // Utility functions
  const showModal = (title: string, message: string, options = {}) => {
    setModalState({ isOpen: true, title, message, options })
  }

  const hideModal = () => {
    setModalState({ isOpen: false, title: '', message: '', options: {} })
  }

  // Quiz functions
  const startQuiz = () => {
    setStage('quiz')
  }

  const handleAnswer = (questionId: string, guna: keyof GunaScores) => {
    setAnswers(prev => ({ ...prev, [questionId]: guna }))
  }

  useEffect(() => {
    const numAnswers = Object.keys(answers).length
    if (numAnswers === 0) return

    const isQuizFinished = numAnswers === gunaQuestions.length

    const timer = setTimeout(() => {
      if (!isQuizFinished) {
        setCurrentQuestionIndex(prev => prev + 1)
      } else {
        const finalScores = Object.values(answers).reduce(
          (acc, gunaValue) => {
            acc[gunaValue]++
            return acc
          },
          { sattva: 0, rajas: 0, tamas: 0 }
        )

        setScores(finalScores)
        const profile = calculateGunaProfile(finalScores)
        setPersonalityArchetypeCode(profile.personalityArchetypeCode)
        setGunaTraitCode(profile.gunaTraitCode)
        setDominantGuna(profile.dominantGuna)
        
        // Check if user has quiz history to determine next step
        if (shouldRedirectToRishiMode('guna-profiler')) {
          // User has completed Shiva quiz before, redirect to Rishi Mode for combined analysis
          router.push('/rishi-mode?from=guna-profiler')
        } else {
          // First time user, show results with option to enter Rishi Mode
          setStage('results')
        }
      }
    }, 600)

    return () => clearTimeout(timer)
  }, [answers, router])


  // Registration and OTP functions
  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const newErrors = {
      name: !userDetails.name.trim(),
      email: !userDetails.email.trim() || !isValidEmail(userDetails.email),
      mobile: userDetails.mobile.trim() ? !isValidMobile(userDetails.mobile) : false
    }
    
    setErrors(newErrors)
    
    if (Object.values(newErrors).some(error => error)) {
      return
    }
    
    setStage('detailed-results')
  }

  // Results and feedback functions
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const submitFeedback = async () => {
    if (feedbackRating === 0 && !feedbackComments.trim()) {
      showModal('Feedback Required', 'Please select a rating or enter a comment.')
      return
    }
    
    showModal('Thank You!', 'Your feedback has been submitted successfully.')
    setFeedbackRating(0)
    setFeedbackComments('')
  }

  const handleShare = () => {
    const archetype = (gunaArchetypes as any)[personalityArchetypeCode]?.[language]?.archetype || gunaTraitCode
    const shareText = getShareText(archetype, gunaTraitCode, language)
    setShareModalOpen(true)
  }

  const retakeAssessment = () => {
    // Reset all state
    setStage('initial')
    setCurrentQuestionIndex(0)
    setAnswers({})
    setScores({ sattva: 0, rajas: 0, tamas: 0 })
    setUserDetails({ name: '', email: '', mobile: '' })
    setFeedbackRating(0)
    setFeedbackComments('')
    setActiveTab('overview')
    setErrors({ name: false, email: false, mobile: false })
    setShuffledOptions([])
    // Clear local storage on retake
    storage.remove(LOCAL_STORAGE_KEY)
  }

  const handleEnhancedShivaClick = () => {
    // Navigate to Rishi Mode with Enhanced Shiva Consciousness
    router.push('/rishi-mode?quiz=shiva-consciousness-enhanced')
  }

  const continueToDetailedResults = () => {
    setStage('detailed-results')
  }

  // Get current question
  const currentQuestion = useMemo(() => {
    return currentQuestionIndex < gunaQuestions.length
      ? formatQuestionForLanguage(gunaQuestions[currentQuestionIndex], language)
      : null
  }, [currentQuestionIndex, language])

  // Shuffle options for the current question
  useEffect(() => {
    if (currentQuestion) {
      setShuffledOptions(shuffleArray(currentQuestion.options))
    }
  }, [currentQuestion])

  const progress = ((currentQuestionIndex + 1) / gunaQuestions.length) * 100
  const isQuizComplete = Object.keys(answers).length === gunaQuestions.length
  const { percentages } = calculateGunaProfile(scores)

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      stage === 'quiz' ? 'bg-blue-50' : 
      stage === 'results' ? 'bg-amber-50' : 
      'bg-gray-50'
    }`}>
      {/* Language Toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex justify-end">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={language === 'hi'}
              onChange={(e) => setLanguage(e.target.checked ? 'hi' : 'en')}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-orange-500 relative">
              <span className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform transform peer-checked:translate-x-7"></span>
            </div>
            <span className="ml-3 text-sm font-medium text-gray-900">
              {t.langLabel}
            </span>
          </label>
        </div>
      </div>

      {/* Header */}
      <header className="text-center mb-8 sm:mb-12 px-4 sm:px-6 lg:px-8 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-orange-500 to-amber-500 text-transparent bg-clip-text mb-3">
            {t.mainTitle}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            {t.mainSubtitle}
          </p>
        </motion.div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <AnimatePresence mode="wait">
          {/* Initial Screen */}
          {stage === 'initial' && (
            <motion.div
              key="initial"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white shadow-xl rounded-lg p-6 sm:p-8 border-t-4 border-orange-500"
            >
              <p className="text-lg text-gray-700 mb-6 text-center">
                {t.initialScreenSubtitle}
              </p>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-3 flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  {t.discoverTitle}
                </h3>
                <ul className="list-none space-y-2 text-gray-600 max-w-md mx-auto">
                  <li className="flex items-start">{t.discoverPoint1}</li>
                  <li className="flex items-start">{t.discoverPoint2}</li>
                  <li className="flex items-start">{t.discoverPoint3}</li>
                </ul>
              </div>

              <div className="text-center mb-8">
                <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-800 p-4 rounded-md shadow-sm max-w-sm mx-auto">
                  <div className="text-sm font-medium">{t.reportsGenerated}</div>
                  <div 
                    ref={reportCounterRef}
                    className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-transparent bg-clip-text"
                  >
                    15,000+
                  </div>
                </div>
              </div>

              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startQuiz}
                  className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 w-full sm:w-auto font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-200 relative z-10"
                >
                  {t.startJourneyBtn}
                </motion.button>
              </div>
            </motion.div>
          )}

                    {/* Quiz Screen */}
          {stage === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative z-10"
            >
              {/* Instructions */}
              <div className="bg-white shadow-xl rounded-lg p-6 sm:p-8 border-t-4 border-orange-500 mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 flex items-center gap-3 text-gray-700">
                  <Sparkles className="w-6 h-6 text-orange-500" />
                  {t.instructionsTitle}
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>{t.instruction1}</li>
                  <li>{t.instruction2}</li>
                  <li>{t.instruction3}</li>
                </ul>
              </div>

              {/* Progress */}
              <div className="mb-8">
                <div className="text-sm flex justify-between items-center mb-2 text-gray-500">
                  <span>{t.questionCounter(currentQuestionIndex + 1, gunaQuestions.length)}</span>
                  <span>{t.answeredStatus(Object.keys(answers).length, gunaQuestions.length)}</span>
                </div>
                <div className="relative w-full bg-gray-200 rounded-full h-3">
                  <motion.div 
                    className="bg-gradient-to-r from-orange-400 to-amber-500 h-3 rounded-full transition-all duration-300 ease-out"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              {currentQuestion && (
                <motion.div
                  key={currentQuestion.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white shadow-xl rounded-lg p-6 sm:p-8"
                >
                  <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-800">
                    {currentQuestion.question}
                  </h3>
                  
                  <div className="space-y-4">
                    {shuffledOptions.map((option, index) => (
                      <motion.button
                        key={`${option.guna}-${index}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswer(currentQuestion.id, option.guna)}
                        className={`w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 flex justify-between items-center ${
                          answers[currentQuestion.id] === option.guna
                            ? 'border-orange-500 bg-orange-50 shadow-lg scale-105'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-base sm:text-lg font-medium text-gray-700">
                          {option.text}
                        </span>
                        <span className={`w-5 h-5 border-2 rounded-full transition-all ${
                          answers[currentQuestion.id] === option.guna
                            ? 'border-orange-500 bg-orange-500'
                            : 'border-gray-300'
                        }`} />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Detailed Results Screen */}
          {stage === 'detailed-results' && (
                                        <motion.div
                key="detailed-results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gray-50 rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 relative z-10"
              >
                {/* Results Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-orange-600">
                    {t.resultsTitle}
                  </h2>
                  <p className="text-md sm:text-lg text-gray-500">
                    {t.resultsSubtitle}
                  </p>
                </div>

                {/* Navigation Tabs */}
                <div className="mb-6 sm:mb-8 border-b border-gray-300">
                  <nav className="flex flex-wrap sm:flex-nowrap justify-center -mb-px">
                    {[
                      { id: 'overview', label: t.overviewTab },
                      { id: 'analysis', label: t.analysisTab },
                      { id: 'recommendations', label: t.recommendationsTab },
                      { id: 'colorTherapy', label: t.colorTherapyTab },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                          activeTab === tab.id
                            ? 'border-orange-500 text-orange-600 bg-white'
                            : 'border-transparent text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                  {activeTab === 'overview' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      {/* Personality Card */}
                      <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-lg">
                        <h2 className="text-3xl font-bold mb-2 text-gray-800">
                          {(gunaArchetypes as any)[personalityArchetypeCode]?.[language]?.archetype || 'Your Archetype'}
                        </h2>
                        <div className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-lg font-medium mb-4">
                          {gunaTraitCode}
                        </div>
                        <p className="text-lg leading-relaxed max-w-2xl mx-auto text-gray-600">
                          {(gunaArchetypes as any)[personalityArchetypeCode]?.[language]?.description || 'Your unique personality description.'}
                        </p>
                      </div>

                      {/* Guna Scores */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { guna: 'sattva', icon: Sun, score: scores.sattva, percentage: percentages.sattva },
                          { guna: 'rajas', icon: Flame, score: scores.rajas, percentage: percentages.rajas },
                          { guna: 'tamas', icon: Mountain, score: scores.tamas, percentage: percentages.tamas }
                        ].map(({ guna, icon: Icon, score, percentage }) => (
                          <div
                            key={guna}
                            className={`bg-white rounded-xl shadow-md p-6 transition-all duration-300 ${
                              dominantGuna === guna
                                ? 'border-2 border-orange-500 shadow-lg'
                                : 'border border-gray-200'
                            }`}
                          >
                            <div className="flex justify-between items-center mb-3">
                              <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                                <Icon className={`w-6 h-6 ${GUNA_COLORS[guna as keyof typeof GUNA_COLORS].icon}`} />
                                {t[guna as 'sattva' | 'rajas' | 'tamas']}
                              </h3>
                              <span className="font-bold text-lg text-gray-800">{percentage}%</span>
                            </div>
                            <div className="relative w-full bg-gray-200 rounded-full h-3 mb-2">
                              <motion.div
                                className={`${GUNA_COLORS[guna as keyof typeof GUNA_COLORS].progress} h-3 rounded-full`}
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                              />
                            </div>
                            <p className="text-4xl font-bold text-gray-800 text-center mt-4">
                              {score}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Key Insights */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 p-6 rounded-lg shadow-sm">
                          <h3 className="text-xl font-semibold text-red-800 mb-3">
                            {t.results.analysis.problemTitle}
                          </h3>
                          <p className="text-gray-800 leading-relaxed">
                            {t.results.analysis.problems[dominantGuna].problem}
                          </p>
                        </div>
                        <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 p-6 rounded-lg shadow-sm">
                          <h3 className="text-xl font-semibold text-green-800 mb-3">
                            {t.results.analysis.solutionTitle}
                          </h3>
                          <p className="text-gray-800 leading-relaxed">
                            {t.results.analysis.problems[dominantGuna].solution}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'analysis' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">In-Depth Analysis</h3>
                        <p className="text-gray-600">Understand how your Gunas interact and influence your life</p>
                      </div>
                      
                      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h4 className="text-xl font-semibold mb-4 text-blue-800">
                          {t.results.analysis.interplayTitle}
                        </h4>
                        <p className="text-gray-800 leading-relaxed">
                          {t.results.analysis.interplay[dominantGuna]}
                        </p>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h4 className="text-xl font-semibold mb-4 text-green-800">
                          {t.results.analysis.balanceTitle}
                        </h4>
                        <p className="text-gray-800 leading-relaxed">
                          {t.results.analysis.balance[dominantGuna]}
                        </p>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h4 className="text-xl font-semibold mb-4 text-red-800">
                          {t.results.analysis.shadowTitle}
                        </h4>
                        <p className="text-gray-800 leading-relaxed">
                          {t.results.analysis.shadow[dominantGuna]}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'recommendations' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Personalized Recommendations</h3>
                        <p className="text-gray-600">Practical suggestions to enhance your well-being</p>
                      </div>

                      {/* Dietary Recommendations */}
                      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h4 className="text-xl font-semibold text-green-800 mb-4 flex items-center gap-2">
                          🍃 {t.recommendations.dietaryTitle}
                        </h4>
                        <ul className="list-disc pl-6 space-y-2 text-gray-800">
                          {t.recommendations.dietary[dominantGuna].map((item, index) => (
                            <li key={index} className="leading-relaxed">{item}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Activity Recommendations */}
                      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h4 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
                          🏃‍♂️ {t.recommendations.activityTitle}
                        </h4>
                        <ul className="list-disc pl-6 space-y-2 text-gray-800">
                          {t.recommendations.activities[dominantGuna].map((item, index) => (
                            <li key={index} className="leading-relaxed">{item}</li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'colorTherapy' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Color Therapy</h3>
                        <p className="text-gray-600">Harness the power of colors to balance your Gunas</p>
                      </div>
                      
                      <div className="bg-white p-6 rounded-lg shadow-md">
                        <h4 className="text-xl font-semibold mb-4 text-purple-700">
                          {t.recommendations.colorTherapy.problemTitle}
                        </h4>
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {t.recommendations.colorTherapy[dominantGuna].problem}
                        </p>
                        <h4 className="text-xl font-semibold mb-4 text-green-700">
                          {t.recommendations.colorTherapy.solutionTitle}
                        </h4>
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {t.recommendations.colorTherapy[dominantGuna].solution}
                        </p>
                        <div className="mb-4">
                          <h5 className="font-semibold text-gray-800 mb-2">Recommended Colors:</h5>
                          <div className="flex flex-wrap gap-2">
                            {t.recommendations.colorTherapy[dominantGuna].colors.map((color, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg border"
                                style={{ backgroundColor: color.hex + '20' }}
                              >
                                <div
                                  className="w-4 h-4 rounded-full border"
                                  style={{ backgroundColor: color.hex }}
                                />
                                <span className="text-sm font-medium">{color.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-2">How to Use:</h5>
                          <ul className="list-disc pl-6 space-y-1 text-gray-700">
                            {t.recommendations.colorTherapy[dominantGuna].howToUse.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 font-semibold"
                  >
                    <Share2 className="w-5 h-5" />
                    {t.shareBtn}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={retakeAssessment}
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 font-semibold"
                  >
                    <RotateCcw className="w-5 h-5" />
                    {t.retakeBtn}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/rishi-mode')}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 font-semibold"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Enter Rishi Mode
                  </motion.button>
                </div>
              </motion.div>
          )}

          {/* Results Screen - Show Enter Rishi Mode Button */}
          {stage === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-50 rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 relative z-10"
            >
              <EnterRishiModeButton
                quizType="guna-profiler"
                result={`${dominantGuna.charAt(0).toUpperCase() + dominantGuna.slice(1)} (${percentages[dominantGuna]}%)`}
                language={language}
              />
              
              {/* Continue to Detailed Results Button */}
              <div className="text-center mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={continueToDetailedResults}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
                >
                  Continue to Detailed Results <ArrowRight className="w-6 h-6" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Results Screen */}
          {stage === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-50 rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 relative z-10"
            >
              {/* Results Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-orange-600">
                  {t.resultsTitle}
                </h2>
                <p className="text-md sm:text-lg text-gray-500">
                  {t.resultsSubtitle}
                </p>
              </div>

              {/* Navigation Tabs */}
              <div className="mb-6 sm:mb-8 border-b border-gray-300">
                <nav className="flex flex-wrap sm:flex-nowrap justify-center -mb-px">
                  {[
                    { id: 'overview', label: t.overviewTab },
                    { id: 'analysis', label: t.analysisTab },
                    { id: 'recommendations', label: t.recommendationsTab },
                    { id: 'colorTherapy', label: t.colorTherapyTab },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                        activeTab === tab.id
                          ? 'border-orange-500 text-orange-600 bg-white'
                          : 'border-transparent text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    {/* Personality Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-lg">
                      <h2 className="text-3xl font-bold mb-2 text-gray-800">
                        {(gunaArchetypes as any)[personalityArchetypeCode]?.[language]?.archetype || 'Your Archetype'}
                      </h2>
                      <div className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-lg font-medium mb-4">
                        {gunaTraitCode}
                      </div>
                      <p className="text-lg leading-relaxed max-w-2xl mx-auto text-gray-600">
                        {(gunaArchetypes as any)[personalityArchetypeCode]?.[language]?.description || 'Your unique personality description.'}
                      </p>
                    </div>

                    {/* Guna Scores */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { guna: 'sattva', icon: Sun, score: scores.sattva, percentage: percentages.sattva },
                        { guna: 'rajas', icon: Flame, score: scores.rajas, percentage: percentages.rajas },
                        { guna: 'tamas', icon: Mountain, score: scores.tamas, percentage: percentages.tamas }
                      ].map(({ guna, icon: Icon, score, percentage }) => (
                        <div
                          key={guna}
                          className={`bg-white rounded-xl shadow-md p-6 transition-all duration-300 ${
                            dominantGuna === guna
                              ? 'border-2 border-orange-500 shadow-lg'
                              : 'border border-gray-200'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                              <Icon className={`w-6 h-6 ${GUNA_COLORS[guna as keyof typeof GUNA_COLORS].icon}`} />
                              {t[guna as 'sattva' | 'rajas' | 'tamas']}
                            </h3>
                            <span className="font-bold text-lg text-gray-800">{percentage}%</span>
                          </div>
                          <div className="relative w-full bg-gray-200 rounded-full h-3 mb-2">
                            <motion.div
                              className={`${GUNA_COLORS[guna as keyof typeof GUNA_COLORS].progress} h-3 rounded-full`}
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1.2, ease: "easeOut" }}
                            />
                          </div>
                          <p className="text-4xl font-bold text-gray-800 text-center mt-4">
                            {score}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Key Insights */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-red-700 mb-2">
                          {t.results.analysis.problemTitle}
                        </h3>
                        <p className="text-gray-700">
                          {t.results.analysis.problems[dominantGuna].problem}
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-green-700 mb-2">
                          {t.results.analysis.solutionTitle}
                        </h3>
                        <p className="text-gray-700">
                          {t.results.analysis.problems[dominantGuna].solution}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'analysis' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">In-Depth Analysis</h3>
                      <p className="text-gray-600">Understand how your Gunas interact and influence your life</p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h4 className="text-xl font-semibold mb-4 text-blue-700">
                        {t.results.analysis.interplayTitle}
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {t.results.analysis.interplay[dominantGuna]}
                      </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h4 className="text-xl font-semibold mb-4 text-green-700">
                        {t.results.analysis.balanceTitle}
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {t.results.analysis.balance[dominantGuna]}
                      </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h4 className="text-xl font-semibold mb-4 text-red-700">
                        {t.results.analysis.shadowTitle}
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {t.results.analysis.shadow[dominantGuna]}
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'recommendations' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">Personalized Recommendations</h3>
                      <p className="text-gray-600">Practical suggestions to enhance your well-being</p>
                    </div>

                    {/* Dietary Recommendations */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h4 className="text-xl font-semibold text-green-700 mb-4 flex items-center gap-2">
                        🍃 {t.recommendations.dietaryTitle}
                      </h4>
                      <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        {t.recommendations.dietary[dominantGuna].map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Activity Recommendations */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h4 className="text-xl font-semibold text-blue-700 mb-4 flex items-center gap-2">
                        🏃‍♂️ {t.recommendations.activityTitle}
                      </h4>
                      <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        {t.recommendations.activities[dominantGuna].map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'colorTherapy' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">Color Therapy</h3>
                      <p className="text-gray-600">Harness the power of colors to balance your energy</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h4 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-3">
                        🎨 {t.recommendations.colorTitle}
                      </h4>
                      
                      {/* Color Swatches */}
                      <div className="flex flex-wrap gap-4 items-center mb-4">
                        {t.recommendations.colorTherapy[dominantGuna].colors.map((color, index) => (
                          <div key={index} className="text-center">
                            <div 
                              className="w-12 h-12 rounded-full shadow-md border-2 border-white mx-auto"
                              style={{ backgroundColor: color.hex }}
                            />
                            <p className="text-sm mt-2 text-gray-600">{color.name}</p>
                          </div>
                        ))}
                      </div>

                      <p className="text-gray-700 mb-4">
                        {t.recommendations.colorTherapy[dominantGuna].colorInfo}
                      </p>

                      <h5 className="font-semibold text-gray-800 mb-2">
                        {t.recommendations.colorHowTo}
                      </h5>
                      <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        {t.recommendations.colorTherapy[dominantGuna].howToUse.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* CTA Section */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="bg-gradient-to-br from-orange-50 via-white to-amber-50 rounded-2xl p-8 text-center shadow-lg border border-amber-200">
                  <div className="text-5xl mb-4">💎</div>
                  <h3 className="text-3xl font-extrabold text-gray-800 mb-3">
                    {t.cta[dominantGuna].title}
                  </h3>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                    {t.cta[dominantGuna].subtitle}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push(UPSELL_COURSE_URL)}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-4 px-10 rounded-lg text-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {t.cta[dominantGuna].button} <ArrowRight className="inline ml-2 w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-center items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={retakeAssessment}
                  className="flex items-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  {t.retakeBtn}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleShare}
                  className="flex items-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  {t.shareBtn}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/rishi-mode')}
                  className="flex items-center gap-2 bg-green-500 border-2 border-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                  Enter Rishi Mode
                </motion.button>
              </div>

              {/* Feedback Section */}
              <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-gray-700 mb-2 text-center">
                  {t.feedbackTitle}
                </h3>
                <p className="text-gray-600 mb-4 text-center">
                  {t.feedbackSubtitle}
                </p>
                
                {/* Star Rating */}
                <div className="flex justify-center space-x-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setFeedbackRating(star)}
                      className={`text-2xl transition-colors ${
                        star <= feedbackRating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      <Star className="w-8 h-8 fill-current" />
                    </button>
                  ))}
                </div>
                
                <textarea
                  value={feedbackComments}
                  onChange={(e) => setFeedbackComments(e.target.value)}
                  placeholder={t.feedbackPlaceholder}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  rows={4}
                />
                
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={submitFeedback}
                    className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                  >
                    {t.submitFeedbackBtn}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={hideModal}
        title={modalState.title}
        message={modalState.message}
        options={modalState.options}
      />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        shareText={getShareText(
          (gunaArchetypes as any)[personalityArchetypeCode]?.[language]?.archetype || gunaTraitCode,
          gunaTraitCode,
          language
        )}
      />
    </div>
  )
}
