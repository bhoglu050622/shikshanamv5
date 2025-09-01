'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Check, Play, BookOpen, Users, Clock, Award, MessageCircle, Download, Video, Star, Globe, Volume2, FileText, Smartphone, RotateCcw, X } from 'lucide-react'
import Link from 'next/link'

export default function ShikshanamSanskritPage() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0
  })

  const [currentScene, setCurrentScene] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isEnrolling, setIsEnrolling] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  // Scene refs for scroll detection
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    // Set target date to end of offer
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 1) // 1 day from now

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      if (distance > 0) {
        setTimeLeft({ hours, minutes, seconds })
      } else {
        clearInterval(timer)
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Scroll-based scene detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2
      
      sceneRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect()
          const elementTop = rect.top + window.scrollY
          const elementBottom = elementTop + rect.height
          
          if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
            setCurrentScene(index)
          }
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const playAudio = () => {
    setIsPlaying(true)
    // Simulate audio play
    setTimeout(() => setIsPlaying(false), 2000)
  }

  const handleEnrollment = async () => {
    // Redirect to payment page
    window.open('https://courses.shikshanam.in/single-checkout/655b340de4b0b31c6db6cb3c?pid=p2', '_blank')
  }

  const scenes = [
    {
      id: 'hero',
      title: '☀️ Discover the Living Language of the Sages',
      subtitle: '🕉️ Premium Online Sanskrit Course — Taught in Hindi by Traditional Gurukul Scholars',
      content: 'Learn. Speak. Read. Connect. Reclaim your connection to Sanskrit through a guided, modern, and deeply authentic learning journey.',
      visual: 'hero-sunrise'
    },
    {
      id: 'call',
      title: '🪔 The Call of Sanskrit — Ancient Yet Alive',
      content: 'For centuries, Sanskrit wasn\'t just spoken — it was lived. Today, it\'s more relevant than ever. Whether you seek clarity in spiritual texts, inner growth, or cultural depth, Sanskrit holds the key. Now, you can learn it — step by step, in Hindi, with ease.',
      visual: 'palm-leaf-transition'
    },
    {
      id: 'fluency',
      title: '📖 From First Syllable to Full Fluency',
      content: 'Start with the basics — not with dry grammar, but with sound, rhythm, and logic. Hear it. Say it. Feel it. Learn with clear, guided voiceovers in Hindi that teach you how to say it right.',
      visual: 'syllable-animation'
    },
    {
      id: 'grammar',
      title: '🧠 Grammar That Opens Doors, Not Frustration',
      content: 'Sanskrit grammar isn\'t about memorizing rules — it\'s about seeing patterns. We use animated visuals to show you how each sentence builds, unfolds, and flows. No overwhelm. Just awe.',
      visual: 'grammar-canvas'
    },
    {
      id: 'mentor',
      title: '👨‍🏫 Meet Your Mentor — Acharya V. Shrinidhi',
      content: 'Trained in the prestigious Poornaprajna Gurukul, Acharya Shrinidhi bridges the traditional and modern, teaching Sanskrit the way it was meant to be learned — through understanding, not memorization.',
      visual: 'mentor-parallax'
    },
    {
      id: 'learning',
      title: '🧘 Learning That Flows With You',
      content: 'What you get in this comprehensive course designed for your success.',
      visual: 'flipbook-features'
    },
    {
      id: 'bonuses',
      title: '🧳 Open the Treasure Chest (Bonuses Worth ₹10,000)',
      content: 'Exclusive bonus materials to accelerate your learning journey.',
      visual: 'treasure-box'
    },
    {
      id: 'transformation',
      title: '🏁 Your Transformation — In Real Steps',
      content: 'What you\'ll be able to achieve after completing this course.',
      visual: 'footsteps-sand'
    },
    {
      id: 'curriculum',
      title: '🧾 Curriculum Overview (Interactive)',
      content: 'Complete module breakdown of what you\'ll learn.',
      visual: 'accordion-modules'
    },
    {
      id: 'scope',
      title: '⚠️ A Note on Scope',
      content: 'What\'s included and what\'s not in this course.',
      visual: 'scope-clarity'
    },
    {
      id: 'certification',
      title: '📜 Get Certified',
      content: 'Earn a certificate upon completion that you can share proudly.',
      visual: 'certificate-seal'
    },
    {
      id: 'testimonials',
      title: '💬 Student Voices',
      content: 'Hear from students who have transformed their Sanskrit journey.',
      visual: 'floating-quotes'
    },
    {
      id: 'faq',
      title: '📞 Frequently Asked Questions',
      content: 'Common questions and answers about the course.',
      visual: 'sticky-toggle'
    },
    {
      id: 'final-cta',
      title: '🚀 Final Call to Action',
      content: 'Your journey into Sanskrit starts now.',
      visual: 'temple-bell'
    }
  ]

  const learningFeatures = [
    { icon: <Video className="w-6 h-6" />, title: '17+ Hours of Lessons', description: 'Stream anytime on web or app', color: 'from-blue-500 to-purple-500' },
    { icon: <MessageCircle className="w-6 h-6" />, title: 'Live Doubt Sessions', description: 'Weekly Q&A with Acharya ji', color: 'from-green-500 to-teal-500' },
    { icon: <BookOpen className="w-6 h-6" />, title: 'Sanskrit Bhasha Pragya', description: 'Start from zero in simple Hindi', color: 'from-yellow-500 to-orange-500' },
    { icon: <Users className="w-6 h-6" />, title: 'Sanskrit Sambhashan', description: 'Speak naturally without grammar stress', color: 'from-red-500 to-pink-500' },
    { icon: <Download className="w-6 h-6" />, title: 'Bonus Material', description: 'Flashcards, practice sheets, quizzes', color: 'from-indigo-500 to-blue-500' }
  ]

  const bonusItems = [
    { title: '500+ Flashcards', value: '₹3,500', icon: <BookOpen className="w-6 h-6" /> },
    { title: '12+ Printable Practice Sheets', value: '₹3,000', icon: <FileText className="w-6 h-6" /> },
    { title: '30+ Quizzes & Notes', value: '₹2,500', icon: <Download className="w-6 h-6" /> },
    { title: 'Lifetime Telegram Support Group', value: 'Included', icon: <MessageCircle className="w-6 h-6" /> },
    { title: 'App Access with Offline Download', value: 'Included', icon: <Smartphone className="w-6 h-6" /> }
  ]

  const transformationSteps = [
    'Pronounce Sanskrit with clarity',
    'Translate and understand shlokas',
    'Break down sentence structures using grammar',
    'Speak basic Sanskrit for conversation',
    'Begin reading scriptures with insight'
  ]

  const curriculumModules = [
    'Introduction to Sanskrit Alphabet (with pronunciation)',
    'Nouns, Pronouns & Declensions',
    'Verb Roots, Tenses & Usage',
    'Modifiers, Indeclinables & Prefixes',
    'Compound Words (Samasa)',
    'Sandhi (Sound Merging)',
    'Sanskrit Conversation Training',
    'Shloka Reading Practice',
    'Final Project + Certification'
  ]

  const notForYouItems = [
    'If you want instant results without practice',
    'If you prefer English-only instruction',
    'If you\'re looking for a quick certificate',
    'If you don\'t have 30 minutes daily to practice',
    'If you expect to learn without any effort'
  ]

  const scopeNotIncluded = [
    'Vedic chanting or ritual-focused Sanskrit',
    'Advanced academic/Vedantic topics',
    'English medium'
  ]

  const testimonials = [
    { quote: 'Acharya ji\'s teaching brought life to Sanskrit for me.', author: 'Priya S., Pune' },
    { quote: 'I struggled with pronunciation before. This course fixed it in week 1.', author: 'Rahul M., Varanasi' },
    { quote: 'I can now understand the Gita when I read it!', author: 'Maya T., California' }
  ]

  const faqs = [
    {
      question: 'How do I enroll?',
      answer: 'Click "Enroll Now" and sign up in less than a minute.'
    },
    {
      question: 'Is this course lifetime access?',
      answer: 'Yes. Buy once, learn forever.'
    },
    {
      question: 'Can I access it offline?',
      answer: 'Yes, via our mobile app (single-device download).'
    },
    {
      question: 'Refunds?',
      answer: 'This course is non-refundable. Please review the demo and details before purchase.'
    },
    {
      question: 'Need help?',
      answer: 'Call: +91‑9910032165 (Mon–Sat, 11AM–6PM) or Email: support@shikshanam.in'
    }
  ]

  return (
    <div ref={containerRef} className="relative">
      {/* Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <motion.div 
          className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
          style={{ width: progressWidth }}
        />
      </div>



      {/* Scene 1: Hero Section */}
      <section 
        ref={(el: HTMLDivElement | null) => { sceneRefs.current[0] = el }}
        data-scene="hero"
        className="min-h-screen relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      >
        {/* Enhanced Indian Sanskrit Background Elements */}
        <div className="absolute inset-0">
          {/* Sacred Geometry Background */}
          <div className="absolute inset-0 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-300 opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-red-400/15 via-orange-400/15 to-yellow-400/15"></div>
          
          {/* Temple Architecture Silhouettes */}
          <div className="absolute bottom-0 left-0 right-0 h-48">
            <svg viewBox="0 0 1200 200" className="w-full h-full">
              <defs>
                <linearGradient id="templeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{stopColor: 'rgba(0,0,0,0.1)', stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: 'rgba(0,0,0,0.3)', stopOpacity: 1}} />
                </linearGradient>
              </defs>
              {/* Temple Dome */}
              <path d="M 100 200 L 100 80 Q 100 40 140 40 Q 180 40 180 80 L 180 200 Z" fill="url(#templeGradient)"/>
              <path d="M 140 40 L 140 20 Q 140 0 160 0 Q 180 0 180 20 L 180 40 Z" fill="url(#templeGradient)"/>
              {/* Temple Pillars */}
              <rect x="200" y="120" width="20" height="80" fill="url(#templeGradient)"/>
              <rect x="240" y="120" width="20" height="80" fill="url(#templeGradient)"/>
              <rect x="280" y="120" width="20" height="80" fill="url(#templeGradient)"/>
              {/* More temple elements */}
              <path d="M 320 200 L 320 100 Q 320 60 360 60 Q 400 60 400 100 L 400 200 Z" fill="url(#templeGradient)"/>
              <path d="M 360 60 L 360 30 Q 360 10 380 10 Q 400 10 400 30 L 400 60 Z" fill="url(#templeGradient)"/>
            </svg>
          </div>
          
          {/* Sacred Om Symbol */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 2 }}
            className="absolute top-20 right-20 w-64 h-64 text-orange-400/20"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path d="M 50 20 Q 70 20 70 40 Q 70 60 50 60 Q 30 60 30 40 Q 30 20 50 20 Z" fill="currentColor"/>
              <path d="M 50 60 Q 70 60 70 80 Q 70 90 50 90 Q 30 90 30 80 Q 30 60 50 60 Z" fill="currentColor"/>
              <circle cx="50" cy="50" r="3" fill="currentColor"/>
            </svg>
          </motion.div>
          
          {/* Floating Sanskrit Characters with Enhanced Styling */}
          {['ॐ', 'अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ'].map((char, index) => (
            <motion.div
              key={char}
              initial={{ opacity: 0, y: 100, rotate: -180 }}
              whileInView={{ opacity: 0.6, y: 0, rotate: 0 }}
              transition={{ duration: 2, delay: index * 0.2 }}
              className="absolute text-6xl font-sanskrit drop-shadow-lg"
              style={{
                left: `${5 + (index * 8)}%`,
                top: `${15 + (index * 6)}%`,
                color: `hsl(${25 + index * 12}, 80%, 65%)`,
                textShadow: '3px 3px 6px rgba(0,0,0,0.2)',
                filter: 'drop-shadow(0 0 10px rgba(255,165,0,0.3))'
              }}
            >
              {char}
            </motion.div>
          ))}
          
          {/* Sacred Fire Elements */}
          <div className="absolute top-40 left-10 w-32 h-32">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-full h-full bg-gradient-to-br from-orange-300/40 to-red-300/40 rounded-full blur-xl"
            />
          </div>
          
          {/* Floating Diya (Oil Lamp) */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-60 right-32 w-16 h-16"
          >
            <div className="w-full h-full bg-gradient-to-br from-yellow-400/60 to-orange-400/60 rounded-full blur-md"></div>
            <div className="absolute inset-0 flex items-center justify-center text-2xl">🪔</div>
          </motion.div>
          
          {/* Sacred Geometry Patterns */}
          <div className="absolute top-1/2 left-1/4 w-24 h-24 opacity-20">
            <svg viewBox="0 0 100 100" className="w-full h-full text-orange-400">
              <polygon points="50,10 90,90 10,90" fill="none" stroke="currentColor" strokeWidth="2"/>
              <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </div>
          
          {/* Floating Particles with Sanskrit Theme */}
          {[...Array(12)].map((_, index) => (
            <motion.div
              key={index}
              className="absolute w-3 h-3 bg-gradient-to-r from-orange-400/40 to-yellow-400/40 rounded-full"
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${20 + Math.random() * 70}%`,
                filter: 'blur(1px)',
              }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-5xl mx-auto">
            {/* Enhanced Main Title with Sanskrit Typography */}
            <motion.h1 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-6xl sm:text-7xl lg:text-8xl font-playfair font-bold text-gray-800 dark:text-white mb-8 drop-shadow-2xl"
            >
              <span className="text-4xl sm:text-5xl lg:text-6xl text-orange-600 dark:text-orange-400 mb-4 block">ॐ</span>
              Discover the Living Language of the Sages
            </motion.h1>
            
            {/* Enhanced Subtitle with Traditional Elements */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl text-gray-700 dark:text-gray-100 mb-6 font-bold"
            >
              🕉️ Premium Online Sanskrit Course — Taught in Hindi by Traditional Gurukul Scholars
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-gray-600 dark:text-gray-200 mb-12 font-medium leading-relaxed"
            >
              Learn. Speak. Read. Connect. Reclaim your connection to Sanskrit through a guided, modern, and deeply authentic learning journey.
            </motion.p>
            
            {/* Enhanced Video Section with Indian Design Elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-xl rounded-3xl p-8 mb-12 max-w-5xl mx-auto border-2 border-orange-200/30 shadow-2xl relative overflow-hidden"
            >
              {/* Decorative Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 via-yellow-400/10 to-orange-400/10 rounded-3xl"></div>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500"></div>
              
              <div className="text-center mb-8 relative z-10">
                <div className="text-6xl mb-4">🎬</div>
                <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">Watch Our Introduction</h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg">Experience the magic of Sanskrit learning</p>
              </div>
              
              {/* Enhanced Video Container */}
              <div className="relative w-full h-0 pb-[56.25%] rounded-2xl overflow-hidden shadow-2xl border-2 border-orange-200/50">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/SEHrRi3hkDk?rel=0&modestbranding=1"
                  title="Sanskrit Course Introduction"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>

            {/* Enhanced Acharya Section with Traditional Design */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="mb-12"
            >
              <div className="flex justify-center items-center gap-6 mb-6">
                {/* Acharya Image 1 - Traditional Golden Background */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                  className="relative group"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-orange-400/60 shadow-2xl group-hover:border-orange-500 group-hover:scale-110 transition-all duration-500">
                    <div className="w-full h-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                      <span className="text-3xl">👨‍🏫</span>
                    </div>
                  </div>
                  <div className="absolute -inset-3 bg-gradient-to-r from-orange-400/30 to-amber-400/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </motion.div>

                {/* Acharya Image 2 - Warm Orange Background */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.3 }}
                  className="relative group"
                >
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-red-400/60 shadow-2xl group-hover:border-red-500 group-hover:scale-110 transition-all duration-500">
                    <div className="w-full h-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                      <span className="text-4xl">🧘‍♂️</span>
                    </div>
                  </div>
                  <div className="absolute -inset-3 bg-gradient-to-r from-red-400/30 to-orange-400/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </motion.div>

                {/* Acharya Image 3 - Temple Background */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4 }}
                  className="relative group"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-yellow-400/60 shadow-2xl group-hover:border-yellow-500 group-hover:scale-110 transition-all duration-500">
                    <div className="w-full h-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                      <span className="text-3xl">🕉️</span>
                    </div>
                  </div>
                  <div className="absolute -inset-3 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </motion.div>
              </div>
              
              <div className="text-center">
                <p className="text-gray-800 dark:text-white font-bold text-xl mb-2">Acharya V. Shrinidhi</p>
                <p className="text-gray-600 dark:text-gray-300 text-base font-medium">Traditional Gurukul Scholar & Sanskrit Expert</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Poornaprajna Gurukul Graduate</p>
              </div>
            </motion.div>
            
            {/* Enhanced Countdown Timer with Indian Design */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, type: "spring", stiffness: 100 }}
              className="bg-gradient-to-r from-orange-500/95 to-amber-500/95 backdrop-blur-xl rounded-3xl px-10 py-8 inline-block mb-12 border-2 border-orange-300/50 shadow-2xl relative overflow-hidden"
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-yellow-400/20 to-orange-400/20"></div>
              
              <div className="text-center relative z-10">
                <span className="text-white font-bold text-xl mb-4 block">⏰ Special Offer Ends In:</span>
                <div className="flex gap-4 justify-center items-center">
                  <motion.div 
                    className="bg-white/25 backdrop-blur-sm rounded-2xl px-6 py-4 min-w-[80px] border border-white/30"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-3xl font-bold text-white">
                      {timeLeft.hours.toString().padStart(2, '0')}
                    </div>
                    <div className="text-sm text-white/90 font-medium">Hours</div>
                  </motion.div>
                  <span className="text-white text-3xl font-bold">:</span>
                  <motion.div 
                    className="bg-white/25 backdrop-blur-sm rounded-2xl px-6 py-4 min-w-[80px] border border-white/30"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-3xl font-bold text-white">
                      {timeLeft.minutes.toString().padStart(2, '0')}
                    </div>
                    <div className="text-sm text-white/90 font-medium">Minutes</div>
                  </motion.div>
                  <span className="text-white text-3xl font-bold">:</span>
                  <motion.div 
                    className="bg-white/25 backdrop-blur-sm rounded-2xl px-6 py-4 min-w-[80px] border border-white/30"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-3xl font-bold text-white">
                      {timeLeft.seconds.toString().padStart(2, '0')}
                    </div>
                    <div className="text-sm text-white/90 font-medium">Seconds</div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7 }}
            >
              <Button
                size="lg"
                onClick={() => window.open('https://courses.shikshanam.in/single-checkout/655b340de4b0b31c6db6cb3c?pid=p2', '_blank')}
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-12 py-6 text-2xl font-bold rounded-full shadow-2xl border-2 border-orange-300/50 hover:border-orange-400/50 transition-all duration-300 hover:scale-105"
              >
                🚀 Start Your Sanskrit Journey
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

           {/* Scene 2: The Call of Sanskrit */}
           <section 
        ref={(el: HTMLDivElement | null) => { sceneRefs.current[1] = el }}
        className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-700 flex items-center relative overflow-hidden py-20"
      >
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0">
          {/* Sacred Geometry Patterns */}
          <div className="absolute top-20 left-20 w-32 h-32 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full text-orange-400">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
              <polygon points="50,5 95,50 50,95 5,50" fill="none" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </div>
          <div className="absolute bottom-20 right-20 w-40 h-40 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full text-amber-400">
              <polygon points="50,10 90,90 10,90" fill="none" stroke="currentColor" strokeWidth="2"/>
              <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </div>
          
          {/* Floating Sanskrit Mantras */}
          {['ॐ नमः शिवाय', 'सर्वे भवन्तु सुखिनः', 'वसुधैव कुटुम्बकम्'].map((mantra, index) => (
            <motion.div
              key={mantra}
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 0.3, x: 0 }}
              transition={{ duration: 2, delay: index * 0.5 }}
              className="absolute text-lg font-sanskrit text-orange-400/40"
              style={{
                left: `${10 + (index * 25)}%`,
                top: `${20 + (index * 20)}%`,
                transform: 'rotate(-15deg)',
              }}
            >
              {mantra}
            </motion.div>
          ))}
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-5xl mx-auto"
          >
            <h2 className="text-5xl sm:text-6xl font-playfair font-bold text-gray-800 dark:text-white mb-8 drop-shadow-lg">
              🪔 The Call of Sanskrit — Ancient Yet Alive
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-200 mb-12 leading-relaxed font-medium">
              For centuries, Sanskrit wasn't just spoken — it was lived. Today, it's more relevant than ever. Whether you seek clarity in spiritual texts, inner growth, or cultural depth, Sanskrit holds the key. Now, you can learn it — step by step, in Hindi, with ease.
            </p>

            {/* Enhanced Palm Leaf to Digital Transition Animation */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5 }}
                className="bg-gradient-to-br from-white/95 to-orange-50/95 dark:from-gray-800/95 dark:to-gray-700/95 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-2xl border-2 border-orange-200/50"
              >
                <div className="relative flex flex-col md:flex-row gap-8 sm:gap-12 items-center justify-center">
                  {/* Ancient Palm Leaf Manuscript */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="w-full md:w-1/2 text-center relative bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl p-8 sm:p-10 border border-orange-200/50 shadow-lg"
                  >
                    <div className="relative mb-6 sm:mb-8">
                      <div className="text-7xl sm:text-8xl mb-6">📜</div>
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-amber-400/20 rounded-full blur-2xl scale-150"></div>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 dark:text-white">Ancient Wisdom</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-6">Sacred palm leaf manuscripts</p>
                    <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                      <p>• Traditional Gurukul methods</p>
                      <p>• Sacred text preservation</p>
                      <p>• Ancient knowledge systems</p>
                    </div>
                  </motion.div>

                  {/* Enhanced Transition Arrow for Desktop */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5 }}
                    className="hidden md:flex flex-col items-center mx-4"
                  >
                    <div className="text-5xl text-orange-500 animate-pulse drop-shadow-lg mb-2">→</div>
                    <div className="text-xs text-orange-600 font-semibold bg-white/95 backdrop-blur-md rounded-xl px-3 py-1.5 shadow-xl text-center whitespace-nowrap border border-orange-200/30">Bridging Tradition & Technology</div>
                  </motion.div>
                  
                  {/* Transition Arrow for Mobile (displays below) */}
                   <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5 }}
                    className="flex md:hidden flex-col items-center my-4"
                  >
                    <div className="text-4xl text-orange-500 animate-pulse drop-shadow-lg mb-2">↓</div>
                    <div className="text-xs text-orange-600 font-semibold bg-white/95 backdrop-blur-md rounded-xl px-3 py-1.5 shadow-xl text-center whitespace-nowrap border border-orange-200/30">Bridging Tradition & Technology</div>
                  </motion.div>


                  {/* Modern Digital Learning */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                    className="w-full md:w-1/2 text-center relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 sm:p-10 border border-blue-200/50 shadow-lg"
                  >
                    <div className="relative mb-6 sm:mb-8">
                      <div className="text-7xl sm:text-8xl mb-6">💻</div>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-2xl scale-150"></div>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 dark:text-white">Modern Learning</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-6">Digital Sanskrit education</p>
                    <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                      <p>• Interactive video lessons</p>
                      <p>• Mobile app access</p>
                      <p>• Live doubt sessions</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Additional Cultural Context */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <div className="bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl p-6 border border-orange-200/50">
                <div className="text-4xl mb-4">🕉️</div>
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Spiritual Connection</h3>
                <p className="text-gray-600 dark:text-gray-300">Connect with ancient wisdom and spiritual texts</p>
              </div>
              <div className="bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-red-200/50">
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Mental Clarity</h3>
                <p className="text-gray-600 dark:text-gray-300">Enhance cognitive abilities and mental discipline</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-yellow-200/50">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Cultural Heritage</h3>
                <p className="text-gray-600 dark:text-gray-300">Preserve and celebrate Indian cultural heritage</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* Scene 3: Grammar Deconstruction */}
      <section 
        ref={(el: HTMLDivElement | null) => { sceneRefs.current[2] = el }}
        className="min-h-screen bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center relative overflow-hidden"
      >
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0">
          {/* Sacred Geometry Patterns */}
          <div className="absolute top-20 left-20 w-48 h-48 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full text-white">
              <polygon points="50,5 95,50 50,95 5,50" fill="none" stroke="currentColor" strokeWidth="2"/>
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1"/>
              <polygon points="50,15 85,50 50,85 15,50" fill="none" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </div>
          <div className="absolute bottom-20 right-20 w-40 h-40 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full text-white">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
              <polygon points="50,10 90,50 50,90 10,50" fill="none" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </div>
          
          {/* Floating Sanskrit Grammar Elements */}
          {['क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ'].map((char, index) => (
            <motion.div
              key={char}
              initial={{ opacity: 0, y: 50, rotate: 180 }}
              whileInView={{ opacity: 0.4, y: 0, rotate: 0 }}
              transition={{ duration: 1.5, delay: index * 0.1 }}
              className="absolute text-2xl font-sanskrit text-white/30"
              style={{
                left: `${5 + (index * 8)}%`,
                top: `${10 + (index * 8)}%`,
                transform: 'rotate(-15deg)',
              }}
            >
              {char}
            </motion.div>
          ))}
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-6xl mx-auto"
          >
            <h2 className="text-5xl sm:text-6xl font-playfair font-bold mb-8 drop-shadow-lg">
              📚 Grammar That Feels Like Magic
            </h2>
            <p className="text-xl mb-12 opacity-90 max-w-3xl mx-auto">
              Sanskrit grammar isn't just rules — it's a beautifully crafted structure. Watch it unfold like origami: elegant, logical, mesmerizing.
            </p>

            {/* Enhanced Grammar Breakdown with Indian Design */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                { 
                  original: 'रामः', 
                  parts: ['राम', 'ः'], 
                  meaning: 'Rama',
                  explanation: 'Noun with nominative case ending',
                  color: 'from-orange-400 to-red-400'
                },
                { 
                  original: 'गच्छति', 
                  parts: ['गम्', 'च्छ', 'ति'], 
                  meaning: 'Goes',
                  explanation: 'Verb root with present tense',
                  color: 'from-yellow-400 to-orange-400'
                },
                { 
                  original: 'वनम्', 
                  parts: ['वन', 'म्'], 
                  meaning: 'Forest',
                  explanation: 'Noun with accusative case ending',
                  color: 'from-red-400 to-pink-400'
                }
              ].map((word, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.3 }}
                  className="bg-white/20 backdrop-blur-xl rounded-2xl p-8 border border-white/30 shadow-2xl hover:bg-white/30 transition-all duration-300"
                >
                  <div className="text-4xl font-sanskrit mb-6 text-center">{word.original}</div>
                  <div className="text-sm opacity-75 mb-3 font-semibold">Grammar Breakdown:</div>
                  <div className="flex justify-center gap-3 mb-6 flex-wrap">
                    {word.parts.map((part, partIndex) => (
                      <motion.span
                        key={partIndex}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: partIndex * 0.1 }}
                        className={`bg-gradient-to-r ${word.color} rounded-lg px-3 py-2 text-sm font-sanskrit text-white shadow-lg`}
                      >
                        {part}
                      </motion.span>
                    ))}
                  </div>
                  <div className="text-lg font-bold mb-2">{word.meaning}</div>
                  <div className="text-sm opacity-80 text-center">{word.explanation}</div>
                </motion.div>
              ))}
            </div>

            {/* Additional Grammar Concepts */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[
                { title: 'Sandhi', description: 'Sound merging rules', icon: '🔗' },
                { title: 'Samasa', description: 'Compound word formation', icon: '🔗' },
                { title: 'Vibhakti', description: 'Case endings', icon: '📝' },
                { title: 'Dhatu', description: 'Verb roots', icon: '🌱' }
              ].map((concept, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className="bg-white/15 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 hover:bg-white/25 transition-all duration-300"
                >
                  <div className="text-3xl mb-3">{concept.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{concept.title}</h3>
                  <p className="text-sm opacity-80">{concept.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Scene 4: Enhanced Mentor Section */}
      <section 
        ref={(el: HTMLDivElement | null) => { sceneRefs.current[3] = el }}
        className="min-h-screen bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-400 text-white flex items-center relative overflow-hidden"
      >
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-orange-300/20 to-yellow-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-red-300/15 to-orange-300/15 rounded-full blur-2xl"></div>
        
        {/* Sacred Geometry Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full text-white">
              <polygon points="50,5 95,50 50,95 5,50" fill="none" stroke="currentColor" strokeWidth="2"/>
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full text-white">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
              <polygon points="50,10 90,50 50,90 10,50" fill="none" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="text-5xl sm:text-6xl font-playfair font-bold text-white mb-6 drop-shadow-lg">
                👨‍🏫 Meet Acharya V. Shrinidhi
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Traditional Gurukul Scholar & Modern Sanskrit Educator
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20 relative overflow-hidden">
              {/* Decorative Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 via-yellow-400/10 to-orange-400/10 rounded-3xl"></div>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                {/* Enhanced Acharya Images Grid */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  className="text-center"
                >
                  <div className="grid grid-cols-3 gap-8 mb-8">
                    {/* Image 1 - Traditional Golden */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="relative group"
                    >
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-300/80 shadow-2xl group-hover:border-orange-400 group-hover:scale-110 transition-all duration-300">
                        <div className="w-full h-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                          <span className="text-4xl drop-shadow-lg">👨‍🏫</span>
                        </div>
                      </div>
                      <div className="absolute -inset-4 bg-gradient-to-r from-orange-400/40 to-amber-400/40 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Teacher
                      </div>
                    </motion.div>

                    {/* Image 2 - Warm Orange */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="relative group"
                    >
                      <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-red-300/80 shadow-2xl group-hover:border-red-400 group-hover:scale-110 transition-all duration-300">
                        <div className="w-full h-full bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center">
                          <span className="text-5xl drop-shadow-lg">🧘‍♂️</span>
                        </div>
                      </div>
                      <div className="absolute -inset-4 bg-gradient-to-r from-red-400/40 to-orange-400/40 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Scholar
                      </div>
                    </motion.div>

                    {/* Image 3 - Temple */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="relative group"
                    >
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-300/80 shadow-2xl group-hover:border-yellow-400 group-hover:scale-110 transition-all duration-300">
                        <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                          <span className="text-4xl drop-shadow-lg">🕉️</span>
                        </div>
                      </div>
                      <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/40 to-orange-400/40 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-yellow-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Guide
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-white font-bold text-xl mb-2 drop-shadow-lg">Acharya V. Shrinidhi</p>
                    <p className="text-white text-base font-medium">Poornaprajna Gurukul Scholar</p>
                    <p className="text-white/90 text-sm mt-1">Traditional Sanskrit Expert</p>
                  </div>
                </motion.div>

                <div className="lg:col-span-1">
                  <motion.p 
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl text-white/95 mb-8 leading-relaxed"
                  >
                    Trained in the prestigious Poornaprajna Gurukul, Acharya Shrinidhi bridges the traditional and modern, teaching Sanskrit the way it was meant to be learned — through understanding, not memorization.
                  </motion.p>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                  >
                    <div className="flex items-center gap-4 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                      <Award className="w-6 h-6 text-orange-300" />
                      <div>
                        <span className="text-white font-semibold block">12+ Years</span>
                        <span className="text-white/70 text-sm">Experience</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                      <BookOpen className="w-6 h-6 text-orange-300" />
                      <div>
                        <span className="text-white font-semibold block">Traditional</span>
                        <span className="text-white/70 text-sm">Gurukul Training</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                      <Users className="w-6 h-6 text-orange-300" />
                      <div>
                        <span className="text-white font-semibold block">1000+</span>
                        <span className="text-white/70 text-sm">Students Taught</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                      <Star className="w-6 h-6 text-orange-300" />
                      <div>
                        <span className="text-white font-semibold block">4.9/5</span>
                        <span className="text-white/70 text-sm">Student Rating</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Scene 5: Chat Bubbles */}
      <section 
        ref={(el: HTMLDivElement | null) => { sceneRefs.current[4] = el }}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:bg-gray-800 flex items-center relative overflow-hidden"
      >
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0">
          {/* Sacred Geometry Patterns */}
          <div className="absolute top-20 left-20 w-32 h-32 opacity-5">
            <svg viewBox="0 0 100 100" className="w-full h-full text-orange-400">
              <polygon points="50,5 95,50 50,95 5,50" fill="none" stroke="currentColor" strokeWidth="2"/>
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </div>
          <div className="absolute bottom-20 right-20 w-40 h-40 opacity-5">
            <svg viewBox="0 0 100 100" className="w-full h-full text-amber-400">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
              <polygon points="50,10 90,50 50,90 10,50" fill="none" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </div>
          
          {/* Floating Sanskrit Conversation Elements */}
          {['नमस्ते', 'धन्यवाद', 'स्वागतम्', 'शुभम्'].map((word, index) => (
            <motion.div
              key={word}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 0.2, y: 0 }}
              transition={{ duration: 2, delay: index * 0.3 }}
              className="absolute text-lg font-sanskrit text-orange-400/30"
              style={{
                left: `${15 + (index * 20)}%`,
                top: `${25 + (index * 15)}%`,
                transform: 'rotate(-10deg)',
              }}
            >
              {word}
            </motion.div>
          ))}
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-5xl sm:text-6xl font-playfair font-bold text-gray-800 dark:text-white mb-6 drop-shadow-lg">
                🗣️ Speak the Language — Not Just Learn It
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-200 mb-8 font-medium">
                We skip the boring textbook approach. You'll start forming real Sanskrit sentences from Week 1. No excessive grammar drills — just practice, patterns, and progress.
              </p>
              
              {/* Additional Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                <div className="flex items-center gap-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-4 border border-orange-200/50">
                  <div className="text-2xl">🎯</div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-white">Practical Focus</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Real conversations from day one</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-red-200/50">
                  <div className="text-2xl">🧠</div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-white">Natural Learning</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Pattern-based approach</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              {/* Enhanced Chat Bubbles Animation */}
              <div className="space-y-6">
                {[
                  { text: 'नमस्ते! कथम् अस्ति?', translation: 'Hello! How are you?', delay: 0, speaker: 'Student' },
                  { text: 'अहं कुशली अस्मि।', translation: 'I am fine.', delay: 0.5, speaker: 'Teacher' },
                  { text: 'तव नाम किम्?', translation: 'What is your name?', delay: 1, speaker: 'Student' },
                  { text: 'मम नाम रामः।', translation: 'My name is Rama.', delay: 1.5, speaker: 'Teacher' }
                ].map((bubble, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: bubble.delay }}
                    className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-xs p-6 rounded-2xl shadow-lg border ${
                      index % 2 === 0 
                        ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white border-orange-400/30' 
                        : 'bg-gradient-to-br from-gray-100 to-white dark:from-gray-700 dark:to-gray-600 text-gray-900 dark:text-white border-gray-200/50 dark:border-gray-600/50'
                    }`}>
                      <div className="text-xs opacity-75 mb-2 font-semibold">{bubble.speaker}</div>
                      <div className="font-sanskrit text-xl mb-2">{bubble.text}</div>
                      <div className="text-sm opacity-80 font-medium">{bubble.translation}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Conversation Progress Indicator */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
                className="mt-8 text-center"
              >
                <div className="bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-4 border border-orange-200/50">
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    💬 This is just Week 1! Imagine what you'll be saying by Week 8...
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Scene 6: Curriculum Unboxing */}
      <section 
        ref={(el: HTMLDivElement | null) => { sceneRefs.current[5] = el }}
        className="min-h-screen bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center relative overflow-hidden"
      >
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0">
          {/* Sacred Geometry Patterns */}
          <div className="absolute top-20 left-20 w-48 h-48 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full text-white">
              <polygon points="50,5 95,50 50,95 5,50" fill="none" stroke="currentColor" strokeWidth="2"/>
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1"/>
              <polygon points="50,15 85,50 50,85 15,50" fill="none" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </div>
          <div className="absolute bottom-20 right-20 w-40 h-40 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full text-white">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
              <polygon points="50,10 90,50 50,90 10,50" fill="none" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </div>
          
          {/* Floating Sanskrit Learning Elements */}
          {['शिक्षा', 'ज्ञान', 'विद्या', 'अध्ययन'].map((word, index) => (
            <motion.div
              key={word}
              initial={{ opacity: 0, y: 50, rotate: 180 }}
              whileInView={{ opacity: 0.3, y: 0, rotate: 0 }}
              transition={{ duration: 2, delay: index * 0.3 }}
              className="absolute text-lg font-sanskrit text-white/40"
              style={{
                left: `${10 + (index * 20)}%`,
                top: `${15 + (index * 20)}%`,
                transform: 'rotate(-15deg)',
              }}
            >
              {word}
            </motion.div>
          ))}
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-7xl mx-auto"
          >
            <h2 className="text-5xl sm:text-6xl font-playfair font-bold mb-8 drop-shadow-lg">
              📦 Here's What You Get
            </h2>
            <p className="text-xl mb-12 text-white font-medium max-w-3xl mx-auto">
              Everything you need to master Sanskrit, delivered in the most effective way possible.
            </p>

            {/* Enhanced Animated Curriculum Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-16">
              {learningFeatures.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0, y: 50 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/20 backdrop-blur-xl rounded-2xl p-8 text-center hover:bg-white/30 transition-all duration-300 border border-white/30 shadow-2xl hover:shadow-3xl hover:scale-105"
                >
                  <div className={`w-20 h-20 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg`}>
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-lg text-white mb-3">{item.title}</h3>
                  <p className="text-sm text-white/90 font-medium leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Additional Course Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="font-bold text-lg mb-2">Structured Learning</h3>
                <p className="text-sm text-white/80">Step-by-step progression from basics to advanced</p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-4xl mb-4">🔄</div>
                <h3 className="font-bold text-lg mb-2">Lifetime Access</h3>
                <p className="text-sm text-white/80">Learn at your own pace, revisit anytime</p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="font-bold text-lg mb-2">Certification</h3>
                <p className="text-sm text-white/80">Earn a certificate upon completion</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Scene 6.5: Bonus Section */}
      <section 
        ref={(el: HTMLDivElement | null) => { sceneRefs.current[6] = el }}
        className="min-h-screen bg-gradient-to-br from-purple-700 via-pink-700 to-orange-700 text-white flex items-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom right, #7c3aed, #ec4899, #ea580c)'
        }}
      >
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0">
          {/* Sacred Geometry Patterns */}
          <div className="absolute top-20 left-20 w-48 h-48 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full text-white">
              <polygon points="50,5 95,50 50,95 5,50" fill="none" stroke="currentColor" strokeWidth="2"/>
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </div>
          <div className="absolute bottom-20 right-20 w-40 h-40 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full text-white">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
              <polygon points="50,10 90,50 50,90 10,50" fill="none" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </div>
          
          {/* Floating Treasure Elements */}
          {['💎', '🏆', '🎁', '✨', '💫'].map((element, index) => (
            <motion.div
              key={element}
              initial={{ opacity: 0, y: 50, rotate: 180 }}
              whileInView={{ opacity: 0.6, y: 0, rotate: 0 }}
              transition={{ duration: 2, delay: index * 0.3 }}
              className="absolute text-3xl drop-shadow-2xl"
              style={{
                left: `${10 + (index * 15)}%`,
                top: `${15 + (index * 20)}%`,
                filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.5))'
              }}
            >
              {element}
            </motion.div>
          ))}
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-6xl mx-auto"
          >
            <h2 className="text-5xl sm:text-6xl font-playfair font-bold mb-8 drop-shadow-2xl text-white">
              🧳 Open the Treasure Chest (Bonuses Worth ₹9,000+)
            </h2>
            <p className="text-xl mb-12 text-white font-medium max-w-3xl mx-auto drop-shadow-lg">
              Exclusive bonus materials to accelerate your learning journey and make your Sanskrit mastery complete.
            </p>

            {/* Enhanced Bonus Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-16">
              {bonusItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0, y: 50 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 text-center hover:bg-white/30 transition-all duration-300 border-2 border-white/50 shadow-2xl hover:shadow-3xl hover:scale-105 relative overflow-hidden group"
                >
                  {/* Bonus Ribbon */}
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-bl-lg shadow-xl z-10 border border-yellow-300/30">
                    BONUS
                  </div>
                  
                  {/* Icon Container */}
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-xl group-hover:scale-110 transition-transform duration-300 border-2 border-white/30">
                    {item.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className="font-bold text-lg text-white mb-3 leading-tight drop-shadow-lg">{item.title}</h3>
                  
                  {/* Value */}
                  <div className="text-2xl font-bold text-yellow-300 mb-3 drop-shadow-lg">
                    {item.value}
                  </div>
                  
                  {/* Description */}
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                    <p className="text-xs text-white font-medium leading-relaxed drop-shadow-md">
                      {item.value === 'Included' ? 'Completely FREE with your course enrollment' : 'Exclusive bonus value'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Total Value Highlight */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-yellow-400/25 to-orange-400/25 backdrop-blur-xl rounded-3xl p-8 border-2 border-yellow-300/60 shadow-2xl relative overflow-hidden"
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-yellow-400/20"></div>
              
              <div className="text-center relative z-10">
                <div className="text-4xl mb-4 drop-shadow-lg">🎁</div>
                <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">Total Bonus Value</h3>
                <div className="text-6xl font-bold text-yellow-300 mb-2 drop-shadow-2xl">₹9,000+</div>
                <p className="text-white text-lg font-medium mb-4 drop-shadow-lg">All included FREE with your course enrollment!</p>
                <div className="bg-white/25 backdrop-blur-sm rounded-xl p-4 inline-block border border-white/30">
                  <p className="text-white text-sm font-semibold drop-shadow-md">
                    💎 That's ₹9,000+ worth of exclusive materials you get absolutely FREE!
                  </p>
                </div>
              </div>
            </motion.div>
            
            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-12 text-center"
            >
              <Button
                size="lg"
                onClick={() => window.open('https://courses.shikshanam.in/single-checkout/655b340de4b0b31c6db6cb3c?pid=p2', '_blank')}
                className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-gray-900 px-12 py-6 text-xl font-bold rounded-full shadow-2xl border-2 border-yellow-400/50 hover:scale-105 transition-all duration-300 drop-shadow-lg"
              >
                🎁 Claim Your ₹9,000+ Bonus Package
              </Button>
              <p className="text-white text-sm mt-4 font-medium drop-shadow-lg">
                Enroll now and get instant access to all bonus materials!
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Scene 7: Global Community */}
      <section 
        ref={(el: HTMLDivElement | null) => { sceneRefs.current[7] = el }}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:bg-gray-800 flex items-center relative overflow-hidden"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl sm:text-5xl font-playfair font-bold text-gray-800 dark:text-white mb-8 drop-shadow-lg">
              🌐 Thousands Have Already Started. Why Not You?
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-200 mb-12 font-medium">
              From Mumbai to Melbourne, students are reconnecting with their roots. And it all started with one scroll, one class, one syllable.
            </p>

            {/* Enhanced Global Map Animation with Better Visibility */}
            <div className="relative">
              <div className="w-full h-64 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-blue-400/30">
                <Globe className="w-32 h-32 text-white/70" />
                
                {/* Enhanced Animated dots representing learners */}
                {[
                  { x: '20%', y: '30%', city: 'Mumbai', color: 'bg-yellow-400' },
                  { x: '80%', y: '40%', city: 'Melbourne', color: 'bg-orange-400' },
                  { x: '15%', y: '60%', city: 'Delhi', color: 'bg-red-400' },
                  { x: '85%', y: '20%', city: 'Toronto', color: 'bg-green-400' },
                  { x: '50%', y: '50%', city: 'Dubai', color: 'bg-pink-400' }
                ].map((dot, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.2 }}
                    className="absolute"
                    style={{ left: dot.x, top: dot.y }}
                  >
                    <div className={`w-6 h-6 ${dot.color} rounded-full animate-pulse shadow-lg border-2 border-white`}></div>
                    <div className="text-sm text-white mt-2 text-center font-semibold bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">{dot.city}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Scene 8: Outcomes */}
      <section 
        ref={(el: HTMLDivElement | null) => { sceneRefs.current[8] = el }}
        className="min-h-screen bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl sm:text-5xl font-playfair font-bold mb-8 drop-shadow-lg">
              💡 Clarity, Confidence & Connection
            </h2>
            <p className="text-xl mb-12 text-white font-medium">
              What you'll achieve by the end of this transformative journey.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {transformationSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white/20 backdrop-blur-sm rounded-lg p-6 flex items-center gap-4"
                >
                  <Check className="w-8 h-8 text-yellow-300 flex-shrink-0" />
                  <span className="font-bold text-white text-lg">{step}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Scene 9: Not For You */}
      <section 
        ref={(el: HTMLDivElement | null) => { sceneRefs.current[9] = el }}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:bg-gray-800 flex items-center relative overflow-hidden"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl sm:text-5xl font-playfair font-bold text-gray-800 dark:text-white mb-8 drop-shadow-lg">
              ⚠️ This Course Isn't For Everyone
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-200 mb-12 font-medium">
              We want to be clear about expectations so you can make the right decision.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {notForYouItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6 text-center"
                >
                  <X className="w-8 h-8 text-red-500 mx-auto mb-4" />
                  <p className="text-red-700 dark:text-red-300 font-medium">{item}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-12 bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6"
            >
              <p className="text-orange-800 dark:text-orange-200 font-semibold">
                This is deep learning for genuine seekers.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Scene 10: Instagram Reel-Style Testimonials */}
      <section 
        ref={(el: HTMLDivElement | null) => { sceneRefs.current[10] = el }}
        className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-600 text-white flex items-center relative overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20"></div>
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-br from-orange-400/20 to-yellow-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl sm:text-6xl font-playfair font-bold text-white mb-6 drop-shadow-2xl">
              📱 Student Stories
            </h2>
            <p className="text-xl text-white/95 max-w-2xl mx-auto font-medium">
              Real experiences from our Sanskrit learners
            </p>
          </motion.div>

          {/* Instagram Reel-Style Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Reel 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative group"
            >
              <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
                <div className="relative w-full h-0 pb-[177.78%] rounded-xl overflow-hidden mb-4">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/KY6jVDHuMiM?rel=0&modestbranding=1"
                    title="Student Testimonial 1"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">Priya's Journey</h3>
                  <p className="text-white/80 text-sm">"Sanskrit pronunciation became crystal clear!"</p>
                </div>
                {/* Instagram-style overlay */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm">📱</span>
                </div>
              </div>
            </motion.div>

            {/* Reel 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative group"
            >
              <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
                <div className="relative w-full h-0 pb-[177.78%] rounded-xl overflow-hidden mb-4">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/1wRsegfOJoQ?rel=0&modestbranding=1"
                    title="Student Testimonial 2"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">Rahul's Breakthrough</h3>
                  <p className="text-white/80 text-sm">"From zero to reading shlokas in weeks!"</p>
                </div>
                {/* Instagram-style overlay */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm">🔥</span>
                </div>
              </div>
            </motion.div>

            {/* Reel 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="relative group"
            >
              <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
                <div className="relative w-full h-0 pb-[177.78%] rounded-xl overflow-hidden mb-4">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/5IOb3Iy5rnY?rel=0&modestbranding=1"
                    title="Student Testimonial 3"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">Maya's Transformation</h3>
                  <p className="text-white/80 text-sm">"Understanding the Gita like never before!"</p>
                </div>
                {/* Instagram-style overlay */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm">⭐</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-12"
          >
            <p className="text-white text-lg mb-6 font-medium">
              Join thousands of students who have transformed their Sanskrit journey
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-10 py-5 text-xl font-bold rounded-full shadow-2xl border-2 border-white/20 hover:scale-105 transition-all duration-300"
            >
              🎬 Watch More Stories
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Scene 11: Final CTA */}
      <section 
        ref={(el: HTMLDivElement | null) => { sceneRefs.current[11] = el }}
        className="min-h-screen bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center relative overflow-hidden"
      >
        {/* Enhanced Sunrise Animation Background */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-orange-600 via-amber-500 to-yellow-400"></div>
          
          {/* Enhanced Temple Silhouettes */}
          <div className="absolute bottom-0 left-0 right-0 h-48">
            <svg viewBox="0 0 1200 200" className="w-full h-full">
              <defs>
                <linearGradient id="finalTempleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{stopColor: 'rgba(0,0,0,0.2)', stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: 'rgba(0,0,0,0.4)', stopOpacity: 1}} />
                </linearGradient>
              </defs>
              {/* Temple Dome */}
              <path d="M 100 200 L 100 80 Q 100 40 140 40 Q 180 40 180 80 L 180 200 Z" fill="url(#finalTempleGradient)"/>
              <path d="M 140 40 L 140 20 Q 140 0 160 0 Q 180 0 180 20 L 180 40 Z" fill="url(#finalTempleGradient)"/>
              {/* Temple Pillars */}
              <rect x="200" y="120" width="20" height="80" fill="url(#finalTempleGradient)"/>
              <rect x="240" y="120" width="20" height="80" fill="url(#finalTempleGradient)"/>
              <rect x="280" y="120" width="20" height="80" fill="url(#finalTempleGradient)"/>
              {/* More temple elements */}
              <path d="M 320 200 L 320 100 Q 320 60 360 60 Q 400 60 400 100 L 400 200 Z" fill="url(#finalTempleGradient)"/>
              <path d="M 360 60 L 360 30 Q 360 10 380 10 Q 400 10 400 30 L 400 60 Z" fill="url(#finalTempleGradient)"/>
            </svg>
          </div>
          
          {/* Floating Sacred Elements */}
          {['ॐ', '🕉️', '🪔', '📜'].map((element, index) => (
            <motion.div
              key={element}
              initial={{ opacity: 0, y: 100, rotate: -180 }}
              whileInView={{ opacity: 0.6, y: 0, rotate: 0 }}
              transition={{ duration: 2, delay: index * 0.3 }}
              className="absolute text-4xl"
              style={{
                left: `${10 + (index * 20)}%`,
                top: `${20 + (index * 15)}%`,
                filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))'
              }}
            >
              {element}
            </motion.div>
          ))}
        </motion.div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-5xl sm:text-6xl font-playfair font-bold mb-8 drop-shadow-2xl">
              🧘‍♀️ Ready to Begin Your Sanskrit Journey?
            </h2>
            <p className="text-xl mb-8 text-white font-medium max-w-2xl mx-auto">
              Sanskrit is calling. You've scrolled through the vision — now it's time to step into it.
            </p>

            {/* Enhanced Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/30 backdrop-blur-xl rounded-full px-8 py-4 text-lg font-semibold border-2 border-white/40 shadow-lg hover:bg-white/40 transition-all duration-300"
              >
                🎁 Instant Access
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white/30 backdrop-blur-xl rounded-full px-8 py-4 text-lg font-semibold border-2 border-white/40 shadow-lg hover:bg-white/40 transition-all duration-300"
              >
                📜 Certified
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-white/30 backdrop-blur-xl rounded-full px-8 py-4 text-lg font-semibold border-2 border-white/40 shadow-lg hover:bg-white/40 transition-all duration-300"
              >
                ♾ Lifetime Replays
              </motion.div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                              <Button
              size="lg"
              onClick={() => window.open('https://courses.shikshanam.in/single-checkout/655b340de4b0b31c6db6cb3c?pid=p2', '_blank')}
              className="bg-gradient-to-r from-white to-gray-100 text-orange-600 hover:from-gray-100 hover:to-white px-12 py-6 text-2xl font-bold rounded-full shadow-2xl border-2 border-orange-200 hover:scale-105 transition-all duration-300"
            >
              👉 Enroll Now
            </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      const heroSection = document.querySelector('[data-scene="hero"]');
                      if (heroSection) {
                        heroSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-12 py-6 text-2xl font-bold rounded-full shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    💬 Try the Free Demo
                  </Button>
                </motion.div>
              </div>
            
            {/* Final Sanskrit Quote */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-16 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            >
              <p className="text-white/90 text-lg font-medium mb-2">
                "विद्या ददाति विनयं" (Knowledge gives discipline)
              </p>
              <p className="text-white/70 text-sm">
                — Ancient Sanskrit Proverb
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 p-4 z-40">
        <div className="container mx-auto text-center">
          <p className="text-gray-800 dark:text-gray-200 italic font-medium">
            "This course didn't just teach me a language. It connected me to something timeless."
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            — Aarav Desai, Mumbai
          </p>
        </div>
      </div>
    </div>
  )
}
