'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { Play, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function AboutShikshanam() {
  const ref = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)
  const playButtonRef = useRef<HTMLDivElement>(null)
  const mandalaRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  // GSAP animations
  useEffect(() => {
    if (!isInView) return

    // Mandala background animation
    if (mandalaRef.current) {
      gsap.to(mandalaRef.current, {
        rotation: 360,
        duration: 60,
        repeat: -1,
        ease: "none"
      })
    }

    // Play button pulse animation
    if (playButtonRef.current) {
      gsap.to(playButtonRef.current, {
        scale: 1.1,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      })
    }
  }, [isInView])

  // Video hover effect
  const handleVideoHover = () => {
    if (videoRef.current && !isVideoPlaying) {
      gsap.to(videoRef.current, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      })
    }
  }

  const handleVideoLeave = () => {
    if (videoRef.current && !isVideoPlaying) {
      gsap.to(videoRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      })
    }
  }

  const handleVideoClick = () => {
    setIsVideoPlaying(true)
    if (videoRef.current) {
      gsap.to(videoRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      })
    }
  }

  return (
    <section ref={ref} className="relative py-32 px-4 overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-bg-secondary/20 via-bg-primary/10 to-bg-secondary/10" />
      
      {/* Animated mandala accents */}
      <div ref={mandalaRef} className="absolute top-1/4 right-1/4 w-64 h-64 opacity-10">
        <div className="w-full h-full border border-primary-light/20 dark:border-primary-dark/20 rounded-full" />
        <div className="absolute inset-8 border border-secondary-light/15 dark:border-secondary-dark/15 rounded-full" />
        <div className="absolute inset-16 border border-accent-light/10 dark:border-accent-dark/10 rounded-full" />
      </div>
      
      <div className="absolute bottom-1/4 left-1/4 w-48 h-48 opacity-8">
        <div className="w-full h-full border border-secondary-light/15 dark:border-secondary-dark/15 rounded-full" />
        <div className="absolute inset-6 border border-primary-light/10 dark:border-primary-dark/10 rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - YouTube Video */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div
              ref={videoRef}
              className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl cursor-pointer transition-transform duration-300"
              onMouseEnter={handleVideoHover}
              onMouseLeave={handleVideoLeave}
              onClick={handleVideoClick}
            >
              {!isVideoPlaying ? (
                <>
                  {/* Custom thumbnail overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10" />
                  
                  {/* Mandala overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 border-2 border-white/30 dark:border-white/30 rounded-full relative">
                      <div className="absolute inset-4 border border-white/20 dark:border-white/20 rounded-full" />
                      <div className="absolute inset-8 border border-white/10 dark:border-white/10 rounded-full" />
                    </div>
                  </div>
                  
                  {/* Play button */}
                  <div
                    ref={playButtonRef}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-20 h-20 bg-bg-primary rounded-full flex items-center justify-center shadow-lg">
                      <Play className="w-8 h-8 text-primary-light dark:text-primary-dark ml-1" />
                    </div>
                  </div>
                  
                  {/* Video placeholder */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
                </>
              ) : (
                <iframe
                  src="https://www.youtube.com/embed/kc6D24nSg04?si=lFFuGcC9ktL-I-OW&autoplay=1"
                  title="Shikshanam Journey Video"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  aria-label="Shikshanam journey video - Where Ancient Wisdom Meets Modern Seekers"
                />
              )}
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 rounded-full border border-accent-primary/20"
            >
              <Sparkles className="w-4 h-4 text-primary-light dark:text-primary-dark" />
              <span className="text-primary-light dark:text-primary-dark font-medium">Our Story</span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-4xl md:text-5xl font-serif font-bold text-gradient-cosmic glow-gold leading-tight"
            >
              Shikshanam: Where Ancient Wisdom Meets Modern Seekers
            </motion.h2>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-xl text-text-secondary-light/90 dark:text-text-secondary-dark/90 leading-relaxed"
            >
              From Sanskrit sutras to global classrooms, Shikshanam is reimagining Indian philosophy for the world. Watch our journey.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <Link
                href="/courses/all-courses"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-light/30 dark:focus:ring-primary-dark/30"
                aria-label="Join Shikshanam and share wisdom - Explore all courses"
              >
                <span>Join and share wisdom</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
