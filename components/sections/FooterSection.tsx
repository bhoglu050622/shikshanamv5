'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Mail, Users, Play, BookOpen, ShoppingBag, Linkedin, Twitter, Instagram, Youtube } from 'lucide-react'

export default function FooterSection() {
  const ref = useRef<HTMLElement>(null)
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    const initFooterAnimation = async () => {
      const { gsap } = await import('gsap')
      
      if (ref.current) {
        // Final mandala animation
        const mandala = ref.current.querySelector('.footer-mandala')
        const icons = ref.current.querySelectorAll('.footer-icon')
        
        gsap.fromTo(mandala,
          { 
            scale: 0,
            opacity: 0,
            rotation: 0
          },
          {
            scale: 1,
            opacity: 0.3,
            rotation: 360,
            duration: 3,
            ease: "power2.out"
          }
        )
        
        gsap.fromTo(icons,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "backOut"
          }
        )
      }
    }

    initFooterAnimation()
  }, [])

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail('')
      // Here you would typically send the email to your backend
    }
  }

  return (
    <section ref={ref} className="relative py-20 px-4 bg-gradient-to-br from-background-alt-light via-background-light to-background-alt-light dark:from-background-alt-dark dark:via-background-dark dark:to-background-alt-dark">
      {/* Background mandala */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="footer-mandala w-96 h-96 border border-primary-light/20 dark:border-primary-dark/20 rounded-full animate-mandala-spin">
          <div className="w-full h-full border border-primary-light/10 dark:border-primary-dark/10 rounded-full" />
          <div className="absolute inset-8 border border-primary-light/5 dark:border-primary-dark/5 rounded-full" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Newsletter Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <p className="text-xl text-text-secondary-light dark:text-text-secondary-dark mb-8 max-w-2xl mx-auto">
            <strong>Join 50,000+ spiritual seekers</strong> receiving exclusive insights, ancient wisdom teachings, 
            and community updates. <strong>Start your transformation today!</strong>
          </p>

          {!isSubscribed ? (
            <motion.form 
              onSubmit={handleNewsletterSubmit}
              className="max-w-md mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="flex gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 bg-background-alt-light/50 dark:bg-background-alt-dark/50 border border-primary-light/30 dark:border-primary-dark/30 rounded-full text-text-light dark:text-text-dark placeholder-text-secondary-light/60 dark:placeholder-text-secondary-dark/60 focus:outline-none focus:border-primary-light/50 dark:focus:border-primary-dark/50 transition-all duration-300"
                  required
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 ripple-button glow-border hover:shadow-xl transition-all duration-300"
                >
                  <Mail className="w-5 h-5" />
                  Subscribe
                </motion.button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-6 rounded-2xl border border-green-400/30 max-w-md mx-auto"
            >
              <p className="text-green-300 font-semibold">Thank you for subscribing! Welcome to the Shikshanam community.</p>
            </motion.div>
          )}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 ripple-button glow-border hover:shadow-xl transition-all duration-300"
          >
            <Play className="w-5 h-5" />
            Take Free Class
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group border-2 border-primary-light/30 dark:border-primary-dark/30 text-text-light dark:text-text-dark px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 hover:border-primary-light dark:hover:border-primary-dark hover:text-primary-light dark:hover:text-primary-dark transition-all duration-300"
          >
            <Users className="w-5 h-5" />
            Join the Community
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        {/* Quick Links */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="grid md:grid-cols-4 gap-8 mb-12"
        >
          <div>

            <ul className="space-y-2 text-text-secondary-light dark:text-text-secondary-dark">
              <li><a href="#" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">Free Masterclasses</a></li>
              <li><a href="#" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">Live Classes</a></li>
              <li><a href="#" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">Courses</a></li>
              <li><a href="#" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">Resources</a></li>
            </ul>
          </div>
          
          <div>

            <ul className="space-y-2 text-text-secondary-light dark:text-text-secondary-dark">
              <li><a href="#" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">Virtual Meetups</a></li>
              <li><a href="#" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">IRL Events</a></li>
              <li><a href="#" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">Challenges</a></li>
              <li><a href="#" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">Leaderboard</a></li>
            </ul>
          </div>
          
          <div>

            <ul className="space-y-2 text-text-secondary-light dark:text-text-secondary-dark">
              <li><a href="#" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">Digital Resources</a></li>
              <li><a href="#" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">Books</a></li>
              <li><a href="#" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">Merchandise</a></li>
              <li><a href="#" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">Bundles</a></li>
            </ul>
          </div>
          
          <div>

            <ul className="space-y-2 text-text-secondary-light dark:text-text-secondary-dark">
              <li><a href="#" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">Team</a></li>
              <li><a href="#" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">Contact</a></li>
            </ul>
          </div>
        </motion.div>

        {/* Social Links & Copyright */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="border-t border-indigo-600/30 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-cream-400 text-sm">
              © 2024 Shikshanam. All rights reserved. Ancient wisdom, modern delivery.
            </div>
            
            <div className="flex gap-6">
              <a href="#" className="footer-icon text-cream-400 hover:text-saffron-300 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="footer-icon text-cream-400 hover:text-saffron-300 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="footer-icon text-cream-400 hover:text-saffron-300 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="footer-icon text-cream-400 hover:text-saffron-300 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
