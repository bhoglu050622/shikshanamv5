'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Brain, Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface EnterRishiModeButtonProps {
  quizType: 'guna-profiler' | 'shiva-consciousness'
  result: string
  language: 'en' | 'hi'
}

export default function EnterRishiModeButton({ 
  quizType, 
  result, 
  language 
}: EnterRishiModeButtonProps) {
  const router = useRouter()

  const t = {
    en: {
      title: "Your Quiz Results",
      subtitle: "You've completed the quiz and discovered your results. Now take the next step to get personalized recommendations and deeper insights.",
      resultLabel: "Your Result:",
      enterRishiMode: "Enter Rishi Mode for Your Analysis",
      benefits: [
        "Personalized course recommendations based on your results",
        "Curated book suggestions for your spiritual journey",
        "Deeper analysis combining multiple perspectives",
        "Guided learning path tailored to your needs"
      ]
    },
    hi: {
      title: "आपके क्विज के परिणाम",
      subtitle: "आपने क्विज पूरा कर लिया है और अपने परिणाम खोज लिए हैं। अब व्यक्तिगत सुझाव और गहरी अंतर्दृष्टि प्राप्त करने के लिए अगला कदम उठाएं।",
      resultLabel: "आपका परिणाम:",
      enterRishiMode: "अपने विश्लेषण के लिए ऋषि मोड में प्रवेश करें",
      benefits: [
        "आपके परिणामों के आधार पर व्यक्तिगत पाठ्यक्रम सुझाव",
        "आपकी आध्यात्मिक यात्रा के लिए क्यूरेटेड पुस्तक सुझाव",
        "कई दृष्टिकोणों को जोड़कर गहरा विश्लेषण",
        "आपकी आवश्यकताओं के अनुरूप निर्देशित शिक्षण पथ"
      ]
    }
  }[language]

  const handleEnterRishiMode = () => {
    // Navigate to Rishi Mode with the quiz type as parameter
    router.push(`/rishi-mode?from=${quizType}`)
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

      {/* Result Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-8 text-center"
      >
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
            {t.resultLabel}
          </h3>
          <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-transparent bg-clip-text">
            {result}
          </div>
        </div>
        
        <div className="text-gray-600 dark:text-gray-400 text-sm">
          {quizType === 'guna-profiler' 
            ? "Your dominant Guna has been identified. Now let's explore what this means for your spiritual journey."
            : "Your Shiva Consciousness alignment has been revealed. Now let's discover your personalized path forward."
          }
        </div>
      </motion.div>

      {/* Enter Rishi Mode Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-900/20 dark:via-gray-800 dark:to-blue-900/20 rounded-2xl p-8 shadow-lg border border-purple-200 dark:border-purple-800"
      >
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Ready for Deeper Insights?
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Enter Rishi Mode to receive personalized recommendations and a comprehensive analysis of your spiritual journey.
          </p>
        </div>

        {/* Benefits List */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {t.benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-start gap-3"
            >
              <Sparkles className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300 text-sm">{benefit}</span>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEnterRishiMode}
            className="bg-gradient-to-r from-purple-500 to-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 mx-auto"
          >
            <Heart className="w-6 h-6" />
            {t.enterRishiMode}
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
