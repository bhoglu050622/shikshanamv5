'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { 
  BookOpen, 
  Target, 
  Zap, 
  Brain, 
  Heart, 
  Eye, 
  Sparkles, 
  Star, 
  Award, 
  Trophy, 
  Calendar,
  ArrowDown,
  Play,
  ChevronRight,
  Users,
  Clock,
  Flame
} from 'lucide-react'
import Link from 'next/link'
import darshanasData from '@/data/darshanas.json'

// Types
interface Darshana {
  id: string
  title: string
  sanskrit: string
  subtitle: string
  description: string
  shortDescription: string
  color: string
  bgColor: string
  textColor: string
  icon: string
  level: string
  xpReward: number
  questCount: number
  estimatedTime: string
  themes: string[]
  gamificationElements: {
    badge: string
    achievements: string[]
    progressPath: string
  }
  courseLinks: {
    free: string
    premium: string
  }
}

// Icon mapping
const iconMap = {
  BookOpen,
  Target,
  Zap,
  Brain,
  Heart,
  Eye
}

// Hero Section Component
function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true })

  const scrollToMap = () => {
    document.getElementById('darshana-map')?.scrollIntoView({ 
      behavior: 'smooth' 
    })
  }

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-background-light via-background-alt-light to-primary-light/10 dark:from-background-dark dark:via-background-alt-dark dark:to-primary-dark/10">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Sacred Geometry */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 opacity-10">
          <motion.div
            className="absolute inset-0 border border-primary-light/30 dark:border-primary-dark/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-8 border border-secondary-light/20 dark:border-secondary-dark/20 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Floating Particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary-light/30 dark:bg-primary-dark/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-light/20 to-secondary-light/20 dark:from-primary-dark/20 dark:to-secondary-dark/20 rounded-full border border-primary-light/30 dark:border-primary-dark/30 mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Sparkles className="w-5 h-5 text-primary-light dark:text-primary-dark" />
          <span className="text-primary-light dark:text-primary-dark font-medium">Ancient Wisdom • Gamified Learning</span>
          <Star className="w-5 h-5 text-primary-light dark:text-primary-dark" />
        </motion.div>

        {/* Main Title */}
        <motion.h1
          className="text-6xl md:text-8xl font-serif font-bold mb-6 text-primary-light dark:text-primary-dark"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Six Darshanas
        </motion.h1>

        {/* Sanskrit */}
        <motion.p
          className="text-2xl md:text-3xl font-sanskrit text-secondary-light dark:text-secondary-dark mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
        >
          षड्दर्शनानि
        </motion.p>

        {/* Subtitle */}
        <motion.p
          className="text-2xl md:text-3xl text-text-secondary-light dark:text-text-secondary-dark mb-8 max-w-4xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Master the complete system of <strong>Indian philosophy</strong> through an epic gamified journey. 
          Unlock ancient wisdom, earn XP, and achieve <strong>spiritual enlightenment</strong>.
        </motion.p>

        {/* Stats */}
        <motion.div
          className="flex flex-wrap justify-center gap-8 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <div className="flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark">
            <Users className="w-5 h-5" />
            <span>5000+ Students</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark">
            <Clock className="w-5 h-5" />
            <span>6-month Journey</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark">
            <Trophy className="w-5 h-5" />
            <span>Ancient Wisdom</span>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.7 }}
        >
          <motion.button
            onClick={scrollToMap}
            className="bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 mx-auto group hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-5 h-5" />
            Begin Your Journey
            <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </motion.button>

          <Link href="/courses/free-masterclass">
            <motion.button
              className="border-2 border-primary-light dark:border-primary-dark text-primary-light dark:text-primary-dark px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 mx-auto hover:bg-primary-light/10 dark:hover:bg-primary-dark/10 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BookOpen className="w-5 h-5" />
              Free Masterclass
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// Darshana Card Component
interface DarshanaCardProps {
  darshana: Darshana
  index: number
}

function DarshanaCard({ darshana, index }: DarshanaCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const IconComponent = iconMap[darshana.icon as keyof typeof iconMap]

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative p-8 rounded-3xl bg-white/95 dark:bg-gray-900/95 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-lg hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary-light/10 dark:hover:shadow-primary-dark/10 transition-all duration-500 cursor-pointer h-full">
        {/* Level Badge */}
        <div className="absolute top-6 right-6">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${darshana.textColor} bg-gradient-to-r ${darshana.color} bg-opacity-10 border border-current/20`}>
            {darshana.level}
          </span>
        </div>

        {/* Icon */}
        <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${darshana.color} flex items-center justify-center text-white shadow-xl shadow-black/20`}>
          <IconComponent className="w-10 h-10" />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-serif font-bold text-center mb-3 text-gray-900 dark:text-white">
          {darshana.title}
        </h3>

        {/* Sanskrit */}
        <p className="font-sanskrit text-center text-xl mb-3 text-gray-700 dark:text-gray-300">
          {darshana.sanskrit}
        </p>

        {/* Subtitle */}
        <p className={`text-center font-semibold mb-4 text-lg ${darshana.textColor}`}>
          {darshana.subtitle}
        </p>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-center text-sm leading-relaxed mb-8 min-h-[3rem] flex items-center justify-center">
          {darshana.shortDescription}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center">
            <div className={`w-8 h-8 mx-auto mb-2 rounded-lg bg-gradient-to-br ${darshana.color} flex items-center justify-center`}>
              <Award className="w-4 h-4 text-white" />
            </div>
            <p className="text-xs font-medium text-gray-900 dark:text-white">{darshana.xpReward} XP</p>
          </div>
          <div className="text-center">
            <div className={`w-8 h-8 mx-auto mb-2 rounded-lg bg-gradient-to-br ${darshana.color} flex items-center justify-center`}>
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <p className="text-xs font-medium text-gray-900 dark:text-white">{darshana.questCount} Quests</p>
          </div>
          <div className="text-center">
            <div className={`w-8 h-8 mx-auto mb-2 rounded-lg bg-gradient-to-br ${darshana.color} flex items-center justify-center`}>
              <Clock className="w-4 h-4 text-white" />
            </div>
            <p className="text-xs font-medium text-gray-900 dark:text-white">{darshana.estimatedTime}</p>
          </div>
        </div>

        {/* Progress Path */}
        <div className="text-center mb-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Journey Path</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white leading-relaxed">
            {darshana.gamificationElements.progressPath}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-3">
          <Link 
            href={`/darshana/${darshana.id}`} 
            className="flex-1"
          >
            <motion.button
              className={`w-full bg-gradient-to-r ${darshana.color} text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-black/25 transition-all duration-300`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play className="w-4 h-4" />
              Start Quest
            </motion.button>
          </Link>
          
          <Link href={darshana.courseLinks.free}>
            <motion.button
              className="px-4 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BookOpen className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            </motion.button>
          </Link>
        </div>

        {/* Hover Glow Effect */}
        <motion.div
          className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${darshana.color} opacity-0 transition-opacity duration-500 -z-10`}
          animate={{ opacity: isHovered ? 0.05 : 0 }}
        />
      </div>
    </motion.div>
  )
}

// Darshana Map Component
function DarshanaMap() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const darshanas = darshanasData.darshanas

  return (
    <section id="darshana-map" ref={ref} className="py-20 px-4 bg-background-alt-light dark:bg-background-alt-dark">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <h2 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-primary-light dark:text-primary-dark">
            Choose Your Path
          </h2>
          <p className="text-xl text-text-secondary-light dark:text-text-secondary-dark max-w-3xl mx-auto">
            Each darshana offers a unique perspective on reality and consciousness. 
            Begin with any path that calls to your soul.
          </p>
        </motion.div>

        {/* Darshana Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {darshanas.map((darshana, index) => (
            <DarshanaCard 
              key={darshana.id} 
              darshana={darshana} 
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// Gamification Section Component
function GamificationSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { levels, badges } = darshanasData.gamificationSystem

  return (
    <section ref={ref} className="py-20 px-4 bg-gradient-to-br from-primary-light/5 to-secondary-light/5 dark:from-primary-dark/5 dark:to-secondary-dark/5">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-light/20 to-secondary-light/20 dark:from-primary-dark/20 dark:to-secondary-dark/20 rounded-full border border-primary-light/30 dark:border-primary-dark/30 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Trophy className="w-4 h-4 text-primary-light dark:text-primary-dark" />
            <span className="text-primary-light dark:text-primary-dark font-medium">Gamified Learning</span>
            <Flame className="w-4 h-4 text-primary-light dark:text-primary-dark" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-primary-light dark:text-primary-dark">
            Level Up Your Wisdom
          </h2>
          <p className="text-xl text-text-secondary-light dark:text-text-secondary-dark max-w-3xl mx-auto">
            Earn XP, unlock achievements, and progress through wisdom levels as you master ancient philosophy.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Levels System */}
          <motion.div
            className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <h3 className="text-2xl font-serif font-bold mb-8 text-center text-gray-900 dark:text-white flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              Wisdom Levels
            </h3>
            
            <div className="space-y-4">
              {levels.map((level, index) => (
                <motion.div
                  key={level.level}
                  className="flex items-center gap-4 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {level.level}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">{level.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {level.xpRequired} XP required
                    </p>
                  </div>
                  <div className="text-xs text-primary-light dark:text-primary-dark font-semibold bg-primary-light/10 dark:bg-primary-dark/10 px-3 py-1.5 rounded-full">
                    {level.rewards[0]}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Badges System */}
          <motion.div
            className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <h3 className="text-2xl font-serif font-bold mb-8 text-center text-gray-900 dark:text-white flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-light to-primary-light dark:from-accent-dark dark:to-primary-dark flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              Achievement Badges
            </h3>
            
            <div className="space-y-4">
              {badges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  className="flex items-center gap-4 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-light to-primary-light dark:from-accent-dark dark:to-primary-dark flex items-center justify-center shadow-lg">
                    <Star className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">{badge.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Course Cards Section
function CourseCardsSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const courses = [
    {
      title: "Free Darshana Masterclass",
      description: "Get introduced to all six philosophical systems in this comprehensive overview.",
      duration: "2 hours",
      level: "Beginner",
      price: "Free",
      link: "/courses/free-masterclass",
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Premium Darshana Journey",
      description: "Deep dive into each philosophy with guided meditation and practical exercises.",
      duration: "6 months",
      level: "All Levels",
      price: "$299",
      link: "/courses/premium-courses",
      color: "from-purple-500 to-indigo-600"
    },
    {
      title: "Sanskrit Foundations",
      description: "Learn to read original philosophical texts in Sanskrit with proper pronunciation.",
      duration: "3 months",
      level: "Intermediate", 
      price: "$199",
      link: "/courses/sanskrit-live-class",
      color: "from-orange-500 to-red-600"
    }
  ]

  return (
    <section ref={ref} className="py-20 px-4 bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-primary-light dark:text-primary-dark">
            Start Your Learning Journey
          </h2>
          <p className="text-xl text-text-secondary-light dark:text-text-secondary-dark max-w-3xl mx-auto">
            Choose from our curated courses designed to guide you through the depths of Indian philosophy.
          </p>
        </motion.div>

        {/* Course Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.title}
              className="group bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl hover:shadow-primary-light/10 dark:hover:shadow-primary-dark/10 transition-all duration-500 hover:scale-[1.02]"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              {/* Header with Level and Price */}
              <div className="flex justify-between items-start mb-8">
                <div className={`px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r ${course.color} text-white shadow-lg`}>
                  {course.level}
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {course.price}
                  </span>
                  {course.price !== "Free" && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">one-time</p>
                  )}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-serif font-bold mb-4 text-gray-900 dark:text-white group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors leading-tight">
                {course.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed min-h-[4rem] flex items-center">
                {course.description}
              </p>

              {/* Duration and Details */}
              <div className="flex items-center justify-center gap-2 mb-8 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                <Clock className="w-5 h-5 text-primary-light dark:text-primary-dark" />
                <span className="font-semibold text-gray-900 dark:text-white">{course.duration}</span>
              </div>

              {/* CTA Button */}
              <Link href={course.link}>
                <motion.button
                  className={`w-full bg-gradient-to-r ${course.color} text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-black/25 transition-all duration-300`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <BookOpen className="w-5 h-5" />
                  Enroll Now
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Main Page Component
export default function SixDharshansPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <DarshanaMap />
      <GamificationSection />
      <CourseCardsSection />
    </main>
  )
}
