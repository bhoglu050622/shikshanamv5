import payload from 'payload';

// Initialize Payload client for server-side operations
export const getPayload = () => {
  // Check if payload is available and initialized
  if (!payload || typeof payload !== 'object') {
    throw new Error('Payload not available');
  }
  return payload;
};

// Fetch published pages
export async function getPages() {
  try {
    const pages = await getPayload().find({
      collection: 'pages',
      where: {
        status: {
          equals: 'published',
        },
      },
      sort: 'order',
    });
    return pages.docs;
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
}

// Fetch a single page by slug
export async function getPage(slug: string, draft = false) {
  try {
    const page = await getPayload().find({
      collection: 'pages',
      where: {
        slug: {
          equals: slug,
        },
        ...(draft ? {} : { status: { equals: 'published' } }),
      },
      draft,
      limit: 1,
    });
    return page.docs[0] || null;
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}

// Fetch published courses
export async function getCourses() {
  try {
    const courses = await getPayload().find({
      collection: 'courses',
      where: {
        status: {
          equals: 'published',
        },
      },
      sort: '-publishedAt',
    });
    return courses.docs;
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

// Fetch a single course by slug
export async function getCourse(slug: string, draft = false) {
  try {
    const course = await getPayload().find({
      collection: 'courses',
      where: {
        slug: {
          equals: slug,
        },
        ...(draft ? {} : { status: { equals: 'published' } }),
      },
      draft,
      limit: 1,
    });
    return course.docs[0] || null;
  } catch (error) {
    console.error('Error fetching course:', error);
    return null;
  }
}

// Fetch published testimonials
export async function getTestimonials() {
  try {
    const testimonials = await getPayload().find({
      collection: 'testimonials',
      where: {
        status: {
          equals: 'approved',
        },
      },
      sort: '-createdAt',
    });
    return testimonials.docs;
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

// Fetch featured testimonials
export async function getFeaturedTestimonials() {
  try {
    const testimonials = await getPayload().find({
      collection: 'testimonials',
      where: {
        and: [
          {
            status: {
              equals: 'approved',
            },
          },
          {
            featured: {
              equals: true,
            },
          },
        ],
      },
      sort: '-createdAt',
      limit: 6,
    });
    return testimonials.docs;
  } catch (error) {
    console.error('Error fetching featured testimonials:', error);
    return [];
  }
}

// Fetch published bundles
export async function getBundles() {
  try {
    const bundles = await getPayload().find({
      collection: 'bundles',
      where: {
        status: {
          equals: 'published',
        },
      },
      sort: '-publishedAt',
    });
    return bundles.docs;
  } catch (error) {
    console.error('Error fetching bundles:', error);
    return [];
  }
}

// Fetch a single bundle by slug
export async function getBundle(slug: string, draft = false) {
  try {
    const bundle = await getPayload().find({
      collection: 'bundles',
      where: {
        slug: {
          equals: slug,
        },
        ...(draft ? {} : { status: { equals: 'published' } }),
      },
      draft,
      limit: 1,
    });
    return bundle.docs[0] || null;
  } catch (error) {
    console.error('Error fetching bundle:', error);
    return null;
  }
}

// Fetch published FAQs
export async function getFAQs(category?: string) {
  try {
    const where: any = {
      status: {
        equals: 'published',
      },
    };

    if (category) {
      where.category = {
        equals: category,
      };
    }

    const faqs = await getPayload().find({
      collection: 'faqs',
      where,
      sort: 'order',
    });
    return faqs.docs;
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
}

// Fetch media by category
export async function getMedia(category?: string) {
  try {
    const where: any = {};
    if (category) {
      where.category = {
        equals: category,
      };
    }

    const media = await getPayload().find({
      collection: 'media',
      where,
      sort: '-createdAt',
    });
    return media.docs;
  } catch (error) {
    console.error('Error fetching media:', error);
    return [];
  }
}

// Search content
export async function searchContent(query: string, collections: string[] = ['pages', 'courses', 'faqs']) {
  try {
    const results = await Promise.all(
      collections.map(async (collection) => {
        try {
          const docs = await getPayload().find({
            collection: collection as any,
            where: {
              or: [
                {
                  title: {
                    contains: query,
                  },
                },
                {
                  description: {
                    contains: query,
                  },
                },
                {
                  content: {
                    contains: query,
                  },
                },
              ],
              status: {
                equals: 'published',
              },
            },
            limit: 10,
          });
          return {
            collection,
            docs: docs.docs,
          };
        } catch (error) {
          console.error(`Error searching ${collection}:`, error);
          return {
            collection,
            docs: [],
          };
        }
      })
    );

    return results;
  } catch (error) {
    console.error('Error searching content:', error);
    return [];
  }
}

// Get global settings (you can create a globals collection for this)
export async function getGlobalSettings() {
  try {
    // This would fetch from a globals collection
    // For now, return default settings
    return {
      siteName: 'Shikshanam',
      siteDescription: 'Learn Sanskrit, Vedanta, and Ancient Wisdom',
      contactEmail: 'contact@shikshanam.com',
      socialLinks: {
        facebook: '',
        twitter: '',
        instagram: '',
        youtube: '',
      },
    };
  } catch (error) {
    console.error('Error fetching global settings:', error);
    return null;
  }
}

// Helper function to format dates
export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Helper function to truncate text
export function truncateText(text: string, length: number = 150) {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

// Helper function to generate SEO metadata
export function generateSEO(page: any) {
  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.description || page.shortDescription,
    keywords: page.seo?.keywords || '',
    ogImage: page.seo?.ogImage?.url || page.featuredImage?.url,
    ogTitle: page.seo?.ogTitle || page.title,
    ogDescription: page.seo?.ogDescription || page.description || page.shortDescription,
  };
}
