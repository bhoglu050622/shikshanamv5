# Shikshanam Course Pages

This document describes the 4 course-related pages built for the Shikshanam website using Next.js, Tailwind CSS, Framer Motion, and GSAP.

## 📁 Project Structure

```
app/courses/
├── free-masterclass/page.tsx      # Free masterclass signup page
├── premium-courses/page.tsx       # Premium course showcase
├── live-courses/page.tsx          # Live course sessions
└── all-courses/page.tsx           # Course library with filters

components/course/
├── Hero.tsx                       # Reusable hero component
├── Outcomes.tsx                   # Benefits/features display
├── CourseGrid.tsx                 # Course card grid
├── Testimonials.tsx               # Student testimonials carousel
├── Pricing.tsx                    # Pricing tiers and bundles
├── Countdown.tsx                  # Live course countdown timer
└── ClosingCTA.tsx                 # Final call-to-action

data/
└── courses.json                   # Mock course data

lib/
├── utils.ts                       # Utility functions
└── courseData.ts                  # Course data helpers

app/api/courses/
└── register/route.ts              # Registration API endpoint
```

## 🎯 Page Overview

### 1. Free Masterclass Page (`/courses/free-masterclass`)

**Goal**: Convert new visitors into free class signups and build trust.

**Features**:
- Hero section with mandala animations
- Why Join section (3 benefit cards)
- Upcoming free classes grid with seat availability
- Registration form with email + WhatsApp opt-in
- Testimonials carousel
- Closing CTA with mandala background

**Key Components**:
- Form submission to `/api/courses/register`
- Seat availability tracking
- Responsive design with animations

### 2. Premium Courses Page (`/courses/premium-courses`)

**Goal**: Showcase depth & value of premium courses for direct enrollments.

**Features**:
- Hero with Sanskrit + English titles
- Why Premium section (4 benefit cards)
- Featured premium courses grid
- Bundle offers with savings calculations
- Testimonials carousel
- Pricing tiers with features
- Payment security indicators

**Key Components**:
- Bundle pricing calculations
- Course feature comparisons
- Trust indicators and guarantees

### 3. Live Courses Page (`/courses/live-courses`)

**Goal**: Drive urgency-based signups for live classes with limited seats.

**Features**:
- Hero section with urgency messaging
- Why Live Courses benefits
- Countdown timer with GSAP animations
- Live session cards with seat tracking
- Schedule view with booking buttons
- Urgency indicators for low seat availability

**Key Components**:
- Real-time countdown timer
- Seat availability logic
- Urgency messaging for low seats

### 4. All Courses Page (`/courses/all-courses`)

**Goal**: Provide unified course library with browsing and filtering.

**Features**:
- Hero section with search focus
- Advanced search and filters
- Course grid with all course types
- Recommended learning pathways
- Community CTA for free masterclass
- Peaceful closing CTA

**Key Components**:
- Real-time search functionality
- Multi-criteria filtering
- Learning pathway recommendations

## 🎨 Design System

### Colors
- **Primary**: Orange (#E65100, #B71C1C)
- **Secondary**: Amber (#FFB800)
- **Accent**: Saffron (#B71C1C)
- **Background**: White/Dark Gray
- **Text**: Dark Gray/Light Gray

### Typography
- **Primary**: Inter (sans-serif)
- **Headings**: Playfair Display (serif)
- **Sanskrit**: Noto Sans Devanagari

### Animations
- **Framer Motion**: Page transitions, hover effects
- **GSAP**: Countdown timers, scroll animations
- **CSS**: Mandala rotations, floating elements

## 🚀 Key Features

### Animations & Interactions
- Mandala background animations
- Scroll-triggered animations
- Hover effects on course cards
- Countdown timers with urgency
- Form submission feedback

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interactions
- Adaptive layouts

### Performance
- Lazy loading of course data
- Optimized images and animations
- Efficient state management
- Minimal bundle size

### Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- High contrast ratios
- Screen reader compatibility

## 📊 Data Structure

### Course Types
```typescript
interface Course {
  id: string
  title: string
  sanskritTitle?: string
  description: string
  price?: number
  duration?: string
  level?: string
  acharya?: string
  seatsAvailable?: number
  seatsTotal?: number
  features?: string[]
  image?: string
}
```

### API Endpoints
- `POST /api/courses/register` - Course registration
- Future: Payment integration, seat management

## 🔧 Technical Implementation

### Dependencies
- **Next.js 14**: App Router, Server Components
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Animation library
- **GSAP**: Advanced animations
- **Lucide React**: Icon library
- **React Intersection Observer**: Scroll animations

### State Management
- React hooks for local state
- Form state management
- Filter state for course search
- Animation state tracking

### Form Handling
- Client-side validation
- API integration
- Loading states
- Success/error feedback

## 🎯 Conversion Optimization

### Free Masterclass Page
- Clear value proposition
- Social proof with testimonials
- Limited seat availability
- Easy registration process
- Multiple CTA opportunities

### Premium Courses Page
- Detailed course information
- Bundle savings calculations
- Trust indicators
- Multiple pricing tiers
- Clear feature comparisons

### Live Courses Page
- Urgency with countdown timers
- Limited seat messaging
- Real-time availability
- Immediate booking options
- FOMO-inducing design

### All Courses Page
- Advanced search functionality
- Personalized recommendations
- Clear learning pathways
- Community integration
- Multiple entry points

## 🚀 Future Enhancements

### Planned Features
- Payment gateway integration (Razorpay/Stripe)
- Real-time seat management
- User authentication
- Course progress tracking
- Community features
- Multi-language support

### Technical Improvements
- Database integration
- Real-time updates
- Advanced analytics
- Performance optimization
- SEO enhancements

## 📝 Usage Instructions

1. **Installation**: Ensure all dependencies are installed
2. **Data**: Update `data/courses.json` with real course data
3. **API**: Configure payment gateways and email services
4. **Deployment**: Deploy to production with proper environment variables

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for theme changes
- Update component props for content changes
- Customize animations in component files

### Content
- Edit course data in `data/courses.json`
- Update testimonials and pricing
- Modify hero content and CTAs

### Functionality
- Extend API routes for additional features
- Add new components as needed
- Integrate with external services

---

**Built with ❤️ for Shikshanam's mission to preserve and share ancient wisdom.**
