import { buildConfig } from 'payload';
import { slateEditor } from '@payloadcms/richtext-slate';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import path from 'path';

// Import collections - temporarily disabled due to PayloadCMS v3 compatibility issues
// import { Pages } from './collections/Pages';
// import { Courses } from './collections/Courses';
// import { Quizzes } from './collections/Quizzes';
// import { Testimonials } from './collections/Testimonials';
// import { Media } from './collections/Media';
// import { Users } from './collections/Users';
// import { Bundles } from './collections/Bundles';
// import { FAQs } from './collections/FAQs';

  // Import blocks (to be created later)
  // import { HeroBlock } from './blocks/HeroBlock';
  // import { CardGridBlock } from './blocks/CardGridBlock';
  // import { TestimonialSliderBlock } from './blocks/TestimonialSliderBlock';
  // import { CTABlock } from './blocks/CTABlock';
  // import { RichTextBlock } from './blocks/RichTextBlock';
  // import { ImageBlock } from './blocks/ImageBlock';
  // import { VideoBlock } from './blocks/VideoBlock';
  // import { PricingBlock } from './blocks/PricingBlock';
  // import { FeaturesBlock } from './blocks/FeaturesBlock';

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  secret: process.env.PAYLOAD_SECRET || 'your-secret-key-here',
  admin: {
    user: 'users', // Temporarily hardcoded due to PayloadCMS v3 compatibility issues
    meta: {
      titleSuffix: '- Shikshanam CMS',
    },
    components: {
      // Custom admin components can be added here
    },
  },
  collections: [
    // Temporarily disabled due to PayloadCMS v3 compatibility issues
    // Pages,
    // Courses,
    // Quizzes,
    // Testimonials,
    // Media,
    // Users,
    // Bundles,
    // FAQs,
  ],
  globals: [
    // Global settings can be added here
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shikshanam-cms',
  }),
  editor: slateEditor({}),
  // Enable live preview
  cors: ['http://localhost:3000', 'http://localhost:3001'],
  csrf: [
    'http://localhost:3000',
    'http://localhost:3001',
  ],
  // Custom admin routes
  routes: {
    admin: '/cms',
  },

  // Upload configuration
  upload: {
    limits: {
      fileSize: 5000000, // 5MB
    },
  },

  // Logging
  debug: process.env.NODE_ENV === 'development',
});
