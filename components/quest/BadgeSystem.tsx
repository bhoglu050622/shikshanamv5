'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Award, 
  Star, 
  Flame,
  Volume2,
  ArrowRight,
  Brain,
  CheckCircle,
  Lock,
  Sparkles,
  Trophy,
  Crown,
  Zap
} from 'lucide-react'
import questData from '@/data/mimamsa-quests.json'

interface Badge {
  id: string
  title: string
  description: string
  icon: string
  questRequired: number
  xpReward: number
}

interface BadgeSystemProps {
  userProgress?: {
    completedQuests: number[]
    currentXP: number
    unlockedBadges: string[]
  }
  onBadgeUnlock?: (badge: Badge) => void
}

const iconMap = {
  Flame,
  Volume2,
  ArrowRight,
  Brain,
  Award,
  Star,
  Trophy,
  Crown,
  Zap
}

export default function BadgeSystem({ userProgress, onBadgeUnlock }: BadgeSystemProps) {
  const [badges, setBadges] = useState<Badge[]>([])
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<Badge[]>([])
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    setBadges(questData.badges as Badge[])
  }, [])

  useEffect(() => {
    if (!userProgress) return

    // Check for newly unlocked badges
    const maxCompletedQuest = Math.max(...userProgress.completedQuests, 0)
    const eligibleBadges = badges.filter(badge => 
      badge.questRequired <= maxCompletedQuest &&
      !userProgress.unlockedBadges.includes(badge.id)
    )

    if (eligibleBadges.length > 0) {
      setNewlyUnlockedBadges(eligibleBadges)
      setShowCelebration(true)
      
      // Call the unlock callback for each badge
      eligibleBadges.forEach(badge => {
        onBadgeUnlock?.(badge)
      })

      // Auto-hide celebration after 3 seconds
      setTimeout(() => {
        setShowCelebration(false)
        setNewlyUnlockedBadges([])
      }, 3000)
    }
  }, [userProgress, badges, onBadgeUnlock])

  const getBadgeStatus = (badge: Badge) => {
    if (!userProgress) return 'locked'
    
    if (userProgress.unlockedBadges.includes(badge.id)) return 'unlocked'
    
    const maxCompletedQuest = Math.max(...userProgress.completedQuests, 0)
    return maxCompletedQuest >= badge.questRequired ? 'available' : 'locked'
  }

  const getProgressTowardsBadge = (badge: Badge) => {
    if (!userProgress) return 0
    const maxCompletedQuest = Math.max(...userProgress.completedQuests, 0)
    return Math.min(100, (maxCompletedQuest / badge.questRequired) * 100)
  }

  return (
    <>
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-serif font-bold text-text-light dark:text-text-dark">
            Sacred Achievements
          </h3>
          <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
            <Trophy className="w-5 h-5" />
            <span className="font-semibold">
              {userProgress?.unlockedBadges.length || 0}/{badges.length}
            </span>
          </div>
        </div>

        {/* Badge Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {badges.map((badge, index) => {
            const status = getBadgeStatus(badge)
            const progress = getProgressTowardsBadge(badge)
            const IconComponent = iconMap[badge.icon as keyof typeof iconMap]
            
            return (
              <motion.div
                key={badge.id}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-500 ${
                  status === 'unlocked' 
                    ? 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-300 dark:border-emerald-700 shadow-emerald-500/10 shadow-xl'
                    : status === 'available'
                    ? 'bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-300 dark:border-orange-700 shadow-orange-500/10 shadow-lg'
                    : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 shadow-lg'
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ scale: status !== 'locked' ? 1.02 : 1 }}
              >
                {/* Badge Icon */}
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg relative ${
                  status === 'unlocked' 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600'
                    : status === 'available'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600'
                    : 'bg-gray-400'
                }`}>
                  {IconComponent && (
                    <IconComponent className={`w-8 h-8 text-white ${status === 'locked' ? 'opacity-50' : ''}`} />
                  )}
                  
                  {/* Status Indicator */}
                  <div className="absolute -top-1 -right-1">
                    {status === 'unlocked' ? (
                      <motion.div
                        className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.5 }}
                      >
                        <CheckCircle className="w-4 h-4 text-white" />
                      </motion.div>
                    ) : status === 'available' ? (
                      <motion.div
                        className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [1, 0.7, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles className="w-4 h-4 text-white" />
                      </motion.div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Badge Details */}
                <div className="text-center">
                  <h4 className={`text-lg font-serif font-bold mb-2 ${
                    status === 'locked' ? 'text-gray-500 dark:text-gray-400' : 'text-text-light dark:text-text-dark'
                  }`}>
                    {badge.title}
                  </h4>
                  <p className={`text-sm leading-relaxed mb-4 ${
                    status === 'locked' ? 'text-gray-400 dark:text-gray-500' : 'text-text-secondary-light dark:text-text-secondary-dark'
                  }`}>
                    {badge.description}
                  </p>

                  {/* Progress or Completion Info */}
                  {status === 'unlocked' ? (
                    <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <Award className="w-4 h-4" />
                      <span className="text-sm font-semibold">+{badge.xpReward} XP Earned</span>
                    </div>
                  ) : status === 'available' ? (
                    <motion.button
                      className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white py-2 px-4 rounded-lg font-semibold text-sm hover:shadow-lg transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Star className="w-4 h-4" />
                        Claim Badge
                      </span>
                    </motion.button>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Complete quest {badge.questRequired} to unlock
                      </p>
                    </div>
                  )}
                </div>

                {/* Shimmer Effect for Available Badges */}
                {status === 'available' && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: ['-100%', '100%']
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  />
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Summary Stats */}
        <motion.div
          className="mt-8 grid grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="text-center p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {userProgress?.unlockedBadges.length || 0}
            </div>
            <div className="text-xs text-emerald-700 dark:text-emerald-300">Earned</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {badges.filter(badge => getBadgeStatus(badge) === 'available').length}
            </div>
            <div className="text-xs text-orange-700 dark:text-orange-300">Available</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
              {badges.filter(badge => getBadgeStatus(badge) === 'locked').length}
            </div>
            <div className="text-xs text-gray-700 dark:text-gray-300">Locked</div>
          </div>
        </motion.div>
      </div>

      {/* Badge Unlock Celebration */}
      <AnimatePresence>
        {showCelebration && newlyUnlockedBadges.length > 0 && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-emerald-200 dark:border-emerald-800"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <div className="text-center">
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 1 }}
                >
                  <Trophy className="w-10 h-10 text-white" />
                </motion.div>
                
                <h3 className="text-2xl font-serif font-bold mb-4 text-emerald-600 dark:text-emerald-400">
                  Achievement Unlocked!
                </h3>
                
                {newlyUnlockedBadges.map((badge) => {
                  const IconComponent = iconMap[badge.icon as keyof typeof iconMap]
                  return (
                    <motion.div
                      key={badge.id}
                      className="mb-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800"
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center">
                          {IconComponent && <IconComponent className="w-6 h-6 text-white" />}
                        </div>
                        <div className="text-left">
                          <h4 className="font-bold text-emerald-700 dark:text-emerald-300">{badge.title}</h4>
                          <p className="text-sm text-emerald-600 dark:text-emerald-400">{badge.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
                
                <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 mb-6">
                  <Award className="w-5 h-5" />
                  <span className="font-semibold">
                    +{newlyUnlockedBadges.reduce((sum, badge) => sum + badge.xpReward, 0)} XP Bonus!
                  </span>
                </div>

                <motion.button
                  onClick={() => {
                    setShowCelebration(false)
                    setNewlyUnlockedBadges([])
                  }}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Continue Journey
                </motion.button>
              </div>

              {/* Celebration Particles */}
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-emerald-400 rounded-full"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                  }}
                  animate={{
                    y: [0, -50, 0],
                    opacity: [1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
