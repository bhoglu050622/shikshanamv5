'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { BookOpen, Users, Award, Clock, Globe, Heart } from 'lucide-react'

interface Outcome {
  icon: React.ReactNode
  title: string
  description: string
}

interface OutcomesProps {
  title: string
  subtitle?: string
  outcomes: Outcome[]
  columns?: 2 | 3 | 4
}

const iconMap = {
  book: BookOpen,
  users: Users,
  award: Award,
  clock: Clock,
  globe: Globe,
  heart: Heart,
}

export default function Outcomes({ 
  title, 
  subtitle, 
  outcomes, 
  columns = 3 
}: OutcomesProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <section className="py-32 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full"
             style={{
               backgroundImage: `radial-gradient(circle at 30% 30%, #f97316 1px, transparent 1px),
                                 radial-gradient(circle at 70% 70%, #8b5cf6 1px, transparent 1px)`,
               backgroundSize: '60px 60px'
             }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-bold text-gray-900 dark:text-white mb-8">
            {title.split(' ').map((word, index, array) => (
              <span key={index} className={word.toLowerCase().includes('premium') || word.toLowerCase().includes('choose') ? 'bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-transparent' : ''}>
                {word}{index < array.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h2>
          {subtitle && (
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </motion.div>

        <div className={`grid ${gridCols[columns]} gap-8 lg:gap-12`}>
          {outcomes.map((outcome, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -15, scale: 1.05 }}
              className="group"
            >
              <div className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 rounded-3xl p-8 h-full border border-white/30 dark:border-gray-700/50 hover:border-orange-300/50 dark:hover:border-orange-500/50 transition-all duration-500 hover:shadow-2xl relative overflow-hidden">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex flex-col items-center text-center relative z-10">
                  <motion.div 
                    className="w-20 h-20 bg-gradient-to-br from-orange-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-white">
                      {outcome.icon}
                    </div>
                  </motion.div>
                  
                  <motion.h3 
                    className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-purple-500 group-hover:bg-clip-text transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    {outcome.title}
                  </motion.h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {outcome.description}
                  </p>

                  {/* Decorative Element */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-purple-400 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
