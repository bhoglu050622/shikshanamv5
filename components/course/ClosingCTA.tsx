'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import { ArrowRight, Star, Heart } from 'lucide-react'

interface ClosingCTAProps {
  title: string
  subtitle?: string
  ctaText: string
  ctaLink: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
  showMandala?: boolean
  variant?: 'default' | 'urgent' | 'peaceful'
}

export default function ClosingCTA({
  title,
  subtitle,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
  showMandala = true,
  variant = 'default'
}: ClosingCTAProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const getVariantStyles = () => {
    switch (variant) {
      case 'urgent':
        return {
          bg: 'bg-gradient-to-br from-red-500 via-orange-500 to-amber-500',
          text: 'text-white',
          button: 'bg-white text-red-600 hover:bg-gray-100'
        }
      case 'peaceful':
        return {
          bg: 'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500',
          text: 'text-white',
          button: 'bg-white text-blue-600 hover:bg-gray-100'
        }
      default:
        return {
          bg: 'bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500',
          text: 'text-white',
          button: 'bg-white text-orange-600 hover:bg-gray-100'
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <section className={`relative py-20 ${styles.bg} overflow-hidden`}>
      {/* Animated Mandala Background */}
      {showMandala && (
        <div className="absolute inset-0 opacity-10">
          <motion.div
            className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="w-full h-full border-2 border-white/30 rounded-full" />
            <div className="absolute top-1/2 left-1/2 w-80 h-80 -translate-x-1/2 -translate-y-1/2 border-2 border-white/20 rounded-full" />
            <div className="absolute top-1/2 left-1/2 w-64 h-64 -translate-x-1/2 -translate-y-1/2 border-2 border-white/10 rounded-full" />
          </motion.div>
          
          <motion.div
            className="absolute top-1/4 right-1/4 w-32 h-32"
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="w-full h-full border border-white/20 rounded-full" />
          </motion.div>
          
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-24 h-24"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="w-full h-full border border-white/15 rounded-full" />
          </motion.div>
        </div>
      )}

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-20 left-20 opacity-20"
      >
        <Star className="w-8 h-8 text-white" />
      </motion.div>
      
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        className="absolute top-40 right-20 opacity-20"
      >
        <Heart className="w-6 h-6 text-white" />
      </motion.div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold mb-6 ${styles.text}`}
          >
            {title}
          </motion.h2>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`text-xl mb-8 opacity-90 ${styles.text}`}
            >
              {subtitle}
            </motion.p>
          )}

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              asChild
              size="lg"
              className={`${styles.button} px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group`}
            >
              <a href={ctaLink}>
                {ctaText}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>

            {secondaryCtaText && secondaryCtaLink && (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300"
              >
                <a href={secondaryCtaLink}>
                  {secondaryCtaText}
                </a>
              </Button>
            )}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-white/80 text-sm"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Secure Payment</span>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>10,000+ Students</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Helper components for trust indicators
const Shield = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
)

const Check = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
)

const Users = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)
