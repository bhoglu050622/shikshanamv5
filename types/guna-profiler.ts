export interface GunaScores {
  sattva: number
  rajas: number
  tamas: number
}

export interface GunaPercentages {
  sattva: number
  rajas: number
  tamas: number
}

export interface QuizQuestion {
  id: string
  question: string
  options: {
    text: string
    guna: keyof GunaScores
  }[]
}

export interface GunaArchetype {
  archetype: string
  description: string
}

export interface GunaAnalysis {
  interplay: string
  balance: string
  shadow: string
}

export interface GunaProblem {
  problem: string
  solution: string
}

export interface GunaChallenge {
  challenge: string
  solution: string
}

export interface ColorInfo {
  name: string
  hex: string
}

export interface ColorTherapy {
  colors: ColorInfo[]
  colorInfo: string
  howToUse: string[]
  problem: string
  solution: string
}

export interface GunaRecommendations {
  dietary: string[]
  activities: string[]
  challenges: GunaChallenge
  colorTherapy: ColorTherapy
}

export interface GunaCtaContent {
  icon: string
  title: string
  subtitle: string
  button: string
}

export interface GunaResults {
  archetypes: Record<string, GunaArchetype>
  analysis: {
    problems: Record<keyof GunaScores, GunaProblem>
    interplayTitle: string
    balanceTitle: string
    shadowTitle: string
    problemTitle: string
    solutionTitle: string
    interplay: Record<keyof GunaScores, string>
    balance: Record<keyof GunaScores, string>
    shadow: Record<keyof GunaScores, string>
  }
}

export interface I18nContent {
  langLabel: string
  mainTitle: string
  mainSubtitle: string
  initialScreenSubtitle: string
  discoverTitle: string
  discoverPoint1: string
  discoverPoint2: string
  discoverPoint3: string
  startJourneyBtn: string
  reportsGenerated: string
  testimonials: Array<{
    text: string
    author: string
  }>
  instructionsTitle: string
  instruction1: string
  instruction2: string
  instruction3: string
  questionCounter: (current: number, total: number) => string
  answeredStatus: (answered: number, total: number) => string
  resultsTitle: string
  resultsSubtitle: string
  overviewTab: string
  analysisTab: string
  recommendationsTab: string
  colorTherapyTab: string
  retakeBtn: string
  shareBtn: string
  rishiBtn: string
  feedbackTitle: string
  feedbackSubtitle: string
  feedbackPlaceholder: string
  submitFeedbackBtn: string
  dominant: string
  sattva: string
  rajas: string
  tamas: string
  regTitle: string
  regSubtitle: string
  regName: string
  regEmail: string
  regMobile: string
  regContinue: string
  questions: QuizQuestion[]
  results: GunaResults
  recommendations: {
    dietaryTitle: string
    activityTitle: string
    colorTitle: string
    colorHowTo: string
    challengeTitle: string
    solutionTitle: string
    challenges: Record<keyof GunaScores, GunaChallenge>
    dietary: Record<keyof GunaScores, string[]>
    activities: Record<keyof GunaScores, string[]>
    colorTherapy: {
      problemTitle: string
      solutionTitle: string
    } & Record<keyof GunaScores, ColorTherapy>
  }
  cta: Record<keyof GunaScores, GunaCtaContent>
}

export interface UserDetails {
  name: string
  email: string
  mobile: string
}

export interface GunaState {
  currentLanguage: 'en' | 'hi'
  currentQuestionIndex: number
  scores: GunaScores
  feedbackRating: number
  personalityArchetypeCode: string
  gunaTraitCode: string
  dominantGuna: keyof GunaScores | ''
  activeTab: string
  sessionId: string
  userDetails: UserDetails
  answers: Record<string, keyof GunaScores>
}

export type AppStage = 'initial' | 'quiz' | 'registration' | 'results' | 'detailed-results' | 'recommendations'

export interface ModalOptions {
  iconClass?: string
  iconBg?: string
  iconColor?: string
  otp?: string
}
