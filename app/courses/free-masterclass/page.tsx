'use client'

import { useState } from 'react'
import Hero from '@/components/course/Hero'
import Outcomes from '@/components/course/Outcomes'
import CourseGrid from '@/components/course/CourseGrid'
import Testimonials from '@/components/course/Testimonials'
import ClosingCTA from '@/components/course/ClosingCTA'
import { Button } from '@/components/ui/button'
import { BookOpen, Users, Award, Clock, CheckCircle, Play, User, Languages, Video, Smartphone, MessageCircle, Brain, Filter } from 'lucide-react'
import { getFreeMasterclasses, getTestimonials } from '@/lib/courseData'

export default function FreeMasterclassPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(false)
  const [buttonStates, setButtonStates] = useState<{ [key: string]: boolean }>({})



  const freeMasterclasses = getFreeMasterclasses()
  const testimonials = getTestimonials()

  const categories = [
    { id: 'all', name: 'All Classes', count: freeMasterclasses.length },
    { id: 'tatvabodha', name: 'Tatvabodha Series', count: freeMasterclasses.filter(c => c.title.toLowerCase().includes('tatvabodha') && !c.title.toLowerCase().includes('yoga')).length },
    { id: 'yoga', name: 'Yoga Darshan', count: freeMasterclasses.filter(c => c.title.toLowerCase().includes('yoga')).length },
    { id: 'samkhya', name: 'Samkhya Wisdom', count: freeMasterclasses.filter(c => (c.title.toLowerCase().includes('samkhya') || c.title.toLowerCase().includes('sāṁkhya')) && !c.title.toLowerCase().includes('tatvabodha')).length },
    { id: 'special', name: 'Special Classes', count: freeMasterclasses.filter(c => c.title.toLowerCase().includes('navratri') || c.title.toLowerCase().includes('stotra')).length }
  ]

  const filteredMasterclasses = selectedCategory === 'all' 
    ? freeMasterclasses 
    : freeMasterclasses.filter(masterclass => {
        const title = masterclass.title.toLowerCase()
        if (selectedCategory === 'tatvabodha') return title.includes('tatvabodha') && !title.includes('yoga')
        if (selectedCategory === 'yoga') return title.includes('yoga')
        if (selectedCategory === 'samkhya') return (title.includes('samkhya') || title.includes('sāṁkhya')) && !title.includes('tatvabodha')
        if (selectedCategory === 'special') return title.includes('navratri') || title.includes('stotra')
        return true
      })

  const outcomes = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Learn with Acharyas",
      description: "Direct guidance from authentic Sanskrit scholars and spiritual teachers with decades of experience."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Authentic Sanskrit",
      description: "Learn from original texts and traditional methods, not modern interpretations or translations."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Interactive Sessions",
      description: "Ask questions, participate in discussions, and connect with fellow seekers in real-time."
    }
  ]

  const syllabusItems = [
    "Foundation: Understanding Samkhya and Yoga Philosophy",
    "Advanced Practices: Unlocking Spiritual Powers and Liberation",
    "Sacred Knowledge: Ancient Tantra and Energy Systems",
    "Inner Transformation: Emotional Mastery through Samkhya",
    "Divine Connection: Sacred Chanting and Devotional Practices",
    "Community Wisdom: Interactive Learning and Support",
    "Life Application: Bringing Ancient Wisdom to Modern Living"
  ]

  const benefits = [
    {
      icon: <Award className="w-6 h-6" />,
      title: "Completely Free",
      description: "Access to profound wisdom without any cost. We believe ancient knowledge should be available to every sincere seeker."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Learn at Your Pace",
      description: "No pressure, no deadlines. Absorb the wisdom in your own time and integrate it naturally into your life."
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: "Crystal Clear Teaching",
      description: "Complex philosophical concepts made simple through expert explanations and visual aids."
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Learn Anywhere",
      description: "Access your wisdom journey from anywhere - your phone, tablet, or computer. Knowledge follows you."
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Community Support",
      description: "Connect with fellow seekers, ask questions, and share insights in our supportive learning community."
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Deep Understanding",
      description: "Go beyond surface knowledge with comprehensive resources, practice materials, and guided applications."
    }
  ]

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const getCheckoutUrl = (masterclassId: string) => {
    const checkoutUrls: { [key: string]: string } = {
      'fm-001': 'https://courses.shikshanam.in/single-checkout/658fa59ae4b06d2e3bbf6d27?pid=p1',
      'fm-002': 'https://courses.shikshanam.in/single-checkout/65b208cbe4b0c73c831991ed?pid=p1',
      'fm-003': 'https://courses.shikshanam.in/single-checkout/65d03908e4b06baa4efbda89?pid=p1',
      'fm-004': 'https://courses.shikshanam.in/single-checkout/6700f323b6e40105f97a57ed?pid=p1',

      'fm-006': 'https://courses.shikshanam.in/single-checkout/688480a1e766436e41ce156b?pid=p1'
    }
    return checkoutUrls[masterclassId] || '#'
  }

  return (
    <div className="min-h-screen relative">

      
      {/* Hero Section */}
      <Hero
        title="Unlock Ancient Wisdom - Free Masterclasses"
        sanskritTitle="प्राचीन ज्ञान का द्वार खोलें - निःशुल्क मास्टरक्लास"
        subtitle="Discover the secrets of Samkhya, Yoga, and Tantra through authentic teachings. Transform your life with wisdom that has guided seekers for thousands of years. Join thousands who have already begun their journey."
        ctaText="Start Your Journey"
        ctaLink="#upcoming-classes"
        secondaryCtaText="Watch Preview"
        secondaryCtaLink="#preview"
        showVideo={true}
      />

      {/* Course Overview Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-gray-900 dark:text-white mb-6">
                Your Gateway to Ancient Wisdom
              </h2>
              <div className="w-24 h-1 bg-orange-500 mx-auto mb-8"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Instructor Info */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 border border-orange-100 dark:border-gray-600">
                <div className="text-center">
                  <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Instructor</h3>
                  <p className="text-orange-600 dark:text-orange-400 font-medium">Vishal Chaurasia</p>
                </div>
              </div>

              {/* Language Info */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 border border-orange-100 dark:border-gray-600">
                <div className="text-center">
                  <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Languages className="w-10 h-10 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Languages</h3>
                  <p className="text-orange-600 dark:text-orange-400 font-medium">Hindi & Hinglish</p>
                </div>
              </div>

              {/* Price Info */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 border border-orange-100 dark:border-gray-600">
                <div className="text-center">
                  <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-10 h-10 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Price</h3>
                  <p className="text-orange-600 dark:text-orange-400 font-medium">FREE</p>
                </div>
              </div>
            </div>

            {/* Course Description */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 mb-12">
              <h3 className="text-2xl font-playfair font-bold text-gray-900 dark:text-white mb-6">
                Transform Your Life with Timeless Knowledge
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                Step into a world where ancient wisdom meets modern understanding. Our masterclass series is your direct connection to the profound teachings of Samkhya, Yoga, and Tantra - knowledge that has illuminated the path for countless seekers across millennia.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                From the foundational principles that explain the nature of reality to advanced practices that unlock your highest potential, each session is carefully crafted to bring you closer to the wisdom that has shaped the greatest minds in human history.
              </p>
            </div>

            {/* Key Highlights */}
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-8">
              <h3 className="text-2xl font-playfair font-bold text-gray-900 dark:text-white mb-6">
                Why Choose Our Masterclasses?
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-orange-600 dark:text-orange-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Authentic teachings passed down through generations of Sanskrit scholars</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-orange-600 dark:text-orange-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Practical wisdom you can apply to transform your daily life</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-orange-600 dark:text-orange-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Join a community of seekers on the same transformative journey</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Syllabus Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-gray-900 dark:text-white mb-6">
                Your Journey Through Ancient Wisdom
              </h2>
              <div className="w-24 h-1 bg-orange-500 mx-auto mb-8"></div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {syllabusItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm">{index + 1}</span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Will Get Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-gray-900 dark:text-white mb-6">
              Your Complete Learning Experience
            </h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto mb-8"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 border border-orange-100 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-500 transition-all duration-300 hover:shadow-lg">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Preview Section */}
      <section id="preview" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-gray-900 dark:text-white mb-6">
                Preview Your Transformation
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Take a peek into the profound wisdom that awaits you. See how ancient knowledge can transform your understanding of life, consciousness, and reality itself.
              </p>
              <div className="w-24 h-1 bg-orange-500 mx-auto mb-8"></div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
              <div className="aspect-video bg-gradient-to-br from-orange-100 to-amber-100 dark:from-gray-800 dark:to-gray-700 rounded-xl flex items-center justify-center mb-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-10 h-10 text-white ml-1" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Your Journey Begins Here
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Preview: Discover the secrets of consciousness, reality, and spiritual transformation
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">What You'll Discover:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">The fundamental nature of consciousness and reality</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">Ancient techniques for spiritual awakening</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">Mastery over your emotions and mind</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">Sacred practices for divine connection</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Course Format:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">60-90 minute live interactive sessions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Users className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">Interactive sessions with fellow seekers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <MessageCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">Q&A session included</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Languages className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">Taught in Hindi and Hinglish</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <Outcomes
        title="Why Thousands Choose Our Masterclasses?"
        subtitle="Join a community of seekers who have already transformed their lives through ancient wisdom"
        outcomes={outcomes}
        columns={3}
      />

      {/* Free Masterclasses */}
      <section id="upcoming-classes" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-gray-900 dark:text-white mb-6">
              Free Masterclasses
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover the depth of ancient Indian wisdom through our carefully curated masterclass series. Each session is designed to transform your understanding and bring timeless knowledge to your modern life.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 relative z-10">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setSelectedCategory(category.id)
                }}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer z-10 relative ${
                  selectedCategory === category.id
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-500'
                }`}
                style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
              >
                <Filter className="w-4 h-4" />
                {category.name}
                <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-full text-xs">
                  {category.count}
                </span>
              </button>
            ))}
          </div>

          {filteredMasterclasses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No masterclasses found for the selected category.
              </p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors"
              >
                View All Classes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
              {filteredMasterclasses.map((masterclass, index) => (
              <div key={masterclass.id} className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-500 transition-all duration-300 hover:shadow-lg">
                <div className="text-center">
                  {/* Level Badge */}
                  <div className="flex justify-center mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(masterclass.level)}`}>
                      {masterclass.level}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {masterclass.title}
                  </h3>
                  <p className="text-sm font-sanskrit text-orange-600 dark:text-orange-400 mb-4">
                    {masterclass.sanskritTitle}
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(masterclass.date).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })} at {masterclass.time}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">{masterclass.acharya}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Languages className="w-4 h-4" />
                      <span>{masterclass.language}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm">
                    {masterclass.description}
                  </p>

                  {/* Topics */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Topics Covered:</h4>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {masterclass.topics.slice(0, 3).map((topic, idx) => (
                        <span key={idx} className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs rounded-full">
                          {topic}
                        </span>
                      ))}
                      {masterclass.topics.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                          +{masterclass.topics.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>



                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setButtonStates(prev => ({ ...prev, [masterclass.id]: true }))
                      const url = getCheckoutUrl(masterclass.id)
                      if (url && url !== '#') {
                        try {
                          window.open(url, '_blank', 'noopener,noreferrer')
                        } catch (error) {
                          console.error('Error opening checkout URL:', error)
                          alert('Unable to open checkout page. Please try again or contact support.')
                        }
                      } else {
                        console.error('No checkout URL found for masterclass:', masterclass.id)
                        alert('Checkout URL not available for this masterclass. Please contact support.')
                      }
                      setButtonStates(prev => ({ ...prev, [masterclass.id]: false }))
                    }}
                    disabled={buttonStates[masterclass.id]}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer z-10 relative px-4 py-2 rounded-md font-medium transition-colors"
                    style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
                  >
                    {buttonStates[masterclass.id] ? 'Opening...' : 'Join Masterclass'}
                  </button>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </section>

      {/* Checkout URLs for each masterclass */}
      {/* 
        Masterclass Checkout URLs:
        
        1. Tatvabodha: Samkhya Darshan
        - ID: fm-001
        - Checkout URL: https://courses.shikshanam.in/single-checkout/658fa59ae4b06d2e3bbf6d27?pid=p1
        
        2. Tatvabodha: Yoga Darshan  
        - ID: fm-002
        - Checkout URL: https://courses.shikshanam.in/single-checkout/65b208cbe4b0c73c831991ed?pid=p1
        
        3. Tatvabodha: Masterclass 3 - Yoga Darshan Vibhuti and Kaivalya Pada
        - ID: fm-003
        - Checkout URL: https://courses.shikshanam.in/single-checkout/65d03908e4b06baa4efbda89?pid=p1
        
        4. Navratri Special: Decoding the Principles of Tantra
        - ID: fm-004
        - Checkout URL: https://courses.shikshanam.in/single-checkout/6700f323b6e40105f97a57ed?pid=p1
        

        
        6. Stotra Chanting
        - ID: fm-006
        - Checkout URL: https://courses.shikshanam.in/single-checkout/688480a1e766436e41ce156b?pid=p1
      */}

      {/* Testimonials */}
      <Testimonials
        title="Transformations That Speak for Themselves"
        subtitle="Hear from seekers whose lives have been forever changed by these ancient teachings"
        testimonials={testimonials}
      />

      {/* Closing CTA */}
      <ClosingCTA
        title="Your Journey to Ancient Wisdom Starts Now"
        subtitle="Don't wait another moment to unlock the secrets that have guided humanity for millennia. Join thousands who have already begun their transformation."
        ctaText="Start Your Journey"
        ctaLink="#upcoming-classes"
        secondaryCtaText="Explore All Courses"
        secondaryCtaLink="/courses/all-courses"
        showMandala={true}
        variant="default"
      />
    </div>
  )
}
