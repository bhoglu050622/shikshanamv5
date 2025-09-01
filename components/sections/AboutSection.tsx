'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Sparkles, Star, Heart, Users, BookOpen, Target } from 'lucide-react'

// Optimized 3D Card Component
function Card3D({ children, className = "" }: {
  children: React.ReactNode
  className?: string
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      
      const rotateX = (y - centerY) / 15
      const rotateY = (centerX - x) / 15
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    }

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    }

    card.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <motion.div
      ref={cardRef}
      className={`card-enhanced p-8 rounded-2xl transition-all duration-300 ${className}`}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      {children}
    </motion.div>
  )
}

// Sacred Geometry Background
function SacredGeometry() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-15">
      <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-primary-light/20 dark:border-primary-dark/20 rotate-45" />
      <div className="absolute top-3/4 right-1/4 w-24 h-24 border border-secondary-light/20 dark:border-secondary-dark/20 -rotate-45" />
      <div className="absolute bottom-1/4 left-1/3 w-40 h-40 border border-accent-light/15 dark:border-accent-dark/15 rotate-90" />
      <div className="absolute top-1/2 left-1/2 w-16 h-16 border border-primary-light/15 dark:border-primary-dark/15 -rotate-12" />
    </div>
  )
}

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  return (
    <section ref={ref} className="relative py-32 px-4 overflow-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background-alt-light/40 via-background-alt-light/20 to-background-light/10 dark:from-background-alt-dark/40 dark:via-background-alt-dark/20 dark:to-background-dark/10" />
      <SacredGeometry />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-primary-light to-secondary-light rounded-full dark:from-primary-dark dark:to-secondary-dark"
            style={{
              left: `${20 + i * 20}%`,
              top: `${30 + i * 15}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-light/15 to-secondary-light/15 rounded-full border border-primary-light/20 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4 text-primary-light dark:text-primary-dark" />
            <span className="text-primary-light dark:text-primary-dark font-medium">About Our Mission</span>
            <Star className="w-4 h-4 text-primary-light dark:text-primary-dark" />
          </motion.div>

          <motion.h2 
            className="text-5xl md:text-6xl font-serif font-bold mb-8 text-gradient-cosmic glow-gold"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Why Choose Shikshanam?
          </motion.h2>
          
          <motion.p 
            className="text-2xl md:text-3xl text-text-secondary-light/90 dark:text-text-secondary-dark/90 mb-8 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <strong>Join 10,000+ spiritual seekers</strong> who've transformed their lives through the world's most comprehensive 
            <strong> Six Darshanas learning platform</strong>. Where ancient wisdom meets modern technology for life-changing results.
          </motion.p>

          {/* Sanskrit Quote */}
          <motion.div
            className="bg-gradient-to-r from-background-alt-light/8 to-primary-light/8 p-8 rounded-2xl border border-primary-light/15 max-w-3xl mx-auto dark:from-background-alt-dark/8 dark:to-primary-dark/8 dark:border-primary-dark/15"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <p className="text-3xl font-sanskrit text-primary-light/90 dark:text-primary-dark/90 mb-4">
              विद्या ददाति विनयं
            </p>
            <p className="text-lg text-text-secondary-light/80 dark:text-text-secondary-dark/80 italic">
              "Knowledge gives discipline, discipline gives worthiness, worthiness gives wealth, wealth gives good deeds, and good deeds give happiness."
            </p>
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Founding Vision */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div>
              <p className="text-text-secondary-light/90 dark:text-text-secondary-dark/90 text-lg leading-relaxed mb-8">
                <strong>We're revolutionizing spiritual education</strong> by making India's 5000-year-old philosophical wisdom 
                accessible to everyone. Through <strong>AI-powered learning, expert Acharyas, and immersive technology</strong>, 
                we're helping modern seekers achieve profound personal transformation and spiritual growth.
              </p>
            </div>

            {/* Founders Cards */}
            <div className="space-y-6">
              <Card3D className="about-card">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-light to-secondary-light rounded-full flex items-center justify-center dark:from-primary-dark dark:to-secondary-dark">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                                <p className="text-text-secondary-light/90 dark:text-text-secondary-dark/90 font-medium">Founder & Visionary</p>
            <p className="text-sm text-text-secondary-light/80 dark:text-text-secondary-dark/80 mt-2">
              Dedicated to preserving and sharing India's spiritual heritage
            </p>
                  </div>
                </div>
              </Card3D>

              <Card3D className="about-card">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary-light to-accent-light rounded-full flex items-center justify-center dark:from-secondary-dark dark:to-accent-dark">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <div>
                                <p className="text-text-secondary-light/90 dark:text-text-secondary-dark/90 font-medium">Co-founder & Technologist</p>
            <p className="text-sm text-text-secondary-light/80 dark:text-text-secondary-dark/80 mt-2">
              Bridging ancient wisdom with modern technology
            </p>
                  </div>
                </div>
              </Card3D>
            </div>
          </motion.div>
          
          {/* Mission Statement */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <div>
              <p className="text-text-secondary-light/90 dark:text-text-secondary-dark/90 text-lg leading-relaxed mb-8">
                To create a premium learning ecosystem that honors the depth and authenticity of India's 
                philosophical traditions while leveraging the latest in educational technology and 
                immersive experiences.
              </p>
            </div>

            {/* Mission Pillars */}
            <div className="space-y-6">
              <Card3D className="about-card">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald to-primary-light rounded-full flex items-center justify-center dark:from-emerald dark:to-primary-dark">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-text-secondary-light/90 dark:text-text-secondary-dark/90 text-sm font-medium">
                      Preserving the essence of traditional teachings
                    </p>
                  </div>
                </div>
              </Card3D>

              <Card3D className="about-card">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple to-secondary-light rounded-full flex items-center justify-center dark:from-purple dark:to-secondary-dark">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-text-secondary-light/90 dark:text-text-secondary-dark/90 text-sm font-medium">
                      Building meaningful connections and support networks
                    </p>
                  </div>
                </div>
              </Card3D>

              <Card3D className="about-card">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose to-primary-light rounded-full flex items-center justify-center dark:from-rose dark:to-primary-dark">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-text-secondary-light/90 dark:text-text-secondary-dark/90 text-sm font-medium">
                      Leveraging technology for immersive learning experiences
                    </p>
                  </div>
                </div>
              </Card3D>
            </div>
          </motion.div>
        </div>

        {/* Bottom Quote */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Card3D className="max-w-4xl mx-auto">
            <p className="text-2xl font-serif text-center text-text-light/95 dark:text-text-dark/95 mb-4">
              "Built by educators, creators, and technologists—rooted in wisdom, scaled by community."
            </p>
            <div className="flex justify-center gap-4">
              <div className="w-2 h-2 bg-primary-light rounded-full dark:bg-primary-dark" />
              <div className="w-2 h-2 bg-secondary-light rounded-full dark:bg-secondary-dark" />
              <div className="w-2 h-2 bg-accent-light rounded-full dark:bg-accent-dark" />
            </div>
          </Card3D>
        </motion.div>
      </div>
    </section>
  )
}
