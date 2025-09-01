'use client'

import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState, useEffect, useRef } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
  course: string
  avatar?: string
}

interface TestimonialsProps {
  title?: string
  subtitle?: string
  testimonials: Testimonial[]
}

export default function Testimonials({
  title = "What Our Students Say",
  subtitle = "Discover how Shikshanam has transformed the learning journey of our community",
  testimonials,
}: TestimonialsProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [visibleTestimonials, setVisibleTestimonials] = useState(5)
  const controls = useAnimation();
  const scrollRef = useRef<HTMLDivElement>(null);


  const handleLoadMore = () => {
    setVisibleTestimonials(prev => Math.min(prev + 5, testimonials.length));
  };

  const visibleTestimonialsData = testimonials.slice(0, visibleTestimonials);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  if (visibleTestimonialsData.length === 0) {
    return null;
  }

  return (
    <section className="py-32 bg-gradient-to-br from-white via-orange-50/30 to-pink-50/30 dark:from-gray-900 dark:via-orange-900/10 dark:to-pink-900/10 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full"
             style={{
               backgroundImage: `radial-gradient(circle at 40% 40%, #f97316 1px, transparent 1px),
                                 radial-gradient(circle at 80% 20%, #ec4899 1px, transparent 1px)`,
               backgroundSize: '80px 80px'
             }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-orange-200 rounded-full px-6 py-3 mb-8 shadow-lg">
            <Star className="w-5 h-5 text-orange-600" />
            <span className="text-orange-600 font-medium">Success Stories</span>
            <Quote className="w-5 h-5 text-orange-600" />
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-bold text-gray-900 dark:text-white mb-8">
            {title.split(' ').map((word, index, array) => (
              <span key={index} className={word.toLowerCase().includes('student') || word.toLowerCase().includes('success') ? 'bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent' : ''}>
                {word}{index < array.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h2>
          {subtitle && (
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </motion.div>

        <div className="relative">
          <motion.div
            ref={scrollRef}
            className="flex space-x-8 overflow-x-auto pb-8 scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-orange-100 dark:scrollbar-thumb-orange-600 dark:scrollbar-track-gray-800"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
            initial="hidden"
            animate={controls}
          >
            {visibleTestimonialsData.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="flex-shrink-0 w-[80vw] md:w-[400px] snap-center"
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <div
                  className="bg-white/80 backdrop-blur-xl dark:bg-gray-800/80 rounded-3xl p-6 lg:p-10 shadow-2xl border border-white/30 dark:border-gray-700/50 relative overflow-hidden h-full flex flex-col"
                >
                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-pink-500/5 to-purple-500/5" />
                  
                  <div className="text-center relative z-10 flex-grow">
                    {/* Quote Icon */}
                    <div className="flex justify-center mb-6">
                      <motion.div 
                        className="w-14 h-14 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Quote className="w-7 h-7 text-white" />
                      </motion.div>
                    </div>

                    {/* Rating */}
                    <motion.div 
                      className="flex justify-center mb-6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3, delay: i * 0.1 + 0.3 }}
                        >
                          <Star
                            className={`w-5 h-5 mx-1 ${
                              i < testimonial.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Testimonial Content */}
                    <motion.blockquote 
                      className="text-lg lg:text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed italic font-medium min-h-[8rem]"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      "{testimonial.content}"
                    </motion.blockquote>

                    {/* Course */}
                    <motion.div
                      className="inline-block bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-900/30 dark:to-pink-900/30 text-orange-700 dark:text-orange-300 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      {testimonial.course}
                    </motion.div>
                  </div>

                  {/* Author */}
                  <motion.div 
                    className="flex flex-col items-center mt-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    {testimonial.avatar && (
                      <motion.div 
                        className="w-16 h-16 rounded-full overflow-hidden mb-3 ring-4 ring-orange-200 dark:ring-orange-700/50"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    )}
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-0.5">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 font-medium text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {visibleTestimonials < testimonials.length && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleLoadMore}
                variant="outline"
                className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-orange-200 dark:border-gray-600/50 hover:bg-orange-100 dark:hover:bg-gray-700 text-orange-600 dark:text-orange-400 p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Load More Testimonials
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
