import courseData from '@/data/courses.json'

export interface FreeMasterclass {
  id: string
  title: string
  sanskritTitle: string
  date: string
  time: string
  duration: string
  seatsAvailable: number
  seatsTotal: number
  acharya: string
  description: string
  topics: string[]
  level: string
  language: string
}

export interface PremiumCourse {
  id: string
  title: string
  sanskritTitle: string
  price: number
  originalPrice: number
  duration: string
  sessions: number
  level: string
  acharya: string
  description: string
  features: string[]
  curriculum: string[]
  image: string
  externalUrl?: string
}

export interface LiveCourse {
  id: string
  title: string
  sanskritTitle: string
  startDate: string
  endDate: string
  schedule: string
  time: string
  price: number
  seatsAvailable: number
  seatsTotal: number
  acharya: string
  description: string
  features: string[]
  chapters?: string[]
  topics?: string[]
  techniques?: string[]
}

export interface Course {
  id: string
  title: string
  type: string
  school: string
  level: string
  language: string
  price: number
  duration: string
  acharya: string
  description: string
  image: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
  course: string
  avatar?: string
}

export interface BundleOffer {
  id: string
  title: string
  description: string
  courses: string[]
  originalPrice: number
  bundlePrice: number
  savings: number
  savingsPercentage: number
}

export function getFreeMasterclasses(): FreeMasterclass[] {
  return courseData.freeMasterclasses
}

export function getPremiumCourses(): PremiumCourse[] {
  return courseData.premiumCourses
}

export function getLiveCourses(): LiveCourse[] {
  return courseData.liveCourses
}

export function getAllCourses(): Course[] {
  return courseData.allCourses
}

export function getTestimonials(): Testimonial[] {
  return courseData.testimonials
}

export function getBundleOffers(): BundleOffer[] {
  return courseData.bundleOffers
}

export function getCourseById(id: string): FreeMasterclass | PremiumCourse | LiveCourse | Course | null {
  const allCourses = [
    ...getFreeMasterclasses(),
    ...getPremiumCourses(),
    ...getLiveCourses(),
    ...getAllCourses()
  ]
  
  return allCourses.find(course => course.id === id) || null
}

export function getCoursesByType(type: string): Course[] {
  return getAllCourses().filter(course => course.type === type)
}

export function getCoursesBySchool(school: string): Course[] {
  return getAllCourses().filter(course => course.school === school)
}

export function getCoursesByLevel(level: string): Course[] {
  return getAllCourses().filter(course => course.level === level)
}

export function searchCourses(query: string): Course[] {
  const courses = getAllCourses()
  const lowercaseQuery = query.toLowerCase()
  
  return courses.filter(course => 
    course.title.toLowerCase().includes(lowercaseQuery) ||
    course.description.toLowerCase().includes(lowercaseQuery) ||
    course.school.toLowerCase().includes(lowercaseQuery) ||
    course.acharya.toLowerCase().includes(lowercaseQuery)
  )
}
