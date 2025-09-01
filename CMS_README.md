# Shikshanam Payload CMS

A comprehensive, fully-featured CMS built with Payload CMS for managing all website content including pages, courses, quizzes, testimonials, and more.

## 🚀 Features

### Core CMS Features
- **Modular Content Blocks**: Hero banners, card grids, testimonial sliders, CTA sections, and more
- **Draft vs Published Mode**: Save changes without publishing using Payload's version control
- **Live Preview**: Real-time preview of draft content before publishing
- **Version History**: Rollback to previous versions with one-click restore
- **Autosave**: Automatic saving every 2 seconds while editing
- **Custom Page Slugs**: SEO-friendly URLs with automatic generation
- **SEO Metadata**: Complete SEO fields for all content types

### Content Management
- **Pages**: Modular pages with drag-and-drop content blocks
- **Courses**: Comprehensive course management with lessons, pricing, and enrollment
- **Quizzes**: Interactive quizzes with multiple question types and scoring
- **Testimonials**: Customer reviews with approval workflow
- **Bundles**: Course bundles with discount pricing
- **FAQs**: Organized FAQ system with categories
- **Media**: Image and file management with optimization

### Admin Interface
- **Modern UI**: Clean, branded interface with Shikshanam styling
- **Mega Menu Navigation**: Organized content types for fast access
- **Responsive Design**: Works on all devices
- **Drag & Drop**: Reorder content blocks and media
- **Image Upload & Crop**: Built-in image processing
- **Rich Text Editor**: Advanced content editing with Slate.js

### User Management
- **Role-Based Access**: Admin, Editor, and Author roles
- **Permission System**: Granular permissions for different actions
- **User Profiles**: Avatar, bio, and activity tracking

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud)
- Next.js 14+

## 🛠️ Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env.local` file with:
   ```env
   PAYLOAD_SECRET=your-super-secret-key-here
   MONGODB_URI=mongodb://localhost:27017/shikshanam-cms
   PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
   ```

3. **Initialize Admin User**
   ```bash
   npm run cms:init
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Access CMS**
   Navigate to `http://localhost:3000/cms`
   - Email: `admin@shikshanam.com`
   - Password: `adminadmin`

## 📁 Project Structure

```
├── payload.config.ts          # Main Payload configuration
├── collections/               # Content collections
│   ├── Users.ts              # User management
│   ├── Pages.ts              # Page content
│   ├── Courses.ts            # Course management
│   ├── Quizzes.ts            # Quiz system
│   ├── Testimonials.ts       # Customer reviews
│   ├── Bundles.ts            # Course bundles
│   ├── FAQs.ts               # FAQ management
│   └── Media.ts              # Media library
├── blocks/                   # Content blocks (to be created)
├── admin/                    # Admin customization
│   └── styles.css           # Custom admin styles
├── scripts/                  # Utility scripts
│   └── init-admin.ts        # Admin user initialization
├── lib/                      # Utilities
│   └── payload.ts           # CMS data fetching utilities
└── app/api/payload/         # Payload API routes
```

## 🎨 Content Blocks

The CMS supports modular content blocks for flexible page building:

### Available Blocks
- **Hero Block**: Full-width banners with CTA buttons
- **Rich Text Block**: Formatted content with styling options
- **Card Grid Block**: Responsive card layouts
- **Testimonial Slider Block**: Customer review carousels
- **CTA Block**: Call-to-action sections
- **Image Block**: Optimized image display
- **Video Block**: Embedded video content
- **Pricing Block**: Course pricing tables
- **Features Block**: Feature highlights

### Block Features
- Drag-and-drop reordering
- Individual styling options
- Responsive layouts
- SEO optimization
- Preview support

## 🔐 User Roles & Permissions

### Admin
- Full access to all features
- User management
- System settings
- Content publishing
- Analytics access

### Editor
- Content creation and editing
- Publishing permissions
- Media management
- Limited user access

### Author
- Content creation
- Draft saving
- No publishing rights
- Limited media access

## 📊 Collections Overview

### Pages
- Modular content with blocks
- SEO metadata
- Template selection
- Status management
- Preview functionality

### Courses
- Lesson management
- Pricing and enrollment
- Certificate generation
- Progress tracking
- Review system

### Quizzes
- Multiple question types
- Scoring and results
- Time limits
- Retake settings
- Analytics tracking

### Testimonials
- Approval workflow
- Rating system
- Social proof
- Course association
- Featured selection

### Bundles
- Course packaging
- Discount pricing
- Enrollment management
- Support options
- Analytics tracking

### FAQs
- Category organization
- Search functionality
- Helpful ratings
- Related content
- SEO optimization

### Media
- Image optimization
- Multiple sizes
- Category organization
- Usage tracking
- Alt text management

## 🚀 API Endpoints

### REST API
- `GET /api/payload/pages` - Fetch pages
- `GET /api/payload/courses` - Fetch courses
- `GET /api/payload/testimonials` - Fetch testimonials
- `POST /api/payload/pages` - Create page
- `PATCH /api/payload/pages/:id` - Update page
- `DELETE /api/payload/pages/:id` - Delete page

### GraphQL API
- Schema generated automatically
- Available at `/api/payload/graphql`
- Full CRUD operations
- Real-time subscriptions

## 🔄 Live Preview

### Setup
1. Configure preview URLs in collection configs
2. Set up preview API route
3. Implement preview components

### Usage
1. Edit content in CMS
2. Click "Preview" button
3. View draft content in real-time
4. Publish when ready

## 📈 Analytics & Tracking

### Built-in Analytics
- Page views
- Content engagement
- User activity
- Conversion tracking
- Performance metrics

### Custom Tracking
- Course completion rates
- Quiz performance
- User behavior
- Content popularity
- ROI calculations

## 🔧 Customization

### Admin UI
- Custom CSS in `admin/styles.css`
- Brand colors and styling
- Logo and favicon
- Navigation customization

### Content Blocks
- Create custom blocks in `blocks/`
- Add new field types
- Custom validation
- Advanced features

### API Extensions
- Custom endpoints
- Webhook integrations
- Third-party services
- Data transformations

## 🚀 Deployment

### Production Setup
1. Set production environment variables
2. Configure MongoDB connection
3. Set up file storage (S3, Cloudinary, etc.)
4. Configure CDN for media
5. Set up monitoring and logging

### Environment Variables
```env
PAYLOAD_SECRET=production-secret-key
MONGODB_URI=production-mongodb-uri
PAYLOAD_PUBLIC_SERVER_URL=https://yourdomain.com
NODE_ENV=production
```

## 📚 Scripts

### Available Commands
```bash
# Initialize admin user
npm run cms:init

# Generate TypeScript types
npm run cms:generate:types

# Generate GraphQL schema
npm run cms:generate:graphQLSchema

# Build admin panel
npm run cms:build

# Development with auto-reload
npm run cms:dev
```

## 🔍 Troubleshooting

### Common Issues
1. **MongoDB Connection**: Ensure MongoDB is running
2. **Admin Access**: Check credentials and permissions
3. **Media Uploads**: Verify file permissions and storage
4. **Preview Issues**: Check preview URL configuration

### Debug Mode
Enable debug logging in `payload.config.ts`:
```typescript
debug: process.env.NODE_ENV === 'development'
```

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper TypeScript types
3. Include error handling
4. Test thoroughly
5. Update documentation

## 📄 License

This project is part of the Shikshanam platform.

## 🆘 Support

For support and questions:
- Check the documentation
- Review troubleshooting section
- Contact the development team

---

**Built with ❤️ using Payload CMS**
