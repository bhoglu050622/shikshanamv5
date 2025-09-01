# 🌿 Rishi Mode - Philosophical Path Discovery

## Overview

Rishi Mode is an immersive onboarding experience that transforms a new user's first visit into a guided journey of self-discovery, inspired by the six Darshanas (schools of Indian philosophy).

## Features

### 🧭 User Journey
1. **Entry Point**: Homepage or dedicated `/rishi-mode` page
2. **Identity Setup**: User selects avatar, name, and occupation
3. **Quests & Quizzes**: Mini-journeys with philosophical questions
4. **Philosophical Alignment**: Shows matching Darshana + Chakra with storytelling
5. **Guided Path**: Recommends relevant courses and resources
6. **Gamification**: Users earn "Rishi Badges" for completing quests
7. **Community Hook**: Invites users to join Rishi Circles

### 🎯 Philosophical Archetypes

#### Nyaya - The Logical Sage
- **Chakra**: Ajna (Third Eye)
- **Focus**: Systematic analysis and logical reasoning
- **Characteristics**: Analytical thinking, logical reasoning, debate and discussion
- **Recommended Courses**: Logic & Critical Thinking through Nyaya, Sanskrit for Beginners

#### Vedanta - The Unity Seeker
- **Chakra**: Sahasrara (Crown)
- **Focus**: Ultimate truth and unity of all existence
- **Characteristics**: Spiritual seeking, unity consciousness, inner peace
- **Recommended Courses**: Advaita Upanishad Studies, Isha Upanishad: Essence of Oneness

#### Yoga - The Disciplined Practitioner
- **Chakra**: Manipura (Solar Plexus)
- **Focus**: Systematic practice and self-discipline
- **Characteristics**: Self-discipline, systematic practice, mind-body awareness
- **Recommended Courses**: Yoga Darshan: Complete Journey, Daily Yogic Practices

#### Sankhya - The Analytical Observer
- **Chakra**: Svadhisthana (Sacral)
- **Focus**: Pattern recognition and dualistic understanding
- **Characteristics**: Pattern recognition, observational wisdom, discrimination
- **Recommended Courses**: Sanskrit for Beginners, Vedanta Philosophy

#### Vaisheshika - The Natural Philosopher
- **Chakra**: Muladhara (Root)
- **Focus**: Understanding the material world and its elements
- **Characteristics**: Material understanding, elemental awareness, systematic observation
- **Recommended Courses**: Sanskrit for Beginners, Vedanta Philosophy

## Technical Implementation

### File Structure
```
app/
├── rishi-mode/
│   └── page.tsx          # Main Rishi Mode page
data/
├── rishiModeData.ts      # Quiz questions, profiles, and data
components/
└── Navigation.tsx        # Updated with Rishi Mode link
```

### Key Components

#### Rishi Mode Page (`/app/rishi-mode/page.tsx`)
- Multi-step onboarding flow
- Interactive quiz with philosophical questions
- Personalized profile generation
- Course recommendations
- Community integration

#### Data Layer (`/data/rishiModeData.ts`)
- Quiz questions and answer options
- Rishi profiles with characteristics
- Guna descriptions (Sattva, Rajas, Tamas)
- Chakra information and associations

### Navigation Updates
- Replaced "All Courses" with "My Rishi Mode" in user menu
- Added "Rishi Mode" link in main navigation for non-authenticated users

## User Experience

### Step 1: Welcome
- Introduction to Rishi Mode concept
- Overview of the journey ahead
- Call-to-action to begin

### Step 2: Quiz
- 5 philosophical questions
- Multiple choice answers
- Real-time progress tracking
- Smooth animations and transitions

### Step 3: Profile Generation
- Personalized Rishi archetype
- Darshana and chakra alignment
- Characteristic traits
- Recommended practices

### Step 4: Recommendations
- Personalized course suggestions
- Community features
- Next steps for learning journey

## Design Features

### Visual Elements
- **Gradients**: Color-coded by philosophical school
- **Animations**: Framer Motion for smooth transitions
- **Icons**: Lucide React for consistent iconography
- **Progress Indicators**: Step-by-step journey tracking

### Responsive Design
- Mobile-first approach
- Adaptive layouts for different screen sizes
- Touch-friendly interactions

### Accessibility
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management

## Integration Points

### Course System
- Links to existing course catalog
- Personalized recommendations based on quiz results
- Seamless transition to learning platform

### Authentication
- Works for both authenticated and non-authenticated users
- Saves user preferences when logged in
- Personalized experience for returning users

### Community Features
- Rishi Circles by philosophical alignment
- Virtual and IRL meetups
- Study groups and discussions

## Future Enhancements

### Planned Features
1. **Advanced Quiz Engine**: More sophisticated question algorithms
2. **Progress Tracking**: Save and resume quiz progress
3. **Social Features**: Share results with friends
4. **Gamification**: Badges, achievements, and leaderboards
5. **AI Integration**: Personalized content recommendations
6. **Mobile App**: Native mobile experience

### Analytics
- Quiz completion rates
- Most popular philosophical alignments
- Course conversion rates
- User engagement metrics

## Benefits

### For Users
- **Personalized Experience**: Tailored to individual philosophical inclinations
- **Guided Discovery**: Structured path to spiritual learning
- **Community Connection**: Find like-minded seekers
- **Gamified Learning**: Engaging and motivating experience

### For Business
- **Higher Conversion**: Personalized funnel increases course enrollment
- **User Engagement**: Interactive experience keeps users engaged
- **Data Insights**: Better understanding of user preferences
- **Brand Differentiation**: Unique positioning in spiritual education market

## Technical Requirements

### Dependencies
- Next.js 14+
- React 18+
- Framer Motion
- Lucide React
- Tailwind CSS

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Getting Started

1. Navigate to `/rishi-mode` in the application
2. Click "Begin Your Journey"
3. Answer the philosophical questions
4. Discover your Rishi profile
5. Explore personalized recommendations

## Contributing

To add new features or modify existing ones:

1. Update quiz questions in `data/rishiModeData.ts`
2. Add new philosophical archetypes as needed
3. Enhance the UI components in `app/rishi-mode/page.tsx`
4. Test the user flow and animations
5. Update this documentation

---

*Rishi Mode transforms the traditional course catalog into an engaging journey of self-discovery, making Shikshanam feel like an "experience" rather than just an edtech platform.*
