import { useState, useEffect } from 'react';
import type { CMSUser, CMSPage, CMSCourse, CMSTestimonial } from './localStorage-cms';

// Types for our localStorage CMS
interface LocalStorageCMS {
  // User methods
  authenticateUser(email: string, password: string): Promise<CMSUser | null>;
  getUserById(id: string): Promise<CMSUser | null>;
  createUser(userData: Omit<CMSUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<CMSUser>;

  // Page methods
  getPages(status?: string): Promise<CMSPage[]>;
  getPageBySlug(slug: string): Promise<CMSPage | null>;
  getPageById(id: string): Promise<CMSPage | null>;
  createPage(pageData: Omit<CMSPage, 'id' | 'createdAt' | 'updatedAt'>): Promise<CMSPage>;
  updatePage(id: string, updates: Partial<CMSPage>): Promise<CMSPage | null>;
  deletePage(id: string): Promise<boolean>;

  // Course methods
  getCourses(status?: string): Promise<CMSCourse[]>;
  getCourseBySlug(slug: string): Promise<CMSCourse | null>;
  getCourseById(id: string): Promise<CMSCourse | null>;
  createCourse(courseData: Omit<CMSCourse, 'id' | 'createdAt' | 'updatedAt'>): Promise<CMSCourse>;
  updateCourse(id: string, updates: Partial<CMSCourse>): Promise<CMSCourse | null>;
  deleteCourse(id: string): Promise<boolean>;

  // Testimonial methods
  getTestimonials(status?: string): Promise<CMSTestimonial[]>;
  getTestimonialById(id: string): Promise<CMSTestimonial | null>;
  createTestimonial(testimonialData: Omit<CMSTestimonial, 'id' | 'createdAt' | 'updatedAt'>): Promise<CMSTestimonial>;
  updateTestimonial(id: string, updates: Partial<CMSTestimonial>): Promise<CMSTestimonial | null>;
  deleteTestimonial(id: string): Promise<boolean>;

  // Utility methods
  exportData(): any;
  importData(data: any): boolean;
  clearAllData(): void;
  isLocalStorageAvailable(): boolean;
  getStorageInfo(): any;
}

// localStorage CMS Data Store
class LocalStorageCMSImpl implements LocalStorageCMS {
  private users: CMSUser[] = [];
  private pages: CMSPage[] = [];
  private courses: CMSCourse[] = [];
  private testimonials: CMSTestimonial[] = [];

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    if (typeof window === 'undefined') return;

    console.log('Initializing localStorage CMS data...');

    // Initialize users
    const storedUsers = localStorage.getItem('cms_users');
    console.log('Stored users:', storedUsers);
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
      console.log('Loaded users from localStorage:', this.users);
    } else {
      console.log('Creating default admin user...');
      this.users = [{
        id: 'admin-1',
        name: 'Admin',
        email: 'admin@shikshanam.com',
        role: 'admin',
        password: 'adminadmin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }];
      this.saveToLocalStorage('users');
      console.log('Default admin user created:', this.users);
    }

    // Initialize other collections
    const storedPages = localStorage.getItem('cms_pages');
    this.pages = storedPages ? JSON.parse(storedPages) : [];

    const storedCourses = localStorage.getItem('cms_courses');
    this.courses = storedCourses ? JSON.parse(storedCourses) : [];

    const storedTestimonials = localStorage.getItem('cms_testimonials');
    this.testimonials = storedTestimonials ? JSON.parse(storedTestimonials) : [];
  }

  private saveToLocalStorage(collection: string) {
    if (typeof window === 'undefined') return;

    try {
      let data: any[] = [];
      
      switch (collection) {
        case 'users':
          data = this.users;
          break;
        case 'pages':
          data = this.pages;
          break;
        case 'courses':
          data = this.courses;
          break;
        case 'testimonials':
          data = this.testimonials;
          break;
      }
      
      localStorage.setItem(`cms_${collection}`, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${collection} to localStorage:`, error);
    }
  }

  // User methods
  async authenticateUser(email: string, password: string): Promise<CMSUser | null> {
    console.log('Authenticating user:', email);
    console.log('Available users:', this.users);
    const user = this.users.find(u => u.email === email && u.password === password);
    console.log('Found user:', user);
    return user || null;
  }

  async getUserById(id: string): Promise<CMSUser | null> {
    return this.users.find(u => u.id === id) || null;
  }

  async createUser(userData: Omit<CMSUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<CMSUser> {
    const user: CMSUser = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.push(user);
    this.saveToLocalStorage('users');
    return user;
  }

  // Page methods
  async getPages(status?: string): Promise<CMSPage[]> {
    if (status) {
      return this.pages.filter(p => p.status === status);
    }
    return this.pages;
  }

  async getPageBySlug(slug: string): Promise<CMSPage | null> {
    return this.pages.find(p => p.slug === slug) || null;
  }

  async getPageById(id: string): Promise<CMSPage | null> {
    return this.pages.find(p => p.id === id) || null;
  }

  async createPage(pageData: Omit<CMSPage, 'id' | 'createdAt' | 'updatedAt'>): Promise<CMSPage> {
    const page: CMSPage = {
      ...pageData,
      id: `page-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.pages.push(page);
    this.saveToLocalStorage('pages');
    return page;
  }

  async updatePage(id: string, updates: Partial<CMSPage>): Promise<CMSPage | null> {
    const index = this.pages.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    this.pages[index] = {
      ...this.pages[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveToLocalStorage('pages');
    return this.pages[index];
  }

  async deletePage(id: string): Promise<boolean> {
    const index = this.pages.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    this.pages.splice(index, 1);
    this.saveToLocalStorage('pages');
    return true;
  }

  // Course methods
  async getCourses(status?: string): Promise<CMSCourse[]> {
    if (status) {
      return this.courses.filter(c => c.status === status);
    }
    return this.courses;
  }

  async getCourseBySlug(slug: string): Promise<CMSCourse | null> {
    return this.courses.find(c => c.slug === slug) || null;
  }

  async getCourseById(id: string): Promise<CMSCourse | null> {
    return this.courses.find(c => c.id === id) || null;
  }

  async createCourse(courseData: Omit<CMSCourse, 'id' | 'createdAt' | 'updatedAt'>): Promise<CMSCourse> {
    const course: CMSCourse = {
      ...courseData,
      id: `course-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.courses.push(course);
    this.saveToLocalStorage('courses');
    return course;
  }

  async updateCourse(id: string, updates: Partial<CMSCourse>): Promise<CMSCourse | null> {
    const index = this.courses.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    this.courses[index] = {
      ...this.courses[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveToLocalStorage('courses');
    return this.courses[index];
  }

  async deleteCourse(id: string): Promise<boolean> {
    const index = this.courses.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.courses.splice(index, 1);
    this.saveToLocalStorage('courses');
    return true;
  }

  // Testimonial methods
  async getTestimonials(status?: string): Promise<CMSTestimonial[]> {
    if (status) {
      return this.testimonials.filter(t => t.status === status);
    }
    return this.testimonials;
  }

  async getTestimonialById(id: string): Promise<CMSTestimonial | null> {
    return this.testimonials.find(t => t.id === id) || null;
  }

  async createTestimonial(testimonialData: Omit<CMSTestimonial, 'id' | 'createdAt' | 'updatedAt'>): Promise<CMSTestimonial> {
    const testimonial: CMSTestimonial = {
      ...testimonialData,
      id: `testimonial-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.testimonials.push(testimonial);
    this.saveToLocalStorage('testimonials');
    return testimonial;
  }

  async updateTestimonial(id: string, updates: Partial<CMSTestimonial>): Promise<CMSTestimonial | null> {
    const index = this.testimonials.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    this.testimonials[index] = {
      ...this.testimonials[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveToLocalStorage('testimonials');
    return this.testimonials[index];
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    const index = this.testimonials.findIndex(t => t.id === id);
    if (index === -1) return false;
    
    this.testimonials.splice(index, 1);
    this.saveToLocalStorage('testimonials');
    return true;
  }

  // Utility methods
  exportData() {
    return {
      users: this.users,
      pages: this.pages,
      courses: this.courses,
      testimonials: this.testimonials,
      exportedAt: new Date().toISOString(),
    };
  }

  importData(data: any) {
    try {
      if (data.users) {
        this.users = data.users;
        this.saveToLocalStorage('users');
      }
      if (data.pages) {
        this.pages = data.pages;
        this.saveToLocalStorage('pages');
      }
      if (data.courses) {
        this.courses = data.courses;
        this.saveToLocalStorage('courses');
      }
      if (data.testimonials) {
        this.testimonials = data.testimonials;
        this.saveToLocalStorage('testimonials');
      }
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  clearAllData() {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('cms_users');
    localStorage.removeItem('cms_pages');
    localStorage.removeItem('cms_courses');
    localStorage.removeItem('cms_testimonials');

    this.users = [];
    this.pages = [];
    this.courses = [];
    this.testimonials = [];

    this.initializeData();
  }

  isLocalStorageAvailable(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  getStorageInfo() {
    if (typeof window === 'undefined') return null;

    try {
      const total = JSON.stringify(this.exportData()).length;
      const maxStorage = 5 * 1024 * 1024; // 5MB typical localStorage limit
      const usagePercent = (total / maxStorage) * 100;

      return {
        totalBytes: total,
        maxBytes: maxStorage,
        usagePercent: Math.round(usagePercent * 100) / 100,
        isNearLimit: usagePercent > 80,
      };
    } catch (error) {
      console.error('Error calculating storage info:', error);
      return null;
    }
  }
}

export function useLocalStorageCMS() {
  const [cms, setCms] = useState<LocalStorageCMS | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    if (typeof window !== 'undefined') {
      try {
        const cmsInstance = new LocalStorageCMSImpl();
        setCms(cmsInstance);
        setIsReady(true);
      } catch (error) {
        console.error('Error initializing CMS:', error);
        // Fallback: create a basic CMS instance
        const fallbackCms: LocalStorageCMS = {
          // User methods
          authenticateUser: async (email: string, password: string) => {
            if (email === 'admin@shikshanam.com' && password === 'adminadmin') {
              return {
                id: 'admin-1',
                name: 'Admin',
                email: 'admin@shikshanam.com',
                role: 'admin',
                password: 'adminadmin',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
            }
            return null;
          },
          getUserById: async (id: string) => null,
          createUser: async (userData: any) => ({ ...userData, id: `user-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }),
          
          // Page methods
          getPages: async () => [],
          getPageBySlug: async (slug: string) => null,
          getPageById: async (id: string) => null,
          createPage: async (data: any) => ({ ...data, id: `page-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }),
          updatePage: async (id: string, updates: any) => null,
          deletePage: async (id: string) => true,
          
          // Course methods
          getCourses: async () => [],
          getCourseBySlug: async (slug: string) => null,
          getCourseById: async (id: string) => null,
          createCourse: async (data: any) => ({ ...data, id: `course-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }),
          updateCourse: async (id: string, updates: any) => null,
          deleteCourse: async (id: string) => true,
          
          // Testimonial methods
          getTestimonials: async () => [],
          getTestimonialById: async (id: string) => null,
          createTestimonial: async (data: any) => ({ ...data, id: `testimonial-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }),
          updateTestimonial: async (id: string, updates: any) => null,
          deleteTestimonial: async (id: string) => true,
          
          // Utility methods
          exportData: () => ({ users: [], pages: [], courses: [], testimonials: [] }),
          importData: (data: any) => true,
          clearAllData: () => {},
          isLocalStorageAvailable: () => true,
          getStorageInfo: () => ({ totalBytes: 0, maxBytes: 5242880, usagePercent: 0, isNearLimit: false }),
        };
        setCms(fallbackCms);
        setIsReady(true);
      }
    }
  }, []);

  return { cms, isReady: isClient && isReady, isClient };
}
