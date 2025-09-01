'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { ArrowRight, Play, Users, BookOpen, Calendar, Clock, Star } from 'lucide-react'

const learningOpportunities = [
  {
    title: 'FREE Masterclass Series',
    description: 'Experience the power of ancient wisdom with zero commitment',
    features: ['100% Free Access', 'Expert Acharyas', 'Live Q&A Sessions', 'Certificate Included'],
    icon: Play,
    color: 'from-emerald to-primary-light dark:from-emerald dark:to-primary-dark',
    cta: 'Claim Free Access Now',
    popular: false
  },
  {
    title: 'Live Interactive Classes',
    description: 'Real-time learning with world-renowned spiritual masters',
    features: ['Direct Master Interaction', 'Breakout Discussions', 'Lifetime Access', 'Community Membership'],
    icon: Users,
    color: 'from-accent-light to-primary-light dark:from-accent-dark dark:to-primary-dark',
    cta: 'Join Live Session Today',
    popular: true
  },
  {
    title: 'Complete Certification Program',
    description: 'Master all Six Darshanas with personalized guidance',
    features: ['Comprehensive Curriculum', '1-on-1 Mentoring', 'Official Certification', 'Lifetime Access'],
    icon: BookOpen,
    color: 'from-purple to-accent-light dark:from-purple dark:to-accent-dark',
    cta: 'Enroll in Full Program',
    popular: false
  }
]

export default function LearningSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    const initScrollAnimation = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      
      if (ref.current && isInView) {
        const cards = ref.current.querySelectorAll('.learning-card')
        
        gsap.fromTo(cards,
          { 
            opacity: 0,
            y: 100,
            scale: 0.8
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            stagger: 0.3,
            ease: "backOut",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        )
      }
    }

    initScrollAnimation()
  }, [isInView])

  return (
    <section ref={ref} className="relative py-20 px-4 bg-gradient-to-b from-background-alt-light/50 to-background-light/30 dark:from-background-alt-dark/50 dark:to-background-dark/30 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
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
            Learning Opportunities
          </motion.h2>
          <p className="text-xl text-text-secondary-light dark:text-text-secondary-dark max-w-3xl mx-auto">
            <strong>Start your spiritual journey today</strong> with our proven learning pathways designed for every seeker, 
            from beginners to advanced practitioners. <strong>Join thousands who've already transformed their lives.</strong>
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {learningOpportunities.map((opportunity, index) => {
            const IconComponent = opportunity.icon
            
            return (
              <motion.div
                key={opportunity.title}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`learning-card relative bg-gradient-to-br from-background-alt-light/50 to-background-light/30 dark:from-background-alt-dark/50 dark:to-background-dark/30 p-8 rounded-2xl border border-primary-light/30 dark:border-primary-dark/30 hover:border-secondary-light/50 dark:hover:border-secondary-dark/50 transition-all duration-500 hover:shadow-xl ${
                  opportunity.popular ? 'ring-2 ring-secondary-light/50 dark:ring-secondary-dark/50' : ''
                }`}
              >
                {opportunity.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${opportunity.color} flex items-center justify-center`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark">
                    {opportunity.description}
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  {opportunity.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3 text-text-secondary-light dark:text-text-secondary-dark">
                      <div className="w-2 h-2 bg-secondary-light dark:bg-secondary-dark rounded-full" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    opportunity.popular
                      ? 'bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark text-white hover:shadow-lg'
                      : 'border border-secondary-light/30 dark:border-secondary-dark/30 text-secondary-light dark:text-secondary-dark hover:border-secondary-light dark:hover:border-secondary-dark hover:text-primary-light dark:hover:text-primary-dark'
                  }`}
                >
                  {opportunity.cta}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )
          })}
        </div>

        {/* Next Class CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-primary-light/20 to-accent-light/20 dark:from-primary-dark/20 dark:to-accent-dark/20 p-8 rounded-2xl border border-secondary-light/30 dark:border-secondary-dark/30 glow-border max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Calendar className="w-6 h-6 text-secondary-light dark:text-secondary-dark" />
              <span className="text-xl font-semibold text-primary-light dark:text-primary-dark">Next Live Class</span>
              <Clock className="w-6 h-6 text-secondary-light dark:text-secondary-dark" />
            </div>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
              "Introduction to Vedanta" with Acharya Vishal Chaurasia
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 mx-auto ripple-button glow-border hover:shadow-xl transition-all duration-300"
            >
              <Play className="w-5 h-5" />
              Join the Next Class
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
