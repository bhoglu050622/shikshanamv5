'use client';

import { useState, useEffect } from 'react';
import type { CMSPage, CMSCourse, CMSTestimonial } from '@/lib/simple-cms';

export default function CMSPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [courses, setCourses] = useState<CMSCourse[]>([]);
  const [testimonials, setTestimonials] = useState<CMSTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: 'admin@shikshanam.com',
    password: 'adminadmin',
  });

  // New content forms
  const [newPage, setNewPage] = useState({
    title: '',
    slug: '',
    content: '',
    status: 'draft' as const,
    template: 'default',
    seo: { title: '', description: '', keywords: '' },
  });

  const [newCourse, setNewCourse] = useState({
    title: '',
    slug: '',
    description: '',
    shortDescription: '',
    category: 'sanskrit',
    level: 'beginner' as const,
    price: 0,
    isFree: false,
    status: 'draft' as const,
    featured: false,
    instructor: '',
    duration: { hours: 0, minutes: 0 },
    lessons: [],
  });

  useEffect(() => {
    console.log('CMS Page mounted, isLoggedIn:', isLoggedIn);
    if (isLoggedIn) {
      loadData();
    }
  }, [isLoggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    console.log('Attempting login with:', loginForm);
    
    try {
      const response = await fetch('/api/cms/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });

      console.log('Login response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        setUser(data.user);
        setIsLoggedIn(true);
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData);
        setError(errorData.error || 'Login failed. Check credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Network error.');
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    console.log('Loading data...');
    
    try {
      const [pagesRes, coursesRes, testimonialsRes] = await Promise.all([
        fetch('/api/cms/pages'),
        fetch('/api/cms/courses'),
        fetch('/api/cms/testimonials'),
      ]);

      console.log('API responses:', {
        pages: pagesRes.status,
        courses: coursesRes.status,
        testimonials: testimonialsRes.status
      });

      if (pagesRes.ok) {
        const pagesData = await pagesRes.json();
        console.log('Pages loaded:', pagesData);
        setPages(pagesData);
      } else {
        console.error('Failed to load pages:', pagesRes.status);
      }
      
      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        console.log('Courses loaded:', coursesData);
        setCourses(coursesData);
      } else {
        console.error('Failed to load courses:', coursesRes.status);
      }
      
      if (testimonialsRes.ok) {
        const testimonialsData = await testimonialsRes.json();
        console.log('Testimonials loaded:', testimonialsData);
        setTestimonials(testimonialsData);
      } else {
        console.error('Failed to load testimonials:', testimonialsRes.status);
      }
    } catch (error) {
      console.error('Load data error:', error);
      setError('Failed to load data. Please try again.');
    }
    setLoading(false);
  };

  const createPage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/cms/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPage),
      });

      if (response.ok) {
        const page = await response.json();
        setPages([...pages, page]);
        setNewPage({
          title: '',
          slug: '',
          content: '',
          status: 'draft',
          template: 'default',
          seo: { title: '', description: '', keywords: '' },
        });
        alert('Page created successfully!');
      }
    } catch (error) {
      console.error('Create page error:', error);
      alert('Failed to create page.');
    }
  };

  const createCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/cms/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse),
      });

      if (response.ok) {
        const course = await response.json();
        setCourses([...courses, course]);
        setNewCourse({
          title: '',
          slug: '',
          description: '',
          shortDescription: '',
          category: 'sanskrit',
          level: 'beginner',
          price: 0,
          isFree: false,
          status: 'draft',
          featured: false,
          instructor: '',
          duration: { hours: 0, minutes: 0 },
          lessons: [],
        });
        alert('Course created successfully!');
      }
    } catch (error) {
      console.error('Create course error:', error);
      alert('Failed to create course.');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Shikshanam CMS
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to manage your content
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Sign in
            </button>
            
            {/* Debug: Skip to Dashboard */}
            <button
              type="button"
              onClick={() => {
                console.log('Debug: Skipping login');
                setUser({ id: 'admin-1', name: 'Admin', email: 'admin@shikshanam.com', role: 'admin' });
                setIsLoggedIn(true);
              }}
              className="w-full mt-2 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Debug: Skip to Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Shikshanam CMS</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {['dashboard', 'pages', 'courses', 'testimonials'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                          <span className="text-white font-bold">P</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Pages</dt>
                          <dd className="text-lg font-medium text-gray-900">{pages.length}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                          <span className="text-white font-bold">C</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Courses</dt>
                          <dd className="text-lg font-medium text-gray-900">{courses.length}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                          <span className="text-white font-bold">T</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Testimonials</dt>
                          <dd className="text-lg font-medium text-gray-900">{testimonials.length}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pages */}
            {activeTab === 'pages' && (
              <div className="space-y-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Page</h3>
                  <form onSubmit={createPage} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                          type="text"
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          value={newPage.title}
                          onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Slug</label>
                        <input
                          type="text"
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          value={newPage.slug}
                          onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Content</label>
                      <textarea
                        required
                        rows={4}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        value={newPage.content}
                        onChange={(e) => setNewPage({ ...newPage, content: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        value={newPage.status}
                        onChange={(e) => setNewPage({ ...newPage, status: e.target.value as any })}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                    >
                      Create Page
                    </button>
                  </form>
                </div>

                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">All Pages</h3>
                    <div className="space-y-4">
                      {pages.map((page) => (
                        <div key={page.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{page.title}</h4>
                              <p className="text-sm text-gray-500">/{page.slug}</p>
                              <p className="text-sm text-gray-600 mt-1">
                                {page.content.substring(0, 100)}...
                              </p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              page.status === 'published' ? 'bg-green-100 text-green-800' :
                              page.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {page.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Courses */}
            {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Course</h3>
                  <form onSubmit={createCourse} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                          type="text"
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          value={newCourse.title}
                          onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Slug</label>
                        <input
                          type="text"
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          value={newCourse.slug}
                          onChange={(e) => setNewCourse({ ...newCourse, slug: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        required
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        value={newCourse.description}
                        onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          value={newCourse.category}
                          onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                        >
                          <option value="sanskrit">Sanskrit</option>
                          <option value="vedanta">Vedanta</option>
                          <option value="yoga">Yoga</option>
                          <option value="meditation">Meditation</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Level</label>
                        <select
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          value={newCourse.level}
                          onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value as any })}
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                          <option value="all-levels">All Levels</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <input
                          type="number"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          value={newCourse.price}
                          onChange={(e) => setNewCourse({ ...newCourse, price: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                    >
                      Create Course
                    </button>
                  </form>
                </div>

                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">All Courses</h3>
                    <div className="space-y-4">
                      {courses.map((course) => (
                        <div key={course.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{course.title}</h4>
                              <p className="text-sm text-gray-500">/{course.slug}</p>
                              <p className="text-sm text-gray-600 mt-1">
                                {course.description.substring(0, 100)}...
                              </p>
                              <div className="flex space-x-4 mt-2 text-sm text-gray-500">
                                <span>{course.category}</span>
                                <span>{course.level}</span>
                                <span>${course.price}</span>
                              </div>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              course.status === 'published' ? 'bg-green-100 text-green-800' :
                              course.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {course.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Testimonials */}
            {activeTab === 'testimonials' && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">All Testimonials</h3>
                  <div className="space-y-4">
                    {testimonials.map((testimonial) => (
                      <div key={testimonial.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                            <p className="text-sm text-gray-500">{testimonial.email}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {testimonial.testimonial.substring(0, 150)}...
                            </p>
                            <div className="flex items-center mt-2">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            testimonial.status === 'approved' ? 'bg-green-100 text-green-800' :
                            testimonial.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            testimonial.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {testimonial.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
