import { getAllCourses, getPremiumCourses, type Course, type PremiumCourse } from '@/lib/courseData'
import { rishiProfiles, type RishiProfile } from '@/data/rishiModeData'
import { GunaScores } from '@/types/guna-profiler'
import { storage } from '@/lib/utils'

// Quiz Registry - Lightweight metadata for all available quizzes
export interface QuizMetadata {
  id: string
  name: string
  description: string
  tags: string[]
  completionKey: string // localStorage key for completion state
  resultKey: string // localStorage key for results
  priority: number // Order in recommendation flow
}

export interface QuizResult {
  quizId: string
  completedAt: Date
  dominantTrait?: string
  scores?: Record<string, number>
  archetype?: string
  lowScoreAreas?: string[]
  tags?: string[]
  percentages?: Record<string, number>
  personalityArchetypeCode?: string
  gunaTraitCode?: string
}

export interface BookRecommendation {
  title: string
  author: string
  reason: string
  category: 'philosophy' | 'practice' | 'meditation' | 'scripture'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export interface CourseRecommendation {
  course: PremiumCourse
  reason: string
  matchScore: number
  category: 'primary' | 'secondary' | 'explore'
  matchType: 'perfect' | 'high' | 'good'
}

export interface UnifiedRecommendations {
  nextQuiz?: QuizMetadata
  courses: CourseRecommendation[]
  books: BookRecommendation[]
  analysis: string
  combinedAnalysis?: string
  hasQuizHistory: boolean
}

// Quiz Registry - Extensible system for all quizzes
export const QUIZ_REGISTRY: QuizMetadata[] = [
  {
    id: 'guna-profiler',
    name: 'Guna Profiler',
    description: 'Discover your dominant energy type',
    tags: ['guna', 'personality', 'energy', 'balance'],
    completionKey: 'gunaProfilerState',
    resultKey: 'gunaProfilerState',
    priority: 1
  },
  {
    id: 'shiva-consciousness',
    name: 'Shiva Consciousness Quiz',
    description: 'Explore your Shiva archetype',
    tags: ['shiva', 'archetype', 'consciousness', 'transformation'],
    completionKey: 'rishiModeState',
    resultKey: 'rishiModeState',
    priority: 2
  }
]

// Book Database - Curated recommendations
const BOOK_DATABASE: BookRecommendation[] = [
  {
    title: 'The Bhagavad Gita',
    author: 'Translated by Stephen Mitchell',
    reason: 'Essential scripture for understanding dharma and spiritual practice',
    category: 'scripture',
    difficulty: 'intermediate'
  },
  {
    title: 'The Upanishads',
    author: 'Eknath Easwaran',
    reason: 'Core texts for understanding Vedantic philosophy',
    category: 'philosophy',
    difficulty: 'advanced'
  },
  {
    title: 'Yoga Sutras of Patanjali',
    author: 'Sri Swami Satchidananda',
    reason: 'Practical guide for disciplined spiritual practice',
    category: 'practice',
    difficulty: 'intermediate'
  },
  {
    title: 'Autobiography of a Yogi',
    author: 'Paramahansa Yogananda',
    reason: 'Inspirational journey of spiritual awakening',
    category: 'practice',
    difficulty: 'beginner'
  },
  {
    title: 'The Power of Now',
    author: 'Eckhart Tolle',
    reason: 'Modern guide to present-moment awareness',
    category: 'meditation',
    difficulty: 'beginner'
  },
  {
    title: 'Meditations',
    author: 'Marcus Aurelius',
    reason: 'Stoic wisdom for inner strength and clarity',
    category: 'philosophy',
    difficulty: 'intermediate'
  },
  {
    title: 'The Heart of Yoga',
    author: 'T.K.V. Desikachar',
    reason: 'Comprehensive guide to yoga philosophy and practice',
    category: 'practice',
    difficulty: 'intermediate'
  },
  {
    title: 'The Secret of the Veda',
    author: 'Sri Aurobindo',
    reason: 'Deep insights into Vedic wisdom and symbolism',
    category: 'philosophy',
    difficulty: 'advanced'
  }
]

export class QuizRecommendationEngine {
  private courses: PremiumCourse[]
  
  constructor() {
    this.courses = getPremiumCourses()
  }

  // Main entry point - generates unified recommendations
  generateUnifiedRecommendations(): UnifiedRecommendations {
    const completedQuizzes = this.getCompletedQuizzes()
    const nextQuiz = this.getNextRecommendedQuiz(completedQuizzes)
    const hasQuizHistory = completedQuizzes.length > 0
    
    // Always generate recommendations, even if no quizzes completed
    const courses = this.generateCourseRecommendations(completedQuizzes)
    const books = this.generateBookRecommendations(completedQuizzes)
    const analysis = this.generateAnalysis(completedQuizzes)
    const combinedAnalysis = completedQuizzes.length >= 2 ? this.generateCombinedAnalysis(completedQuizzes) : undefined

    return {
      nextQuiz,
      courses: courses.slice(0, 3), // Limit to 3 courses
      books: books.slice(0, 2), // Limit to 2 books
      analysis,
      combinedAnalysis,
      hasQuizHistory
    }
  }

  private getCompletedQuizzes(): QuizResult[] {
    const completed: QuizResult[] = []
    
    for (const quiz of QUIZ_REGISTRY) {
      const state = storage.get(quiz.completionKey)
      if (state && this.isQuizCompleted(state, quiz.id)) {
        completed.push(this.parseQuizResult(state, quiz))
      }
    }
    
    return completed.sort((a, b) => {
      const quizA = QUIZ_REGISTRY.find(q => q.id === a.quizId)
      const quizB = QUIZ_REGISTRY.find(q => q.id === b.quizId)
      return (quizA?.priority || 0) - (quizB?.priority || 0)
    })
  }

  private isQuizCompleted(state: any, quizId: string): boolean {
    switch (quizId) {
      case 'guna-profiler':
        return !!state.dominantGuna && !!state.scores
      case 'shiva-consciousness':
        return !!state.rishiProfile || !!storage.get('shivaConsciousnessCompleted', false)
      default:
        return false
    }
  }

  private parseQuizResult(state: any, quiz: QuizMetadata): QuizResult {
    switch (quiz.id) {
      case 'guna-profiler':
        return {
          quizId: quiz.id,
          completedAt: new Date(state.timestamp || Date.now()),
          dominantTrait: state.dominantGuna,
          scores: state.scores,
          percentages: state.percentages,
          personalityArchetypeCode: state.personalityArchetypeCode,
          gunaTraitCode: state.gunaTraitCode,
          tags: ['guna', state.dominantGuna],
          lowScoreAreas: this.getLowScoreGunas(state.scores)
        }
      case 'shiva-consciousness':
        return {
          quizId: quiz.id,
          completedAt: new Date(state.timestamp || Date.now()),
          dominantTrait: state.rishiProfile?.archetype,
          archetype: state.rishiProfile?.archetype,
          tags: ['shiva', state.rishiProfile?.darshana, state.rishiProfile?.guna],
          lowScoreAreas: this.getLowScoreDarshanas(state.answers)
        }
      default:
        return {
          quizId: quiz.id,
          completedAt: new Date(),
          tags: quiz.tags
        }
    }
  }

  private getLowScoreGunas(gunaScores?: GunaScores): string[] {
    if (!gunaScores) return []
    const scores = Object.entries(gunaScores)
    const avgScore = scores.reduce((sum, [_, score]) => sum + score, 0) / scores.length
    return scores
      .filter(([_, score]) => score < avgScore * 0.7)
      .map(([guna, _]) => guna)
  }

  private getLowScoreDarshanas(answers?: Record<string, string>): string[] {
    if (!answers) return []
    const darshanaCounts: Record<string, number> = {}
    Object.values(answers).forEach(answer => {
      darshanaCounts[answer] = (darshanaCounts[answer] || 0) + 1
    })
    const total = Object.values(darshanaCounts).reduce((sum, count) => sum + count, 0)
    return Object.entries(darshanaCounts)
      .filter(([_, count]) => count < total * 0.2)
      .map(([darshana, _]) => darshana)
  }

  private getNextRecommendedQuiz(completedQuizzes: QuizResult[]): QuizMetadata | undefined {
    const completedIds = new Set(completedQuizzes.map(q => q.quizId))
    return QUIZ_REGISTRY
      .filter(quiz => !completedIds.has(quiz.id))
      .sort((a, b) => a.priority - b.priority)[0]
  }

  private generateCourseRecommendations(completedQuizzes: QuizResult[]): CourseRecommendation[] {
    const recommendations: CourseRecommendation[] = []
    
    for (const course of this.courses) {
      const score = this.calculateCourseMatchScore(course, completedQuizzes)
      // Lower the threshold to ensure we get recommendations
      if (score > 0.1) {
        const reason = this.generateCourseReason(course, completedQuizzes)
        const matchType = score > 0.8 ? 'perfect' : score > 0.6 ? 'high' : 'good'
        recommendations.push({
          course,
          reason,
          matchScore: score,
          category: score > 0.7 ? 'primary' : score > 0.5 ? 'secondary' : 'explore',
          matchType
        })
      }
    }
    
    // If no recommendations found, add some default ones
    if (recommendations.length === 0) {
      const defaultCourses = this.courses.slice(0, 3)
      for (const course of defaultCourses) {
        recommendations.push({
          course,
          reason: 'A foundational course to start your spiritual journey',
          matchScore: 0.5,
          category: 'explore',
          matchType: 'good'
        })
      }
    }
    
    return recommendations
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5) // Get top 5 for selection
  }

  private calculateCourseMatchScore(course: PremiumCourse, completedQuizzes: QuizResult[]): number {
    let score = 0
    let factors = 0
    
    for (const quiz of completedQuizzes) {
      const quizScore = this.calculateQuizCourseMatch(course, quiz)
      score += quizScore
      factors++
    }
    
    // Ensure we return a minimum score for all courses to show some recommendations
    const finalScore = factors > 0 ? score / factors : 0.1
    
    // Debug logging
    console.log(`Course: ${course.title}, Score: ${finalScore}, Factors: ${factors}`)
    
    return finalScore
  }

  private calculateQuizCourseMatch(course: PremiumCourse, quiz: QuizResult): number {
    let score = 0
    
    // Guna Profiler logic
    if (quiz.quizId === 'guna-profiler') {
      if (quiz.dominantTrait === 'tamas' && this.courseMatchesTag(course, ['meditation', 'awareness', 'clarity'])) {
        score += 0.8
      } else if (quiz.dominantTrait === 'rajas' && this.courseMatchesTag(course, ['discipline', 'practice', 'action'])) {
        score += 0.8
      } else if (quiz.dominantTrait === 'sattva' && this.courseMatchesTag(course, ['philosophy', 'wisdom', 'understanding'])) {
        score += 0.8
      }
      
      // Low score areas
      if (quiz.lowScoreAreas?.includes('sattva') && this.courseMatchesTag(course, ['meditation', 'peace'])) {
        score += 0.6
      }
    }
    
    // Shiva Consciousness logic
    if (quiz.quizId === 'shiva-consciousness') {
      if (quiz.archetype === 'The Destroyer' && this.courseMatchesTag(course, ['transformation', 'healing', 'emotional'])) {
        score += 0.8
      } else if (quiz.archetype === 'The Yogi' && this.courseMatchesTag(course, ['yoga', 'practice', 'discipline'])) {
        score += 0.8
      } else if (quiz.archetype === 'The Sage' && this.courseMatchesTag(course, ['philosophy', 'wisdom', 'knowledge'])) {
        score += 0.8
      }
    }
    
    // Tag-based matching for future quizzes
    if (quiz.tags) {
      const tagMatch = this.calculateTagMatch(course, quiz.tags)
      score += tagMatch * 0.5
    }
    
    return Math.min(score, 1.0)
  }

  private courseMatchesTag(course: PremiumCourse, tags: string[]): boolean {
    const courseText = `${course.title} ${course.description} ${course.features?.join(' ') || ''}`.toLowerCase()
    return tags.some(tag => courseText.includes(tag.toLowerCase()))
  }

  private calculateTagMatch(course: PremiumCourse, tags: string[]): number {
    const courseText = `${course.title} ${course.description} ${course.features?.join(' ') || ''}`.toLowerCase()
    const matches = tags.filter(tag => courseText.includes(tag.toLowerCase())).length
    return matches / tags.length
  }

  private generateCourseReason(course: PremiumCourse, completedQuizzes: QuizResult[]): string {
    const reasons: string[] = []
    
    for (const quiz of completedQuizzes) {
      if (quiz.quizId === 'guna-profiler' && quiz.dominantTrait) {
        if (quiz.dominantTrait === 'tamas') {
          reasons.push('Perfect for developing inner awareness and clarity')
        } else if (quiz.dominantTrait === 'rajas') {
          reasons.push('Aligns with your action-oriented nature')
        } else if (quiz.dominantTrait === 'sattva') {
          reasons.push('Supports your balanced and wisdom-seeking approach')
        }
      }
      
      if (quiz.quizId === 'shiva-consciousness' && quiz.archetype) {
        if (quiz.archetype === 'The Destroyer') {
          reasons.push('Helps channel your transformative energy constructively')
        } else if (quiz.archetype === 'The Yogi') {
          reasons.push('Builds on your disciplined practice orientation')
        } else if (quiz.archetype === 'The Sage') {
          reasons.push('Deepens your philosophical understanding')
        }
      }
    }
    
    return reasons.length > 0 ? reasons[0] : 'Complements your spiritual journey'
  }

  private generateBookRecommendations(completedQuizzes: QuizResult[]): BookRecommendation[] {
    const recommendations: BookRecommendation[] = []
    const usedBooks = new Set<string>()
    
    for (const quiz of completedQuizzes) {
      const quizBooks = this.getBooksForQuiz(quiz)
      for (const book of quizBooks) {
        if (!usedBooks.has(book.title)) {
          recommendations.push(book)
          usedBooks.add(book.title)
        }
      }
    }
    
    // If no specific recommendations, add some foundational books
    if (recommendations.length === 0) {
      const foundationalBooks = [
        BOOK_DATABASE.find(b => b.title === 'The Bhagavad Gita'),
        BOOK_DATABASE.find(b => b.title === 'The Power of Now'),
        BOOK_DATABASE.find(b => b.title === 'Yoga Sutras of Patanjali')
      ].filter(Boolean) as BookRecommendation[]
      
      recommendations.push(...foundationalBooks)
    }
    
    return recommendations
      .sort((a, b) => {
        // Prioritize by difficulty and relevance
        const difficultyOrder = { beginner: 3, intermediate: 2, advanced: 1 }
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
      })
      .slice(0, 3)
  }

  private getBooksForQuiz(quiz: QuizResult): BookRecommendation[] {
    const books: BookRecommendation[] = []
    
    if (quiz.quizId === 'guna-profiler') {
      if (quiz.dominantTrait === 'tamas') {
        books.push(
          BOOK_DATABASE.find(b => b.title === 'The Power of Now')!,
          BOOK_DATABASE.find(b => b.title === 'Meditations')!
        )
      } else if (quiz.dominantTrait === 'rajas') {
        books.push(
          BOOK_DATABASE.find(b => b.title === 'Yoga Sutras of Patanjali')!,
          BOOK_DATABASE.find(b => b.title === 'The Heart of Yoga')!
        )
      } else if (quiz.dominantTrait === 'sattva') {
        books.push(
          BOOK_DATABASE.find(b => b.title === 'The Upanishads')!,
          BOOK_DATABASE.find(b => b.title === 'The Secret of the Veda')!
        )
      }
    }
    
    if (quiz.quizId === 'shiva-consciousness') {
      if (quiz.archetype === 'The Destroyer') {
        books.push(
          BOOK_DATABASE.find(b => b.title === 'Autobiography of a Yogi')!,
          BOOK_DATABASE.find(b => b.title === 'The Power of Now')!
        )
      } else if (quiz.archetype === 'The Yogi') {
        books.push(
          BOOK_DATABASE.find(b => b.title === 'Yoga Sutras of Patanjali')!,
          BOOK_DATABASE.find(b => b.title === 'The Heart of Yoga')!
        )
      } else if (quiz.archetype === 'The Sage') {
        books.push(
          BOOK_DATABASE.find(b => b.title === 'The Upanishads')!,
          BOOK_DATABASE.find(b => b.title === 'The Bhagavad Gita')!
        )
      }
    }
    
    return books.filter(Boolean) as BookRecommendation[]
  }

  private generateAnalysis(completedQuizzes: QuizResult[]): string {
    if (completedQuizzes.length === 0) {
      return 'Welcome to your spiritual journey! Complete the Guna Profiler or Shiva Consciousness quiz to receive a personalized analysis of your unique spiritual path and recommendations tailored to your energy patterns and archetype.'
    }
    
    if (completedQuizzes.length === 1) {
      const quiz = completedQuizzes[0]
      if (quiz.quizId === 'guna-profiler') {
        return `Your dominant ${quiz.dominantTrait} guna reveals your natural energy pattern. This foundation guides your spiritual practices and learning preferences. Your ${quiz.dominantTrait} energy influences how you approach challenges, relationships, and personal growth.`
      } else if (quiz.quizId === 'shiva-consciousness') {
        return `Your ${quiz.archetype} archetype shows your unique approach to transformation and spiritual growth. This archetype reveals how you process change, seek wisdom, and connect with your higher self.`
      }
    } else if (completedQuizzes.length >= 2) {
      const gunaQuiz = completedQuizzes.find(q => q.quizId === 'guna-profiler')
      const shivaQuiz = completedQuizzes.find(q => q.quizId === 'shiva-consciousness')
      
      if (gunaQuiz && shivaQuiz) {
        return `Your ${gunaQuiz.dominantTrait} energy combined with your ${shivaQuiz.archetype} archetype creates a unique spiritual blueprint. This combination suggests a balanced approach to both inner awareness and transformative action.`
      }
    }
    
    return 'Your quiz results reveal important insights about your spiritual journey and learning preferences.'
  }

  private generateCombinedAnalysis(completedQuizzes: QuizResult[]): string {
    const gunaQuiz = completedQuizzes.find(q => q.quizId === 'guna-profiler')
    const shivaQuiz = completedQuizzes.find(q => q.quizId === 'shiva-consciousness')
    
    if (!gunaQuiz || !shivaQuiz) {
      return this.generateAnalysis(completedQuizzes)
    }

    const gunaTrait = gunaQuiz.dominantTrait
    const shivaArchetype = shivaQuiz.archetype
    
    // Generate comprehensive combined analysis
    let analysis = `Your spiritual profile reveals a fascinating combination: your ${gunaTrait} energy pattern working in harmony with your ${shivaArchetype} archetype. `
    
    if (gunaTrait === 'sattva' && shivaArchetype === 'The Sage') {
      analysis += `This rare combination of balanced energy and philosophical wisdom suggests you have a natural inclination toward deep contemplation and spiritual understanding. Your path is one of steady growth through wisdom and insight.`
    } else if (gunaTrait === 'rajas' && shivaArchetype === 'The Yogi') {
      analysis += `Your dynamic energy combined with disciplined practice orientation creates a powerful force for transformation. You thrive on structured spiritual practices and systematic approaches to growth.`
    } else if (gunaTrait === 'tamas' && shivaArchetype === 'The Destroyer') {
      analysis += `Your grounding energy paired with transformative archetype suggests a journey of profound inner change. You have the potential to turn challenges into opportunities for deep spiritual awakening.`
    } else {
      analysis += `This unique combination creates a balanced approach to spiritual development, where your energy patterns support your archetypal strengths and help you navigate your spiritual journey with authenticity.`
    }
    
    return analysis
  }

  // Check if user has quiz history
  hasQuizHistory(): boolean {
    const completedQuizzes = this.getCompletedQuizzes()
    return completedQuizzes.length > 0
  }

  // Get user's quiz completion status
  getQuizCompletionStatus(): { guna: boolean; shiva: boolean } {
    const gunaState = storage.get('gunaProfilerState')
    const shivaState = storage.get('rishiModeState')
    
    return {
      guna: !!(gunaState && gunaState.dominantGuna),
      shiva: !!(shivaState && shivaState.rishiProfile)
    }
  }

  // Extensibility: Add new quiz to registry
  static addQuizToRegistry(quiz: QuizMetadata): void {
    const existingIndex = QUIZ_REGISTRY.findIndex(q => q.id === quiz.id)
    if (existingIndex >= 0) {
      QUIZ_REGISTRY[existingIndex] = quiz
    } else {
      QUIZ_REGISTRY.push(quiz)
      QUIZ_REGISTRY.sort((a, b) => a.priority - b.priority)
    }
  }
}

// Export singleton instance
export const quizRecommendationEngine = new QuizRecommendationEngine()
