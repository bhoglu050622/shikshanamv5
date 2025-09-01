'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Sparkles, Target, Users, Award, ArrowRight, ChevronRight, Star, Heart, Brain, Zap, ExternalLink, Clock, User, Book, GraduationCap } from 'lucide-react'
import { GunaScores } from '@/types/guna-profiler'
import { useRouter } from 'next/navigation'

interface ImmediateRecommendationsProps {
  dominantGuna: keyof GunaScores
  scores: GunaScores
  language: 'en' | 'hi'
  onEnhancedShivaClick: () => void
}

interface CourseRecommendation {
  id: string
  title: string
  description: string
  level: string
  duration: string
  price: string
  reason: string
  category: 'primary' | 'secondary'
}

interface BookRecommendation {
  title: string
  author: string
  reason: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export default function ImmediateRecommendations({ 
  dominantGuna, 
  scores, 
  language, 
  onEnhancedShivaClick 
}: ImmediateRecommendationsProps) {
  const [expandedSections, setExpandedSections] = useState({
    courses: true,
    books: true,
    enhancedShiva: true
  })
  const router = useRouter()

  const t = {
    en: {
      title: "Your Personalized Recommendations",
      subtitle: "Based on your Guna profile, here are tailored recommendations to help you grow and balance your energy.",
      coursesTitle: "Recommended Courses",
      coursesSubtitle: "Courses designed to help you balance your gunas and enhance self-awareness",
      booksTitle: "Recommended Books",
      booksSubtitle: "Books that provide deeper insights into Guna theory and spiritual growth",
      enhancedShivaTitle: "Deeper Analysis Available",
      enhancedShivaSubtitle: "Get a more comprehensive and accurate analysis with our Enhanced Shiva Consciousness module",
      enhancedShivaDescription: "Complete the Enhanced Shiva Consciousness module to receive:",
      enhancedShivaBenefits: [
        "A more comprehensive analysis of your spiritual alignment",
        "More refined and targeted course recommendations",
        "Deeper insights into your philosophical archetype",
        "Personalized learning path recommendations"
      ],
      tryEnhancedShiva: "Try Enhanced Shiva Consciousness",
      viewAllCourses: "View All Courses",
      getBook: "Get This Book",
      primary: "Primary",
      secondary: "Secondary"
    },
    hi: {
      title: "आपके व्यक्तिगत सुझाव",
      subtitle: "आपके गुण प्रोफाइल के आधार पर, यहाँ आपकी ऊर्जा को संतुलित करने और विकसित करने के लिए अनुकूलित सुझाव हैं।",
      coursesTitle: "अनुशंसित पाठ्यक्रम",
      coursesSubtitle: "आपके गुणों को संतुलित करने और आत्म-जागरूकता बढ़ाने के लिए डिज़ाइन किए गए पाठ्यक्रम",
      booksTitle: "अनुशंसित पुस्तकें",
      booksSubtitle: "गुण सिद्धांत और आध्यात्मिक विकास में गहरी अंतर्दृष्टि प्रदान करने वाली पुस्तकें",
      enhancedShivaTitle: "गहरा विश्लेषण उपलब्ध",
      enhancedShivaSubtitle: "हमारे एन्हांस्ड शिव चेतना मॉड्यूल के साथ अधिक व्यापक और सटीक विश्लेषण प्राप्त करें",
      enhancedShivaDescription: "अधिक व्यापक और सटीक विश्लेषण प्राप्त करने के लिए एन्हांस्ड शिव चेतना मॉड्यूल पूरा करें:",
      enhancedShivaBenefits: [
        "आपके आध्यात्मिक संरेखण का अधिक व्यापक विश्लेषण",
        "अधिक परिष्कृत और लक्षित पाठ्यक्रम सुझाव",
        "आपके दार्शनिक आर्केटाइप में गहरी अंतर्दृष्टि",
        "व्यक्तिगत शिक्षण पथ सुझाव"
      ],
      tryEnhancedShiva: "एन्हांस्ड शिव चेतना आज़माएं",
      viewAllCourses: "सभी पाठ्यक्रम देखें",
      getBook: "यह पुस्तक प्राप्त करें",
      primary: "प्राथमिक",
      secondary: "द्वितीयक"
    }
  }[language]

  // Course recommendations based on dominant guna
  const courseRecommendations = {
    sattva: [
      {
        id: 'emotional-intelligence',
        title: 'Emotional Intelligence with Sāṅkhya Darshan',
        description: 'Learn to channel your clarity and wisdom into practical action',
        level: 'Intermediate',
        duration: '8 weeks',
        price: '₹2,999',
        reason: 'Perfect for balancing your Sattvic clarity with grounded action',
        category: 'primary'
      },
      {
        id: 'meditation-mastery',
        title: 'Meditation Mastery',
        description: 'Deepen your natural meditative abilities',
        level: 'Beginner',
        duration: '4 weeks',
        price: '₹1,499',
        reason: 'Builds on your natural Sattvic qualities',
        category: 'secondary'
      },
      {
        id: 'spiritual-leadership',
        title: 'Spiritual Leadership',
        description: 'Learn to guide others with your wisdom',
        level: 'Advanced',
        duration: '12 weeks',
        price: '₹4,999',
        reason: 'Leverages your natural leadership qualities',
        category: 'secondary'
      }
    ],
    rajas: [
      {
        id: 'emotional-intelligence',
        title: 'Emotional Intelligence with Sāṅkhya Darshan',
        description: 'Learn to channel your energy and drive effectively',
        level: 'Intermediate',
        duration: '8 weeks',
        price: '₹2,999',
        reason: 'Helps balance your Rajasic energy with wisdom',
        category: 'primary'
      },
      {
        id: 'stress-management',
        title: 'Stress Management & Burnout Prevention',
        description: 'Learn to manage your high energy without burning out',
        level: 'Beginner',
        duration: '6 weeks',
        price: '₹1,999',
        reason: 'Essential for preventing Rajasic burnout',
        category: 'secondary'
      },
      {
        id: 'goal-achievement',
        title: 'Goal Achievement & Focus',
        description: 'Channel your drive into focused, sustainable action',
        level: 'Intermediate',
        duration: '8 weeks',
        price: '₹2,499',
        reason: 'Optimizes your natural goal-oriented nature',
        category: 'secondary'
      }
    ],
    tamas: [
      {
        id: 'emotional-intelligence',
        title: 'Emotional Intelligence with Sāṅkhya Darshan',
        description: 'Learn to overcome inertia and find your motivation',
        level: 'Intermediate',
        duration: '8 weeks',
        price: '₹2,999',
        reason: 'Helps transform Tamasic inertia into positive action',
        category: 'primary'
      },
      {
        id: 'energy-activation',
        title: 'Energy Activation & Motivation',
        description: 'Learn to activate your energy and overcome inertia',
        level: 'Beginner',
        duration: '6 weeks',
        price: '₹1,999',
        reason: 'Specifically designed to address Tamasic challenges',
        category: 'secondary'
      },
      {
        id: 'grounding-practices',
        title: 'Grounding Practices & Stability',
        description: 'Transform your stability into a strength',
        level: 'Beginner',
        duration: '4 weeks',
        price: '₹1,499',
        reason: 'Builds on your natural grounding abilities',
        category: 'secondary'
      }
    ]
  }[dominantGuna]

  // Book recommendations based on dominant guna
  const bookRecommendations = {
    sattva: [
      {
        title: 'The Bhagavad Gita',
        author: 'Eknath Easwaran',
        reason: 'Perfect for your contemplative nature and spiritual clarity',
        difficulty: 'intermediate'
      },
      {
        title: 'The Upanishads',
        author: 'Eknath Easwaran',
        reason: 'Deepens your natural wisdom and understanding',
        difficulty: 'advanced'
      },
      {
        title: 'The Yoga Sutras of Patanjali',
        author: 'Sri Swami Satchidananda',
        reason: 'Provides practical guidance for your spiritual journey',
        difficulty: 'intermediate'
      }
    ],
    rajas: [
      {
        title: 'The Bhagavad Gita',
        author: 'Eknath Easwaran',
        reason: 'Teaches action with wisdom - perfect for your energetic nature',
        difficulty: 'intermediate'
      },
      {
        title: 'The Art of Living',
        author: 'Thich Nhat Hanh',
        reason: 'Helps balance your energy with mindfulness',
        difficulty: 'beginner'
      },
      {
        title: 'The Power of Now',
        author: 'Eckhart Tolle',
        reason: 'Teaches presence and reduces overthinking',
        difficulty: 'beginner'
      }
    ],
    tamas: [
      {
        title: 'The Bhagavad Gita',
        author: 'Eknath Easwaran',
        reason: 'Provides motivation and purpose to overcome inertia',
        difficulty: 'intermediate'
      },
      {
        title: 'Awakening the Buddha Within',
        author: 'Lama Surya Das',
        reason: 'Gentle approach to spiritual awakening',
        difficulty: 'beginner'
      },
      {
        title: 'The Miracle of Mindfulness',
        author: 'Thich Nhat Hanh',
        reason: 'Simple, practical steps to increase awareness',
        difficulty: 'beginner'
      }
    ]
  }[dominantGuna]

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleCourseClick = (courseId: string) => {
    router.push(`/courses/premium-courses#${courseId}`)
  }

  const handleBookClick = (bookTitle: string, author: string) => {
    const searchQuery = encodeURIComponent(`${bookTitle} ${author}`)
    window.open(`https://www.google.com/search?q=${searchQuery}+book`, '_blank')
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {t.title}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </motion.div>

      {/* Course Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6"
      >
        <div 
          className="flex items-center justify-between cursor-pointer mb-4"
          onClick={() => toggleSection('courses')}
        >
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <GraduationCap className="w-6 h-6 mr-3 text-primary-light dark:text-primary-dark" />
              {t.coursesTitle}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {t.coursesSubtitle}
            </p>
          </div>
          <ChevronRight 
            className={`w-6 h-6 text-gray-400 transition-transform ${
              expandedSections.courses ? 'rotate-90' : ''
            }`} 
          />
        </div>

        {expandedSections.courses && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4"
          >
            {courseRecommendations.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        course.category === 'primary' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {course.category === 'primary' ? t.primary : t.secondary}
                      </span>
                      <span className="text-sm text-gray-500">{course.level}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{course.duration}</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {course.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {course.description}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">
                      <strong>Why this course:</strong> {course.reason}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary-light dark:text-primary-dark">
                        {course.price}
                      </span>
                      <button
                        onClick={() => handleCourseClick(course.id)}
                        className="bg-primary-light dark:bg-primary-dark text-white px-4 py-2 rounded-lg hover:bg-primary-light/90 dark:hover:bg-primary-dark/90 transition-colors flex items-center gap-2"
                      >
                        {t.viewAllCourses} <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Book Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6"
      >
        <div 
          className="flex items-center justify-between cursor-pointer mb-4"
          onClick={() => toggleSection('books')}
        >
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <Book className="w-6 h-6 mr-3 text-secondary-light dark:text-secondary-dark" />
              {t.booksTitle}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {t.booksSubtitle}
            </p>
          </div>
          <ChevronRight 
            className={`w-6 h-6 text-gray-400 transition-transform ${
              expandedSections.books ? 'rotate-90' : ''
            }`} 
          />
        </div>

        {expandedSections.books && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4"
          >
            {bookRecommendations.map((book, index) => (
              <motion.div
                key={book.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
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
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {book.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      by {book.author}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">
                      <strong>Why this book:</strong> {book.reason}
                    </p>
                    <button
                      onClick={() => handleBookClick(book.title, book.author)}
                      className="bg-secondary-light dark:bg-secondary-dark text-white px-4 py-2 rounded-lg hover:bg-secondary-light/90 dark:hover:bg-secondary-dark/90 transition-colors flex items-center gap-2"
                    >
                      {t.getBook} <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Enhanced Shiva Consciousness Prompt */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-orange-900/20 dark:via-gray-800 dark:to-amber-900/20 rounded-2xl p-8 shadow-lg border border-orange-200 dark:border-orange-800"
      >
        <div 
          className="flex items-center justify-between cursor-pointer mb-4"
          onClick={() => toggleSection('enhancedShiva')}
        >
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <Sparkles className="w-6 h-6 mr-3 text-orange-500" />
              {t.enhancedShivaTitle}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {t.enhancedShivaSubtitle}
            </p>
          </div>
          <ChevronRight 
            className={`w-6 h-6 text-gray-400 transition-transform ${
              expandedSections.enhancedShiva ? 'rotate-90' : ''
            }`} 
          />
        </div>

        {expandedSections.enhancedShiva && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4"
          >
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              {t.enhancedShivaDescription}
            </p>
            <ul className="space-y-2 mb-6">
              {t.enhancedShivaBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                </li>
              ))}
            </ul>
            <div className="text-center">
              <button
                onClick={onEnhancedShivaClick}
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 mx-auto"
              >
                <Heart className="w-6 h-6" />
                {t.tryEnhancedShiva}
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
