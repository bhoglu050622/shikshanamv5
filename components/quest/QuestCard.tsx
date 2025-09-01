'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Lock, 
  Play, 
  CheckCircle, 
  Clock, 
  Award, 
  Flame,
  Brain,
  BookOpen,
  Eye,
  Volume2,
  ArrowRight,
  Sparkles,
  Star
} from 'lucide-react'

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

interface QuestCardProps {
  quest: Quest
  index: number
  onStartQuest: (questId: number) => void
  userProgress?: {
    completedQuests: number[]
    currentXP: number
  }
}

const iconMap = {
  Flame,
  Brain,
  BookOpen,
  Eye,
  Volume2,
  ArrowRight
}

const difficultyColors = {
  beginner: 'from-green-500 to-emerald-600',
  intermediate: 'from-orange-500 to-amber-600', 
  advanced: 'from-red-500 to-rose-600',
  master: 'from-purple-500 to-indigo-600'
}

const statusConfig = {
  locked: {
    icon: Lock,
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    textColor: 'text-gray-500 dark:text-gray-400',
    borderColor: 'border-gray-200 dark:border-gray-700',
    buttonText: 'Locked',
    buttonDisabled: true
  },
  unlocked: {
    icon: Play,
    bgColor: 'bg-white dark:bg-gray-900',
    textColor: 'text-gray-900 dark:text-white',
    borderColor: 'border-orange-200 dark:border-orange-800',
    buttonText: 'Start Quest',
    buttonDisabled: false
  },
  completed: {
    icon: CheckCircle,
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    textColor: 'text-gray-900 dark:text-white',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    buttonText: 'Review',
    buttonDisabled: false
  }
}

export default function QuestCard({ quest, index, onStartQuest, userProgress }: QuestCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const config = statusConfig[quest.status]
  const StatusIcon = config.icon
  
  // Determine if quest should be unlocked based on previous completion
  const shouldBeUnlocked = quest.id === 1 || (userProgress?.completedQuests.includes(quest.id - 1) ?? false)
  const actualStatus = quest.id === 1 ? 'unlocked' : 
    userProgress?.completedQuests.includes(quest.id) ? 'completed' :
    shouldBeUnlocked ? 'unlocked' : 'locked'
  
  const actualConfig = statusConfig[actualStatus]
  const ActualStatusIcon = actualConfig.icon

  const handleCardClick = () => {
    if (!actualConfig.buttonDisabled) {
      onStartQuest(quest.id)
    }
  }

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`relative p-6 rounded-3xl ${actualConfig.bgColor} border-2 ${actualConfig.borderColor} backdrop-blur-lg hover:scale-[1.02] hover:shadow-2xl transition-all duration-500 cursor-pointer h-full min-h-[400px] flex flex-col`}
        onClick={handleCardClick}
      >
        {/* Quest Number & Status Icon */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center text-white font-bold shadow-lg`}>
              {quest.id}
            </div>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${actualStatus === 'completed' ? 'bg-emerald-500' : actualStatus === 'unlocked' ? 'bg-orange-500' : 'bg-gray-400'}`}>
              <ActualStatusIcon className="w-4 h-4 text-white" />
            </div>
          </div>
          
          {/* Difficulty Badge */}
          <div className={`px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${difficultyColors[quest.difficulty as keyof typeof difficultyColors]} shadow-lg`}>
            {quest.difficulty}
          </div>
        </div>

        {/* Quest Title & Sanskrit */}
        <div className="mb-4 flex-1">
          <h3 className={`text-xl font-serif font-bold mb-2 ${actualConfig.textColor} leading-tight`}>
            {quest.title}
          </h3>
          <p className="font-sanskrit text-lg text-orange-600 dark:text-orange-400 mb-3">
            {quest.sanskrit}
          </p>
          <p className={`text-sm leading-relaxed ${actualStatus === 'locked' ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}>
            {quest.description}
          </p>
        </div>

        {/* Quest Details */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="text-center">
            <div className={`w-8 h-8 mx-auto mb-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center ${actualStatus === 'locked' ? 'opacity-50' : ''}`}>
              <Award className="w-4 h-4 text-white" />
            </div>
            <p className={`text-xs font-medium ${actualConfig.textColor}`}>
              {quest.xpReward} XP
            </p>
          </div>
          <div className="text-center">
            <div className={`w-8 h-8 mx-auto mb-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center ${actualStatus === 'locked' ? 'opacity-50' : ''}`}>
              <Clock className="w-4 h-4 text-white" />
            </div>
            <p className={`text-xs font-medium ${actualConfig.textColor}`}>
              {quest.estimatedTime}
            </p>
          </div>
          <div className="text-center">
            <div className={`w-8 h-8 mx-auto mb-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center ${actualStatus === 'locked' ? 'opacity-50' : ''}`}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <p className={`text-xs font-medium ${actualConfig.textColor}`}>
              {quest.type}
            </p>
          </div>
        </div>

        {/* Gameplay Preview */}
        <div className={`p-3 rounded-xl mb-6 ${actualStatus === 'locked' ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20'} border ${actualStatus === 'locked' ? 'border-gray-200 dark:border-gray-700' : 'border-orange-200 dark:border-orange-800'}`}>
          <p className={`text-xs font-medium mb-1 ${actualStatus === 'locked' ? 'text-gray-500' : 'text-orange-700 dark:text-orange-300'}`}>
            Quest Type
          </p>
          <p className={`text-sm leading-relaxed ${actualStatus === 'locked' ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
            {quest.gameplayElements.description}
          </p>
        </div>

        {/* Action Button */}
        <motion.button
          className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
            actualConfig.buttonDisabled 
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
              : actualStatus === 'completed'
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-lg hover:shadow-emerald-500/25'
                : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-lg hover:shadow-orange-500/25'
          }`}
          whileHover={!actualConfig.buttonDisabled ? { scale: 1.02 } : {}}
          whileTap={!actualConfig.buttonDisabled ? { scale: 0.98 } : {}}
          disabled={actualConfig.buttonDisabled}
        >
          <ActualStatusIcon className="w-5 h-5" />
          {actualConfig.buttonText}
          {!actualConfig.buttonDisabled && (
            <motion.div
              animate={isHovered ? { x: 5 } : { x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          )}
        </motion.button>

        {/* Hover Glow Effect */}
        <motion.div
          className={`absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-500 to-red-600 opacity-0 transition-opacity duration-500 -z-10 ${actualStatus === 'locked' ? 'hidden' : ''}`}
          animate={{ opacity: isHovered ? 0.05 : 0 }}
        />

        {/* Lock Overlay for Locked Quests */}
        {actualStatus === 'locked' && (
          <div className="absolute inset-0 rounded-3xl bg-gray-500/10 dark:bg-gray-900/50 flex items-center justify-center backdrop-blur-[1px]">
            <div className="text-center">
              <Lock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Complete previous quest to unlock
              </p>
            </div>
          </div>
        )}

        {/* Completion Badge */}
        {actualStatus === 'completed' && (
          <div className="absolute top-4 right-4">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
