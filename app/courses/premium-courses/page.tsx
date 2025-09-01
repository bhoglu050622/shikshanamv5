'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Hero from '@/components/course/Hero'
import Outcomes from '@/components/course/Outcomes'
import CourseGrid from '@/components/course/CourseGrid'
import Testimonials from '@/components/course/Testimonials'
import Pricing from '@/components/course/Pricing'
import ClosingCTA from '@/components/course/ClosingCTA'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, Users, Award, Clock, Star, Shield, Zap, 
  Play, ChevronDown, Sparkles, Trophy, Crown, 
  ArrowRight, CheckCircle, TrendingUp, Gift,
  Infinity as InfinityIcon, Target, Brain, Heart
} from 'lucide-react'
import { getPremiumCourses, getTestimonials, getBundleOffers } from '@/lib/courseData'

export default function PremiumCoursesPage() {
  const premiumCourses = useMemo(() => getPremiumCourses() || [], [])
  const testimonials = useMemo(() => getTestimonials() || [], [])
  const bundleOffers = useMemo(() => getBundleOffers() || [], [])
  
  const [mounted, setMounted] = useState(false)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])

  useEffect(() => {
    setMounted(true)
  }, [])

  const outcomes = [
    {
      icon: Brain,
      title: "Acharya-Led Learning",
      description: "Learn directly from authentic Sanskrit scholars and spiritual teachers with decades of experience in traditional texts.",
      gradient: "from-purple-500 to-indigo-600",
      delay: 0.1
    },
    {
      icon: InfinityIcon,
      title: "Lifetime Access",
      description: "Unlimited access to all course materials, allowing you to learn at your own pace and revisit concepts anytime.",
      gradient: "from-blue-500 to-cyan-600",
      delay: 0.2
    },
    {
      icon: Crown,
      title: "Rare Text Access",
      description: "Exclusive access to rare manuscripts, commentaries, and traditional texts not available elsewhere.",
      gradient: "from-amber-500 to-orange-600",
      delay: 0.3
    },
    {
      icon: Trophy,
      title: "Certificate of Completion",
      description: "Receive a prestigious certificate recognizing your mastery of ancient wisdom traditions.",
      gradient: "from-emerald-500 to-teal-600",
      delay: 0.4
    }
  ]

  const pricingTiers = [
    {
      id: "basic",
      name: "Individual Course",
      price: 7999,
      originalPrice: 11999,
      duration: "8-12 weeks",
      features: [
        "Complete course access",
        "Recorded sessions",
        "Course materials",
        "Certificate of completion",
        "Community forum access"
      ],
      ctaText: "Enroll Now",
      ctaLink: "#courses",
      savings: 4000,
      savingsPercentage: 33
    },
    {
      id: "premium",
      name: "Premium Package",
      price: 14999,
      originalPrice: 23997,
      duration: "Multiple courses",
      features: [
        "3 premium courses",
        "Lifetime access",
        "Live Q&A sessions",
        "Personal mentorship",
        "Exclusive resources",
        "Priority support"
      ],
      popular: true,
      ctaText: "Get Premium Access",
      ctaLink: "#bundle-offers",
      savings: 8998,
      savingsPercentage: 37
    },
    {
      id: "complete",
      name: "Complete Journey",
      price: 24999,
      originalPrice: 41994,
      duration: "All courses",
      features: [
        "All premium courses",
        "Lifetime access",
        "1-on-1 mentorship",
        "Exclusive workshops",
        "Rare text library",
        "VIP community access"
      ],
      ctaText: "Start Complete Journey",
      ctaLink: "#bundle-offers",
      savings: 16995,
      savingsPercentage: 40
    }
  ]

  const stats = [
    { number: "5000+", label: "Students Enrolled", icon: Users },
    { number: "50+", label: "Expert Acharyas", icon: Award },
    { number: "100+", label: "Course Hours", icon: Clock },
    { number: "98%", label: "Satisfaction Rate", icon: Star }
  ]

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-16 h-16 bg-gradient-to-r from-orange-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <motion.p
            className="text-gray-600 dark:text-gray-300 font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading Premium Experience...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-200/20 to-pink-200/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 -right-40 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-blue-200/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{ y }}
          >
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
            <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-pulse" />
            <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
          </motion.div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-5xl mx-auto"
          >
            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-orange-200 rounded-full px-6 py-3 mb-8 shadow-lg"
            >
              <Sparkles className="w-5 h-5 text-orange-500" />
              <span className="text-orange-600 font-medium">Premium Learning Experience</span>
              <Crown className="w-5 h-5 text-orange-500" />
            </motion.div>

            {/* Sanskrit Title */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-2xl sm:text-3xl font-sanskrit text-orange-600 dark:text-orange-400 mb-6"
            >
              प्रीमियम पाठ्यक्रम
            </motion.h2>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-playfair font-bold mb-8 leading-tight"
            >
              <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-purple-600 bg-clip-text text-transparent dark:from-white dark:via-orange-400 dark:to-purple-400">
                Premium Courses
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Deep dive into ancient wisdom with our comprehensive premium courses. 
              Master the Six Darshanas with authentic guidance from traditional Acharyas.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white px-10 py-6 text-lg font-semibold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 group relative overflow-hidden"
              >
                <a href="#courses">
                  <span className="relative z-10">Start Your Journey</span>
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-10 py-6 text-lg font-semibold rounded-full transition-all duration-300 group backdrop-blur-sm bg-white/50"
              >
                <a href="#preview">
                  <Play className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Preview Course
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-gray-600 dark:text-gray-400"
          >
            <span className="text-sm font-medium">Explore More</span>
            <div className="w-8 h-12 border-2 border-orange-600 rounded-full flex justify-center relative">
              <motion.div
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-3 bg-orange-600 rounded-full mt-2"
              />
            </div>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </motion.div>
        </motion.div>
      </section>

      {/* Enhanced Why Premium Section */}
      <section className="py-32 bg-white dark:bg-gray-900 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-900/30 dark:to-pink-900/30 rounded-full px-6 py-3 mb-8">
              <Target className="w-5 h-5 text-orange-600" />
              <span className="text-orange-600 dark:text-orange-400 font-medium">Why Choose Premium</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-bold text-gray-900 dark:text-white mb-8">
              Experience the <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Difference</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Discover the depth and authenticity that only Shikshanam can provide through our premium learning experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {outcomes && outcomes.map((outcome, index) => outcome && (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: outcome.delay }}
                viewport={{ once: true }}
                whileHover={{ y: -15, scale: 1.08 }}
                className="group relative"
              >
                <div className="bg-white/95 backdrop-blur-sm dark:bg-gray-800/95 rounded-3xl p-10 h-full border-2 border-gray-200/50 dark:border-gray-600/50 shadow-2xl hover:shadow-3xl hover:border-orange-300/50 dark:hover:border-orange-500/50 transition-all duration-500 relative overflow-hidden">
                  {/* Enhanced Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${outcome.gradient} opacity-5 group-hover:opacity-15 transition-opacity duration-500`} />
                  
                  {/* Enhanced Icon Container */}
                  <div className="relative mb-8">
                    <div className={`w-24 h-24 bg-gradient-to-br ${outcome.gradient} rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl mx-auto`}>
                      <div className="text-white">
                        <outcome.icon className="w-12 h-12" />
                      </div>
                    </div>
                    {/* Icon Background Glow */}
                    <div className={`absolute inset-0 w-24 h-24 bg-gradient-to-br ${outcome.gradient} rounded-3xl opacity-20 blur-xl scale-150 group-hover:scale-175 transition-transform duration-500 mx-auto`} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-pink-500 group-hover:bg-clip-text transition-all duration-300">
                    {outcome.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-center text-lg">
                    {outcome.description}
                  </p>

                  {/* Enhanced Decorative Elements */}
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <Sparkles className="w-6 h-6 text-orange-400 animate-pulse" />
                  </div>
                  
                  {/* Additional Corner Decoration */}
                  <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-60 transition-opacity duration-700">
                    <div className={`w-3 h-3 bg-gradient-to-br ${outcome.gradient} rounded-full animate-bounce`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Course Grid */}
      {premiumCourses && premiumCourses.length > 0 ? (
        <CourseGrid
          title="Our Premium Course Collection"
          subtitle="Explore our comprehensive range of premium courses designed to deepen your understanding of ancient wisdom traditions"
          courses={premiumCourses}
          columns={3}
          showPricing={true}
          ctaText="Enroll Now"
        />
      ) : (
        <section className="py-32 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-bold text-gray-900 dark:text-white mb-8">
                Premium Courses Coming Soon
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                We're preparing an amazing collection of premium courses for you. Stay tuned for updates!
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Bundle Offers */}
      <section className="py-32 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-800 dark:via-purple-900/20 dark:to-gray-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full"
               style={{
                 backgroundImage: `radial-gradient(circle at 25% 25%, orange 2px, transparent 2px),
                                   radial-gradient(circle at 75% 75%, pink 1px, transparent 1px)`,
                 backgroundSize: '50px 50px'
               }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-orange-200 rounded-full px-6 py-3 mb-8 shadow-lg">
              <Gift className="w-5 h-5 text-orange-600" />
              <span className="text-orange-600 font-medium">Special Offers</span>
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-bold text-gray-900 dark:text-white mb-8">
              Bundle <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Savings</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Save significantly when you enroll in multiple courses. Choose the perfect learning path for your spiritual journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {bundleOffers && bundleOffers.length > 0 ? bundleOffers.map((bundle, index) => bundle && (
              <motion.div
                key={bundle.id}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative"
              >
                <div className="bg-white/90 backdrop-blur-xl dark:bg-gray-900/90 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 border-2 border-white/30 dark:border-gray-600/50 hover:border-orange-300/50 dark:hover:border-orange-500/50 relative overflow-visible">
                  {/* Enhanced Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-pink-500/5 to-purple-500/5 group-hover:from-orange-500/15 group-hover:via-pink-500/15 group-hover:to-purple-500/15 transition-all duration-500 rounded-3xl" />
                  
                  {/* Enhanced Savings Badge */}
                  <div className="absolute -top-6 -right-6 z-20">
                    <motion.div 
                      className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white px-8 py-4 rounded-full shadow-2xl transform rotate-12 group-hover:rotate-6 transition-all duration-500 border-2 border-white/30"
                      whileHover={{ scale: 1.1, rotate: 0 }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 animate-pulse" />
                        <span className="font-bold text-lg">Save {bundle.savingsPercentage}%</span>
                      </div>
                    </motion.div>
                  </div>

                  <div className="relative z-10">
                    <div className="text-center mb-8">
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-pink-500 group-hover:bg-clip-text transition-all duration-300">
                        {bundle.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed min-h-[6rem]">
                        {bundle.description}
                      </p>
                    </div>

                    <div className="space-y-6 mb-8">
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg">Included Courses:</h4>
                      <ul className="space-y-3">
                        {bundle.courses && bundle.courses.map((course, courseIndex) => course && (
                          <motion.li
                            key={courseIndex}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: courseIndex * 0.1 }}
                            className="flex items-center gap-4 text-gray-600 dark:text-gray-300"
                          >
                            <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-lg">{course}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Pricing */}
                    <div className="text-center mb-8 p-6 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 rounded-2xl">
                      <div className="flex items-center justify-center gap-4 mb-3 flex-wrap">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                          ₹{bundle.bundlePrice.toLocaleString()}
                        </span>
                        <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
                          ₹{bundle.originalPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-full text-lg font-bold inline-block">
                        You save ₹{bundle.savings.toLocaleString()}
                      </div>
                    </div>

                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white py-6 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
                    >
                      <a href="#enroll">
                        <span className="relative z-10">Get Bundle Access</span>
                        <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform relative z-10" />
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </a>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-2 text-center py-12">
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  No bundle offers available at the moment.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 text-gray-900 dark:text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-0 left-0 w-full h-full opacity-20"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundImage: `radial-gradient(circle at 20% 20%, rgba(249, 115, 22, 0.3) 0%, transparent 50%),
                                radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)`,
              backgroundSize: '100% 100%'
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-bold mb-8">
              Trusted by <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">Thousands</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Join our global community of wisdom seekers and experience transformative learning
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {stats && stats.map((stat, index) => stat && (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="text-center group"
              >
                <div className="bg-white/50 dark:bg-white/10 backdrop-blur-sm rounded-3xl p-6 lg:p-8 border border-gray-200/50 dark:border-white/20 hover:border-orange-400/50 transition-all duration-500 hover:shadow-2xl">
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 10 }}
                  >
                    <stat.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <motion.div
                    className="text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  >
                    {stat.number}
                  </motion.div>
                  
                  <p className="text-gray-600 dark:text-gray-300 font-medium">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 ? (
        <Testimonials
          title="Student Success Stories"
          subtitle="Hear from our premium course students about their transformative learning experiences"
          testimonials={testimonials}
        />
      ) : (
        <section className="py-32 bg-gradient-to-br from-white via-orange-50/30 to-pink-50/30 dark:from-gray-900 dark:via-orange-900/10 dark:to-pink-900/10 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-bold text-gray-900 dark:text-white mb-8">
                Student Success Stories
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Our students' success stories will be featured here soon. Be the first to share your journey!
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Closing CTA */}
      <ClosingCTA
        title="Invest in Your Wisdom Journey Today"
        subtitle="Join thousands of seekers who have transformed their lives through authentic ancient wisdom"
        ctaText="Analyze your profile"
        ctaLink="/guna-profiler"
        secondaryCtaText="View All Courses"
        secondaryCtaLink="/courses/all-courses"
        showMandala={true}
        variant="default"
      />



      {/* Mouse Follower Effect - Removed for better performance */}
    </div>
  )
}
