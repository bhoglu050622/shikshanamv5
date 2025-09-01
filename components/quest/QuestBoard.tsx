'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import QuestCard from './QuestCard'
import questData from '@/data/mimamsa-quests.json'

interface Quest {
  id: number
  title: string
  sanskrit: string
  description: string
  xpReward: number
  type: string
  difficulty: string
  estimatedTime: string
  status: 'locked' | 'unlocked' | 'completed'
  gameplayElements: {
    type: string
    description: string
  }
}

interface QuestBoardProps {
  onStartQuest: (questId: number) => void
  userProgress?: {
    completedQuests: number[]
    currentXP: number
  }
}

export default function QuestBoard({ onStartQuest, userProgress }: QuestBoardProps) {
  const [quests, setQuests] = useState<Quest[]>([])
  const [filter, setFilter] = useState<'all' | 'available' | 'completed'>('all')

  useEffect(() => {
    // Load quests from data
    setQuests(questData.quests as Quest[])
  }, [])

  const filteredQuests = quests.filter(quest => {
    const isCompleted = userProgress?.completedQuests.includes(quest.id) ?? false
    const isUnlocked = quest.id === 1 || (userProgress?.completedQuests.includes(quest.id - 1) ?? false)
    
    switch (filter) {
      case 'available':
        return isUnlocked && !isCompleted
      case 'completed':
        return isCompleted
      default:
        return true
    }
  })

  const questStats = {
    total: quests.length,
    completed: userProgress?.completedQuests.length ?? 0,
    available: quests.filter((_, index) => 
      index === 0 || (userProgress?.completedQuests.includes(index) ?? false)
    ).length - (userProgress?.completedQuests.length ?? 0)
  }

  return (
    <section className="py-20 px-4 bg-background-alt-light dark:bg-background-alt-dark">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-primary-light dark:text-primary-dark">
            Sacred Quest Board
          </h2>
          <p className="text-xl text-text-secondary-light dark:text-text-secondary-dark max-w-3xl mx-auto mb-8">
            Embark on your journey through the ancient art of Vedic ritual interpretation. 
            Master each quest to unlock deeper wisdom and advance your spiritual understanding.
          </p>

          {/* Quest Statistics */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
              <div className="text-2xl font-bold text-primary-light dark:text-primary-dark">
                {questStats.completed}
              </div>
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Completed
              </div>
            </div>
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {questStats.available}
              </div>
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Available
              </div>
            </div>
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
              <div className="text-2xl font-bold text-text-light dark:text-text-dark">
                {questStats.total}
              </div>
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Total Quests
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { key: 'all', label: 'All Quests', count: questStats.total },
              { key: 'available', label: 'Available', count: questStats.available },
              { key: 'completed', label: 'Completed', count: questStats.completed }
            ].map(({ key, label, count }) => (
              <motion.button
                key={key}
                onClick={() => setFilter(key as typeof filter)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 border-2 ${
                  filter === key
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white border-orange-500 shadow-lg'
                    : 'bg-white/80 dark:bg-gray-900/80 text-text-light dark:text-text-dark border-gray-300 dark:border-gray-600 hover:border-orange-400 dark:hover:border-orange-500'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {label} ({count})
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Quest Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredQuests.map((quest, index) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              index={index}
              onStartQuest={onStartQuest}
              userProgress={userProgress}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredQuests.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-orange-500/20 to-red-600/20 flex items-center justify-center">
              <motion.div
                className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-4 text-text-light dark:text-text-dark">
              No Quests Found
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark max-w-md mx-auto">
              {filter === 'available' 
                ? "Complete more quests to unlock new challenges!" 
                : filter === 'completed'
                ? "You haven't completed any quests yet. Start your journey now!"
                : "Loading your spiritual journey..."}
            </p>
          </motion.div>
        )}

        {/* Progress Indicator */}
        {questStats.total > 0 && (
          <motion.div
            className="mt-16 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
              <h3 className="text-xl font-serif font-bold mb-6 text-center text-text-light dark:text-text-dark">
                Your Progress Through Mīmāṃsā
              </h3>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2">
                  <span>Quest Progress</span>
                  <span>{questStats.completed} / {questStats.total}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(questStats.completed / questStats.total) * 100}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* XP Progress */}
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                  {userProgress?.currentXP ?? 0} XP
                </div>
                <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Total Experience Earned
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
