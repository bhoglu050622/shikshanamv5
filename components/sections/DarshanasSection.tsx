'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Sparkles, Star, BookOpen, Brain, Heart, Target, Zap, Eye } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'

// 3D Chakra Node Component
function ChakraNode3D({ 
  title, 
  description, 
  icon, 
  color, 
  position, 
  delay = 0 
}: {
  title: string
  description: string
  icon: React.ReactNode
  color: string
  position: { x: number; y: number }
  delay?: number
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const nodeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = nodeRef.current
    if (!node) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered) return
      
      const rect = node.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      
      const rotateX = (y / rect.height) * 20
      const rotateY = (x / rect.width) * 20
      
      node.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.1, 1.1, 1.1)`
    }

    const handleMouseLeave = () => {
      node.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    }

    if (isHovered) {
      node.addEventListener('mousemove', handleMouseMove)
      node.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      node.removeEventListener('mousemove', handleMouseMove)
      node.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isHovered])

  return (
    <motion.div
      ref={nodeRef}
      className="absolute"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 1, delay, ease: "backOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => setIsActive(!isActive)}
    >
      {/* Main Chakra Node */}
      <motion.div
        className={`relative w-24 h-24 rounded-full cursor-pointer transition-all duration-500 ${color}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: isHovered 
            ? `0 0 40px ${color.replace('bg-', '').replace('-', '')}/50` 
            : `0 0 20px ${color.replace('bg-', '').replace('-', '')}/30`
        }}
      >
        {/* Rotating Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner Ring */}
        <motion.div
          className="absolute inset-2 rounded-full border border-white/20"
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Icon */}
        <div className="absolute inset-0 flex items-center justify-center text-white">
          {icon}
        </div>
        
        {/* Pulse Effect */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/20"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 w-64 p-4 glass-effect rounded-xl border border-white/10 z-50"
          >
            <p className="text-sm text-text-secondary-light/80 dark:text-text-secondary-dark/80">{description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Floating Particles Component for Darshanas
function FloatingParticlesDarshanas() {
  const [particles, setParticles] = useState<Array<{
    id: number
    left: number
    top: number
    duration: number
    delay: number
  }>>([])

  useEffect(() => {
    // Generate particles only on client side to avoid hydration mismatch
    const generatedParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 4 + Math.random() * 2,
      delay: Math.random() * 2,
    }))
    setParticles(generatedParticles)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark rounded-full float-darshanas"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  )
}

// Sacred Geometry Background
function SacredGeometryBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-30">
      {/* Mandala Pattern */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96">
        <motion.div
          className="absolute inset-0 border border-primary-light/20 dark:border-primary-dark/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-8 border border-secondary-light/15 dark:border-secondary-dark/15 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-16 border border-accent-light/10 dark:border-accent-dark/10 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Geometric Shapes */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-primary-light/20 dark:border-primary-dark/20 rotate-45" />
      <div className="absolute top-3/4 right-1/4 w-24 h-24 border border-secondary-light/15 dark:border-secondary-dark/15 -rotate-45" />
      <div className="absolute bottom-1/4 left-1/3 w-40 h-40 border border-accent-light/10 dark:border-accent-dark/10 rotate-90" />
    </div>
  )
}

export default function DarshanasSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  const darshanas = [
    {
      title: "Vedanta",
      description: "Master the ultimate truth of non-duality and achieve spiritual liberation",
      icon: <Eye className="w-8 h-8" />,
      color: "bg-gradient-to-br from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark",
      position: { x: 20, y: 30 }
    },
    {
      title: "Yoga",
      description: "Transform your life through spiritual discipline and divine union",
      icon: <Heart className="w-8 h-8" />,
      color: "bg-gradient-to-br from-secondary-light to-accent-light dark:from-secondary-dark dark:to-accent-dark",
      position: { x: 80, y: 20 }
    },
    {
      title: "Samkhya",
      description: "Unlock the secrets of consciousness through analytical wisdom",
      icon: <Brain className="w-8 h-8" />,
      color: "bg-gradient-to-br from-accent-light to-purple dark:from-accent-dark dark:to-purple",
      position: { x: 15, y: 70 }
    },
    {
      title: "Nyaya",
      description: "Master logical reasoning and discover the path to true knowledge",
      icon: <Target className="w-8 h-8" />,
      color: "bg-gradient-to-br from-emerald to-accent-light dark:from-emerald dark:to-accent-dark",
      position: { x: 85, y: 80 }
    },
    {
      title: "Vaisheshika",
      description: "Understand the atomic nature of reality and cosmic principles",
      icon: <Zap className="w-8 h-8" />,
      color: "bg-gradient-to-br from-purple to-accent-light dark:from-purple dark:to-accent-dark",
      position: { x: 50, y: 15 }
    },
    {
      title: "Mimamsa",
      description: "Master the science of rituals and sacred interpretation",
      icon: <BookOpen className="w-8 h-8" />,
      color: "bg-gradient-to-br from-accent-light to-primary-light dark:from-accent-dark dark:to-primary-dark",
      position: { x: 50, y: 85 }
    }
  ]

  useEffect(() => {
    const initDarshanasAnimation = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      
      gsap.registerPlugin(ScrollTrigger)
      
      // Floating animation for background elements
      gsap.to('.float-darshanas', {
        y: -30,
        duration: 6,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.5
      })
    }

    initDarshanasAnimation()
  }, [])

  return (
    <section ref={ref} className="relative py-32 px-4 overflow-hidden min-h-screen flex items-center bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark" style={{ position: 'relative' }}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background-alt-light/50 via-background-alt-light/30 to-background-light/20 dark:from-background-alt-dark/50 dark:via-background-alt-dark/30 dark:to-background-dark/20" />
      <SacredGeometryBackground />
      
      {/* Floating Particles */}
      <FloatingParticlesDarshanas />

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-light/20 to-secondary-light/20 dark:from-primary-dark/20 dark:to-secondary-dark/20 rounded-full border border-primary-light/30 dark:border-primary-dark/30 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4 text-primary-light dark:text-primary-dark" />
            <span className="text-primary-light dark:text-primary-dark font-medium">The Six Darshanas</span>
            <Star className="w-4 h-4 text-primary-light dark:text-primary-dark" />
                    </motion.div>

          <motion.h2
            className="text-5xl md:text-6xl font-serif font-bold mb-8 text-primary-light dark:text-primary-dark glow-gold"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Master the Six Darshanas
          </motion.h2>

          
          <motion.p
            className="text-2xl md:text-3xl text-text-secondary-light/80 dark:text-text-secondary-dark/80 mb-8 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <strong>Discover the complete system of Indian philosophy</strong> that has guided millions for 5000+ years. 
            <strong> Master all Six Darshanas</strong> and unlock the secrets to ultimate wisdom, inner peace, and spiritual enlightenment.
          </motion.p>

          {/* Sanskrit Quote */}
          <motion.div
            className="bg-gradient-to-r from-background-alt-light/10 to-primary-light/10 dark:from-background-alt-dark/10 dark:to-primary-dark/10 p-6 rounded-2xl border border-primary-light/20 dark:border-primary-dark/20 max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <p className="text-2xl font-sanskrit text-primary-light/80 dark:text-primary-dark/80 mb-2">
              षड्दर्शनानि
            </p>
            <p className="text-lg text-text-secondary-light/70 dark:text-text-secondary-dark/70">
              "The Six Perspectives - Pathways to Ultimate Truth"
            </p>
          </motion.div>
        </motion.div>

        {/* Interactive Chakra Map */}
        <motion.div 
          className="relative w-full h-96 md:h-[500px] mb-16"
          style={{ y, opacity }}
        >
          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            {darshanas.map((darshan, i) => 
              darshanas.slice(i + 1).map((other, j) => (
                <motion.line
                  key={`${i}-${j}`}
                  x1={`${darshan.position.x}%`}
                  y1={`${darshan.position.y}%`}
                  x2={`${other.position.x}%`}
                  y2={`${other.position.y}%`}
                  stroke="url(#gradient)"
                  strokeWidth="1"
                  opacity="0.3"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 1 + (i + j) * 0.1 }}
                />
              ))
            )}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.5" />
                <stop offset="50%" stopColor="var(--color-secondary)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>

          {/* Chakra Nodes */}
          <div className="relative w-full h-full">
            {darshanas.map((darshan, index) => (
              <ChakraNode3D
                key={darshan.title}
                {...darshan}
                delay={index * 0.2}
              />
            ))}
          </div>
        </motion.div>

        {/* Description Cards */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
        >
          {darshanas.map((darshan, index) => (
            <motion.div
              key={darshan.title}
              className="glass-effect p-6 rounded-2xl text-center group cursor-pointer"
              whileHover={{ y: -10, scale: 1.05 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-white ${darshan.color}`}>
                {darshan.icon}
              </div>
              <p className="text-text-secondary-light/70 dark:text-text-secondary-dark/70 text-sm leading-relaxed">{darshan.description}</p>

              {/* Hover Effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl border border-primary-light/20 dark:border-primary-dark/20 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ scale: 0.8 }}
                whileHover={{ scale: 1 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1 }}
        >
          <motion.button
            className="bg-gradient-to-r from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 mx-auto group hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BookOpen className="w-5 h-5" />
            Explore All Darshanas
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
