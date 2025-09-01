'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import { Clock, Users, Star, ArrowRight, BookOpen, GraduationCap } from 'lucide-react'

interface Course {
  id: string
  title: string
  sanskritTitle?: string
  description: string
  price?: number
  originalPrice?: number
  duration?: string
  sessions?: number
  level?: string
  acharya?: string
  image?: string
  seatsAvailable?: number
  seatsTotal?: number
  date?: string
  time?: string
  features?: string[]
  rating?: number
  externalUrl?: string
}

interface CourseGridProps {
  title?: string
  subtitle?: string
  courses: Course[]
  columns?: 2 | 3 | 4
  showPricing?: boolean
  showSeats?: boolean
  showDate?: boolean
  ctaText?: string
  variant?: 'default' | 'compact' | 'featured'
}

export default function CourseGrid({
  title,
  subtitle,
  courses,
  columns = 3,
  showPricing = true,
  showSeats = false,
  showDate = false,
  ctaText = "Explore Course",
  variant = 'default'
}: CourseGridProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4',
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <section className="py-32 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full"
             style={{
               backgroundImage: `radial-gradient(circle at 20% 20%, #f97316 1px, transparent 1px),
                                 radial-gradient(circle at 80% 80%, #3b82f6 1px, transparent 1px)`,
               backgroundSize: '40px 40px'
             }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {(title || subtitle) && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 bg-bg-secondary border border-accent-primary rounded-full px-6 py-3 mb-8 shadow-lg">
              <BookOpen className="w-5 h-5 text-orange-600" />
              <span className="text-orange-600 font-medium">Course Collection</span>
              <GraduationCap className="w-5 h-5 text-orange-600" />
            </div>

            {title && (
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-bold text-gray-900 dark:text-white mb-8">
                {title.split(' ').map((word, index, array) => (
                  <span key={index} className={index === array.length - 1 ? 'bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-transparent' : ''}>
                    {word}{index < array.length - 1 ? ' ' : ''}
                  </span>
                ))}
              </h2>
            )}
            {subtitle && (
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}

        <div className={`grid ${gridCols[columns]} gap-6 md:gap-8 lg:gap-12`}>
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -15, scale: 1.03 }}
              className="group"
            >
              <div className="bg-bg-secondary rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-border-primary relative">
                {/* Gradient Background Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Course Image */}
                <div className="relative h-56 overflow-hidden">
                  <div 
                    className={`w-full h-full transition-all duration-500 flex items-center justify-center relative ${
                      index % 4 === 0 ? 'bg-gradient-to-br from-orange-400 via-orange-500 to-amber-500 group-hover:from-orange-500 group-hover:via-orange-600 group-hover:to-amber-600' :
                      index % 4 === 1 ? 'bg-gradient-to-br from-red-400 via-pink-500 to-rose-500 group-hover:from-red-500 group-hover:via-pink-600 group-hover:to-rose-600' :
                      index % 4 === 2 ? 'bg-gradient-to-br from-purple-400 via-violet-500 to-indigo-500 group-hover:from-purple-500 group-hover:via-violet-600 group-hover:to-indigo-600' :
                      'bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-500 group-hover:from-blue-500 group-hover:via-cyan-600 group-hover:to-teal-600'
                    }`}
                  >
                    {/* Floating Particles */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute top-4 left-4 w-2 h-2 bg-white/30 rounded-full animate-pulse" />
                      <div className="absolute top-12 right-8 w-1 h-1 bg-white/40 rounded-full animate-pulse" />
                      <div className="absolute bottom-8 left-8 w-3 h-3 bg-white/20 rounded-full animate-pulse" />
                    </div>
                    
                    <motion.div 
                      className="text-center relative z-10"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: -5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <GraduationCap className="w-20 h-20 text-white mb-3 mx-auto opacity-90 drop-shadow-lg" />
                      </motion.div>
                      <BookOpen className="w-10 h-10 text-white mx-auto opacity-70 drop-shadow-lg" />
                    </motion.div>
                  </div>
                  
                  {/* Sanskrit Title Overlay */}
                  {course.sanskritTitle && (
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <p className="text-white text-sm font-sanskrit opacity-95 drop-shadow-lg text-center">
                        {course.sanskritTitle}
                      </p>
                    </motion.div>
                  )}

                  {/* Premium Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-bg-accent border border-border-primary rounded-full px-3 py-1 text-text-primary text-xs font-semibold shadow-lg">
                      Premium
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 relative">
                  {/* Course Title */}
                  <motion.h3 
                    className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-purple-500 group-hover:bg-clip-text transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    {course.title}
                  </motion.h3>

                  {/* Course Description */}
                  <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Course Meta */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    {course.duration && (
                      <motion.div 
                        className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-3 py-2 rounded-full text-sm font-medium"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </motion.div>
                    )}
                    {course.sessions && (
                      <motion.div 
                        className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-full text-sm font-medium"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Users className="w-4 h-4" />
                        <span>{course.sessions} sessions</span>
                      </motion.div>
                    )}
                    {course.level && (
                      <motion.span 
                        className="px-3 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium"
                        whileHover={{ scale: 1.05 }}
                      >
                        {course.level}
                      </motion.span>
                    )}
                  </div>



                  {/* Date and Time */}
                  {showDate && course.date && (
                    <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                        {formatDate(course.date)}
                        {course.time && ` at ${course.time}`}
                      </p>
                    </div>
                  )}

                  {/* Seats Available */}
                  {showSeats && course.seatsAvailable !== undefined && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Seats Available</span>
                                                 <span className="font-medium text-gray-900 dark:text-white">
                           {course.seatsAvailable}/{course.seatsTotal || '∞'}
                         </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${(course.seatsAvailable / (course.seatsTotal || 1)) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Enhanced Pricing */}
                  {showPricing && course.price && (
                    <motion.div 
                      className="bg-gradient-to-br from-orange-50 via-purple-50/50 to-pink-50 dark:from-orange-900/30 dark:via-purple-900/30 dark:to-pink-900/30 rounded-3xl p-6 mb-6 border-2 border-orange-200/50 dark:border-orange-700/50 shadow-lg hover:shadow-xl hover:border-orange-300/70 dark:hover:border-orange-600/70 backdrop-blur-sm"
                      whileHover={{ scale: 1.03, y: -2 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <motion.div 
                            className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2"
                            whileHover={{ scale: 1.05 }}
                          >
                            {formatPrice(course.price)}
                          </motion.div>
                          {course.originalPrice && course.originalPrice > course.price && (
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-lg text-gray-500 dark:text-gray-400 line-through font-medium">
                                {formatPrice(course.originalPrice)}
                              </span>
                              <motion.span 
                                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                                whileHover={{ scale: 1.1 }}
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF
                              </motion.span>
                            </div>
                          )}
                        </div>
                        {course.rating && (
                          <motion.div 
                            className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/40 dark:to-amber-900/40 px-4 py-3 rounded-2xl border border-yellow-300/50 dark:border-yellow-600/50 shadow-md"
                            whileHover={{ scale: 1.08, rotate: 3 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Star className="w-5 h-5 text-yellow-500 fill-current" />
                            <span className="text-lg font-bold text-yellow-700 dark:text-yellow-300">
                              {course.rating}
                            </span>
                          </motion.div>
                        )}
                      </div>
                      
                      {/* Additional pricing info */}
                      <div className="mt-4 pt-4 border-t border-orange-200/50 dark:border-orange-700/50">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">Premium Course</span>
                          <span className="text-orange-600 dark:text-orange-400 font-bold">Lifetime Access</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* CTA Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-700 hover:to-purple-700 text-white py-4 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                    >
                      <a 
                        href={course.externalUrl || `/courses/${course.id}`}
                        target={course.externalUrl ? "_blank" : "_self"}
                        rel={course.externalUrl ? "noopener noreferrer" : undefined}
                      >
                        <span className="relative z-10">{ctaText}</span>
                        <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform relative z-10" />
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </a>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
