import { GunaScores, GunaPercentages, GunaState } from '@/types/guna-profiler'
import { gunaQuestions } from '@/data/gunaProfilerData'
import { storage } from '@/lib/utils'

export function calculateGunaProfile(scores: GunaScores) {
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0) || 1
  
  const percentages: GunaPercentages = {
    sattva: Math.round((scores.sattva / totalScore) * 100),
    rajas: Math.round((scores.rajas / totalScore) * 100),
    tamas: Math.round((scores.tamas / totalScore) * 100)
  }
  
  const sortedGunas = Object.entries(scores).sort(([,a], [,b]) => b - a)
  const dominantGuna = sortedGunas[0][0] as keyof GunaScores
  const gunaTraitCode = sortedGunas.map(([key]) => key.charAt(0).toUpperCase()).join('')
  
  // Determine Archetype Code
  const highestScore = sortedGunas[0][1]
  const secondScore = sortedGunas[1][1]
  const lowestScore = sortedGunas[2][1]
  
  let personalityArchetypeCode: string
  
  // Check if it's a 2-guna type (one guna is significantly lower)
  if (lowestScore < highestScore * 0.35 && highestScore > 0) {
    // It's a 2-guna type - use the two highest gunas
    const twoGunaCode = sortedGunas.slice(0, 2).map(([key]) => key.charAt(0).toUpperCase()).join('')
    personalityArchetypeCode = twoGunaCode
  } else {
    // It's a 3-guna type - use the full code
    personalityArchetypeCode = gunaTraitCode
  }
  
  return {
    percentages,
    dominantGuna,
    gunaTraitCode,
    personalityArchetypeCode
  }
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  let currentIndex = shuffled.length
  let randomIndex: number
  
  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    
    [shuffled[currentIndex], shuffled[randomIndex]] = 
    [shuffled[randomIndex], shuffled[currentIndex]]
  }
  
  return shuffled
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidMobile(mobile: string): boolean {
  const mobileRegex = /^[6-9]\d{9}$/
  return mobileRegex.test(mobile)
}

export function generateOtp(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

export function generateSessionId(): string {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substr(2, 5)
  return `${timestamp}-${randomPart}`
}

export function getShareText(
  archetype: string, 
  gunaTraitCode: string, 
  language: 'en' | 'hi'
): string {
  const siteUrl = "https://shikshanam.in/guna-profiler/"
  
  if (language === 'hi') {
    return `मैंने अभी गुण प्रोफाइलर पर अपना वैदिक व्यक्तित्व प्रकार खोजा है! मेरा परिणाम: ${gunaTraitCode} (${archetype})। आप भी अपना पता लगाएं! ${siteUrl}`
  }
  
  return `I just discovered my Vedic personality type on the Guṇa Profiler! My result: ${gunaTraitCode} (${archetype}). Find out yours! ${siteUrl}`
}

export function animateCounter(
  element: HTMLElement, 
  target: number, 
  duration: number
): void {
  let startTimestamp: number | null = null
  const startValue = 0
  const endValue = target

  function step(timestamp: number) {
    if (!startTimestamp) startTimestamp = timestamp
    const progress = Math.min((timestamp - startTimestamp) / duration, 1)
    const easedProgress = 0.5 - Math.cos(progress * Math.PI) / 2
    const currentValue = Math.floor(easedProgress * (endValue - startValue) + startValue)
    element.textContent = currentValue.toLocaleString()

    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      element.textContent = endValue.toLocaleString() + '+'
      element.classList.add('bounce-effect')
      setTimeout(() => {
        element.classList.remove('bounce-effect')
      }, 300)
    }
  }
  
  requestAnimationFrame(step)
}

export function formatQuestionForLanguage(
  questionData: typeof gunaQuestions[0],
  language: 'en' | 'hi'
) {
  return {
    id: questionData.id,
    question: questionData.question[language],
    options: questionData.options.map(option => ({
      text: option.text[language],
      guna: option.guna
    }))
  }
}

// Quiz history and completion utilities
export const checkQuizHistory = () => {
  const gunaState = storage.get('gunaProfilerState')
  const rishiState = storage.get('rishiModeState')
  
  return {
    hasGunaHistory: !!(gunaState && gunaState.dominantGuna),
    hasShivaHistory: !!(rishiState && rishiState.rishiProfile),
    hasAnyHistory: !!(gunaState && gunaState.dominantGuna) || !!(rishiState && rishiState.rishiProfile)
  }
}

export const shouldRedirectToRishiMode = (quizType: 'guna-profiler' | 'shiva-consciousness'): boolean => {
  const history = checkQuizHistory()
  
  if (quizType === 'guna-profiler') {
    // Redirect if user has completed Shiva quiz before
    return history.hasShivaHistory
  } else if (quizType === 'shiva-consciousness') {
    // Redirect if user has completed Guna quiz before
    return history.hasGunaHistory
  }
  
  return false
}

export const getQuizCompletionStatus = () => {
  const gunaState = storage.get('gunaProfilerState')
  const rishiState = storage.get('rishiModeState')
  
  return {
    guna: {
      completed: !!(gunaState && gunaState.dominantGuna),
      dominantGuna: gunaState?.dominantGuna,
      scores: gunaState?.scores,
      percentages: gunaState?.percentages,
      archetype: gunaState?.personalityArchetypeCode,
      traitCode: gunaState?.gunaTraitCode
    },
    shiva: {
      completed: !!(rishiState && rishiState.rishiProfile),
      profile: rishiState?.rishiProfile,
      answers: rishiState?.answers
    }
  }
}

export const clearQuizHistory = () => {
  storage.remove('gunaProfilerState')
  storage.remove('rishiModeState')
}

export const getQuizProgress = () => {
  const gunaState = storage.get('gunaProfilerState')
  const rishiState = storage.get('rishiModeState')
  
  return {
    guna: {
      completed: !!(gunaState && gunaState.dominantGuna),
      progress: gunaState ? Object.keys(gunaState.answers || {}).length : 0,
      total: 20 // Assuming 20 questions for guna profiler
    },
    shiva: {
      completed: !!(rishiState && rishiState.rishiProfile),
      progress: rishiState ? Object.keys(rishiState.answers || {}).length : 0,
      total: 20 // Assuming 20 questions for shiva consciousness
    }
  }
}

export const shouldShowQuizAgain = (quizType: 'guna-profiler' | 'shiva-consciousness'): boolean => {
  const progress = getQuizProgress()
  
  if (quizType === 'guna-profiler') {
    return !progress.guna.completed
  } else if (quizType === 'shiva-consciousness') {
    return !progress.shiva.completed
  }
  
  return true
}

export const getRecommendedNextStep = (): 'guna-profiler' | 'shiva-consciousness' | 'recommendations' => {
  const progress = getQuizProgress()
  
  if (!progress.guna.completed) {
    return 'guna-profiler'
  } else if (!progress.shiva.completed) {
    return 'shiva-consciousness'
  } else {
    return 'recommendations'
  }
}

// Test function to verify quiz completion detection
export const testQuizCompletionDetection = () => {
  const completionStatus = getQuizCompletionStatus()
  const progress = getQuizProgress()
  const nextStep = getRecommendedNextStep()
  
  console.log('Quiz Completion Status:', completionStatus)
  console.log('Quiz Progress:', progress)
  console.log('Recommended Next Step:', nextStep)
  
  return {
    completionStatus,
    progress,
    nextStep
  }
}
