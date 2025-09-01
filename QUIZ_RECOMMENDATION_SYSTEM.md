# Dynamic Post-Quiz Recommendation System

A comprehensive, extensible recommendation system that aggregates results from multiple quizzes and provides personalized recommendations for courses and books.

## Overview

The system automatically activates once a user completes any quiz (currently supporting Guna Profiler and Shiva Consciousness Quiz) and provides:

1. **Next Quiz Suggestions** - Recommends the most relevant remaining quiz
2. **Course Recommendations** - Up to 3 premium courses with personalized explanations
3. **Book Recommendations** - Up to 2 books with context-aware reasoning
4. **Unified Analysis** - Combined insights from all completed quizzes

## Key Features

### 🎯 **Dynamic & Context-Aware**
- Aggregates results from multiple quizzes
- Provides unified recommendations based on combined data
- Context-aware explanations for each recommendation

### 🔄 **Extensible Architecture**
- Lightweight JSON registry for quiz metadata
- Modular logic handlers for different quiz types
- Default logic handler for future quizzes
- No server dependencies - pure client-side implementation

### ⚡ **Performance Optimized**
- Token-efficient logic with template-based explanations
- Collapsible UI sections to reduce DOM weight
- Lazy loading of recommendation components
- Efficient localStorage parsing

### 🎨 **User Experience**
- Beautiful, modern UI with smooth animations
- Collapsible sections for better organization
- Responsive design for all devices
- Accessibility-friendly components

## Architecture

### Core Components

#### 1. Quiz Recommendation Engine (`lib/quizRecommendationEngine.ts`)
```typescript
// Main entry point
const recommendations = quizRecommendationEngine.generateUnifiedRecommendations()
```

**Key Methods:**
- `generateUnifiedRecommendations()` - Main recommendation generator
- `getCompletedQuizzes()` - Parses localStorage for completed quizzes
- `generateCourseRecommendations()` - Course matching logic
- `generateBookRecommendations()` - Book matching logic
- `generateAnalysis()` - Combined insights generation

#### 2. Quiz Registry System
```typescript
export const QUIZ_REGISTRY: QuizMetadata[] = [
  {
    id: 'guna-profiler',
    name: 'Guna Profiler',
    description: 'Discover your dominant energy type',
    tags: ['guna', 'personality', 'energy', 'balance'],
    completionKey: 'gunaProfilerState',
    resultKey: 'gunaProfilerState',
    priority: 1
  },
  // ... more quizzes
]
```

#### 3. React Component (`components/rishi-mode/QuizRecommendations.tsx`)
- Modular, reusable component
- Collapsible sections for better UX
- Analytics integration
- Responsive design

## Quiz Logic Handlers

### Guna Profiler Logic
```typescript
// Dominant guna matching
if (quiz.dominantTrait === 'tamas') {
  // Recommend meditation and awareness courses
} else if (quiz.dominantTrait === 'rajas') {
  // Recommend action-oriented courses
} else if (quiz.dominantTrait === 'sattva') {
  // Recommend wisdom and philosophy courses
}

// Low score areas
if (quiz.lowScoreAreas?.includes('sattva')) {
  // Recommend peace and meditation content
}
```

### Shiva Consciousness Logic
```typescript
// Archetype matching
if (quiz.archetype === 'The Destroyer') {
  // Recommend transformation and healing courses
} else if (quiz.archetype === 'The Yogi') {
  // Recommend practice and discipline courses
} else if (quiz.archetype === 'The Sage') {
  // Recommend philosophy and wisdom courses
}
```

### Default Logic Handler
For future quizzes, the system uses tag-based matching:
```typescript
// Tag-based matching for extensibility
if (quiz.tags) {
  const tagMatch = this.calculateTagMatch(course, quiz.tags)
  score += tagMatch * 0.5
}
```

## Usage Examples

### Basic Implementation
```typescript
import QuizRecommendations from '@/components/rishi-mode/QuizRecommendations'

function MyPage() {
  return (
    <div>
      <h1>Your Recommendations</h1>
      <QuizRecommendations 
        onQuizStart={(quizId) => {
          // Handle quiz navigation
          if (quizId === 'guna-profiler') {
            window.location.href = '/guna-profiler'
          }
        }}
      />
    </div>
  )
}
```

### Adding New Quizzes
```typescript
import { QuizRecommendationEngine } from '@/lib/quizRecommendationEngine'

// Add new quiz to registry
QuizRecommendationEngine.addQuizToRegistry({
  id: 'chakra-balance',
  name: 'Chakra Balance Quiz',
  description: 'Discover your chakra alignment',
  tags: ['chakra', 'energy', 'balance'],
  completionKey: 'chakraBalanceState',
  resultKey: 'chakraBalanceState',
  priority: 3
})
```

## Data Flow

1. **Quiz Completion** → Results stored in localStorage
2. **Recommendation Request** → Engine reads all quiz states
3. **Aggregation** → Combines results from multiple quizzes
4. **Matching** → Applies logic handlers for each quiz type
5. **Scoring** → Calculates match scores for courses and books
6. **Rendering** → UI displays collapsible sections with recommendations

## Recommendation Logic

### Course Matching Algorithm
1. **Darshana Alignment** (40% weight) - Philosophical school compatibility
2. **Level Appropriateness** (25% weight) - Beginner/Intermediate/Advanced
3. **Guna Compatibility** (15% weight) - Energy type alignment
4. **Characteristics Match** (10% weight) - Personality traits
5. **User Preferences** (10% weight) - Interests and completed courses

### Book Matching Algorithm
1. **Quiz-Specific Logic** - Direct mapping for known quizzes
2. **Difficulty Prioritization** - Beginner → Intermediate → Advanced
3. **Category Matching** - Philosophy, Practice, Meditation, Scripture
4. **Deduplication** - Avoids duplicate recommendations

## Analytics Integration

The system tracks:
- Recommendation generation events
- Section toggle interactions
- Course and book clicks
- Quiz start events from recommendations

```typescript
trackEvent('quiz_recommendations_generated', {
  quiz_count: recs.nextQuiz ? 1 : 0,
  course_count: recs.courses.length,
  book_count: recs.books.length,
  has_analysis: !!recs.analysis
})
```

## Performance Considerations

### Token Efficiency
- Template-based explanations (2-3 sentences max)
- Efficient localStorage parsing
- Minimal DOM updates with collapsible sections

### Memory Management
- Lazy loading of recommendation components
- Efficient course and book databases
- Cleanup of unused quiz data

### Scalability
- Extensible quiz registry
- Modular logic handlers
- Default fallback for unknown quizzes

## Testing

Run the test scenarios:
```typescript
import { exampleScenarios } from '@/lib/quizRecommendationEngine.test'

// Test different completion states
exampleScenarios.newUser()
exampleScenarios.gunaCompleted()
exampleScenarios.bothCompleted()
```

## Future Enhancements

### Planned Features
1. **Machine Learning Integration** - Dynamic scoring based on user behavior
2. **A/B Testing** - Different recommendation algorithms
3. **Social Features** - Community recommendations
4. **Progress Tracking** - Learning path recommendations

### Extensibility Points
1. **New Quiz Types** - Add to registry with custom logic
2. **Recommendation Sources** - Integrate external APIs
3. **Personalization** - User preference learning
4. **Content Types** - Videos, podcasts, workshops

## Troubleshooting

### Common Issues

1. **No Recommendations Showing**
   - Check localStorage for quiz completion data
   - Verify quiz registry configuration
   - Check browser console for errors

2. **Incorrect Recommendations**
   - Verify quiz logic handlers
   - Check course and book databases
   - Validate scoring algorithms

3. **Performance Issues**
   - Ensure collapsible sections are working
   - Check for memory leaks in component lifecycle
   - Verify efficient localStorage parsing

### Debug Mode
```typescript
// Enable debug logging
localStorage.setItem('debug_recommendations', 'true')

// Check quiz completion status
console.log('Completed quizzes:', quizRecommendationEngine.getCompletedQuizzes())
```

## Contributing

When adding new quizzes:

1. **Update Quiz Registry** - Add metadata to `QUIZ_REGISTRY`
2. **Implement Logic Handler** - Add quiz-specific matching logic
3. **Add Test Cases** - Include scenarios in test file
4. **Update Documentation** - Document new quiz behavior
5. **Test Integration** - Verify with existing quizzes

## License

This system is part of the Shikshanam platform and follows the same licensing terms.
