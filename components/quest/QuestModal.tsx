'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Play, 
  CheckCircle, 
  Award, 
  Volume2, 
  RotateCcw,
  ArrowRight,
  Flame,
  Brain,
  BookOpen,
  Star,
  Sparkles,
  Clock
} from 'lucide-react'
import questData from '@/data/mimamsa-quests.json'

interface Quest {
  id: number
  title: string
  sanskrit: string
  description: string
  narrative: string
  xpReward: number
  type: string
  difficulty: string
  estimatedTime: string
  gameplayElements: {
    type: string
    description: string
    options?: string[]
    correctSequence?: number[]
    scenarios?: Array<{
      situation: string
      choices: string[]
      correct: number
      explanation: string
    }>
    pairs?: Array<{
      mantra: string
      purpose: string
      timing: string
    }>
    elements?: Array<{
      item: string
      position: string
      significance: string
    }>
    timeFactors?: string[]
    mudras?: Array<{
      name: string
      purpose: string
      elements: string
    }>
    offerings?: Array<{
      item: string
      meaning: string
      deity: string
      timing: string
    }>
    phases?: string[]
    signs?: Array<{
      observation: string
      meaning: string
      action: string
    }>
    components?: string[]
    verses?: Array<{
      text: string
      layers: string[]
    }>
    concepts?: string[]
    feedback?: {
      correct: string
      incorrect: string
    }
  }
  loreContent: {
    mantra: string
    translation: string
    context: string
  }
  reflection: string
}

interface QuestModalProps {
  questId: number | null
  isOpen: boolean
  onClose: () => void
  onComplete: (questId: number, score: number) => void
}

type GameplayState = 'narrative' | 'gameplay' | 'reflection' | 'completion'

export default function QuestModal({ questId, isOpen, onClose, onComplete }: QuestModalProps) {
  const [quest, setQuest] = useState<Quest | null>(null)
  const [currentState, setCurrentState] = useState<GameplayState>('narrative')
  const [userAnswers, setUserAnswers] = useState<any[]>([])
  const [currentScore, setCurrentScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [reflectionText, setReflectionText] = useState('')

  // Quest 1: Sequence Puzzle State
  const [sequence, setSequence] = useState<number[]>([])
  const [draggedItem, setDraggedItem] = useState<number | null>(null)

  // Quest 2: Scenario Choice State
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [hasAnswered, setHasAnswered] = useState(false)

  // Quest 3: Mantra Matching State
  const [matches, setMatches] = useState<{[key: number]: number}>({})
  const [hasSubmitted, setHasSubmitted] = useState(false)

  // Quest 4: Construction Puzzle State
  const [placedElements, setPlacedElements] = useState<{[key: string]: string}>({})

  // Quest 5: Timing Puzzle State
  const [selectedTimings, setSelectedTimings] = useState<{[key: string]: string}>({})

  // Quest 6: Gesture Practice State
  const [currentMudra, setCurrentMudra] = useState(0)
  const [hasCompleted, setHasCompleted] = useState(false)
  const [score, setScore] = useState(0)

  // Quest 7: Symbolic Interpretation State
  const [selectedMeanings, setSelectedMeanings] = useState<{[key: string]: string}>({})

  // Quest 8: Sequence Orchestration State
  const [currentPhase, setCurrentPhase] = useState(0)

  // Quest 9: Sign Interpretation State
  const [selectedInterpretations, setSelectedInterpretations] = useState<{[key: string]: string}>({})

  // Quest 10: Creative Synthesis State
  const [ritualDesign, setRitualDesign] = useState({
    intention: '',
    timing: '',
    offerings: [] as string[],
    mantras: [] as string[],
    mudras: [] as string[]
  })

  // Quest 11: Textual Analysis State
  const [selectedLayers, setSelectedLayers] = useState<{[key: string]: string}>({})

  // Quest 12: Philosophical Integration State
  const [selectedConcepts, setSelectedConcepts] = useState<{[key: string]: boolean}>({})

  useEffect(() => {
    if (questId && isOpen) {
      const foundQuest = questData.quests.find(q => q.id === questId) as Quest
      setQuest(foundQuest || null)
      setCurrentState('narrative')
      setUserAnswers([])
      setCurrentScore(0)
      setShowFeedback(false)
      setFeedbackMessage('')
      setReflectionText('')
      
      // Reset all quest-specific state
      setSequence([])
      setDraggedItem(null)
      setSelectedAnswer(null)
      setHasAnswered(false)
      setMatches({})
      setHasSubmitted(false)
      setPlacedElements({})
      setSelectedTimings({})
      setCurrentMudra(0)
      setHasCompleted(false)
      setScore(0)
      setSelectedMeanings({})
      setCurrentPhase(0)
      setSelectedInterpretations({})
      setRitualDesign({
        intention: '',
        timing: '',
        offerings: [],
        mantras: [],
        mudras: []
      })
      setSelectedLayers({})
      setSelectedConcepts({})
    }
  }, [questId, isOpen])

  if (!isOpen || !quest) return null

  const handleGameplayComplete = (answers: any[], score: number) => {
    setUserAnswers(answers)
    setCurrentScore(score)
    setCurrentState('reflection')
  }

  const handleReflectionComplete = () => {
    setCurrentState('completion')
  }

  const handleQuestComplete = () => {
    onComplete(quest.id, currentScore)
    onClose()
  }

  const renderNarrative = () => (
    <div className="text-center max-w-2xl mx-auto">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center shadow-2xl">
          <Flame className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-serif font-bold mb-4 text-text-light dark:text-text-dark">
          {quest.title}
        </h2>
        <p className="font-sanskrit text-xl text-orange-600 dark:text-orange-400 mb-6">
          {quest.sanskrit}
        </p>
      </motion.div>

      <motion.div
        className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-8 rounded-3xl border border-orange-200 dark:border-orange-800 mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 italic">
          "{quest.narrative}"
        </p>
      </motion.div>

      <motion.button
        onClick={() => setCurrentState('gameplay')}
        className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 mx-auto hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Play className="w-5 h-5" />
        Begin Quest
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </div>
  )

  const renderSequencePuzzle = () => {
    const options = quest.gameplayElements.options || []
    const correctSequence = quest.gameplayElements.correctSequence || []

    const handleSubmit = () => {
      const isCorrect = JSON.stringify(sequence) === JSON.stringify(correctSequence)
      const score = isCorrect ? 100 : Math.max(0, 50 - Math.abs(sequence.length - correctSequence.length) * 10)
      
      setFeedbackMessage(isCorrect ? 
        quest.gameplayElements.feedback?.correct || "Excellent work!" :
        quest.gameplayElements.feedback?.incorrect || "Not quite right. Try again!"
      )
      setShowFeedback(true)
      
      setTimeout(() => {
        handleGameplayComplete(sequence, score)
      }, 2000)
    }

    return (
      <div className="max-w-3xl mx-auto">
        <h3 className="text-2xl font-serif font-bold mb-6 text-center text-text-light dark:text-text-dark">
          {quest.gameplayElements.description}
        </h3>
        
        <div className="grid gap-4 mb-8">
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl">
            <h4 className="font-semibold mb-4 text-text-light dark:text-text-dark">Available Elements:</h4>
            <div className="grid grid-cols-2 gap-3">
              {options.map((option, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border-2 cursor-move transition-all ${
                    sequence.includes(index) 
                      ? 'bg-gray-200 dark:bg-gray-700 border-gray-400 dark:border-gray-600 opacity-50' 
                      : 'bg-white dark:bg-gray-900 border-orange-300 dark:border-orange-700 hover:border-orange-500 dark:hover:border-orange-500'
                  }`}
                  draggable={!sequence.includes(index)}
                  onDragStart={() => setDraggedItem(index)}
                  onDragEnd={() => setDraggedItem(null)}
                  onClick={() => {
                    if (!sequence.includes(index)) {
                      setSequence([...sequence, index])
                    }
                  }}
                >
                  <p className="text-sm text-text-light dark:text-text-dark">{option}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-2xl border border-orange-200 dark:border-orange-800">
            <h4 className="font-semibold mb-4 text-orange-700 dark:text-orange-300">Your Sequence:</h4>
            <div className="space-y-3 min-h-[200px]">
              {sequence.map((optionIndex, sequenceIndex) => (
                <motion.div
                  key={sequenceIndex}
                  className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-xl border border-orange-300 dark:border-orange-700"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-sm">
                    {sequenceIndex + 1}
                  </div>
                  <p className="flex-1 text-sm text-text-light dark:text-text-dark">
                    {options[optionIndex]}
                  </p>
                  <button
                    onClick={() => setSequence(sequence.filter((_, i) => i !== sequenceIndex))}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
              {sequence.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Click or drag elements above to build your sequence
                </div>
              )}
            </div>
          </div>
        </div>

        {showFeedback && (
          <motion.div
            className={`p-4 rounded-xl mb-6 ${
              feedbackMessage.includes('Excellent') || feedbackMessage.includes('Perfect')
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="font-medium">{feedbackMessage}</p>
          </motion.div>
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setSequence([])}
            className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleSubmit}
            disabled={sequence.length === 0}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Submit Sequence
          </button>
        </div>
      </div>
    )
  }

  const renderReflection = () => (
    <div className="max-w-2xl mx-auto">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-serif font-bold mb-4 text-text-light dark:text-text-dark">
          Sacred Reflection
        </h3>
      </motion.div>

      {/* Lore Content */}
      <motion.div
        className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-3xl border border-amber-200 dark:border-amber-800 mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="text-center mb-4">
          <p className="font-sanskrit text-2xl text-amber-700 dark:text-amber-300 mb-2">
            {quest.loreContent.mantra}
          </p>
          <p className="text-lg italic text-amber-600 dark:text-amber-400 mb-2">
            "{quest.loreContent.translation}"
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {quest.loreContent.context}
          </p>
        </div>
      </motion.div>

      {/* Reflection Question */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <h4 className="text-lg font-semibold mb-4 text-text-light dark:text-text-dark">
          Contemplate and Reflect:
        </h4>
        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          {quest.reflection}
        </p>
        
        <textarea
          value={reflectionText}
          onChange={(e) => setReflectionText(e.target.value)}
          placeholder="Share your insights and reflections here..."
          className="w-full h-32 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-text-light dark:text-text-dark placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:border-orange-500 dark:focus:border-orange-400 focus:outline-none transition-colors"
        />
      </motion.div>

      <motion.button
        onClick={handleReflectionComplete}
        className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
      >
        <Sparkles className="w-5 h-5" />
        Complete Reflection
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </div>
  )

  const renderCompletion = () => (
    <div className="text-center max-w-2xl mx-auto">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center shadow-2xl">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-4xl font-serif font-bold mb-4 text-emerald-600 dark:text-emerald-400">
          Quest Complete!
        </h2>
        <p className="text-xl text-text-secondary-light dark:text-text-secondary-dark mb-8">
          You have successfully completed "{quest.title}"
        </p>
      </motion.div>

      <motion.div
        className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-8 rounded-3xl border border-emerald-200 dark:border-emerald-800 mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="flex items-center justify-center gap-8 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
              {quest.xpReward}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">XP Earned</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              {currentScore}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
          <Star className="w-5 h-5 fill-current" />
          <Star className="w-5 h-5 fill-current" />
          <Star className="w-5 h-5 fill-current" />
          <span className="ml-2 font-semibold">Ritual Master Level!</span>
        </div>
      </motion.div>

      <motion.button
        onClick={handleQuestComplete}
        className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-10 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 mx-auto hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Award className="w-5 h-5" />
        Claim Rewards
        <Sparkles className="w-5 h-5" />
      </motion.button>
    </div>
  )

  const renderScenarioChoice = () => {
    const scenarios = quest.gameplayElements.scenarios || []
    const currentScenario = scenarios[0] // For now, just use the first scenario

    const handleChoiceSelect = (choiceIndex: number) => {
      setSelectedAnswer(choiceIndex)
      setHasAnswered(true)
      
      const isCorrect = choiceIndex === currentScenario.correct
      const score = isCorrect ? 100 : 25
      
      setFeedbackMessage(isCorrect ? 
        "Excellent dharmic understanding!" :
        `Not quite. ${currentScenario.explanation}`
      )
      setShowFeedback(true)
      
      setTimeout(() => {
        handleGameplayComplete([choiceIndex], score)
      }, 3000)
    }

    return (
      <div className="max-w-3xl mx-auto">
        <h3 className="text-2xl font-serif font-bold mb-6 text-center text-text-light dark:text-text-dark">
          {quest.gameplayElements.description}
        </h3>
        
        {currentScenario && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-2xl border border-orange-200 dark:border-orange-800">
              <h4 className="font-semibold mb-4 text-orange-700 dark:text-orange-300">Scenario:</h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {currentScenario.situation}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-text-light dark:text-text-dark">Choose your response:</h4>
              {currentScenario.choices.map((choice, index) => (
                <motion.button
                  key={index}
                  onClick={() => !hasAnswered && handleChoiceSelect(index)}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-300 border-2 ${
                    hasAnswered
                      ? index === currentScenario.correct
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                        : selectedAnswer === index
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300'
                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
                      : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 hover:border-orange-400 dark:hover:border-orange-500 text-text-light dark:text-text-dark'
                  } ${hasAnswered ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
                  whileHover={!hasAnswered ? { scale: 1.02 } : {}}
                  whileTap={!hasAnswered ? { scale: 0.98 } : {}}
                  disabled={hasAnswered}
                >
                  <span className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      hasAnswered && index === currentScenario.correct
                        ? 'border-emerald-500 bg-emerald-500'
                        : hasAnswered && selectedAnswer === index
                        ? 'border-red-500 bg-red-500'
                        : 'border-gray-400'
                    }`}>
                      {hasAnswered && index === currentScenario.correct && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                      {hasAnswered && selectedAnswer === index && index !== currentScenario.correct && (
                        <X className="w-4 h-4 text-white" />
                      )}
                    </div>
                    {choice}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {showFeedback && (
          <motion.div
            className={`mt-6 p-4 rounded-xl ${
              feedbackMessage.includes('Excellent')
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="font-medium">{feedbackMessage}</p>
          </motion.div>
        )}
      </div>
    )
  }

  const renderMantraMatching = () => {
    const pairs = quest.gameplayElements.pairs || []

    const handleMatch = (mantraIndex: number, purposeIndex: number) => {
      setMatches(prev => ({ ...prev, [mantraIndex]: purposeIndex }))
    }

    const handleSubmit = () => {
      let correctMatches = 0
      pairs.forEach((pair, index) => {
        if (matches[index] === index) correctMatches++
      })
      
      const score = Math.round((correctMatches / pairs.length) * 100)
      setHasSubmitted(true)
      
      setFeedbackMessage(
        score >= 80 ? "Perfect understanding of mantra purposes!" :
        score >= 60 ? "Good knowledge! Review the ones you missed." :
        "Keep studying the sacred meanings of each mantra."
      )
      setShowFeedback(true)
      
      setTimeout(() => {
        handleGameplayComplete(Object.values(matches), score)
      }, 2500)
    }

    return (
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-serif font-bold mb-6 text-center text-text-light dark:text-text-dark">
          {quest.gameplayElements.description}
        </h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Mantras Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-text-light dark:text-text-dark">Sacred Mantras:</h4>
            <div className="space-y-3">
              {pairs.map((pair, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                  <p className="font-sanskrit text-lg text-orange-700 dark:text-orange-300 mb-2">
                    {pair.mantra}
                  </p>
                  <select
                    value={matches[index] || ''}
                    onChange={(e) => handleMatch(index, parseInt(e.target.value))}
                    disabled={hasSubmitted}
                    className="w-full p-2 border border-orange-300 dark:border-orange-700 rounded-lg bg-white dark:bg-gray-900 text-text-light dark:text-text-dark"
                  >
                    <option value="">Select purpose...</option>
                    {pairs.map((purposePair, purposeIndex) => (
                      <option key={purposeIndex} value={purposeIndex}>
                        {purposePair.purpose} ({purposePair.timing})
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Results Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-text-light dark:text-text-dark">Your Matches:</h4>
            <div className="space-y-3">
              {pairs.map((pair, index) => (
                <div key={index} className={`p-4 rounded-xl border-2 ${
                  hasSubmitted
                    ? matches[index] === index
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}>
                  <p className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Mantra {index + 1}:
                  </p>
                  <p className="text-text-light dark:text-text-dark">
                    {matches[index] !== undefined ? pairs[matches[index]]?.purpose : 'Not matched'}
                  </p>
                  {hasSubmitted && matches[index] !== index && (
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2">
                      Correct: {pair.purpose}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            disabled={Object.keys(matches).length < pairs.length || hasSubmitted}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
          >
            <CheckCircle className="w-4 h-4" />
            Submit Matches
          </button>
        </div>

        {showFeedback && (
          <motion.div
            className={`mt-6 p-4 rounded-xl ${
              feedbackMessage.includes('Perfect')
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="font-medium">{feedbackMessage}</p>
          </motion.div>
        )}
      </div>
    )
  }

  // Quest 4: Sacred Geometry of the Altar
  const renderConstructionPuzzle = () => {
    const elements = quest.gameplayElements.elements || []

    const handlePlaceElement = (elementName: string, position: string) => {
      setPlacedElements(prev => ({ ...prev, [elementName]: position }))
    }

    const handleSubmit = () => {
      let correctPlacements = 0
      elements.forEach(element => {
        if (placedElements[element.item] === element.position) correctPlacements++
      })
      
      const score = Math.round((correctPlacements / elements.length) * 100)
      setHasSubmitted(true)
      
      setFeedbackMessage(
        score >= 80 ? "Perfect altar construction! The sacred geometry resonates with cosmic harmony." :
        score >= 60 ? "Good understanding of altar principles. Review the placements." :
        "Study the sacred proportions and cosmic alignments more carefully."
      )
      setShowFeedback(true)
      
      setTimeout(() => {
        handleGameplayComplete(Object.values(placedElements), score)
      }, 2500)
    }

    return (
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-serif font-bold mb-6 text-center text-text-light dark:text-text-dark">
          {quest.gameplayElements.description}
        </h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Altar Construction Area */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-text-light dark:text-text-dark">Sacred Altar:</h4>
            <div className="relative w-full h-80 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border-2 border-orange-200 dark:border-orange-800 p-4">
              {/* Altar Grid */}
              <div className="grid grid-cols-3 grid-rows-3 gap-4 h-full">
                {['northwest', 'north', 'northeast', 'west', 'center', 'east', 'southwest', 'south', 'southeast'].map((position) => (
                  <div key={position} className="border-2 border-dashed border-orange-300 dark:border-orange-700 rounded-lg flex items-center justify-center text-xs text-orange-600 dark:text-orange-400">
                    {position}
                  </div>
                ))}
              </div>
              
              {/* Placed Elements */}
              {Object.entries(placedElements).map(([elementName, position]) => (
                <div key={elementName} className="absolute p-2 bg-orange-100 dark:bg-orange-800 rounded-lg border border-orange-300 dark:border-orange-600 text-xs">
                  {elementName}
                </div>
              ))}
            </div>
          </div>

          {/* Elements to Place */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-text-light dark:text-text-dark">Ritual Elements:</h4>
            <div className="space-y-3">
              {elements.map((element, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                  <p className="font-semibold text-orange-700 dark:text-orange-300 mb-2">{element.item}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{element.significance}</p>
                  <select
                    value={placedElements[element.item] || ''}
                    onChange={(e) => handlePlaceElement(element.item, e.target.value)}
                    disabled={hasSubmitted}
                    className="w-full p-2 border border-orange-300 dark:border-orange-700 rounded-lg bg-white dark:bg-gray-900 text-text-light dark:text-text-dark"
                  >
                    <option value="">Select position...</option>
                    <option value="center">Center</option>
                    <option value="north">North</option>
                    <option value="south">South</option>
                    <option value="east">East</option>
                    <option value="west">West</option>
                    <option value="northeast">Northeast</option>
                    <option value="northwest">Northwest</option>
                    <option value="southeast">Southeast</option>
                    <option value="southwest">Southwest</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            disabled={Object.keys(placedElements).length < elements.length || hasSubmitted}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
          >
            <CheckCircle className="w-4 h-4" />
            Construct Altar
          </button>
        </div>

        {showFeedback && (
          <motion.div
            className={`mt-6 p-4 rounded-xl ${
              feedbackMessage.includes('Perfect')
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="font-medium">{feedbackMessage}</p>
          </motion.div>
        )}
      </div>
    )
  }

  // Quest 5: Timing and Cosmic Rhythms
  const renderTimingPuzzle = () => {
    const timeFactors = quest.gameplayElements.timeFactors || []
    const ritualTypes = [
      { name: "Agnihotra", optimalTime: "sunrise", factor: "Solar transitions" },
      { name: "Soma ceremony", optimalTime: "full moon", factor: "Lunar phases" },
      { name: "Planetary worship", optimalTime: "planetary hour", factor: "Planetary alignments" },
      { name: "Seasonal festival", optimalTime: "solstice", factor: "Seasonal changes" }
    ]

    const handleSelectTiming = (ritualName: string, timing: string) => {
      setSelectedTimings(prev => ({ ...prev, [ritualName]: timing }))
    }

    const handleSubmit = () => {
      let correctTimings = 0
      ritualTypes.forEach(ritual => {
        if (selectedTimings[ritual.name] === ritual.optimalTime) correctTimings++
      })
      
      const score = Math.round((correctTimings / ritualTypes.length) * 100)
      setHasSubmitted(true)
      
      setFeedbackMessage(
        score >= 80 ? "Perfect cosmic timing! Your rituals align with celestial rhythms." :
        score >= 60 ? "Good understanding of timing principles. Study the cosmic cycles." :
        "Learn to read the celestial clock more carefully."
      )
      setShowFeedback(true)
      
      setTimeout(() => {
        handleGameplayComplete(Object.values(selectedTimings), score)
      }, 2500)
    }

    return (
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-serif font-bold mb-6 text-center text-text-light dark:text-text-dark">
          {quest.gameplayElements.description}
        </h3>
        
        <div className="space-y-6">
          {ritualTypes.map((ritual, index) => (
            <div key={index} className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-orange-700 dark:text-orange-300">{ritual.name}</h4>
                <span className="text-sm text-gray-600 dark:text-gray-400">{ritual.factor}</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['sunrise', 'sunset', 'full moon', 'new moon', 'solstice', 'equinox', 'planetary hour', 'midnight'].map((timing) => (
                  <button
                    key={timing}
                    onClick={() => !hasSubmitted && handleSelectTiming(ritual.name, timing)}
                    disabled={hasSubmitted}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedTimings[ritual.name] === timing
                        ? hasSubmitted && timing === ritual.optimalTime
                          ? 'bg-emerald-100 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                          : hasSubmitted && timing !== ritual.optimalTime
                          ? 'bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300'
                          : 'bg-orange-100 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300'
                        : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark hover:border-orange-400 dark:hover:border-orange-500'
                    } ${hasSubmitted ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
                  >
                    {timing}
                  </button>
                ))}
              </div>
              
              {hasSubmitted && selectedTimings[ritual.name] !== ritual.optimalTime && (
                <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-3">
                  Optimal timing: {ritual.optimalTime}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            disabled={Object.keys(selectedTimings).length < ritualTypes.length || hasSubmitted}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
          >
            <CheckCircle className="w-4 h-4" />
            Schedule Rituals
          </button>
        </div>

        {showFeedback && (
          <motion.div
            className={`mt-6 p-4 rounded-xl ${
              feedbackMessage.includes('Perfect')
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="font-medium">{feedbackMessage}</p>
          </motion.div>
        )}
      </div>
    )
  }

  // Quest 6: The Language of Gesture
  const renderGesturePractice = () => {
    const mudras = quest.gameplayElements.mudras || [
      {
        name: "Dhyana Mudra",
        purpose: "Meditation and inner focus",
        elements: "Water and space"
      },
      {
        name: "Abhaya Mudra", 
        purpose: "Offering protection and fearlessness",
        elements: "Fire and air"
      }
    ]

    const handleNextMudra = () => {
      if (currentMudra < mudras.length - 1) {
        setCurrentMudra(currentMudra + 1)
      } else {
        setHasCompleted(true)
        const finalScore = Math.round((score / mudras.length) * 100)
        setFeedbackMessage(
          finalScore >= 80 ? "Perfect mudra mastery! Your gestures channel divine energies." :
          finalScore >= 60 ? "Good understanding of sacred gestures. Practice more." :
          "Continue studying the language of divine gestures."
        )
        setShowFeedback(true)
        
        setTimeout(() => {
          handleGameplayComplete([score], finalScore)
        }, 2500)
      }
    }

    const handleMudraScore = (points: number) => {
      setScore(score + points)
    }

    return (
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-serif font-bold mb-6 text-center text-text-light dark:text-text-dark">
          {quest.gameplayElements.description}
        </h3>
        
        {!hasCompleted ? (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Mudra {currentMudra + 1} of {mudras.length}
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentMudra + 1) / mudras.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-8 rounded-2xl border border-orange-200 dark:border-orange-800">
              <h4 className="text-2xl font-serif font-bold text-center mb-6 text-orange-700 dark:text-orange-300">
                {mudras[currentMudra].name}
              </h4>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h5 className="font-semibold mb-3 text-text-light dark:text-text-dark">Purpose:</h5>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{mudras[currentMudra].purpose}</p>
                  
                  <h5 className="font-semibold mb-3 text-text-light dark:text-text-dark">Elements:</h5>
                  <p className="text-gray-700 dark:text-gray-300">{mudras[currentMudra].elements}</p>
                </div>
                
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-800 dark:to-red-800 rounded-full flex items-center justify-center border-4 border-orange-300 dark:border-orange-600">
                    <span className="text-4xl">🙏</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">Practice this mudra</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="font-semibold text-text-light dark:text-text-dark">How well did you perform this mudra?</h5>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Needs Practice", points: 1 },
                  { label: "Good", points: 2 },
                  { label: "Perfect", points: 3 }
                ].map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      handleMudraScore(option.points)
                      handleNextMudra()
                    }}
                    className="p-4 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:border-orange-400 dark:hover:border-orange-500 transition-all hover:shadow-md"
                  >
                    <div className="font-semibold text-text-light dark:text-text-dark">{option.label}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{option.points} points</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-4">
              Mudra Practice Complete!
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              You have practiced {mudras.length} sacred hand gestures.
            </p>
          </div>
        )}

        {showFeedback && (
          <motion.div
            className={`mt-6 p-4 rounded-xl ${
              feedbackMessage.includes('Perfect')
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="font-medium">{feedbackMessage}</p>
          </motion.div>
        )}
      </div>
    )
  }

  // Quest 7: Offerings and their Significance
  const renderSymbolicInterpretation = () => {
    const offerings = quest.gameplayElements.offerings || [
      {
        item: "White rice",
        meaning: "Abundance and nourishment",
        deity: "Lakshmi",
        timing: "New moon"
      },
      {
        item: "Red flowers",
        meaning: "Energy and transformation", 
        deity: "Durga",
        timing: "Tuesday"
      }
    ]

    const meanings = ["Abundance and nourishment", "Energy and transformation", "Purification and cleansing", "Wisdom and knowledge", "Protection and strength"]

    const handleSelectMeaning = (itemName: string, meaning: string) => {
      setSelectedMeanings(prev => ({ ...prev, [itemName]: meaning }))
    }

    const handleSubmit = () => {
      let correctMeanings = 0
      offerings.forEach(offering => {
        if (selectedMeanings[offering.item] === offering.meaning) correctMeanings++
      })
      
      const score = Math.round((correctMeanings / offerings.length) * 100)
      setHasSubmitted(true)
      
      setFeedbackMessage(
        score >= 80 ? "Perfect understanding of symbolic meanings! You speak the language of offerings." :
        score >= 60 ? "Good knowledge of ritual symbolism. Study the deeper meanings." :
        "Learn to read the cosmic language of offerings more carefully."
      )
      setShowFeedback(true)
      
      setTimeout(() => {
        handleGameplayComplete(Object.values(selectedMeanings), score)
      }, 2500)
    }

    return (
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-serif font-bold mb-6 text-center text-text-light dark:text-text-dark">
          {quest.gameplayElements.description}
        </h3>
        
        <div className="space-y-6">
          {offerings.map((offering, index) => (
            <div key={index} className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-orange-700 dark:text-orange-300">{offering.item}</h4>
                <div className="text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Deity: {offering.deity}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Timing: {offering.timing}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="font-semibold text-text-light dark:text-text-dark">Select the cosmic meaning:</label>
                {meanings.map((meaning, meaningIndex) => (
                  <button
                    key={meaningIndex}
                    onClick={() => !hasSubmitted && handleSelectMeaning(offering.item, meaning)}
                    disabled={hasSubmitted}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                      selectedMeanings[offering.item] === meaning
                        ? hasSubmitted && meaning === offering.meaning
                          ? 'bg-emerald-100 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                          : hasSubmitted && meaning !== offering.meaning
                          ? 'bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300'
                          : 'bg-orange-100 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300'
                        : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark hover:border-orange-400 dark:hover:border-orange-500'
                    } ${hasSubmitted ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
                  >
                    {meaning}
                  </button>
                ))}
              </div>
              
              {hasSubmitted && selectedMeanings[offering.item] !== offering.meaning && (
                <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-3">
                  Correct meaning: {offering.meaning}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            disabled={Object.keys(selectedMeanings).length < offerings.length || hasSubmitted}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
          >
            <CheckCircle className="w-4 h-4" />
            Interpret Offerings
          </button>
        </div>

        {showFeedback && (
          <motion.div
            className={`mt-6 p-4 rounded-xl ${
              feedbackMessage.includes('Perfect')
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="font-medium">{feedbackMessage}</p>
          </motion.div>
        )}
      </div>
    )
  }

  // Quest 8: Advanced Ritual Sequences
  const renderSequenceOrchestration = () => {
    const phases = quest.gameplayElements.phases || [
      "Purification and preparation",
      "Invocation of deities",
      "Main offering sequence",
      "Blessing and completion"
    ]

    const phaseTasks = [
      ["Purify altar space", "Prepare ritual materials", "Set up sacred fire"],
      ["Invoke Agni", "Call upon specific deities", "Establish divine presence"],
      ["Make primary offerings", "Recite main mantras", "Perform core ceremony"],
      ["Give final blessings", "Close sacred space", "Express gratitude"]
    ]

    const handlePhaseComplete = (phaseScore: number) => {
      setScore(score + phaseScore)
      if (currentPhase < phases.length - 1) {
        setCurrentPhase(currentPhase + 1)
      } else {
        setHasCompleted(true)
        const finalScore = Math.round((score + phaseScore) / phases.length)
        setFeedbackMessage(
          finalScore >= 80 ? "Perfect ritual orchestration! You conduct the cosmic symphony with mastery." :
          finalScore >= 60 ? "Good ritual coordination. Practice the sequences more." :
          "Study the sacred choreography of ritual phases."
        )
        setShowFeedback(true)
        
        setTimeout(() => {
          handleGameplayComplete([score + phaseScore], finalScore)
        }, 2500)
      }
    }

    return (
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-serif font-bold mb-6 text-center text-text-light dark:text-text-dark">
          {quest.gameplayElements.description}
        </h3>
        
        {!hasCompleted ? (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Phase {currentPhase + 1} of {phases.length}
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentPhase + 1) / phases.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-8 rounded-2xl border border-orange-200 dark:border-orange-800">
              <h4 className="text-2xl font-serif font-bold text-center mb-6 text-orange-700 dark:text-orange-300">
                {phases[currentPhase]}
              </h4>
              
              <div className="space-y-4">
                <h5 className="font-semibold text-text-light dark:text-text-dark">Tasks to complete:</h5>
                <div className="space-y-2">
                  {phaseTasks[currentPhase].map((task, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border border-orange-200 dark:border-orange-700">
                      <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-800 flex items-center justify-center text-orange-600 dark:text-orange-400 text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="text-text-light dark:text-text-dark">{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="font-semibold text-text-light dark:text-text-dark">How well did you orchestrate this phase?</h5>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Needs Work", points: 1 },
                  { label: "Good", points: 2 },
                  { label: "Excellent", points: 3 }
                ].map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handlePhaseComplete(option.points)}
                    className="p-4 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:border-orange-400 dark:hover:border-orange-500 transition-all hover:shadow-md"
                  >
                    <div className="font-semibold text-text-light dark:text-text-dark">{option.label}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{option.points} points</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-4">
              Ritual Sequence Complete!
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              You have successfully orchestrated {phases.length} ritual phases.
            </p>
          </div>
        )}

        {showFeedback && (
          <motion.div
            className={`mt-6 p-4 rounded-xl ${
              feedbackMessage.includes('Perfect')
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="font-medium">{feedbackMessage}</p>
          </motion.div>
        )}
      </div>
    )
  }

  // Quest 9: Reading Cosmic Signs
  const renderSignInterpretation = () => {
    const signs = quest.gameplayElements.signs || [
      {
        observation: "Flame burns steady and bright",
        meaning: "Divine presence is strong",
        action: "Continue with confidence"
      },
      {
        observation: "Smoke drifts eastward",
        meaning: "Prayers are being carried to the gods",
        action: "Proceed to next phase"
      }
    ]

    const interpretations = [
      "Divine presence is strong",
      "Prayers are being carried to the gods",
      "Need for purification",
      "Deity is pleased",
      "Requires additional offerings",
      "Ritual is complete"
    ]

    const handleSelectInterpretation = (observation: string, interpretation: string) => {
      setSelectedInterpretations(prev => ({ ...prev, [observation]: interpretation }))
    }

    const handleSubmit = () => {
      let correctInterpretations = 0
      signs.forEach(sign => {
        if (selectedInterpretations[sign.observation] === sign.meaning) correctInterpretations++
      })
      
      const score = Math.round((correctInterpretations / signs.length) * 100)
      setHasSubmitted(true)
      
      setFeedbackMessage(
        score >= 80 ? "Perfect sign reading! You understand the language of the cosmos." :
        score >= 60 ? "Good interpretation skills. Study the subtle signs more." :
        "Learn to read the divine messages in all phenomena."
      )
      setShowFeedback(true)
      
      setTimeout(() => {
        handleGameplayComplete(Object.values(selectedInterpretations), score)
      }, 2500)
    }

    return (
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-serif font-bold mb-6 text-center text-text-light dark:text-text-dark">
          {quest.gameplayElements.description}
        </h3>
        
        <div className="space-y-6">
          {signs.map((sign, index) => (
            <div key={index} className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border border-orange-200 dark:border-orange-800">
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-orange-700 dark:text-orange-300 mb-2">Observation:</h4>
                <p className="text-gray-700 dark:text-gray-300 italic">"{sign.observation}"</p>
              </div>
              
              <div className="space-y-2">
                <label className="font-semibold text-text-light dark:text-text-dark">What does this sign mean?</label>
                {interpretations.map((interpretation, interpretationIndex) => (
                  <button
                    key={interpretationIndex}
                    onClick={() => !hasSubmitted && handleSelectInterpretation(sign.observation, interpretation)}
                    disabled={hasSubmitted}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                      selectedInterpretations[sign.observation] === interpretation
                        ? hasSubmitted && interpretation === sign.meaning
                          ? 'bg-emerald-100 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                          : hasSubmitted && interpretation !== sign.meaning
                          ? 'bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300'
                          : 'bg-orange-100 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300'
                        : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark hover:border-orange-400 dark:hover:border-orange-500'
                    } ${hasSubmitted ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
                  >
                    {interpretation}
                  </button>
                ))}
              </div>
              
              {hasSubmitted && selectedInterpretations[sign.observation] !== sign.meaning && (
                <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    <strong>Correct meaning:</strong> {sign.meaning}
                  </p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                    <strong>Action:</strong> {sign.action}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            disabled={Object.keys(selectedInterpretations).length < signs.length || hasSubmitted}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
          >
            <CheckCircle className="w-4 h-4" />
            Interpret Signs
          </button>
        </div>

        {showFeedback && (
          <motion.div
            className={`mt-6 p-4 rounded-xl ${
              feedbackMessage.includes('Perfect')
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="font-medium">{feedbackMessage}</p>
          </motion.div>
        )}
      </div>
    )
  }

  // Quest 10: Personal Ritual Creation
  const renderCreativeSynthesis = () => {
    const components = quest.gameplayElements.components || [
      "Choose intention and timing",
      "Select appropriate offerings",
      "Design altar layout",
      "Sequence ritual phases",
      "Include mantras and mudras"
    ]

    const availableOfferings = ["Rice", "Flowers", "Ghee", "Water", "Incense", "Fruits"]
    const availableMantras = ["ॐ", "ॐ गं गणपतये नमः", "ॐ नमः शिवाय", "सर्वे भवन्तु सुखिनः"]
    const availableMudras = ["Dhyana Mudra", "Abhaya Mudra", "Anjali Mudra", "Chin Mudra"]

    const handleSubmit = () => {
      // Score based on completeness and coherence
      let score = 0
      if (ritualDesign.intention) score += 20
      if (ritualDesign.timing) score += 20
      if (ritualDesign.offerings.length > 0) score += 20
      if (ritualDesign.mantras.length > 0) score += 20
      if (ritualDesign.mudras.length > 0) score += 20
      
      setHasSubmitted(true)
      
      setFeedbackMessage(
        score >= 80 ? "Brilliant ritual design! Your creation honors ancient wisdom while expressing your unique spiritual voice." :
        score >= 60 ? "Good ritual structure. Consider adding more elements for completeness." :
        "A ritual needs all its components to be effective. Review the essential elements."
      )
      setShowFeedback(true)
      
      setTimeout(() => {
        handleGameplayComplete([ritualDesign], score)
      }, 2500)
    }

    return (
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-serif font-bold mb-6 text-center text-text-light dark:text-text-dark">
          {quest.gameplayElements.description}
        </h3>
        
        <div className="space-y-6">
          {/* Intention */}
          <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border border-orange-200 dark:border-orange-800">
            <h4 className="text-lg font-semibold mb-4 text-orange-700 dark:text-orange-300">Ritual Intention:</h4>
            <textarea
              value={ritualDesign.intention}
              onChange={(e) => setRitualDesign(prev => ({ ...prev, intention: e.target.value }))}
              placeholder="What is the purpose of your ritual? (e.g., purification, gratitude, healing, wisdom seeking)"
              className="w-full h-20 p-3 border border-orange-300 dark:border-orange-700 rounded-lg bg-white dark:bg-gray-900 text-text-light dark:text-text-dark resize-none"
              disabled={hasSubmitted}
            />
          </div>

          {/* Timing */}
          <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border border-orange-200 dark:border-orange-800">
            <h4 className="text-lg font-semibold mb-4 text-orange-700 dark:text-orange-300">Optimal Timing:</h4>
            <select
              value={ritualDesign.timing}
              onChange={(e) => setRitualDesign(prev => ({ ...prev, timing: e.target.value }))}
              disabled={hasSubmitted}
              className="w-full p-3 border border-orange-300 dark:border-orange-700 rounded-lg bg-white dark:bg-gray-900 text-text-light dark:text-text-dark"
            >
              <option value="">Select timing...</option>
              <option value="sunrise">Sunrise</option>
              <option value="sunset">Sunset</option>
              <option value="full moon">Full Moon</option>
              <option value="new moon">New Moon</option>
              <option value="solstice">Solstice</option>
              <option value="equinox">Equinox</option>
            </select>
          </div>

          {/* Offerings */}
          <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border border-orange-200 dark:border-orange-800">
            <h4 className="text-lg font-semibold mb-4 text-orange-700 dark:text-orange-300">Sacred Offerings:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableOfferings.map((offering) => (
                <button
                  key={offering}
                  onClick={() => !hasSubmitted && setRitualDesign(prev => ({
                    ...prev,
                    offerings: prev.offerings.includes(offering)
                      ? prev.offerings.filter(o => o !== offering)
                      : [...prev.offerings, offering]
                  }))}
                  disabled={hasSubmitted}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    ritualDesign.offerings.includes(offering)
                      ? 'bg-orange-100 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300'
                      : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark hover:border-orange-400 dark:hover:border-orange-500'
                  } ${hasSubmitted ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
                >
                  {offering}
                </button>
              ))}
            </div>
          </div>

          {/* Mantras */}
          <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border border-orange-200 dark:border-orange-800">
            <h4 className="text-lg font-semibold mb-4 text-orange-700 dark:text-orange-300">Sacred Mantras:</h4>
            <div className="space-y-3">
              {availableMantras.map((mantra) => (
                <button
                  key={mantra}
                  onClick={() => !hasSubmitted && setRitualDesign(prev => ({
                    ...prev,
                    mantras: prev.mantras.includes(mantra)
                      ? prev.mantras.filter(m => m !== mantra)
                      : [...prev.mantras, mantra]
                  }))}
                  disabled={hasSubmitted}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                    ritualDesign.mantras.includes(mantra)
                      ? 'bg-orange-100 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300'
                      : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark hover:border-orange-400 dark:hover:border-orange-500'
                  } ${hasSubmitted ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
                >
                  <span className="font-sanskrit">{mantra}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mudras */}
          <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border border-orange-200 dark:border-orange-800">
            <h4 className="text-lg font-semibold mb-4 text-orange-700 dark:text-orange-300">Sacred Gestures:</h4>
            <div className="grid grid-cols-2 gap-3">
              {availableMudras.map((mudra) => (
                <button
                  key={mudra}
                  onClick={() => !hasSubmitted && setRitualDesign(prev => ({
                    ...prev,
                    mudras: prev.mudras.includes(mudra)
                      ? prev.mudras.filter(m => m !== mudra)
                      : [...prev.mudras, mudra]
                  }))}
                  disabled={hasSubmitted}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    ritualDesign.mudras.includes(mudra)
                      ? 'bg-orange-100 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300'
                      : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark hover:border-orange-400 dark:hover:border-orange-500'
                  } ${hasSubmitted ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
                >
                  {mudra}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            disabled={hasSubmitted}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
          >
            <CheckCircle className="w-4 h-4" />
            Create Ritual
          </button>
        </div>

        {showFeedback && (
          <motion.div
            className={`mt-6 p-4 rounded-xl ${
              feedbackMessage.includes('Brilliant')
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="font-medium">{feedbackMessage}</p>
          </motion.div>
        )}
      </div>
    )
  }

  // Quest 11: Vedic Hermeneutics
  const renderTextualAnalysis = () => {
    const verses = quest.gameplayElements.verses || [
      {
        text: "अग्निमीले पुरोहितं यज्ञस्य देवमृत्विजम्",
        layers: [
          "Literal: I praise Agni, the priest of sacrifice",
          "Ritual: Invocation at ceremony beginning",
          "Mystical: Awakening inner fire of consciousness"
        ]
      }
    ]

    const layerTypes = ["Literal", "Ritual", "Mystical"]

    const handleSelectLayer = (verseText: string, layerType: string) => {
      setSelectedLayers(prev => ({ ...prev, [verseText]: layerType }))
    }

    const handleSubmit = () => {
      let correctLayers = 0
      verses.forEach(verse => {
        if (selectedLayers[verse.text] === "Ritual") correctLayers++
      })
      
      const score = Math.round((correctLayers / verses.length) * 100)
      setHasSubmitted(true)
      
      setFeedbackMessage(
        score >= 80 ? "Perfect hermeneutic understanding! You decode the multi-layered wisdom of the Vedas." :
        score >= 60 ? "Good textual analysis. Study the different levels of meaning." :
        "Learn to read between the lines of sacred texts."
      )
      setShowFeedback(true)
      
      setTimeout(() => {
        handleGameplayComplete(Object.values(selectedLayers), score)
      }, 2500)
    }

    return (
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-serif font-bold mb-6 text-center text-text-light dark:text-text-dark">
          {quest.gameplayElements.description}
        </h3>
        
        <div className="space-y-6">
          {verses.map((verse, index) => (
            <div key={index} className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border border-orange-200 dark:border-orange-800">
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-orange-700 dark:text-orange-300 mb-3">Vedic Verse:</h4>
                <p className="font-sanskrit text-xl text-orange-600 dark:text-orange-400 mb-2">{verse.text}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Analyze this verse's multiple layers of meaning</p>
              </div>
              
              <div className="space-y-4">
                <h5 className="font-semibold text-text-light dark:text-text-dark">Available Interpretations:</h5>
                {verse.layers.map((layer, layerIndex) => (
                  <div key={layerIndex} className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-text-light dark:text-text-dark">{layer}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <h5 className="font-semibold text-text-light dark:text-text-dark mb-3">Which layer is most important for ritual practice?</h5>
                <div className="grid grid-cols-3 gap-3">
                  {layerTypes.map((layerType) => (
                    <button
                      key={layerType}
                      onClick={() => !hasSubmitted && handleSelectLayer(verse.text, layerType)}
                      disabled={hasSubmitted}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedLayers[verse.text] === layerType
                          ? hasSubmitted && layerType === "Ritual"
                            ? 'bg-emerald-100 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                            : hasSubmitted && layerType !== "Ritual"
                            ? 'bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300'
                            : 'bg-orange-100 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300'
                          : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark hover:border-orange-400 dark:hover:border-orange-500'
                      } ${hasSubmitted ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
                    >
                      {layerType}
                    </button>
                  ))}
                </div>
              </div>
              
              {hasSubmitted && selectedLayers[verse.text] !== "Ritual" && (
                <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-3">
                  For ritual practice, the Ritual layer is most important as it provides practical guidance.
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            disabled={Object.keys(selectedLayers).length < verses.length || hasSubmitted}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
          >
            <CheckCircle className="w-4 h-4" />
            Analyze Verses
          </button>
        </div>

        {showFeedback && (
          <motion.div
            className={`mt-6 p-4 rounded-xl ${
              feedbackMessage.includes('Perfect')
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="font-medium">{feedbackMessage}</p>
          </motion.div>
        )}
      </div>
    )
  }

  // Quest 12: The Cosmic Sacrifice
  const renderPhilosophicalIntegration = () => {
    const concepts = quest.gameplayElements.concepts || [
      "Individual ritual as cosmic participation",
      "Every action as potential offering",
      "Consciousness as both priest and sacrifice",
      "Daily life as continuous ceremony"
    ]

    const handleToggleConcept = (concept: string) => {
      if (!hasSubmitted) {
        setSelectedConcepts(prev => ({ ...prev, [concept]: !prev[concept] }))
      }
    }

    const handleSubmit = () => {
      const selectedCount = Object.values(selectedConcepts).filter(Boolean).length
      const score = Math.round((selectedCount / concepts.length) * 100)
      setHasSubmitted(true)
      
      setFeedbackMessage(
        score >= 80 ? "Perfect cosmic understanding! You see the divine sacrifice in all existence." :
        score >= 60 ? "Good philosophical insight. Contemplate the cosmic nature of action." :
        "Meditate on how every action participates in the universal sacrifice."
      )
      setShowFeedback(true)
      
      setTimeout(() => {
        handleGameplayComplete([selectedConcepts], score)
      }, 2500)
    }

    return (
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-serif font-bold mb-6 text-center text-text-light dark:text-text-dark">
          {quest.gameplayElements.description}
        </h3>
        
        <div className="space-y-6">
          <div className="text-center mb-8">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Select the concepts that resonate with your understanding of the cosmic sacrifice:
            </p>
          </div>

          <div className="space-y-4">
            {concepts.map((concept, index) => (
              <button
                key={index}
                onClick={() => handleToggleConcept(concept)}
                disabled={hasSubmitted}
                className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${
                  selectedConcepts[concept]
                    ? 'bg-orange-100 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300'
                    : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark hover:border-orange-400 dark:hover:border-orange-500'
                } ${hasSubmitted ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedConcepts[concept]
                      ? 'border-orange-500 bg-orange-500'
                      : 'border-gray-400'
                  }`}>
                    {selectedConcepts[concept] && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-lg">{concept}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-2xl border border-amber-200 dark:border-amber-800">
            <h4 className="text-lg font-semibold mb-3 text-amber-700 dark:text-amber-300">Reflection:</h4>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              How does understanding that every action is part of the cosmic sacrifice change your perspective on daily life? 
              Consider how this wisdom transforms ordinary activities into sacred offerings.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            disabled={hasSubmitted}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
          >
            <CheckCircle className="w-4 h-4" />
            Complete Integration
          </button>
        </div>

        {showFeedback && (
          <motion.div
            className={`mt-6 p-4 rounded-xl ${
              feedbackMessage.includes('Perfect')
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="font-medium">{feedbackMessage}</p>
          </motion.div>
        )}
      </div>
    )
  }

  const renderCurrentState = () => {
    switch (currentState) {
      case 'narrative':
        return renderNarrative()
      case 'gameplay':
        switch (quest.gameplayElements.type) {
          case 'sequence_puzzle':
            return renderSequencePuzzle()
          case 'scenario_choice':
            return renderScenarioChoice()
          case 'mantra_matching':
            return renderMantraMatching()
          case 'construction_puzzle':
            return renderConstructionPuzzle()
          case 'timing_puzzle':
            return renderTimingPuzzle()
          case 'gesture_practice':
            return renderGesturePractice()
          case 'symbolic_interpretation':
            return renderSymbolicInterpretation()
          case 'sequence_orchestration':
            return renderSequenceOrchestration()
          case 'sign_interpretation':
            return renderSignInterpretation()
          case 'creative_synthesis':
            return renderCreativeSynthesis()
          case 'textual_analysis':
            return renderTextualAnalysis()
          case 'philosophical_integration':
            return renderPhilosophicalIntegration()
          default:
            return renderSequencePuzzle()
        }
      case 'reflection':
        return renderReflection()
      case 'completion':
        return renderCompletion()
      default:
        return renderNarrative()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm font-medium">{quest.estimatedTime}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <Award className="w-5 h-5" />
                  <span className="text-sm font-medium">{quest.xpReward} XP</span>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
              {renderCurrentState()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
