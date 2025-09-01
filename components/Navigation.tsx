'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import { BookOpen, ChevronDown, User, LogOut, Settings, Menu, X } from 'lucide-react'
import LoginModal from './LoginModal'
import { useShikshanamAuth } from '@/lib/useShikshanamAuth'
import ThemeSwitcher from './ThemeSwitcher'

export default function Navigation() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isCoursesDropdownOpen, setIsCoursesDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  const { user, isAuthenticated, logout, courses } = useShikshanamAuth()

  // Determine if user is authenticated (either through NextAuth or custom auth)
  const isUserAuthenticated = !!session || isAuthenticated
  const currentUser = session?.user || user

  const handleLogout = async () => {
    if (session) {
      await signOut({ callbackUrl: '/' })
    }
    if (isAuthenticated) {
      await logout()
    }
    setIsUserMenuOpen(false)
  }

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
  }

  const handleCoursesDropdownToggle = () => {
    setIsCoursesDropdownOpen(!isCoursesDropdownOpen)
  }

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleLearningHubClick = () => {
    // Redirect to the correct learning hub URL
    window.location.href = 'https://courses.shikshanam.in/t/u/activeCourses'
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.user-menu')) {
        setIsUserMenuOpen(false)
      }
      if (!target.closest('.courses-dropdown')) {
        setIsCoursesDropdownOpen(false)
      }
      if (!target.closest('.mobile-menu')) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-bg-primary border-b border-border-primary theme-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-bg-primary" />
                </div>
                <span className="text-xl font-bold text-gradient-theme">
                  Shikshanam
                </span>
              </motion.div>
            </div>

            {/* Navigation Links */}
                          <div className="hidden md:flex items-center space-x-8">
                {/* Courses Dropdown */}
                <div className="relative courses-dropdown">
                  <button
                    onClick={handleCoursesDropdownToggle}
                    className="flex items-center space-x-1 text-text-primary hover:text-accent-primary transition-colors duration-200"
                  >
                    <span>Courses</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCoursesDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isCoursesDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-bg-secondary rounded-xl shadow-lg border border-border-primary overflow-hidden theme-transition"
                      >
                        <div className="p-2">
                          <a
                            href="/courses/premium-courses"
                            className="flex items-center px-3 py-2 rounded-lg text-text-primary hover:bg-bg-tertiary transition-colors duration-200"
                          >
                            Premium Courses
                          </a>
                          <a
                            href="/courses/free-masterclass"
                            className="flex items-center px-3 py-2 rounded-lg text-text-primary hover:bg-bg-tertiary transition-colors duration-200"
                          >
                            Free Masterclasses
                          </a>
                          <a
                            href="/courses/all-courses"
                            className="flex items-center px-3 py-2 rounded-lg text-text-primary hover:bg-bg-tertiary transition-colors duration-200"
                          >
                            All Courses
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Direct Links */}
                <a href="/rishi-mode" className="text-text-primary hover:text-accent-primary transition-colors duration-200">
                  Rishi Mode
                </a>
                <a href="/seva-sangh" className="text-text-primary hover:text-accent-primary transition-colors duration-200">
                  Seva Sangh
                </a>
                <a href="/about" className="text-text-primary hover:text-accent-primary transition-colors duration-200">
                  About Us
                </a>
              </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              <ThemeSwitcher />
              
              {/* Mobile Menu Button */}
              <button
                onClick={handleMobileMenuToggle}
                className="md:hidden p-2 rounded-lg text-text-primary hover:bg-bg-tertiary transition-colors duration-200"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
              
              {isUserAuthenticated ? (
                /* User Menu */
                <div className="relative user-menu">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleUserMenuToggle}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-accent-primary to-accent-secondary text-bg-primary hover:from-accent-secondary hover:to-accent-tertiary transition-all duration-200"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {currentUser?.name || 'User'}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </motion.button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 bg-bg-secondary rounded-xl shadow-lg border border-border-primary overflow-hidden theme-transition"
                      >
                        {/* User Info */}
                        <div className="p-4 border-b border-border-primary">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full flex items-center justify-center">
                              {(currentUser as any)?.avatar ? (
                                <img 
                                  src={(currentUser as any).avatar} 
                                  alt={currentUser?.name || 'User'} 
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <User className="w-5 h-5 text-bg-primary" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-text-primary">
                                {currentUser?.name || 'User'}
                              </p>
                              <p className="text-sm text-text-secondary">
                                {currentUser?.email || 'user@example.com'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                          <button
                            onClick={handleLearningHubClick}
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-text-primary hover:bg-bg-tertiary transition-colors duration-200 w-full text-left"
                          >
                            <BookOpen className="w-4 h-4" />
                            <span>My Learning Hub</span>
                            {courses.length > 0 && (
                              <span className="ml-auto bg-accent-primary text-bg-primary text-xs px-2 py-1 rounded-full">
                                {courses.length}
                              </span>
                            )}
                          </button>
                          
                          <a
                            href="/rishi-mode"
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-text-primary hover:bg-bg-tertiary transition-colors duration-200"
                          >
                            <BookOpen className="w-4 h-4" />
                            <span>My Rishi Mode</span>
                          </a>

                          <div className="border-t border-border-primary my-2" />

                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200 w-full text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Login Button */
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-accent-primary to-accent-secondary text-bg-primary hover:from-accent-secondary hover:to-accent-tertiary transition-all duration-200 font-medium"
                >
                  Login
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-16 left-0 right-0 z-30 bg-bg-primary border-b border-border-primary mobile-menu theme-transition"
          >
            <div className="px-4 py-6 space-y-4">
              {/* Courses Section */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">Courses</h3>
                <div className="space-y-2">
                  <a
                    href="/courses/premium-courses"
                    className="block px-3 py-2 rounded-lg text-text-primary hover:bg-bg-tertiary transition-colors duration-200"
                  >
                    Premium Courses
                  </a>
                  <a
                    href="/courses/free-masterclass"
                    className="block px-3 py-2 rounded-lg text-text-primary hover:bg-bg-tertiary transition-colors duration-200"
                  >
                    Free Masterclasses
                  </a>
                  <a
                    href="/courses/all-courses"
                    className="block px-3 py-2 rounded-lg text-text-primary hover:bg-bg-tertiary transition-colors duration-200"
                  >
                    All Courses
                  </a>
                </div>
              </div>

              {/* Direct Links */}
              <div className="space-y-2">
                <a
                  href="/rishi-mode"
                  className="block px-3 py-2 rounded-lg text-text-primary hover:bg-bg-tertiary transition-colors duration-200"
                >
                  Rishi Mode
                </a>
                <a
                  href="/seva-sangh"
                  className="block px-3 py-2 rounded-lg text-text-primary hover:bg-bg-tertiary transition-colors duration-200"
                >
                  Seva Sangh
                </a>
                <a
                  href="/about"
                  className="block px-3 py-2 rounded-lg text-text-primary hover:bg-bg-tertiary transition-colors duration-200"
                >
                  About Us
                </a>
              </div>

              {/* Login/User Section */}
              {!isUserAuthenticated && (
                <div className="pt-4 border-t border-border-primary">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      setIsLoginModalOpen(true)
                    }}
                    className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-accent-primary to-accent-secondary text-bg-primary font-medium hover:from-accent-secondary hover:to-accent-tertiary transition-all duration-200"
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  )
}
