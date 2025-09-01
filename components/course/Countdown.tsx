'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Clock, Users, AlertTriangle } from 'lucide-react'

interface CountdownProps {
  endDate: string
  seatsAvailable: number
  seatsTotal: number
  ctaText: string
  ctaLink: string
  showUrgency?: boolean
}

export default function Countdown({
  endDate,
  seatsAvailable,
  seatsTotal,
  ctaText,
  ctaLink,
  showUrgency = true
}: CountdownProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - new Date().getTime()
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      } else {
        setIsExpired(true)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [endDate])

  const seatsPercentage = (seatsAvailable / seatsTotal) * 100
  const isLowSeats = seatsPercentage <= 20

  return (
    <section className="py-16 bg-gradient-to-r from-orange-500 to-amber-500 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="max-w-4xl mx-auto">
            {/* Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold mb-6">
              {isExpired ? 'Registration Closed' : 'Limited Time Offer'}
            </h2>
            
            <p className="text-xl mb-12 opacity-90">
              {isExpired 
                ? 'This session has ended. Check out our upcoming live courses!'
                : 'Don\'t miss this opportunity to learn with our Acharyas'
              }
            </p>

            {/* Countdown Timer */}
            {!isExpired && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-12"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="text-center">
                      <motion.div
                        key={value}
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30"
                      >
                        <div className="text-3xl md:text-4xl font-bold mb-2">
                          {value.toString().padStart(2, '0')}
                        </div>
                        <div className="text-sm md:text-base opacity-90 capitalize">
                          {unit}
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Seats Available */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 max-w-md mx-auto">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Users className="w-6 h-6" />
                  <span className="text-lg font-semibold">Seats Available</span>
                </div>
                
                <div className="text-3xl font-bold mb-2">
                  {seatsAvailable} / {seatsTotal}
                </div>
                
                <div className="w-full bg-white/30 rounded-full h-3 mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${seatsPercentage}%` }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className={`h-3 rounded-full transition-all duration-300 ${
                      isLowSeats ? 'bg-red-400' : 'bg-green-400'
                    }`}
                  />
                </div>
                
                <div className="text-sm opacity-90">
                  {isLowSeats ? (
                    <div className="flex items-center justify-center gap-2 text-red-200">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Only {seatsAvailable} seats left!</span>
                    </div>
                  ) : (
                    <span>{Math.round(seatsPercentage)}% filled</span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Urgency Message */}
            {showUrgency && !isExpired && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mb-8"
              >
                <div className="flex items-center justify-center gap-3 text-lg">
                  <Clock className="w-6 h-6" />
                  <span className="font-semibold">
                    {isLowSeats 
                      ? 'Hurry! Seats filling fast!'
                      : 'Secure your spot before it\'s too late!'
                    }
                  </span>
                </div>
              </motion.div>
            )}

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Button
                asChild
                size="lg"
                className={`px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${
                  isExpired
                    ? 'bg-gray-600 hover:bg-gray-700'
                    : isLowSeats
                    ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                    : 'bg-white text-orange-600 hover:bg-gray-100'
                }`}
              >
                <a href={ctaLink}>
                  {isExpired ? 'View Upcoming Courses' : ctaText}
                </a>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
