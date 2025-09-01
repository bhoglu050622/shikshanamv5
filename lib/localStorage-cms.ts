// Types for our localStorage CMS
export interface CMSUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'author';
  password: string; // In production, this should be hashed
  createdAt: string;
  updatedAt: string;
}

export interface CMSPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  template: string;
  seo: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface CMSCourse {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
  price: number;
  isFree: boolean;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  instructor: string;
  duration: {
    hours: number;
    minutes: number;
  };
  lessons: Array<{
    id: string;
    title: string;
    description: string;
    duration: number;
    videoUrl?: string;
  }>;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface CMSTestimonial {
  id: string;
  name: string;
  email: string;
  title?: string;
  company?: string;
  rating: number;
  testimonial: string;
  status: 'pending' | 'approved' | 'rejected' | 'featured';
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CMSMedia {
  id: string;
  filename: string;
  originalName: string;
  alt: string;
  caption?: string;
  category: string;
  url: string;
  size: number;
  mimeType: string;
  createdAt: string;
}

// localStorage CMS Data Store
class LocalStorageCMS {
  private users: CMSUser[] = [];
  private pages: CMSPage[] = [];
  private courses: CMSCourse[] = [];
  private testimonials: CMSTestimonial[] = [];
  private media: CMSMedia[] = [];

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Check if data exists in localStorage, if not create default data
    if (typeof window === 'undefined') return; // Server-side check

    console.log('Initializing localStorage CMS data...');

    // Initialize users
    const storedUsers = localStorage.getItem('cms_users');
    console.log('Stored users:', storedUsers);
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
      console.log('Loaded users from localStorage:', this.users);
    } else {
      // Create default admin user
      console.log('Creating default admin user...');
      this.users = [{
        id: 'admin-1',
        name: 'Admin',
        email: 'admin@shikshanam.com',
        role: 'admin',
        password: 'adminadmin', // In production, this should be hashed
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

    const storedMedia = localStorage.getItem('cms_media');
    this.media = storedMedia ? JSON.parse(storedMedia) : [];
  }

  private saveToLocalStorage(collection: string) {
    if (typeof window === 'undefined') return; // Server-side check

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
        case 'media':
          data = this.media;
          break;
      }
      
      localStorage.setItem(`cms_${collection}`, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${collection} to localStorage:`, error);
    }
  }

  // Export data to JSON (for backup)
  exportData() {
    return {
      users: this.users,
      pages: this.pages,
      courses: this.courses,
      testimonials: this.testimonials,
      media: this.media,
      exportedAt: new Date().toISOString(),
    };
  }

  // Import data from JSON (for restore)
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
      if (data.media) {
        this.media = data.media;
        this.saveToLocalStorage('media');
      }
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Clear all data
  clearAllData() {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('cms_users');
    localStorage.removeItem('cms_pages');
    localStorage.removeItem('cms_courses');
    localStorage.removeItem('cms_testimonials');
    localStorage.removeItem('cms_media');

    this.users = [];
    this.pages = [];
    this.courses = [];
    this.testimonials = [];
    this.media = [];

    // Reinitialize with default data
    this.initializeData();
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

  // Media methods
  async getMedia(category?: string): Promise<CMSMedia[]> {
    if (category) {
      return this.media.filter(m => m.category === category);
    }
    return this.media;
  }

  async getMediaById(id: string): Promise<CMSMedia | null> {
    return this.media.find(m => m.id === id) || null;
  }

  async createMedia(mediaData: Omit<CMSMedia, 'id' | 'createdAt'>): Promise<CMSMedia> {
    const media: CMSMedia = {
      ...mediaData,
      id: `media-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.media.push(media);
    this.saveToLocalStorage('media');
    return media;
  }

  async deleteMedia(id: string): Promise<boolean> {
    const index = this.media.findIndex(m => m.id === id);
    if (index === -1) return false;
    
    this.media.splice(index, 1);
    this.saveToLocalStorage('media');
    return true;
  }

  // Search functionality
  async searchContent(query: string, collections: string[] = ['pages', 'courses']): Promise<any[]> {
    const results: any[] = [];
    const searchTerm = query.toLowerCase();

    if (collections.includes('pages')) {
      const pageResults = this.pages.filter(p => 
        p.title.toLowerCase().includes(searchTerm) ||
        p.content.toLowerCase().includes(searchTerm)
      );
      results.push(...pageResults.map(p => ({ ...p, collection: 'pages' })));
    }

    if (collections.includes('courses')) {
      const courseResults = this.courses.filter(c => 
        c.title.toLowerCase().includes(searchTerm) ||
        c.description.toLowerCase().includes(searchTerm)
      );
      results.push(...courseResults.map(c => ({ ...c, collection: 'courses' })));
    }

    if (collections.includes('testimonials')) {
      const testimonialResults = this.testimonials.filter(t => 
        t.name.toLowerCase().includes(searchTerm) ||
        t.testimonial.toLowerCase().includes(searchTerm)
      );
      results.push(...testimonialResults.map(t => ({ ...t, collection: 'testimonials' })));
    }

    return results;
  }

  // Analytics
  async getAnalytics() {
    return {
      totalPages: this.pages.length,
      publishedPages: this.pages.filter(p => p.status === 'published').length,
      totalCourses: this.courses.length,
      publishedCourses: this.courses.filter(c => c.status === 'published').length,
      totalTestimonials: this.testimonials.length,
      approvedTestimonials: this.testimonials.filter(t => t.status === 'approved').length,
      totalMedia: this.media.length,
      totalUsers: this.users.length,
    };
  }

  // Check localStorage availability
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

  // Get storage usage info
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

// Create singleton instance
let localStorageCMS: LocalStorageCMS;

// Only create instance on client side
if (typeof window !== 'undefined') {
  localStorageCMS = new LocalStorageCMS();
} else {
  // Server-side placeholder
  localStorageCMS = {} as LocalStorageCMS;
}

export default localStorageCMS;
