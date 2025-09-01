'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { ArrowRight, Coins, Trophy, Star, BookOpen, Users } from 'lucide-react'

const rewardCategories = [
  {
    title: 'Content Creation',
    description: 'Share your wisdom through blogs and articles',
    rewards: ['Recognition badges', 'Leaderboard points', 'Community status', 'Expert verification'],
    icon: BookOpen,
    color: 'from-blue-400 to-indigo-500'
  },
  {
    title: 'Glossary Contributions',
    description: 'Help build our knowledge base',
    rewards: ['Knowledge points', 'Editor status', 'Citation credits', 'Expert recognition'],
    icon: Users,
    color: 'from-green-400 to-emerald-500'
  },
  {
    title: 'Sutra Interpretations',
    description: 'Share your understanding of ancient texts',
    rewards: ['Scholar badges', 'Teaching opportunities', 'Publication credits', 'Mentor status'],
    icon: Star,
    color: 'from-yellow-400 to-orange-500'
  }
]



export default function EconomySection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    const initEconomyAnimation = async () => {
      const { gsap } = await import('gsap')
      
      if (ref.current && isInView) {
        // Coin falling animation
        const coins = ref.current.querySelectorAll('.coin-icon')
        const leaderboard = ref.current.querySelector('.leaderboard-counter')
        
        gsap.fromTo(coins,
          { 
            y: -100,
            opacity: 0,
            rotation: 0
          },
          {
            y: 0,
            opacity: 1,
            rotation: 360,
            duration: 1,
            stagger: 0.1,
            ease: "bounce.out"
          }
        )
        
        // Leaderboard counter animation
        if (leaderboard) {
          gsap.fromTo(leaderboard,
            { innerHTML: 0 },
            {
              innerHTML: 1250,
              duration: 2,
              ease: "power2.out",
              snap: { innerHTML: 1 }
            }
          )
        }
      }
    }

    initEconomyAnimation()
  }, [isInView])

  return (
    <section ref={ref} className="relative py-20 px-4 bg-gradient-to-br from-background-alt-light via-background-light to-background-alt-light dark:from-background-alt-dark dark:via-background-dark dark:to-background-alt-dark">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark mb-6"
          >
            Shikshanam Economy
          </motion.h2>
          <p className="text-xl text-text-secondary-light dark:text-text-secondary-dark max-w-3xl mx-auto">
            Earn recognition and rewards for contributing to our collective wisdom
          </p>
        </motion.div>

        {/* Reward Categories */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {rewardCategories.map((category, index) => {
            const IconComponent = category.icon
            
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="glass-effect p-6 rounded-2xl border border-white/10 dark:border-white/5 hover:border-primary-light/30 dark:hover:border-primary-dark/30 transition-all duration-500 hover:shadow-xl backdrop-blur-sm"
              >
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark flex items-center justify-center`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
                    {category.description}
                  </p>
                </div>

                <div className="space-y-3">
                  {category.rewards.map((reward, rewardIndex) => (
                    <div key={rewardIndex} className="flex items-center gap-3 text-text-secondary-light dark:text-text-secondary-dark">
                      <div className="w-2 h-2 bg-secondary-light dark:bg-secondary-dark rounded-full" />
                      <span className="text-sm">{reward}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Leaderboard */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
          className="mb-20"
        >
          <div className="glass-effect p-8 rounded-2xl border border-white/10 dark:border-white/5 backdrop-blur-sm">
            <div className="text-center mb-8">

              <div className="flex items-center justify-center gap-4 mb-6">
                <Coins className="w-8 h-8 text-primary-light dark:text-primary-dark coin-icon" />
                <span className="text-2xl font-bold text-primary-light dark:text-primary-dark leaderboard-counter">0</span>
                <span className="text-text-secondary-light dark:text-text-secondary-dark">Total Points Awarded</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-light dark:text-primary-dark mb-2">🏆</div>
                <div className="text-lg font-semibold text-primary-light dark:text-primary-dark mb-1">Top Contributor</div>
                <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Acharya Vishal</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-light dark:text-primary-dark mb-2">⭐</div>
                <div className="text-lg font-semibold text-primary-light dark:text-primary-dark mb-1">Most Active</div>
                <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Wisdom Seeker</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-light dark:text-primary-dark mb-2">📚</div>
                <div className="text-lg font-semibold text-primary-light dark:text-primary-dark mb-1">Knowledge Guru</div>
                <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Sanskrit Scholar</div>
              </div>
            </div>
          </div>
        </motion.div>


      </div>
    </section>
  )
}
