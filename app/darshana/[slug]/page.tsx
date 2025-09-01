'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Play, 
  BookOpen, 
  Target, 
  Zap, 
  Brain, 
  Heart, 
  Eye,
  Award,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  Star,
  Sparkles
} from 'lucide-react'
import darshanasData from '@/data/darshanas.json'
import QuestBoard from '@/components/quest/QuestBoard'
import ProgressionPath from '@/components/quest/ProgressionPath'
import XPTracker from '@/components/quest/XPTracker'
import QuestModal from '@/components/quest/QuestModal'
import BadgeSystem from '@/components/quest/BadgeSystem'
import questData from '@/data/mimamsa-quests.json'

// Icon mapping
const iconMap = {
  BookOpen,
  Target,
  Zap,
  Brain,
  Heart,
  Eye
}

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

export default function DarshanaPage() {
  const params = useParams()
  const slug = params.slug as string
  const [darshana, setDarshana] = useState<Darshana | null>(null)
  
  // Quest system state (only for Mimamsa)
  const [userProgress, setUserProgress] = useState({
    completedQuests: [] as number[],
    currentXP: 0,
    totalSessionTime: 0,
    streak: 0,
    lastActiveDate: new Date().toISOString(),
    unlockedBadges: [] as string[]
  })
  
  const [activeQuestId, setActiveQuestId] = useState<number | null>(null)
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false)
  const [showLoreTab, setShowLoreTab] = useState(false)

  useEffect(() => {
    const found = darshanasData.darshanas.find(d => d.id === slug)
    setDarshana(found || null)
    
    // Load quest progress for Mimamsa
    if (slug === 'mimamsa') {
      const savedProgress = localStorage.getItem('mimamsa-quest-progress')
      if (savedProgress) {
        setUserProgress(JSON.parse(savedProgress))
      }
    }
  }, [slug])

  // Save progress to localStorage
  const saveProgress = (progress: typeof userProgress) => {
    setUserProgress(progress)
    localStorage.setItem('mimamsa-quest-progress', JSON.stringify(progress))
  }

  const handleStartQuest = (questId: number) => {
    setActiveQuestId(questId)
    setIsQuestModalOpen(true)
  }

  const handleCompleteQuest = (questId: number, score: number) => {
    const quest = questData.quests.find(q => q.id === questId)
    if (!quest) return

    const newProgress = {
      ...userProgress,
      completedQuests: [...userProgress.completedQuests, questId].filter((id, index, arr) => arr.indexOf(id) === index),
      currentXP: userProgress.currentXP + quest.xpReward,
      lastActiveDate: new Date().toISOString()
    }

    // Check for new badges
    const newBadges = questData.badges
      .filter(badge => 
        badge.questRequired <= questId && 
        !userProgress.unlockedBadges.includes(badge.id)
      )
      .map(badge => badge.id)

    if (newBadges.length > 0) {
      newProgress.unlockedBadges = [...userProgress.unlockedBadges, ...newBadges]
    }

    saveProgress(newProgress)
    setIsQuestModalOpen(false)
    setActiveQuestId(null)
  }

  if (!darshana) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold mb-4 text-text-light dark:text-text-dark">
            Darshana Not Found
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mb-8">
            The philosophical system you're looking for doesn't exist.
          </p>
          <Link href="/sixdharshans">
            <motion.button
              className="bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Six Darshanas
            </motion.button>
          </Link>
        </div>
      </div>
    )
  }

  const IconComponent = iconMap[darshana.icon as keyof typeof iconMap]

  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Hero Section */}
      <section className={`relative py-20 px-4 overflow-hidden ${darshana.bgColor}`}>
        {/* Background Effects */}
        <div className="absolute inset-0">
          {/* Sacred Geometry */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 opacity-10">
            <motion.div
              className={`absolute inset-0 border ${darshana.textColor} rounded-full`}
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Floating Particles */}
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-2 h-2 ${darshana.textColor} rounded-full opacity-30`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Back Button */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link href="/sixdharshans">
              <motion.button
                className="flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-light dark:hover:text-text-dark transition-colors"
                whileHover={{ x: -5 }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Six Darshanas
              </motion.button>
            </Link>
          </motion.div>

          <div className="text-center">
            {/* Level Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-lg rounded-full border border-white/30 mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Star className="w-4 h-4 text-white" />
              <span className="text-white font-medium">{darshana.level} Level</span>
              <Award className="w-4 h-4 text-white" />
            </motion.div>

            {/* Icon */}
            <motion.div
              className={`w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br ${darshana.color} flex items-center justify-center text-white shadow-2xl`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <IconComponent className="w-12 h-12" />
            </motion.div>

            {/* Title & Sanskrit */}
            <motion.h1
              className="text-5xl md:text-7xl font-serif font-bold mb-4 text-text-light dark:text-text-dark"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              {darshana.title}
            </motion.h1>

            <motion.p
              className="text-2xl md:text-3xl font-sanskrit mb-4 text-text-secondary-light dark:text-text-secondary-dark"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              {darshana.sanskrit}
            </motion.p>

            {/* Subtitle */}
            <motion.p
              className={`text-2xl md:text-3xl font-medium mb-8 ${darshana.textColor}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              {darshana.subtitle}
            </motion.p>

            {/* Stats */}
            <motion.div
              className="flex flex-wrap justify-center gap-8 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              <div className="flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark">
                <Award className="w-5 h-5" />
                <span>{darshana.xpReward} XP Reward</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark">
                <Calendar className="w-5 h-5" />
                <span>{darshana.questCount} Quests</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark">
                <Clock className="w-5 h-5" />
                <span>{darshana.estimatedTime}</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              {slug === 'mimamsa' ? (
                <motion.button
                  onClick={() => setShowLoreTab(!showLoreTab)}
                  className={`bg-gradient-to-r ${darshana.color} text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 mx-auto group hover:shadow-xl transition-all duration-300`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-5 h-5" />
                  {showLoreTab ? 'Hide Quest System' : 'Start Mimamsa Quest'}
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </motion.button>
              ) : (
                <motion.button
                  className={`bg-gradient-to-r ${darshana.color} text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 mx-auto group hover:shadow-xl transition-all duration-300`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-5 h-5" />
                  Start Quest (Coming Soon)
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </motion.button>
              )}

              <Link href={darshana.courseLinks.free}>
                <motion.button
                  className="border-2 border-white/30 text-text-light dark:text-text-dark px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 mx-auto hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <BookOpen className="w-5 h-5" />
                  Related Courses
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

                {/* Description Section */}
      <section className="py-20 px-4 bg-background-light dark:bg-background-dark">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl font-serif font-bold mb-8 text-gray-900 dark:text-white">
              About This Philosophy
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {darshana.description}
            </p>
          </motion.div>

          {/* Progress Path */}
          <motion.div
            className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 mb-12 shadow-xl"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h3 className="text-2xl font-serif font-bold mb-6 text-center text-gray-900 dark:text-white">
              Your Journey Path
            </h3>
            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
              <p className="text-center text-lg font-semibold text-gray-900 dark:text-white leading-relaxed">
                {darshana.gamificationElements.progressPath}
              </p>
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <h3 className="text-2xl font-serif font-bold mb-8 text-center text-gray-900 dark:text-white">
              Achievements to Unlock
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {darshana.gamificationElements.achievements.map((achievement, index) => (
                <motion.div
                  key={achievement}
                  className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 text-center hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br ${darshana.color} flex items-center justify-center shadow-lg`}>
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">{achievement}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quest System Section - Only for Mimamsa */}
      {slug === 'mimamsa' && showLoreTab && (
        <section className="py-20 px-4 bg-gradient-to-br from-orange-500/5 to-red-600/5 dark:from-orange-500/10 dark:to-red-600/10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-4xl font-serif font-bold mb-8 text-gray-900 dark:text-white">
                Mīmāṃsā Quest System
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
                Embark on a sacred journey through 12 immersive quests. Master the art of ritual interpretation, 
                unlock ancient wisdom, and become a true interpreter of sacred texts.
              </p>
            </motion.div>

            {/* Quest Overview */}
            <motion.div
              className="grid lg:grid-cols-3 gap-8 mb-16"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              {/* XP Tracker */}
              <div className="lg:col-span-1">
                <XPTracker 
                  userProgress={userProgress}
                />
              </div>

              {/* Progression Path */}
              <div className="lg:col-span-2">
                <ProgressionPath 
                  userProgress={userProgress}
                />
              </div>
            </motion.div>

            {/* Quest Board */}
            <motion.div
              className="mb-16"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <QuestBoard 
                userProgress={userProgress}
                onStartQuest={handleStartQuest}
              />
            </motion.div>

            {/* Badge System */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <BadgeSystem 
                userProgress={userProgress}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Coming Soon Notice - Only for non-Mimamsa darshanas */}
      {slug !== 'mimamsa' && (
        <section className="py-20 px-4 bg-gradient-to-br from-primary-light/5 to-secondary-light/5 dark:from-primary-dark/5 dark:to-secondary-dark/5">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-3xl p-12 border border-gray-200/50 dark:border-gray-700/50 shadow-xl text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-serif font-bold mb-6 text-gray-900 dark:text-white">
                Quest System Coming Soon
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
                We're currently developing an immersive quest system for each darshana. 
                You'll be able to progress through interactive lessons, earn XP, unlock achievements, 
                and master ancient wisdom through gamified learning.
              </p>
              <Link href="/courses/free-masterclass">
                <motion.button
                  className="bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark text-white px-10 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 mx-auto hover:shadow-lg hover:shadow-black/25 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <BookOpen className="w-5 h-5" />
                  Start with Free Masterclass
                  <Sparkles className="w-5 h-5" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Quest Modal - Only for Mimamsa */}
      {slug === 'mimamsa' && (
        <QuestModal
          questId={activeQuestId}
          isOpen={isQuestModalOpen}
          onClose={() => {
            setIsQuestModalOpen(false)
            setActiveQuestId(null)
          }}
          onComplete={handleCompleteQuest}
        />
      )}
    </main>
  )
}
