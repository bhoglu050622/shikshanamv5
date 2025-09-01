'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { ArrowRight, Linkedin, Twitter, Mail, Users, Video, Palette, Database } from 'lucide-react'

const teamMembers = [
  {
    name: 'Vishal Chaurasia',
    role: 'Founder',
    description: 'Leading the vision of bridging ancient wisdom with modern technology',
    contribution: 'Strategic vision, content creation, community building',
    image: '/api/placeholder/200/200',
    social: { linkedin: '#', twitter: '#', email: 'vishal@shikshanam.com' },
    category: 'founder'
  },
  {
    name: 'Aman Bhogal',
    role: 'Co-founder',
    description: 'Driving innovation in educational technology and user experience',
    contribution: 'Product strategy, technology architecture, user experience',
    image: '/api/placeholder/200/200',
    social: { linkedin: '#', twitter: '#', email: 'aman@shikshanam.com' },
    category: 'founder'
  },
  {
    name: 'Sneha Singh',
    role: 'Co-founder',
    description: 'Expert in curriculum development and educational content',
    contribution: 'Curriculum design, content strategy, learning methodologies',
    image: '/api/placeholder/200/200',
    social: { linkedin: '#', twitter: '#', email: 'sneha@shikshanam.com' },
    category: 'core'
  },
  {
    name: 'Sumit Prajapati',
    role: 'Senior Video Editor',
    description: 'Creating compelling visual narratives for complex philosophical concepts',
    contribution: 'Video production, post-production, visual storytelling',
    image: '/api/placeholder/200/200',
    social: { linkedin: '#', email: 'sumit@shikshanam.com' },
    category: 'core'
  },
  {
    name: 'Ashta Sharma',
    role: 'Social Media Manager',
    description: 'Building engaging communities across digital platforms',
    contribution: 'Social media strategy, community engagement, content distribution',
    image: '/api/placeholder/200/200',
    social: { linkedin: '#', twitter: '#', email: 'ashta@shikshanam.com' },
    category: 'core'
  },
  {
    name: 'Harsh Jaiswal',
    role: 'Video Editor',
    description: 'Crafting visual experiences that make wisdom accessible',
    contribution: 'Video editing, motion graphics, content optimization',
    image: '/api/placeholder/200/200',
    social: { linkedin: '#', email: 'harsh@shikshanam.com' },
    category: 'core'
  },
  {
    name: 'Sajal Sahay',
    role: 'Content Manager',
    description: 'Curating and organizing our vast knowledge repository',
    contribution: 'Content curation, knowledge management, quality assurance',
    image: '/api/placeholder/200/200',
    social: { linkedin: '#', email: 'sajal@shikshanam.com' },
    category: 'core'
  },
  {
    name: 'Gargi Nawani',
    role: 'Graphic Designer',
    description: 'Creating visual identities that honor tradition and embrace modernity',
    contribution: 'Visual design, brand identity, user interface design',
    image: '/api/placeholder/200/200',
    social: { linkedin: '#', email: 'gargi@shikshanam.com' },
    category: 'core'
  },
  {
    name: 'Akil',
    role: 'Associate Video Editor',
    description: 'Supporting our video production with technical expertise',
    contribution: 'Video editing, technical support, content preparation',
    image: '/api/placeholder/200/200',
    social: { linkedin: '#', email: 'akil@shikshanam.com' },
    category: 'core'
  },
  {
    name: 'Omkar Sen',
    role: 'Data Manager',
    description: 'Ensuring data integrity and insights for our learning platform',
    contribution: 'Data management, analytics, platform optimization',
    image: '/api/placeholder/200/200',
    social: { linkedin: '#', email: 'omkar@shikshanam.com' },
    category: 'core'
  }
]

export default function TeamSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    const initTeamAnimation = async () => {
      const { gsap } = await import('gsap')
      
      if (ref.current && isInView) {
        const cards = ref.current.querySelectorAll('.team-card')
        
        gsap.fromTo(cards,
          { 
            opacity: 0,
            y: 100,
            rotationY: 15
          },
          {
            opacity: 1,
            y: 0,
            rotationY: 0,
            duration: 1,
            stagger: 0.1,
            ease: "backOut"
          }
        )
      }
    }

    initTeamAnimation()
  }, [isInView])

  const founders = teamMembers.filter(member => member.category === 'founder')
  const coreTeam = teamMembers.filter(member => member.category === 'core')

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
            Founders & Team
          </motion.h2>
          <p className="text-xl text-text-secondary-light dark:text-text-secondary-dark max-w-3xl mx-auto">
            Meet the passionate individuals behind Shikshanam's mission to democratize wisdom
          </p>
        </motion.div>

        {/* Founders */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-20"
        >

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {founders.map((founder, index) => (
              <motion.div
                key={founder.name}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.2 }}
                className="team-card group relative"
              >
                <div className="glass-effect p-8 rounded-2xl border border-white/10 dark:border-white/5 hover:border-primary-light/30 dark:hover:border-primary-dark/30 transition-all duration-500 hover:shadow-xl backdrop-blur-sm">
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark flex items-center justify-center text-white text-2xl font-bold">
                      {founder.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <p className="text-secondary-light dark:text-secondary-dark font-semibold mb-2">{founder.role}</p>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
                      {founder.description}
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-text-secondary-light dark:text-text-secondary-dark">
                      <Users className="w-4 h-4 text-primary-light dark:text-primary-dark" />
                      <span className="text-sm">{founder.contribution}</span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4">
                    {founder.social.linkedin && (
                      <a href={founder.social.linkedin} className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {founder.social.twitter && (
                      <a href={founder.social.twitter} className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors">
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    {founder.social.email && (
                      <a href={`mailto:${founder.social.email}`} className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors">
                        <Mail className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Core Team */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
        >

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {coreTeam.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                className="team-card group relative"
              >
                <div className="glass-effect p-6 rounded-2xl border border-white/10 dark:border-white/5 hover:border-primary-light/30 dark:hover:border-primary-dark/30 transition-all duration-500 hover:shadow-xl backdrop-blur-sm">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark flex items-center justify-center text-white font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <p className="text-secondary-light dark:text-secondary-dark font-semibold mb-2">{member.role}</p>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs mb-3">
                      {member.description}
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="flex justify-center gap-3">
                      {member.social.linkedin && (
                        <a href={member.social.linkedin} className="text-cream-400 hover:text-saffron-300 transition-colors">
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {member.social.twitter && (
                        <a href={member.social.twitter} className="text-cream-400 hover:text-saffron-300 transition-colors">
                          <Twitter className="w-4 h-4" />
                        </a>
                      )}
                      {member.social.email && (
                        <a href={`mailto:${member.social.email}`} className="text-cream-400 hover:text-saffron-300 transition-colors">
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Join Us CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 1.4 }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-saffron-500/20 to-indigo-500/20 p-8 rounded-2xl border border-saffron-400/30 glow-border max-w-2xl mx-auto">

            <p className="text-cream-200 mb-6">
              We're always looking for passionate individuals who share our vision of making ancient wisdom accessible to everyone.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border border-saffron-400/30 text-saffron-300 px-6 py-3 rounded-lg font-semibold hover:border-saffron-400 hover:text-saffron-200 transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <Users className="w-4 h-4" />
              View Open Positions
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
