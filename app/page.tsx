'use client'

import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useInView } from 'framer-motion'
import HeroSection from '@/components/sections/HeroSection'
import AuthStatus from '@/components/AuthStatus'
import AboutSection from '@/components/sections/AboutSection'
import AboutShikshanam from '@/components/homepage/AboutShikshanam'
import DarshanasSection from '@/components/sections/DarshanasSection'
import LearningSection from '@/components/sections/LearningSection'
import EconomySection from '@/components/sections/EconomySection'
import ShopSection from '@/components/sections/ShopSection'
import TeamSection from '@/components/sections/TeamSection'
import FooterSection from '@/components/sections/FooterSection'

// Optimized Scroll Animation Hook
function useOptimizedScrollAnimation() {
  const { scrollY } = useScroll()
  const springConfig = { damping: 25, stiffness: 120 }
  
  const backgroundY = useSpring(
    useTransform(scrollY, [0, 1000], [0, -150]),
    springConfig
  )
  
  const mandalaRotation = useSpring(
    useTransform(scrollY, [0, 1000], [0, 180]),
    springConfig
  )
  
  const opacity = useSpring(
    useTransform(scrollY, [0, 300], [1, 0.4]),
    springConfig
  )
  
  return { backgroundY, mandalaRotation, opacity }
}

// Optimized Parallax Section Component
function ParallaxSection({ children, speed = 0.3, className = "" }: {
  children: React.ReactNode
  speed?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -50 * speed])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  
  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className={`parallax-layer ${className}`}
    >
      {children}
    </motion.div>
  )
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { backgroundY, mandalaRotation, opacity } = useOptimizedScrollAnimation()

  useEffect(() => {
    // Optimized scroll performance
    const handleScroll = () => {
      // Throttle scroll events for better performance
      if (containerRef.current) {
        containerRef.current.style.willChange = 'transform'
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (containerRef.current) {
        containerRef.current.style.willChange = 'auto'
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="relative overflow-hidden" style={{ position: 'relative' }}>
      {/* Optimized Background Elements */}
      <motion.div 
        style={{ y: backgroundY }}
        className="fixed inset-0 z-0"
      >
        <div className="absolute inset-0 mandala-bg opacity-20" />
        <div className="absolute inset-0 sacred-geometry" />
        
        {/* Floating Mandala with reduced complexity */}
        <motion.div
          style={{ rotate: mandalaRotation }}
          className="absolute top-1/4 right-1/4 w-80 h-80 opacity-15"
        >
          <div className="w-full h-full border border-primary-light/15 dark:border-primary-dark/15 rounded-full" />
          <div className="absolute inset-8 border border-secondary-light/10 dark:border-secondary-dark/10 rounded-full" />
        </motion.div>
        
        {/* Simplified Cosmic Particles */}
        <div className="absolute inset-0 cosmic-particles opacity-20" />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10" style={{ position: 'relative' }}>
        <main className="min-h-screen">
          {/* Hero Section */}
          <section id="discover" className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <HeroSection />
          </section>

          {/* About Section */}
          <section id="journey" className="premium-section">
            <ParallaxSection speed={0.2} className="premium-section">
              <AboutSection />
            </ParallaxSection>
          </section>

          {/* About Shikshanam Section */}
          <section id="about-shikshanam" className="premium-section">
            <AboutShikshanam />
          </section>

          {/* Darshanas Section */}
          <section id="learning" className="premium-section">
            <DarshanasSection />
          </section>

          {/* Learning Section */}
          <section id="gurus" className="premium-section">
            <ParallaxSection speed={0.25} className="premium-section">
              <LearningSection />
            </ParallaxSection>
          </section>

          {/* Economy Section */}
          <section id="resources" className="premium-section">
            <ParallaxSection speed={0.15} className="premium-section">
              <EconomySection />
            </ParallaxSection>
          </section>

          {/* Shop Section */}
          <section id="enroll" className="premium-section">
            <ShopSection />
          </section>

          {/* Team Section */}
          <section className="premium-section">
            <ParallaxSection speed={0.2} className="premium-section">
              <TeamSection />
            </ParallaxSection>
          </section>

          {/* Footer Section */}
          <section className="premium-section">
            <FooterSection />
          </section>
        </main>
      </div>

      {/* Auth Status (for testing) */}
      <AuthStatus />

      {/* Optimized Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-primary-light via-secondary-light to-accent-light dark:from-primary-dark dark:via-secondary-dark dark:to-accent-dark origin-left"
        initial={{ scaleX: 0 }}
        style={{
          opacity,
          scaleX: useTransform(useScroll().scrollYProgress, [0, 1], [0, 1])
        }}
      />
    </div>
  )
}
