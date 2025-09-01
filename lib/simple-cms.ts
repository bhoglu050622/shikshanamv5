import fs from 'fs';
import path from 'path';

// Types for our CMS
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

// CMS Data Store
class SimpleCMS {
  private dataDir: string;
  private users: CMSUser[] = [];
  private pages: CMSPage[] = [];
  private courses: CMSCourse[] = [];
  private testimonials: CMSTestimonial[] = [];
  private media: CMSMedia[] = [];

  constructor() {
    this.dataDir = path.join(process.cwd(), 'data', 'cms');
    this.ensureDataDir();
    this.loadData();
  }

  private ensureDataDir() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  private getFilePath(collection: string): string {
    return path.join(this.dataDir, `${collection}.json`);
  }

  private loadData() {
    try {
      // Load users
      if (fs.existsSync(this.getFilePath('users'))) {
        this.users = JSON.parse(fs.readFileSync(this.getFilePath('users'), 'utf8'));
      } else {
        // Create default admin user
        this.users = [{
          id: 'admin-1',
          name: 'Admin',
          email: 'admin@shikshanam.com',
          role: 'admin',
          password: 'adminadmin', // In production, this should be hashed
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }];
        this.saveData('users');
      }

      // Load other collections
      if (fs.existsSync(this.getFilePath('pages'))) {
        this.pages = JSON.parse(fs.readFileSync(this.getFilePath('pages'), 'utf8'));
      }
      if (fs.existsSync(this.getFilePath('courses'))) {
        this.courses = JSON.parse(fs.readFileSync(this.getFilePath('courses'), 'utf8'));
      }
      if (fs.existsSync(this.getFilePath('testimonials'))) {
        this.testimonials = JSON.parse(fs.readFileSync(this.getFilePath('testimonials'), 'utf8'));
      }
      if (fs.existsSync(this.getFilePath('media'))) {
        this.media = JSON.parse(fs.readFileSync(this.getFilePath('media'), 'utf8'));
      }
    } catch (error) {
      console.error('Error loading CMS data:', error);
    }
  }

  private saveData(collection: string) {
    try {
      const filePath = this.getFilePath(collection);
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
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error saving ${collection} data:`, error);
    }
  }

  // User methods
  async authenticateUser(email: string, password: string): Promise<CMSUser | null> {
    const user = this.users.find(u => u.email === email && u.password === password);
    return user || null;
  }

  async getUserById(id: string): Promise<CMSUser | null> {
    return this.users.find(u => u.id === id) || null;
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

  async createPage(pageData: Omit<CMSPage, 'id' | 'createdAt' | 'updatedAt'>): Promise<CMSPage> {
    const page: CMSPage = {
      ...pageData,
      id: `page-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.pages.push(page);
    this.saveData('pages');
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
    this.saveData('pages');
    return this.pages[index];
  }

  async deletePage(id: string): Promise<boolean> {
    const index = this.pages.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    this.pages.splice(index, 1);
    this.saveData('pages');
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

  async createCourse(courseData: Omit<CMSCourse, 'id' | 'createdAt' | 'updatedAt'>): Promise<CMSCourse> {
    const course: CMSCourse = {
      ...courseData,
      id: `course-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.courses.push(course);
    this.saveData('courses');
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
    this.saveData('courses');
    return this.courses[index];
  }

  // Testimonial methods
  async getTestimonials(status?: string): Promise<CMSTestimonial[]> {
    if (status) {
      return this.testimonials.filter(t => t.status === status);
    }
    return this.testimonials;
  }

  async createTestimonial(testimonialData: Omit<CMSTestimonial, 'id' | 'createdAt' | 'updatedAt'>): Promise<CMSTestimonial> {
    const testimonial: CMSTestimonial = {
      ...testimonialData,
      id: `testimonial-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.testimonials.push(testimonial);
    this.saveData('testimonials');
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
    this.saveData('testimonials');
    return this.testimonials[index];
  }

  // Media methods
  async getMedia(category?: string): Promise<CMSMedia[]> {
    if (category) {
      return this.media.filter(m => m.category === category);
    }
    return this.media;
  }

  async createMedia(mediaData: Omit<CMSMedia, 'id' | 'createdAt'>): Promise<CMSMedia> {
    const media: CMSMedia = {
      ...mediaData,
      id: `media-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.media.push(media);
    this.saveData('media');
    return media;
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
    };
  }
}

// Create singleton instance
const cms = new SimpleCMS();

export default cms;
