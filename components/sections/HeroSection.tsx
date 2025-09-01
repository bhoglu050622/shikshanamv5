'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { ArrowRight, Play, Sparkles, Star, Zap, BookOpen, Users, Award } from 'lucide-react'

// Enhanced 3D Mandala Component with better performance
function Mandala3D() {
  const mandalaRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (mandalaRef.current) {
      const rect = mandalaRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height
      setMousePosition({ x, y })
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    
    if (mandalaRef.current) {
      observer.observe(mandalaRef.current)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    
    return () => {
      observer.disconnect()
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleMouseMove])

  const springX = useSpring(mousePosition.x * 15, { stiffness: 100, damping: 30 })
  const springY = useSpring(mousePosition.y * 15, { stiffness: 100, damping: 30 })

  return (
    <motion.div
      ref={mandalaRef}
      className="absolute inset-0 flex items-center justify-center opacity-20 lg:opacity-30"
      style={{
        transform: `perspective(1000px) rotateX(${springY}deg) rotateY(${springX}deg)`,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      {/* Sacred Geometry Mandala */}
      <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]">
        {/* Outer Ring */}
        <motion.div
          className="absolute inset-0 border-2 border-primary-light/30 dark:border-primary-dark/30 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />

        {/* Middle Ring */}
        <motion.div
          className="absolute inset-8 md:inset-12 lg:inset-16 border border-secondary-light/25 dark:border-secondary-dark/25 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />

        {/* Inner Ring */}
        <motion.div
          className="absolute inset-16 md:inset-20 lg:inset-32 border border-accent-light/20 dark:border-accent-dark/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Sacred Symbols */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: -360 }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 md:w-3 md:h-3 bg-gradient-to-br from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark rounded-full"
              style={{
                transform: `rotate(${i * 45}deg) translateY(-120px)`,
              }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ 
                duration: 4, 
                delay: i * 0.2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
        
        {/* Om Symbol */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="text-3xl md:text-4xl lg:text-5xl text-primary-light/80 dark:text-primary-dark/80 font-sanskrit">ॐ</div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Enhanced Floating Particles Component
function FloatingParticles() {
  const particles = useMemo(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: (i * 12.5 + 5) % 100, // Deterministic positioning
      top: (i * 15 + 10) % 100,
      xOffset: (i * 7 - 14) % 40,
      duration: 5 + (i % 3),
      delay: (i * 0.5) % 3,
      size: 1 + (i % 2),
    })), []
  )

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-gradient-to-r from-primary-light/60 to-secondary-light/60 dark:from-primary-dark/60 dark:to-secondary-dark/60 rounded-full"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, particle.xOffset, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// Enhanced CTA Button Component
function PremiumCTAButton({ 
  children, 
  icon, 
  variant = "primary", 
  onClick,
  ...props 
}: {
  children: React.ReactNode
  icon?: React.ReactNode
  variant?: "primary" | "secondary"
  onClick?: () => void
  [key: string]: any
}) {
  return (
    <motion.button
      whileHover={{ 
        scale: 1.03,
        boxShadow: variant === "primary" 
          ? "0 20px 40px rgba(216, 67, 21, 0.3)" 
          : "0 15px 30px rgba(0, 0, 0, 0.2)"
      }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`
        group relative px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg flex items-center gap-2 md:gap-3
        transition-all duration-300 overflow-hidden cursor-pointer
        ${variant === "primary"
          ? "bg-gradient-to-r from-primary-light via-accent-light to-primary-light dark:from-primary-dark dark:via-accent-dark dark:to-primary-dark text-white shadow-lg hover:shadow-xl"
          : "border-2 border-primary-light/50 dark:border-primary-dark/50 text-primary-light dark:text-primary-dark hover:border-primary-light dark:hover:border-primary-dark hover:bg-primary-light/10 dark:hover:bg-primary-dark/10 bg-background-alt-light/50 dark:bg-background-alt-dark/50 backdrop-blur-sm"
        }
      `}
      {...props}
    >
      {/* Ripple Effect */}
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      />
      
      {/* Content */}
      <span className="relative z-10 flex items-center gap-2 md:gap-3">
        {icon}
        <span className="whitespace-nowrap">{children}</span>
        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
      </span>
      
      {/* Glow Effect */}
      <div className={`absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 ${
        variant === "primary" 
          ? "bg-gradient-to-r from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark"
          : "bg-gradient-to-r from-primary-light/50 to-secondary-light/50 dark:from-primary-dark/50 dark:to-secondary-dark/50"
      }`} />
    </motion.button>
  )
}

// Enhanced Feature Card Component
function FeatureCard({ icon, title, description, delay }: {
  icon: React.ReactNode
  title: string
  description: string
  delay: number
}) {
  return (
    <motion.div
      className="card-enhanced p-3 md:p-4 rounded-xl text-center backdrop-blur-sm border border-primary-light/20 dark:border-primary-dark/20 hover:border-primary-light/40 dark:hover:border-primary-dark/40 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.12)" }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: "easeOut"
      }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <div className="text-2xl md:text-3xl mb-2 md:mb-3">{icon}</div>
      <p className="text-xs md:text-sm text-text-secondary-light/90 dark:text-text-secondary-dark/90 leading-relaxed font-medium">{description}</p>
    </motion.div>
  )
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  
  const titleY = useTransform(scrollY, [0, 500], [0, -100])
  const titleOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const backgroundScale = useTransform(scrollY, [0, 500], [1, 1.15])
  const mandalaOpacity = useTransform(scrollY, [0, 300], [1, 0.3])

  const features = [
    { 
      icon: "🎯", 
      title: "Personalized Learning", 
      description: "AI-powered curriculum tailored to your spiritual journey" 
    },
    { 
      icon: "🌟", 
      title: "Expert Guidance", 
      description: "Learn from authentic masters and ancient scholars" 
    },
    { 
      icon: "🚀", 
      title: "Immersive Technology", 
      description: "3D experiences and interactive wisdom simulations" 
    }
  ]

  const handlePrimaryCTA = () => {
    // Add your primary CTA logic here
    console.log('Primary CTA clicked')
  }

  const handleSecondaryCTA = () => {
    // Add your secondary CTA logic here
    console.log('Secondary CTA clicked')
  }

  return (
    <section 
      ref={containerRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-background-alt-light via-background-light to-background-alt-light dark:from-background-alt-dark dark:via-background-dark dark:to-background-alt-dark"
    >
      {/* Enhanced Background */}
      <motion.div 
        className="absolute inset-0"
        style={{ scale: backgroundScale }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background-alt-light/80 via-background-light/60 to-background-alt-light/80 dark:from-background-alt-dark/80 dark:via-background-dark/60 dark:to-background-alt-dark/80" />
        <div className="absolute inset-0 mandala-bg opacity-10" />
        <div className="absolute inset-0 sacred-geometry opacity-5" />
      </motion.div>

      {/* Enhanced 3D Mandala */}
      <motion.div style={{ opacity: mandalaOpacity }}>
        <Mandala3D />
      </motion.div>
      
      {/* Enhanced Floating Particles */}
      <FloatingParticles />

      {/* Content Container */}
      <div className="relative z-10 text-center px-4 md:px-6 lg:px-8 max-w-7xl mx-auto h-full flex flex-col justify-center">


        {/* Enhanced Main Title */}
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="mb-4 md:mb-6"
        >
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold mb-3 md:mb-4 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          >
            <span className="text-gradient-cosmic glow-gold">Master</span>
            <br />
            <span className="text-text-light dark:text-text-dark">Ancient Indian</span>
            <br />
            <span className="text-gradient-gold glow-saffron">Philosophy Today</span>
          </motion.h1>
          
          {/* Enhanced Sanskrit Subtitle */}
          <motion.p
            className="text-base md:text-lg lg:text-xl text-primary-light/90 dark:text-primary-dark/90 mb-2 md:mb-3 font-sanskrit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          >
            ज्ञानं परमं बलम् • Knowledge is Supreme Power
          </motion.p>
        </motion.div>
        
        {/* Enhanced Description */}
        <motion.p
          className="text-base md:text-lg lg:text-xl text-text-secondary-light/90 dark:text-text-secondary-dark/90 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <strong>Transform your life</strong> with the world's most comprehensive online platform for 
          <strong> Six Darshanas</strong> - Vedanta, Yoga, Samkhya, Nyaya, Vaisheshika & Mimamsa. 
          <strong> Join 10,000+ seekers</strong> mastering ancient wisdom through cutting-edge technology.
        </motion.p>

        {/* Enhanced CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-6 md:mb-8 px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
        >
          <PremiumCTAButton
            icon={<Play className="w-4 h-4 md:w-5 md:h-5" />}
            variant="primary"
            onClick={handlePrimaryCTA}
          >
            Secure Your Seat Now
          </PremiumCTAButton>
          
          <PremiumCTAButton
            icon={<Zap className="w-4 h-4 md:w-5 md:h-5" />}
            variant="secondary"
            onClick={handleSecondaryCTA}
          >
            Discover Shikshanam
          </PremiumCTAButton>
        </motion.div>

        {/* Enhanced Premium Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto px-4"
        >
          {[
            { 
              icon: "🎯", 
              title: "AI-Powered Learning", 
              description: "Personalized curriculum adapting to your spiritual journey & progress" 
            },
            { 
              icon: "🏆", 
              title: "Expert Acharyas", 
              description: "Learn directly from authentic masters with 20+ years of teaching experience" 
            },
            { 
              icon: "🚀", 
              title: "Immersive Technology", 
              description: "3D experiences, VR simulations & interactive wisdom applications" 
            }
          ].map((feature, i) => (
            <FeatureCard
              key={i}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={1.1 + i * 0.1}
            />
          ))}
        </motion.div>
      </div>


    </section>
  )
}
