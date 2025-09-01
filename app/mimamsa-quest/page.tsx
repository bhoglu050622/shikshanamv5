'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowDown,
  Play,
  BookOpen,
  Flame,
  Award,
  Clock,
  Target,
  Star,
  Sparkles,
  Users,
  Calendar,
  Volume2,
  Scroll,
  ChevronDown
} from 'lucide-react'
import Link from 'next/link'
import QuestBoard from '@/components/quest/QuestBoard'
import ProgressionPath from '@/components/quest/ProgressionPath'
import XPTracker from '@/components/quest/XPTracker'
import QuestModal from '@/components/quest/QuestModal'
import BadgeSystem from '@/components/quest/BadgeSystem'
import questData from '@/data/mimamsa-quests.json'

interface UserProgress {
  completedQuests: number[]
  currentXP: number
  totalSessionTime: number
  streak: number
  lastActiveDate: string
  unlockedBadges: string[]
}

export default function MimamsaQuestPage() {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedQuests: [],
    currentXP: 0,
    totalSessionTime: 0,
    streak: 0,
    lastActiveDate: new Date().toISOString(),
    unlockedBadges: []
  })
  
  const [activeQuestId, setActiveQuestId] = useState<number | null>(null)
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false)
  const [showLoreTab, setShowLoreTab] = useState(false)

  // Load user progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('mimamsa-quest-progress')
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress))
    }
  }, [])

  // Save progress to localStorage
  const saveProgress = (progress: UserProgress) => {
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

  const scrollToQuestBoard = () => {
    document.getElementById('quest-board')?.scrollIntoView({ 
      behavior: 'smooth' 
    })
  }

  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-orange-500/10 via-red-600/10 to-amber-500/10 dark:from-orange-900/20 dark:via-red-900/20 dark:to-amber-900/20">
        {/* Background Effects */}
        <div className="absolute inset-0">
          {/* Sacred Fire Pattern */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 opacity-10">
            <motion.div
              className="absolute inset-0 border border-orange-500/30 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-8 border border-red-500/20 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Floating Ritual Elements */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-orange-500/30 dark:bg-orange-400/30 rounded-full"
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500/20 to-red-600/20 rounded-full border border-orange-300/30 dark:border-orange-700/30 mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <span className="text-orange-700 dark:text-orange-300 font-medium">Sacred Ritual Mastery</span>
            <Star className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </motion.div>

          {/* Main Title */}
          <motion.h1
            className="text-6xl md:text-8xl font-serif font-bold mb-6 text-primary-light dark:text-primary-dark"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Mīmāṃsā Quest
          </motion.h1>

          {/* Sanskrit */}
          <motion.p
            className="text-3xl md:text-4xl font-sanskrit text-orange-600 dark:text-orange-400 mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            मीमांसा
          </motion.p>

          {/* Subtitle */}
          <motion.p
            className="text-2xl md:text-3xl font-bold text-orange-700 dark:text-orange-300 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            The Science of Sacred Rituals
          </motion.p>

          {/* Description */}
          <motion.p
            className="text-xl md:text-2xl text-text-secondary-light dark:text-text-secondary-dark mb-8 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Interpret the sacred. Perform with precision. Rise through the ritual ranks.
          </motion.p>

          {/* Quest Stats */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            <div className="flex items-center gap-2 bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Award className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="text-text-light dark:text-text-dark font-medium">Earn up to 150 XP</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Target className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="text-text-light dark:text-text-dark font-medium">12 Sacred Quests</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="text-text-light dark:text-text-dark font-medium">3-4 weeks to master</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <motion.button
              onClick={scrollToQuestBoard}
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-10 py-4 rounded-full font-semibold text-lg flex items-center gap-3 mx-auto group hover:shadow-xl hover:shadow-orange-500/25 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-5 h-5" />
              Begin Quest
              <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </motion.button>

            <Link href={questData.courseLinks.free.url}>
              <motion.button
                className="border-2 border-orange-500/50 dark:border-orange-400/50 text-orange-700 dark:text-orange-300 px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 mx-auto hover:bg-orange-500/10 dark:hover:bg-orange-400/10 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BookOpen className="w-5 h-5" />
                Free Course
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-orange-500/50 rounded-full p-1">
            <motion.div
              className="w-1 h-3 bg-orange-500 rounded-full mx-auto"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Quest Board Section */}
      <div id="quest-board">
        <QuestBoard 
          onStartQuest={handleStartQuest}
          userProgress={userProgress}
        />
      </div>

      {/* Main Content Grid */}
      <section className="py-20 px-4 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Progression & XP */}
            <div className="lg:col-span-2 space-y-8">
              <ProgressionPath userProgress={userProgress} />
            </div>

            {/* Right Column - XP Tracker & Lore */}
            <div className="space-y-8">
              <XPTracker userProgress={userProgress} />
              <BadgeSystem 
                userProgress={userProgress}
                onBadgeUnlock={(badge) => {
                  // Update user progress with new badge
                  const newProgress = {
                    ...userProgress,
                    unlockedBadges: [...userProgress.unlockedBadges, badge.id],
                    currentXP: userProgress.currentXP + badge.xpReward
                  }
                  saveProgress(newProgress)
                }}
              />
              
              {/* Ritual Scroll - Lore Section */}
              <motion.div
                className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-3xl border border-amber-200 dark:border-amber-800 overflow-hidden shadow-xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <div className="p-6">
                  <button
                    onClick={() => setShowLoreTab(!showLoreTab)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center">
                        <Scroll className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-serif font-bold text-amber-700 dark:text-amber-300">
                        Sacred Scrolls
                      </h3>
                    </div>
                    <motion.div
                      animate={{ rotate: showLoreTab ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </motion.div>
                  </button>

                  <motion.div
                    initial={false}
                    animate={{ height: showLoreTab ? 'auto' : 0, opacity: showLoreTab ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6 space-y-4">
                      {questData.loreResources.map((resource, index) => (
                        <div key={index} className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-amber-200/50 dark:border-amber-700/50">
                          <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-2">
                            {resource.title}
                          </h4>
                          <p className="text-sm text-amber-600 dark:text-amber-400 mb-3">
                            {resource.content}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300">
                            {resource.type === 'audio_resource' && <Volume2 className="w-3 h-3" />}
                            {resource.type === 'mantra_collection' && <Star className="w-3 h-3" />}
                            {resource.type === 'technical_guide' && <BookOpen className="w-3 h-3" />}
                            <span className="capitalize">{resource.type.replace('_', ' ')}</span>
                          </div>
                        </div>
                      ))}

                      {/* Course Links */}
                      <div className="pt-4 border-t border-amber-200 dark:border-amber-700 space-y-3">
                        <h4 className="font-semibold text-amber-700 dark:text-amber-300 text-sm">
                          Deepen Your Learning:
                        </h4>
                        {Object.entries(questData.courseLinks).map(([key, course]) => (
                          <Link key={key} href={course.url}>
                            <motion.div
                              className="flex items-center gap-3 p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-amber-200/50 dark:border-amber-700/50 hover:bg-white dark:hover:bg-gray-800 transition-all cursor-pointer"
                              whileHover={{ scale: 1.02 }}
                            >
                              <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                              <div>
                                <p className="font-medium text-amber-700 dark:text-amber-300 text-sm">
                                  {course.title}
                                </p>
                                <p className="text-xs text-amber-600 dark:text-amber-400">
                                  {course.description}
                                </p>
                              </div>
                            </motion.div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Quest Modal */}
      <QuestModal
        questId={activeQuestId}
        isOpen={isQuestModalOpen}
        onClose={() => {
          setIsQuestModalOpen(false)
          setActiveQuestId(null)
        }}
        onComplete={handleCompleteQuest}
      />
    </main>
  )
}
