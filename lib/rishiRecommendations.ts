import { getAllCourses, getCourseById, type Course } from '@/lib/courseData'
import { rishiProfiles, type RishiProfile } from '@/data/rishiModeData'

export interface RecommendationScore {
  courseId: string
  score: number
  reasons: string[]
  matchType: 'perfect' | 'high' | 'medium' | 'low'
}

export interface EnhancedRecommendation {
  course: Course
  score: RecommendationScore
  priority: number
  category: 'primary' | 'secondary' | 'explore'
}

export interface UserPreferences {
  darshana: string
  guna: string
  level: string
  interests: string[]
  completedCourses: string[]
  preferredAcharyas: string[]
  priceRange?: { min: number; max: number }
  timeCommitment?: 'low' | 'medium' | 'high'
}

export class RishiRecommendationEngine {
  private courses: Course[]
  
  constructor() {
    this.courses = getAllCourses()
  }

  // Enhanced algorithm that considers multiple factors
  generateRecommendations(
    rishiProfile: RishiProfile,
    userPreferences?: Partial<UserPreferences>,
    limit: number = 6
  ): EnhancedRecommendation[] {
    const recommendations: EnhancedRecommendation[] = []

    for (const course of this.courses) {
      const score = this.calculateCourseScore(course, rishiProfile, userPreferences)
      
      if (score.score > 0.3) { // Only recommend courses with decent relevance
        recommendations.push({
          course,
          score,
          priority: this.calculatePriority(course, rishiProfile, score.score),
          category: this.categorizeRecommendation(score.score)
        })
      }
    }

    // Sort by score and priority, then take top results
    return recommendations
      .sort((a, b) => {
        if (a.score.score === b.score.score) {
          return b.priority - a.priority
        }
        return b.score.score - a.score.score
      })
      .slice(0, limit)
  }

  private calculateCourseScore(
    course: Course,
    rishiProfile: RishiProfile,
    userPreferences?: Partial<UserPreferences>
  ): RecommendationScore {
    let score = 0
    const reasons: string[] = []

    // 1. Darshana alignment (40% weight)
    const darshanMatch = this.calculateDarshanMatch(course, rishiProfile.darshana)
    score += darshanMatch.score * 0.4
    if (darshanMatch.reason) reasons.push(darshanMatch.reason)

    // 2. Level appropriateness (25% weight)
    const levelMatch = this.calculateLevelMatch(course, userPreferences?.level || 'Beginner')
    score += levelMatch.score * 0.25
    if (levelMatch.reason) reasons.push(levelMatch.reason)

    // 3. Guna compatibility (15% weight)
    const gunaMatch = this.calculateGunaMatch(course, rishiProfile.guna)
    score += gunaMatch.score * 0.15
    if (gunaMatch.reason) reasons.push(gunaMatch.reason)

    // 4. Course characteristics alignment (10% weight)
    const characteristicsMatch = this.calculateCharacteristicsMatch(course, rishiProfile.characteristics)
    score += characteristicsMatch.score * 0.1
    if (characteristicsMatch.reason) reasons.push(characteristicsMatch.reason)

    // 5. User preferences (10% weight)
    if (userPreferences) {
      const preferencesMatch = this.calculatePreferencesMatch(course, userPreferences)
      score += preferencesMatch.score * 0.1
      if (preferencesMatch.reason) reasons.push(preferencesMatch.reason)
    }

    // Determine match type based on score
    let matchType: 'perfect' | 'high' | 'medium' | 'low'
    if (score >= 0.85) matchType = 'perfect'
    else if (score >= 0.7) matchType = 'high'
    else if (score >= 0.5) matchType = 'medium'
    else matchType = 'low'

    return {
      courseId: course.id,
      score: Math.min(score, 1), // Cap at 1.0
      reasons,
      matchType
    }
  }

  private calculateDarshanMatch(course: Course, darshana: string): { score: number; reason?: string } {
    // Direct school match
    if (course.school.toLowerCase() === darshana.toLowerCase()) {
      return { score: 1.0, reason: `Perfect alignment with your ${darshana} path` }
    }

    // Cross-school synergies
    const synergies: Record<string, string[]> = {
      'vedanta': ['yoga', 'sankhya'],
      'yoga': ['vedanta', 'sankhya'],
      'sankhya': ['yoga', 'vedanta'],
      'nyaya': ['vaisheshika', 'vedanta'],
      'vaisheshika': ['nyaya', 'sankhya'],
      'mimamsa': ['vedanta', 'yoga']
    }

    const relatedSchools = synergies[darshana.toLowerCase()] || []
    if (relatedSchools.includes(course.school.toLowerCase())) {
      return { score: 0.7, reason: `Complementary to your ${darshana} studies` }
    }

    // Sanskrit and foundational courses are good for everyone
    if (course.title.toLowerCase().includes('sanskrit') || 
        course.description.toLowerCase().includes('foundation')) {
      return { score: 0.6, reason: 'Essential foundational knowledge' }
    }

    return { score: 0.3 }
  }

  private calculateLevelMatch(course: Course, userLevel: string): { score: number; reason?: string } {
    const levelHierarchy = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 }
    const courseLevel = levelHierarchy[course.level.toLowerCase() as keyof typeof levelHierarchy] || 1
    const currentLevel = levelHierarchy[userLevel.toLowerCase() as keyof typeof levelHierarchy] || 1

    if (courseLevel === currentLevel) {
      return { score: 1.0, reason: `Perfect match for your ${userLevel} level` }
    } else if (courseLevel === currentLevel + 1) {
      return { score: 0.8, reason: 'Ideal next step in your learning journey' }
    } else if (courseLevel === currentLevel - 1) {
      return { score: 0.6, reason: 'Good for reinforcing fundamentals' }
    } else {
      return { score: 0.3 }
    }
  }

  private calculateGunaMatch(course: Course, guna: string): { score: number; reason?: string } {
    // Map course characteristics to gunas
    const gunaKeywords: Record<string, string[]> = {
      'sattva': ['wisdom', 'peace', 'clarity', 'meditation', 'philosophy', 'understanding'],
      'rajas': ['practice', 'action', 'dynamic', 'leadership', 'achievement', 'discipline'],
      'tamas': ['stability', 'grounding', 'foundation', 'traditional', 'preservation']
    }

    const keywords = gunaKeywords[guna.toLowerCase()] || []
    const courseText = `${course.title} ${course.description}`.toLowerCase()
    
    const matches = keywords.filter(keyword => courseText.includes(keyword))
    
    if (matches.length >= 2) {
      return { score: 1.0, reason: `Aligns with your ${guna} nature` }
    } else if (matches.length === 1) {
      return { score: 0.7, reason: `Resonates with your ${guna} qualities` }
    }

    return { score: 0.5 }
  }

  private calculateCharacteristicsMatch(course: Course, characteristics: string[]): { score: number; reason?: string } {
    const courseText = `${course.title} ${course.description}`.toLowerCase()
    let matches = 0

    for (const characteristic of characteristics) {
      const words = characteristic.toLowerCase().split(' ')
      if (words.some(word => courseText.includes(word))) {
        matches++
      }
    }

    const matchRatio = matches / characteristics.length
    if (matchRatio >= 0.5) {
      return { score: 1.0, reason: 'Matches your natural inclinations' }
    } else if (matchRatio >= 0.25) {
      return { score: 0.7, reason: 'Supports your learning style' }
    }

    return { score: 0.5 }
  }

  private calculatePreferencesMatch(course: Course, preferences: Partial<UserPreferences>): { score: number; reason?: string } {
    let score = 0.5 // Base score
    let reasons: string[] = []

    // Check completed courses to avoid duplicates
    if (preferences.completedCourses?.includes(course.id)) {
      return { score: 0, reason: 'Already completed' }
    }

    // Preferred acharyas
    if (preferences.preferredAcharyas?.includes(course.acharya)) {
      score += 0.3
      reasons.push(`Taught by your preferred teacher ${course.acharya}`)
    }

    // Price range
    if (preferences.priceRange) {
      const { min, max } = preferences.priceRange
      if (course.price >= min && course.price <= max) {
        score += 0.2
        reasons.push('Within your budget')
      } else {
        score -= 0.2
      }
    }

    return { score: Math.min(score, 1.0), reason: reasons.join(', ') }
  }

  private calculatePriority(course: Course, rishiProfile: RishiProfile, score: number): number {
    let priority = score * 100

    // Boost priority for courses explicitly mentioned in profile
    if (rishiProfile.recommendedCourses.includes(course.title)) {
      priority += 50
    }

    // Boost beginner courses for new users
    if (course.level === 'Beginner') {
      priority += 20
    }

    // Boost courses with better value (higher original price vs current price)
    if (course.price < 5000) {
      priority += 10
    }

    return Math.round(priority)
  }

  private categorizeRecommendation(score: number): 'primary' | 'secondary' | 'explore' {
    if (score >= 0.8) return 'primary'
    if (score >= 0.6) return 'secondary'
    return 'explore'
  }

  // Get recommendations by category
  getRecommendationsByCategory(
    rishiProfile: RishiProfile,
    userPreferences?: Partial<UserPreferences>
  ): Record<string, EnhancedRecommendation[]> {
    const all = this.generateRecommendations(rishiProfile, userPreferences, 12)
    
    return {
      primary: all.filter(r => r.category === 'primary'),
      secondary: all.filter(r => r.category === 'secondary'),
      explore: all.filter(r => r.category === 'explore')
    }
  }

  // Learning path generation
  generateLearningPath(
    rishiProfile: RishiProfile,
    userLevel: string = 'Beginner'
  ): EnhancedRecommendation[] {
    const recommendations = this.generateRecommendations(rishiProfile, { level: userLevel }, 20)
    
    // Sort by level progression and score
    const beginnerCourses = recommendations.filter(r => r.course.level === 'Beginner')
    const intermediateCourses = recommendations.filter(r => r.course.level === 'Intermediate')
    const advancedCourses = recommendations.filter(r => r.course.level === 'Advanced')

    return [...beginnerCourses, ...intermediateCourses, ...advancedCourses].slice(0, 6)
  }
}

// Singleton instance
export const recommendationEngine = new RishiRecommendationEngine()

// Utility functions for course matching
export function findSimilarCourses(courseId: string, limit: number = 3): Course[] {
  const course = getCourseById(courseId)
  if (!course) return []

  const allCourses = getAllCourses()
  const similar = allCourses
    .filter(c => c.id !== courseId)
    .map(c => ({
      course: c,
      similarity: calculateCourseSimilarity(course as Course, c)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map(item => item.course)

  return similar
}

function calculateCourseSimilarity(courseA: Course, courseB: Course): number {
  let similarity = 0

  // School match (40% weight)
  if (courseA.school === courseB.school) similarity += 0.4

  // Level similarity (30% weight)
  const levelMap = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 }
  const levelA = levelMap[courseA.level as keyof typeof levelMap] || 1
  const levelB = levelMap[courseB.level as keyof typeof levelMap] || 1
  const levelSimilarity = 1 - Math.abs(levelA - levelB) / 2
  similarity += levelSimilarity * 0.3

  // Teacher match (20% weight)
  if (courseA.acharya === courseB.acharya) similarity += 0.2

  // Price similarity (10% weight)
  const priceDiff = Math.abs(courseA.price - courseB.price)
  const maxPrice = Math.max(courseA.price, courseB.price)
  const priceSimilarity = 1 - (priceDiff / maxPrice)
  similarity += priceSimilarity * 0.1

  return similarity
}
