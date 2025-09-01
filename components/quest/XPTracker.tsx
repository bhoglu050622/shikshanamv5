'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Award, 
  Star, 
  Flame,
  Trophy,
  Target,
  Zap,
  Sparkles,
  TrendingUp,
  Calendar,
  Clock
} from 'lucide-react'
import questData from '@/data/mimamsa-quests.json'

interface XPTrackerProps {
  userProgress?: {
    completedQuests: number[]
    currentXP: number
    totalSessionTime?: number
    streak?: number
    lastActiveDate?: string
  }
}

interface LevelInfo {
  level: number
  title: string
  xpRequired: number
  rewards: string[]
}

const levels: LevelInfo[] = [
  { level: 1, title: "Sacred Seeker", xpRequired: 0, rewards: ["Quest access unlocked"] },
  { level: 2, title: "Ritual Novice", xpRequired: 50, rewards: ["Beginner mantras collection"] },
  { level: 3, title: "Fire Keeper", xpRequired: 120, rewards: ["Sacred geometry guide"] },
  { level: 4, title: "Mantra Master", xpRequired: 200, rewards: ["Advanced pronunciation guide"] },
  { level: 5, title: "Sacred Interpreter", xpRequired: 300, rewards: ["Complete Mīmāṃsā mastery badge"] }
]

export default function XPTracker({ userProgress }: XPTrackerProps) {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [nextLevel, setNextLevel] = useState<LevelInfo | null>(null)
  const [progressToNext, setProgressToNext] = useState(0)
  const [animatedXP, setAnimatedXP] = useState(0)

  const currentXP = userProgress?.currentXP || 0
  const completedQuests = userProgress?.completedQuests || []
  const streak = userProgress?.streak || 0

  useEffect(() => {
    // Calculate current level
    let level = 1
    for (let i = levels.length - 1; i >= 0; i--) {
      if (currentXP >= levels[i].xpRequired) {
        level = levels[i].level
        break
      }
    }
    
    setCurrentLevel(level)
    
    // Find next level
    const next = levels.find(l => l.level > level)
    setNextLevel(next || null)
    
    // Calculate progress to next level
    if (next) {
      const currentLevelInfo = levels.find(l => l.level === level)
      const currentLevelXP = currentLevelInfo?.xpRequired || 0
      const nextLevelXP = next.xpRequired
      const progress = ((currentXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
      setProgressToNext(Math.min(100, Math.max(0, progress)))
    } else {
      setProgressToNext(100) // Max level reached
    }

    // Animate XP counter
    const timer = setTimeout(() => {
      setAnimatedXP(currentXP)
    }, 500)

    return () => clearTimeout(timer)
  }, [currentXP])

  const getCurrentLevelInfo = () => {
    return levels.find(l => l.level === currentLevel) || levels[0]
  }

  const getXPFromQuests = () => {
    return completedQuests.reduce((total, questId) => {
      const quest = questData.quests.find(q => q.id === questId)
      return total + (quest?.xpReward || 0)
    }, 0)
  }

  const getTotalPossibleXP = () => {
    return questData.quests.reduce((total, quest) => total + quest.xpReward, 0)
  }

  const currentLevelInfo = getCurrentLevelInfo()

  return (
    <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-serif font-bold text-text-light dark:text-text-dark">
          Spiritual Progress
        </h3>
        <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
          <Trophy className="w-5 h-5" />
          <span className="font-semibold">Level {currentLevel}</span>
        </div>
      </div>

      {/* Current Level Status */}
      <motion.div
        className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 mb-8 border border-orange-200 dark:border-orange-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
            <Award className="w-8 h-8 text-white" />
          </div>
          <div>
            <h4 className="text-xl font-serif font-bold text-orange-700 dark:text-orange-300">
              {currentLevelInfo.title}
            </h4>
            <p className="text-sm text-orange-600 dark:text-orange-400">
              Current Rank in Mīmāṃsā Mastery
            </p>
          </div>
        </div>

        {/* XP Display */}
        <div className="text-center mb-6">
          <motion.div
            className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {animatedXP}
            </motion.span>
            <span className="text-lg text-gray-600 dark:text-gray-400 ml-2">XP</span>
          </motion.div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {getXPFromQuests()} from quests • {getTotalPossibleXP()} total available
          </p>
        </div>

        {/* Progress to Next Level */}
        {nextLevel && (
          <div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Progress to {nextLevel.title}</span>
              <span>{Math.round(progressToNext)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              {nextLevel.xpRequired - currentXP} XP needed for next level
            </p>
          </div>
        )}
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <motion.div
          className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-emerald-500 flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {completedQuests.length}
          </div>
          <div className="text-xs text-emerald-700 dark:text-emerald-300">
            Quests Completed
          </div>
        </motion.div>

        <motion.div
          className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-blue-500 flex items-center justify-center">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {streak}
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300">
            Day Streak
          </div>
        </motion.div>
      </div>

      {/* Recent Achievements */}
      <motion.div
        className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <h5 className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-3 flex items-center gap-2">
          <Star className="w-4 h-4" />
          Recent Achievements
        </h5>
        
        {completedQuests.length > 0 ? (
          <div className="space-y-2">
            {completedQuests.slice(-3).map((questId, index) => {
              const quest = questData.quests.find(q => q.id === questId)
              return quest ? (
                <motion.div
                  key={questId}
                  className="flex items-center gap-3 text-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                >
                  <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-purple-700 dark:text-purple-300">
                    Completed "{quest.title}"
                  </span>
                  <span className="text-purple-600 dark:text-purple-400 font-semibold ml-auto">
                    +{quest.xpReward}
                  </span>
                </motion.div>
              ) : null
            })}
          </div>
        ) : (
          <div className="text-center py-4">
            <Zap className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <p className="text-sm text-purple-600 dark:text-purple-400">
              Complete quests to unlock achievements!
            </p>
          </div>
        )}
      </motion.div>

      {/* Level Rewards Preview */}
      {nextLevel && (
        <motion.div
          className="mt-6 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h5 className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Next Level Rewards
          </h5>
          <div className="space-y-2">
            {nextLevel.rewards.map((reward, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                <Star className="w-3 h-3" />
                <span>{reward}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Max Level Achieved */}
      {!nextLevel && currentXP > 0 && (
        <motion.div
          className="mt-6 bg-gradient-to-r from-gold/10 to-amber-500/10 rounded-xl p-4 border border-amber-300 dark:border-amber-700 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Crown className="w-8 h-8 mx-auto mb-2 text-amber-600 dark:text-amber-400" />
          <h5 className="text-lg font-serif font-bold text-amber-700 dark:text-amber-300 mb-1">
            Mastery Achieved!
          </h5>
          <p className="text-sm text-amber-600 dark:text-amber-400">
            You have reached the highest level of Mīmāṃsā understanding
          </p>
        </motion.div>
      )}
    </div>
  )
}

// Add missing import
import { Crown } from 'lucide-react'
