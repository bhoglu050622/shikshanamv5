'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { ArrowRight, Users, MapPin, Trophy, Calendar, Video, MessageCircle } from 'lucide-react'

const communityFeatures = [
  {
    title: 'Live Virtual Gatherings',
    description: 'Connect with spiritual seekers worldwide in immersive digital spaces',
    features: ['Interactive Breakout Rooms', 'Expert-Led Discussions', 'Recorded Sessions', 'Global Networking'],
    icon: Video,
    color: 'from-blue-400 to-indigo-500'
  },
  {
    title: 'In-Person Spiritual Retreats',
    description: 'Transformative gatherings in sacred locations worldwide',
    features: ['Sacred Location Events', 'Cultural Immersion', 'Master Classes', 'Deep Networking'],
    icon: MapPin,
    color: 'from-green-400 to-emerald-500'
  },
  {
    title: 'Spiritual Growth Challenges',
    description: 'Gamified learning that accelerates your spiritual journey',
    features: ['Wisdom Quizzes', 'Achievement Badges', 'Reward System', 'Community Recognition'],
    icon: Trophy,
    color: 'from-yellow-400 to-orange-500'
  }
]

const questCheckpoints = [
  { name: 'Join Community', icon: Users, completed: true },
  { name: 'Attend Meetup', icon: Calendar, completed: true },
  { name: 'Complete Challenge', icon: Trophy, completed: false },
  { name: 'Share Wisdom', icon: MessageCircle, completed: false },
  { name: 'Become Guide', icon: Users, completed: false }
]

export default function CommunitySection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    const initQuestAnimation = async () => {
      const { gsap } = await import('gsap')
      
      if (ref.current && isInView) {
        // Quest path glow animation
        const questPath = ref.current.querySelector('.quest-path')
        const checkpoints = ref.current.querySelectorAll('.quest-checkpoint')
        
        gsap.fromTo(questPath,
          { opacity: 0, scaleX: 0 },
          {
            opacity: 1,
            scaleX: 1,
            duration: 2,
            ease: "power2.out"
          }
        )
        
        gsap.fromTo(checkpoints,
          { opacity: 0, scale: 0 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.3,
            ease: "backOut"
          }
        )
      }
    }

    initQuestAnimation()
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
            Community & Meetups
          </motion.h2>
          <p className="text-xl text-text-secondary-light dark:text-text-secondary-dark max-w-3xl mx-auto">
            <strong>Connect with 10,000+ spiritual seekers worldwide</strong> in the most vibrant community dedicated to 
            ancient Indian wisdom. <strong>Share experiences, learn together, and grow spiritually.</strong>
          </p>
        </motion.div>

        {/* Community Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {communityFeatures.map((feature, index) => {
            const IconComponent = feature.icon
            
            return (
              <motion.div
                key={feature.title}
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
                    {feature.description}
                  </p>
                </div>

                <div className="space-y-3">
                  {feature.features.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-3 text-text-secondary-light dark:text-text-secondary-dark">
                      <div className="w-2 h-2 bg-secondary-light dark:bg-secondary-dark rounded-full" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Quest Path */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
          className="mb-16"
        >

          
          <div className="relative quest-path">
            <div className="flex justify-between items-center relative z-10">
              {questCheckpoints.map((checkpoint, index) => {
                const IconComponent = checkpoint.icon
                
                return (
                  <motion.div
                    key={checkpoint.name}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.8 + index * 0.2 }}
                    className={`quest-checkpoint flex flex-col items-center ${checkpoint.completed ? 'text-secondary-light dark:text-secondary-dark' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                      checkpoint.completed 
                        ? 'bg-gradient-to-br from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark animate-glow-pulse' 
                        : 'bg-background-alt-light/50 dark:bg-background-alt-dark/50 border border-primary-light/30 dark:border-primary-dark/30'
                    }`}>
                      <IconComponent className={`w-6 h-6 ${checkpoint.completed ? 'text-white' : 'text-text-secondary-light dark:text-text-secondary-dark'}`} />
                    </div>
                    <span className="text-sm font-medium text-center">{checkpoint.name}</span>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Community Stats */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 1.2 }}
          className="grid md:grid-cols-4 gap-8 text-center"
        >
          <div className="bg-gradient-to-br from-indigo-800/30 to-indigo-900/20 p-6 rounded-xl border border-indigo-600/30">
            <div className="text-3xl font-bold text-saffron-300 mb-2">2,500+</div>
            <div className="text-cream-200">Active Members</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-800/30 to-indigo-900/20 p-6 rounded-xl border border-indigo-600/30">
            <div className="text-3xl font-bold text-saffron-300 mb-2">50+</div>
            <div className="text-cream-200">Cities Worldwide</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-800/30 to-indigo-900/20 p-6 rounded-xl border border-indigo-600/30">
            <div className="text-3xl font-bold text-saffron-300 mb-2">100+</div>
            <div className="text-cream-200">Monthly Events</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-800/30 to-indigo-900/20 p-6 rounded-xl border border-indigo-600/30">
            <div className="text-3xl font-bold text-saffron-300 mb-2">15+</div>
            <div className="text-cream-200">Expert Acharyas</div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.4 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-saffron-500 to-saffron-600 text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 mx-auto ripple-button glow-border hover:shadow-xl transition-all duration-300"
          >
            <Users className="w-5 h-5" />
            Join the Community
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
