# Shikshanam - Discover India's Timeless Wisdom

A modern, immersive website for Shikshanam, an educational platform that bridges India's timeless philosophical traditions with today's digital learners. Built with Next.js, TailwindCSS, and advanced animation libraries.

## 🌟 Features

### 🎨 Design & Branding
- **Ancient yet futuristic** aesthetic with minimalist, spiritual-modern design
- **Trustworthy, community-driven** visual identity
- **Immersive storytelling** through scroll-based animations
- **Saffron, Indigo, and Cream** color palette inspired by Indian heritage

### 🎭 Animation Stack
- **Framer Motion** - Micro-interactions, hover effects, card flips, staggered reveals
- **GSAP + ScrollTrigger** - Scroll timelines, quest path glow, parallax effects, leaderboard counters
- **Lottie** - Mandala outline animations, footer mandala loop, animated video previews
- **Three.js** - Future 3D mandala and breakout room experiences

### 📱 Sections

#### 1. Hero Section
- Immersive mandala animation that unfolds on page load
- Transforms into six chakra-like nodes representing the Six Darshanas
- Elegant Sanskrit textures and soft gradients
- CTA buttons with ripple effects

#### 2. About Shikshanam
- Introduction to the platform's mission
- Founding vision by Vishal Chaurasia and Aman Bhogal
- Callout highlighting the team's expertise

#### 3. Explore the Six Darshanas
- Interactive chakra nodes (Nyaya, Vaisheshika, Samkhya, Yoga, Mimamsa, Vedanta)
- Hover effects with Sanskrit phrases
- Expandable cards with glossary snippets and sutra references
- Video preview integration

#### 4. Learning Opportunities
- Free Masterclasses (entry point)
- Live Classes with Zoom/Jitsi integration
- Structured courses with Acharyas
- Next class CTA with real-time updates

#### 5. Community & Meetups
- Virtual meetups with breakout rooms
- IRL meetups in major cities
- Weekly challenges and quiz competitions
- Gamified quest path with glowing checkpoints

#### 6. Shikshanam Economy
- Rewards system for contributions
- Community leaderboard with animated counters
#### 7. Shop & Resource Library
- Downloadable PDFs (sutras, commentaries, glossaries)
- Physical books and merchandise
- Special bundle offers with parallax effects

#### 8. Founders & Team
- Grid layout with team member cards
- Hover flip animations (photo to role/contribution)
- Social media integration
- Join us CTA

#### 9. Footer CTA
- Newsletter signup with floating input animation
- Final mandala animation
- Social media links with staggered fade-in

## 🛠 Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **GSAP** - Professional animation library
- **Lottie React** - Lottie animations
- **Three.js** - 3D graphics (future implementation)
- **Lucide React** - Icon library

### Styling
- **Custom CSS** with TailwindCSS utilities
- **CSS Grid & Flexbox** for responsive layouts
- **CSS Animations** for performance-critical animations
- **Custom color palette** with saffron, indigo, and cream themes

### Performance
- **Dynamic imports** for heavy animation libraries
- **Lazy loading** for videos and animations
- **Optimized images** and assets
- **Viewport-based animations** to prevent re-triggers

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shikshanam
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
shikshanam/
├── app/
│   ├── layout.tsx          # Root layout with fonts and metadata
│   ├── page.tsx            # Main homepage component
│   └── globals.css         # Global styles and TailwindCSS
├── components/
│   └── sections/           # Individual section components
│       ├── HeroSection.tsx
│       ├── AboutSection.tsx
│       ├── DarshanasSection.tsx
│       ├── LearningSection.tsx
│       ├── CommunitySection.tsx
│       ├── EconomySection.tsx
│       ├── ShopSection.tsx
│       ├── TeamSection.tsx
│       └── FooterSection.tsx
├── public/                 # Static assets
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # TailwindCSS configuration
├── next.config.js         # Next.js configuration
└── tsconfig.json          # TypeScript configuration
```

## 🎨 Design System

### Colors
- **Saffron**: `#f97316` (Primary brand color)
- **Indigo**: `#6366f1` (Secondary brand color)
- **Cream**: `#fefefe` (Background and text)

### Typography
- **Serif**: Playfair Display (Headings)
- **Sans-serif**: Inter (Body text)
- **Sanskrit**: Noto Sans Devanagari (Sanskrit text)

### Animations
- **Smooth, slow-ease** transitions
- **Purposeful** animations (not flashy)
- **Mobile-responsive** with graceful degradation
- **Performance-optimized** with viewport detection

## 📱 Responsive Design

The website is fully responsive with:
- **Mobile-first** approach
- **Tablet and desktop** optimizations
- **Touch-friendly** interactions
- **Accessible** design patterns

## 🔧 Customization

### Adding New Sections
1. Create a new component in `components/sections/`
2. Import and add to `app/page.tsx`
3. Follow the existing animation patterns

### Modifying Animations
- Use Framer Motion for micro-interactions
- Use GSAP for complex scroll animations
- Use CSS animations for performance-critical effects

### Updating Content
- Edit the data arrays in each section component
- Update images in the `public/` directory
- Modify colors in `tailwind.config.js`

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Build command: `npm run build`
- **AWS Amplify**: Follow Next.js deployment guide
- **Docker**: Use the provided Dockerfile

## 📈 Performance Optimization

- **Image optimization** with Next.js Image component
- **Code splitting** with dynamic imports
- **Lazy loading** for non-critical components
- **Animation optimization** with `useInView` hooks
- **Bundle analysis** with `@next/bundle-analyzer`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Vishal Chaurasia** - Founder and vision
- **Aman Bhogal** - Co-founder and technical direction
- **Shikshanam Team** - Content and community
- **Indian Philosophical Traditions** - The timeless wisdom that inspires us all

---

**Shikshanam** - Ancient wisdom, modern delivery. 🌟
