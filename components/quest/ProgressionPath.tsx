'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Flame, 
  BookOpen, 
  Award, 
  Eye, 
  Star,
  CheckCircle,
  Lock,
  Crown,
  Sparkles
} from 'lucide-react'
import questData from '@/data/mimamsa-quests.json'

interface ProgressionRank {
  rank: string
  questRange: [number, number]
  title: string
  description: string
  icon: string
  color: string
}

interface ProgressionPathProps {
  userProgress?: {
    completedQuests: number[]
    currentXP: number
  }
}

const iconMap = {
  Flame,
  BookOpen,
  Award,
  Eye,
  Crown
}

export default function ProgressionPath({ userProgress }: ProgressionPathProps) {
  const [currentRank, setCurrentRank] = useState<ProgressionRank | null>(null)
  const [nextRank, setNextRank] = useState<ProgressionRank | null>(null)
  const progressionRanks = questData.progressionPath as ProgressionRank[]

  useEffect(() => {
    const completedCount = userProgress?.completedQuests.length || 0
    
    // Find current rank based on completed quests
    let current = null
    let next = null
    
    for (let i = 0; i < progressionRanks.length; i++) {
      const rank = progressionRanks[i]
      if (completedCount >= rank.questRange[0] - 1 && completedCount <= rank.questRange[1] - 1) {
        current = rank
        next = progressionRanks[i + 1] || null
        break
      } else if (completedCount < rank.questRange[0] - 1) {
        next = rank
        break
      }
    }
    
    // If completed all quests, set to highest rank
    if (completedCount >= 12) {
      current = progressionRanks[progressionRanks.length - 1]
      next = null
    }
    
    setCurrentRank(current)
    setNextRank(next)
  }, [userProgress, progressionRanks])

  const calculateProgress = () => {
    if (!currentRank) return 0
    const completedCount = userProgress?.completedQuests.length || 0
    const rankStart = currentRank.questRange[0] - 1
    const rankEnd = currentRank.questRange[1] - 1
    const progressInRank = Math.max(0, completedCount - rankStart)
    const totalInRank = rankEnd - rankStart + 1
    return Math.min(100, (progressInRank / totalInRank) * 100)
  }

  const getRankStatus = (rank: ProgressionRank) => {
    const completedCount = userProgress?.completedQuests.length || 0
    if (completedCount >= rank.questRange[1]) return 'completed'
    if (completedCount >= rank.questRange[0] - 1) return 'current'
    return 'locked'
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-600/20 rounded-full border border-orange-300 dark:border-orange-700 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Crown className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span className="text-orange-700 dark:text-orange-300 font-medium">Spiritual Progression</span>
            <Star className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-primary-light dark:text-primary-dark">
            Your Sacred Journey
          </h2>
          <p className="text-xl text-text-secondary-light dark:text-text-secondary-dark max-w-3xl mx-auto">
            Progress through the ranks of Mīmāṃsā mastery. Each stage brings deeper understanding 
            of sacred rituals and cosmic harmony.
          </p>
        </motion.div>

        {/* Current Rank Status */}
        {currentRank && (
          <motion.div
            className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="text-center md:text-left">
                <div className={`w-20 h-20 mx-auto md:mx-0 mb-4 rounded-full bg-gradient-to-r ${currentRank.color} flex items-center justify-center shadow-2xl`}>
                  {iconMap[currentRank.icon as keyof typeof iconMap] && 
                    React.createElement(iconMap[currentRank.icon as keyof typeof iconMap], { 
                      className: "w-10 h-10 text-white" 
                    })
                  }
                </div>
                <h3 className="text-2xl font-serif font-bold mb-2 text-text-light dark:text-text-dark">
                  {currentRank.title}
                </h3>
                <p className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-2">
                  {currentRank.rank}
                </p>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  {currentRank.description}
                </p>
              </div>
              
              <div className="flex-1 w-full">
                <div className="flex justify-between text-sm text-text-secondary-light dark:text-text-secondary-dark mb-3">
                  <span>Rank Progress</span>
                  <span>
                    {userProgress?.completedQuests.length || 0} / {currentRank.questRange[1]} quests
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${currentRank.color} rounded-full`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${calculateProgress()}%` }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                  />
                </div>
                
                {nextRank && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      Next: <span className="font-semibold text-orange-600 dark:text-orange-400">{nextRank.title}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Progression Path Visual */}
        <div className="space-y-8">
          {progressionRanks.map((rank, index) => {
            const status = getRankStatus(rank)
            const IconComponent = iconMap[rank.icon as keyof typeof iconMap]
            
            return (
              <motion.div
                key={rank.rank}
                className="relative"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <div className={`flex items-center gap-8 ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}>
                  {/* Rank Card */}
                  <div className={`flex-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl p-6 border-2 transition-all duration-500 ${
                    status === 'completed' 
                      ? 'border-emerald-300 dark:border-emerald-700 shadow-emerald-500/10 shadow-xl' 
                      : status === 'current'
                      ? 'border-orange-300 dark:border-orange-700 shadow-orange-500/10 shadow-xl'
                      : 'border-gray-200 dark:border-gray-700 shadow-lg'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${rank.color} flex items-center justify-center shadow-lg relative ${
                        status === 'locked' ? 'opacity-50' : ''
                      }`}>
                        {IconComponent && <IconComponent className="w-8 h-8 text-white" />}
                        
                        {/* Status Indicator */}
                        <div className="absolute -top-2 -right-2">
                          {status === 'completed' ? (
                            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          ) : status === 'current' ? (
                            <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                              <Sparkles className="w-4 h-4 text-white" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center">
                              <Lock className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className={`text-xl font-serif font-bold mb-1 ${
                          status === 'locked' ? 'text-gray-500 dark:text-gray-400' : 'text-text-light dark:text-text-dark'
                        }`}>
                          {rank.title}
                        </h3>
                        <p className={`text-sm font-semibold mb-2 ${
                          status === 'completed' ? 'text-emerald-600 dark:text-emerald-400' :
                          status === 'current' ? 'text-orange-600 dark:text-orange-400' :
                          'text-gray-500 dark:text-gray-400'
                        }`}>
                          {rank.rank}
                        </p>
                        <p className={`text-sm leading-relaxed ${
                          status === 'locked' ? 'text-gray-400 dark:text-gray-500' : 'text-text-secondary-light dark:text-text-secondary-dark'
                        }`}>
                          {rank.description}
                        </p>
                        <div className="mt-3 flex items-center gap-4 text-xs text-text-secondary-light dark:text-text-secondary-dark">
                          <span>Quests {rank.questRange[0]} - {rank.questRange[1]}</span>
                          {status === 'completed' && (
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ Mastered</span>
                          )}
                          {status === 'current' && (
                            <span className="text-orange-600 dark:text-orange-400 font-semibold">● In Progress</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Line */}
                  {index < progressionRanks.length - 1 && (
                    <div className={`w-px h-20 bg-gradient-to-b ${
                      status === 'completed' 
                        ? 'from-emerald-300 to-emerald-500' 
                        : status === 'current'
                        ? 'from-orange-300 to-orange-500'
                        : 'from-gray-300 to-gray-400'
                    } hidden md:block`} />
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Achievement Summary */}
        <motion.div
          className="mt-16 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-3xl p-8 border border-amber-200 dark:border-amber-800"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h3 className="text-2xl font-serif font-bold mb-6 text-center text-amber-700 dark:text-amber-300">
            Path to Sacred Interpreter
          </h3>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            {progressionRanks.map((rank, index) => {
              const status = getRankStatus(rank)
              return (
                <div key={rank.rank} className="relative">
                  <div className={`w-4 h-4 mx-auto mb-2 rounded-full ${
                    status === 'completed' ? 'bg-emerald-500' :
                    status === 'current' ? 'bg-orange-500' :
                    'bg-gray-300'
                  }`} />
                  <p className={`text-sm font-semibold ${
                    status === 'completed' ? 'text-emerald-600 dark:text-emerald-400' :
                    status === 'current' ? 'text-orange-600 dark:text-orange-400' :
                    'text-gray-500 dark:text-gray-400'
                  }`}>
                    {rank.title}
                  </p>
                  
                  {/* Connection Line */}
                  {index < progressionRanks.length - 1 && (
                    <div className={`absolute top-2 left-1/2 w-full h-px ${
                      status === 'completed' ? 'bg-emerald-300' : 'bg-gray-300'
                    } hidden md:block`} />
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Add React import for createElement
import React from 'react'
