'use client'

import { useState, useMemo } from 'react'
import Hero from '@/components/course/Hero'
import CourseGrid from '@/components/course/CourseGrid'
import ClosingCTA from '@/components/course/ClosingCTA'
import { Button } from '@/components/ui/button'
import { Search, Filter, BookOpen, Users, Clock, Star } from 'lucide-react'
import { getAllCourses, getCoursesByType, getCoursesBySchool, getCoursesByLevel, searchCourses } from '@/lib/courseData'

export default function AllCoursesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedSchool, setSelectedSchool] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedLanguage, setSelectedLanguage] = useState('all')

  const allCourses = getAllCourses()

  const filteredCourses = useMemo(() => {
    let filtered = allCourses

    // Apply search filter
    if (searchQuery) {
      filtered = searchCourses(searchQuery)
    }

    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(course => course.type === selectedType)
    }

    // Apply school filter
    if (selectedSchool !== 'all') {
      filtered = filtered.filter(course => course.school === selectedSchool)
    }

    // Apply level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(course => course.level === selectedLevel)
    }

    // Apply language filter
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(course => course.language === selectedLanguage)
    }

    return filtered
  }, [searchQuery, selectedType, selectedSchool, selectedLevel, selectedLanguage])

  const uniqueTypes = ['all', ...Array.from(new Set(allCourses.map(course => course.type)))]
  const uniqueSchools = ['all', ...Array.from(new Set(allCourses.map(course => course.school)))]
  const uniqueLevels = ['all', ...Array.from(new Set(allCourses.map(course => course.level)))]
  const uniqueLanguages = ['all', ...Array.from(new Set(allCourses.map(course => course.language)))]

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedType('all')
    setSelectedSchool('all')
    setSelectedLevel('all')
    setSelectedLanguage('all')
  }

  const hasActiveFilters = searchQuery || selectedType !== 'all' || selectedSchool !== 'all' || selectedLevel !== 'all' || selectedLanguage !== 'all'

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        title="Explore All Shikshanam Courses"
        sanskritTitle="सभी शिक्षणम पाठ्यक्रम देखें"
        subtitle="Discover our complete collection of courses covering all Six Darshanas and ancient wisdom traditions."
        ctaText="Start Learning"
        ctaLink="#courses"
        secondaryCtaText="Join Free Masterclass"
        secondaryCtaLink="/courses/free-masterclass"
      />

      {/* Search and Filters */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search courses, topics, or Acharyas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
                {hasActiveFilters && (
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    size="sm"
                    className="ml-auto text-orange-600 border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                  >
                    Clear All
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    {uniqueTypes.map(type => (
                      <option key={type} value={type}>
                        {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* School Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    School of Philosophy
                  </label>
                  <select
                    value={selectedSchool}
                    onChange={(e) => setSelectedSchool(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    {uniqueSchools.map(school => (
                      <option key={school} value={school}>
                        {school === 'all' ? 'All Schools' : school}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Level
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    {uniqueLevels.map(level => (
                      <option key={level} value={level}>
                        {level === 'all' ? 'All Levels' : level}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Language Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Language
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    {uniqueLanguages.map(language => (
                      <option key={language} value={language}>
                        {language === 'all' ? 'All Languages' : language}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Results Count */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {filteredCourses.length} of {allCourses.length} courses
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <CourseGrid
        title="All Courses"
        courses={filteredCourses}
        columns={3}
        showPricing={true}
        ctaText="Explore Course"
      />

      {/* Recommended Pathways */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-gray-900 dark:text-white mb-6">
              Recommended Learning Pathways
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Not sure where to start? Follow these recommended pathways based on your experience level.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Beginner Path */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-orange-200 dark:border-orange-700">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Beginner Path
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Start your journey with foundational courses
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-sm font-bold text-orange-600 dark:text-orange-400">
                    1
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Free Masterclass</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-sm font-bold text-orange-600 dark:text-orange-400">
                    2
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Vedanta Fundamentals</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-sm font-bold text-orange-600 dark:text-orange-400">
                    3
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Sanskrit for Beginners</span>
                </div>
              </div>

              <Button asChild className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                <a href="/courses/free-masterclass">Start Here</a>
              </Button>
            </div>

            {/* Intermediate Path */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-orange-200 dark:border-orange-700">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Intermediate Path
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Deepen your understanding with advanced courses
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-sm font-bold text-orange-600 dark:text-orange-400">
                    1
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Yoga Darshan</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-sm font-bold text-orange-600 dark:text-orange-400">
                    2
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Samkhya Philosophy</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-sm font-bold text-orange-600 dark:text-orange-400">
                    3
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Live Sessions</span>
                </div>
              </div>

              <Button asChild className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                <a href="/courses/premium-courses">Explore Premium</a>
              </Button>
            </div>

            {/* Advanced Path */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-orange-200 dark:border-orange-700">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Advanced Path
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Master the deepest aspects of ancient wisdom
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-sm font-bold text-orange-600 dark:text-orange-400">
                    1
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Isha Upanishad</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-sm font-bold text-orange-600 dark:text-orange-400">
                    2
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Nyaya Logic</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-sm font-bold text-orange-600 dark:text-orange-400">
                    3
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Mimamsa Rituals</span>
                </div>
              </div>

              <Button asChild className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                <a href="/courses/premium-courses">Master Level</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Community CTA */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-gray-900 dark:text-white mb-6">
              Not Sure Where to Start?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Join our free masterclass to experience the authentic teaching style and find your perfect learning path.
            </p>
            <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg font-semibold rounded-full">
              <a href="/courses/free-masterclass">Join a Free Masterclass</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <ClosingCTA
        title="Your Journey, Your Pace, Your Tradition"
        subtitle="Choose the learning path that resonates with your soul and embark on a transformative journey of wisdom"
        ctaText="Start Your Journey"
        ctaLink="#courses"
        secondaryCtaText="Join Free Masterclass"
        secondaryCtaLink="/courses/free-masterclass"
        showMandala={true}
        variant="peaceful"
      />
    </div>
  )
}
