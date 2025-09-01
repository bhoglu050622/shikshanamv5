'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { BookOpen, Play, Crown, Video, Search, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function CoursesIndexPage() {
  const courseTypes = [
    {
      id: 'free-masterclass',
      title: 'Free Masterclass',
      sanskritTitle: 'निःशुल्क मास्टरक्लास',
      description: 'Start your journey with our free introductory sessions. Experience authentic teaching and discover your path.',
      icon: <Play className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-500',
      href: '/courses/free-masterclass',
      features: ['No cost', '108 seats per session', 'Interactive Q&A', 'Certificate of participation']
    },
    {
      id: 'premium-courses',
      title: 'Premium Courses',
      sanskritTitle: 'प्रीमियम पाठ्यक्रम',
      description: 'Deep dive into ancient wisdom with comprehensive courses led by authentic Acharyas.',
      icon: <Crown className="w-8 h-8" />,
      color: 'from-yellow-500 to-orange-500',
      href: '/courses/premium-courses',
      features: ['Lifetime access', 'Rare text access', 'Certificate of completion', 'Community forum']
    },
    {
      id: 'live-courses',
      title: 'Live Courses',
      sanskritTitle: 'जीवंत पाठ्यक्रम',
      description: 'Join live interactive sessions with real-time Q&A and group chanting experiences.',
      icon: <Video className="w-8 h-8" />,
      color: 'from-red-500 to-pink-500',
      href: '/courses/live-courses',
      features: ['Real-time Q&A', 'Group chanting', 'Global cohort', 'Limited seats']
    },
    {
      id: 'all-courses',
      title: 'All Courses',
      sanskritTitle: 'सभी पाठ्यक्रम',
      description: 'Browse our complete library of courses covering all Six Darshanas and wisdom traditions.',
      icon: <Search className="w-8 h-8" />,
      color: 'from-blue-500 to-purple-500',
      href: '/courses/all-courses',
      features: ['Advanced search', 'Filter by school', 'Learning pathways', 'Course recommendations']
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-bold text-gray-900 dark:text-white mb-6">
              Choose Your Learning Path
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8">
              Discover authentic ancient wisdom through our carefully crafted learning experiences
            </p>
            <p className="text-lg text-orange-600 dark:text-orange-400 font-sanskrit mb-12">
              अपना सीखने का मार्ग चुनें
            </p>
          </motion.div>
        </div>
      </section>

      {/* Course Types Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {courseTypes.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Link href={course.href}>
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 h-full border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-500 transition-all duration-300 hover:shadow-xl">
                    <div className="flex items-start gap-6">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${course.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                        {course.icon}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-sm font-sanskrit text-orange-600 dark:text-orange-400 mb-4">
                          {course.sanskritTitle}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                          {course.description}
                        </p>
                        
                        <div className="space-y-2 mb-6">
                          {course.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-medium group-hover:gap-3 transition-all duration-300">
                          <span>Explore {course.title}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-amber-500 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-playfair font-bold mb-6">
              Not Sure Where to Start?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join our free masterclass to experience authentic teaching and find your perfect learning path.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-lg"
            >
              <Link href="/courses/free-masterclass">
                Start with Free Masterclass
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
