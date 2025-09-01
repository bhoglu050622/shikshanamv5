'use client'

import Hero from '@/components/course/Hero'
import Outcomes from '@/components/course/Outcomes'
import CourseGrid from '@/components/course/CourseGrid'
import Testimonials from '@/components/course/Testimonials'
import Countdown from '@/components/course/Countdown'
import ClosingCTA from '@/components/course/ClosingCTA'
import { BookOpen, Users, Award, Clock, Video, Globe, MessageCircle } from 'lucide-react'
import { getLiveCourses, getTestimonials } from '@/lib/courseData'

export default function LiveCoursesPage() {
  const liveCourses = getLiveCourses()
  const testimonials = getTestimonials()

  // Get the course with the earliest start date for countdown
  const nextCourse = liveCourses.reduce((earliest, course) => {
    return new Date(course.startDate) < new Date(earliest.startDate) ? course : earliest
  })

  const outcomes = [
    {
      icon: <Video className="w-8 h-8" />,
      title: "Real-time Q&A",
      description: "Ask questions directly to Acharyas during live sessions and get immediate, personalized responses."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Group Chanting",
      description: "Experience the power of collective chanting and meditation with fellow seekers from around the world."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Cohort",
      description: "Connect with a diverse community of learners from different cultures and backgrounds."
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        title="Learn Live with Shikshanam"
        sanskritTitle="शिक्षणम के साथ जीवंत सीखें"
        subtitle="Experience the authentic transmission of ancient wisdom through live interactive sessions with our Acharyas."
        ctaText="Reserve My Spot"
        ctaLink="#live-sessions"
        secondaryCtaText="View Schedule"
        secondaryCtaLink="#schedule"
      />

      {/* Why Live Courses Section */}
      <Outcomes
        title="Why Choose Live Courses?"
        subtitle="Experience the authentic transmission of wisdom in real-time"
        outcomes={outcomes}
        columns={3}
      />

      {/* Countdown Timer */}
      <Countdown
        endDate={nextCourse.startDate}
        seatsAvailable={nextCourse.seatsAvailable}
        seatsTotal={nextCourse.seatsTotal}
        ctaText="Reserve My Spot"
        ctaLink="#live-sessions"
        showUrgency={true}
      />

      {/* Upcoming Live Sessions */}
      <section id="live-sessions" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-gray-900 dark:text-white mb-6">
              Upcoming Live Sessions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join our live interactive sessions with limited seats for an intimate learning experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {liveCourses.map((course, index) => (
              <div key={course.id} className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 border border-orange-100 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-500 transition-all duration-300 hover:shadow-lg">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm font-sanskrit text-orange-600 dark:text-orange-400 mb-4">
                    {course.sanskritTitle}
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{course.schedule}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>{course.time}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">{course.acharya}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>₹{course.price.toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm">
                    {course.description}
                  </p>

                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Seats Available</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {course.seatsAvailable}/{course.seatsTotal}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(course.seatsAvailable / course.seatsTotal) * 100}%` 
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Features:</h4>
                    <ul className="space-y-1">
                      {course.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button 
                    className={`w-full py-3 text-lg font-semibold rounded-lg transition-all duration-300 ${
                      course.seatsAvailable === 0
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : course.seatsAvailable <= 10
                        ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                        : 'bg-orange-600 hover:bg-orange-700 text-white'
                    }`}
                    disabled={course.seatsAvailable === 0}
                  >
                    {course.seatsAvailable === 0 
                      ? 'Fully Booked' 
                      : course.seatsAvailable <= 10 
                      ? 'Only Few Seats Left!' 
                      : 'Reserve My Spot'
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Session Schedule */}
      <section id="schedule" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-gray-900 dark:text-white mb-6">
              Live Session Schedule
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Plan your learning journey with our comprehensive live session calendar.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="space-y-6">
                {liveCourses.map((course, index) => (
                  <div key={course.id} className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {course.schedule} • {course.time} • {course.acharya}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          ₹{course.price.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {course.seatsAvailable} seats left
                        </div>
                      </div>
                      
                      <button 
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                          course.seatsAvailable === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-orange-600 hover:bg-orange-700 text-white'
                        }`}
                        disabled={course.seatsAvailable === 0}
                      >
                        {course.seatsAvailable === 0 ? 'Full' : 'Book'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials
        title="Live Session Experiences"
        subtitle="Hear from students who have experienced the transformative power of live learning"
        testimonials={testimonials}
      />

      {/* Closing CTA */}
      <ClosingCTA
        title="Secure Your Spot in Live Sessions"
        subtitle="Don't miss the opportunity to learn directly from authentic Acharyas in real-time"
        ctaText="Reserve My Spot"
        ctaLink="#live-sessions"
        secondaryCtaText="View All Courses"
        secondaryCtaLink="/courses/all-courses"
        showMandala={true}
        variant="urgent"
      />
    </div>
  )
}
