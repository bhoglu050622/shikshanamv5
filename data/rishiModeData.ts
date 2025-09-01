export interface RishiProfile {
  darshana: string
  chakra: string
  archetype: string
  description: string
  recommendedCourses: string[]
  color: string
  characteristics: string[]
  practices: string[]
  guna: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: {
    text: string
    value: string
    guna?: string
  }[]
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'When faced with a complex problem, I prefer to:',
    options: [
      { text: 'Analyze it systematically with logic', value: 'nyaya', guna: 'sattva' },
      { text: 'Meditate on it to find inner wisdom', value: 'vedanta', guna: 'sattva' },
      { text: 'Take disciplined action step by step', value: 'yoga', guna: 'rajas' },
      { text: 'Observe patterns in nature and life', value: 'sankhya', guna: 'sattva' }
    ]
  },
  {
    id: '2',
    question: 'My primary goal in life is to:',
    options: [
      { text: 'Understand the nature of reality through reason', value: 'nyaya', guna: 'sattva' },
      { text: 'Realize my true self and achieve liberation', value: 'vedanta', guna: 'sattva' },
      { text: 'Master my mind and achieve self-discipline', value: 'yoga', guna: 'rajas' },
      { text: 'Live in harmony with natural laws', value: 'vaisheshika', guna: 'sattva' }
    ]
  },
  {
    id: '3',
    question: 'I feel most fulfilled when:',
    options: [
      { text: 'Solving intellectual puzzles and debates', value: 'nyaya', guna: 'rajas' },
      { text: 'Experiencing moments of deep inner peace', value: 'vedanta', guna: 'sattva' },
      { text: 'Achieving mastery over my body and mind', value: 'yoga', guna: 'rajas' },
      { text: 'Understanding the material world around me', value: 'vaisheshika', guna: 'rajas' }
    ]
  },
  {
    id: '4',
    question: 'My learning style is:',
    options: [
      { text: 'Logical and analytical', value: 'nyaya', guna: 'sattva' },
      { text: 'Intuitive and contemplative', value: 'vedanta', guna: 'sattva' },
      { text: 'Practical and experiential', value: 'yoga', guna: 'rajas' },
      { text: 'Observational and systematic', value: 'sankhya', guna: 'sattva' }
    ]
  },
  {
    id: '5',
    question: 'I believe the path to wisdom comes through:',
    options: [
      { text: 'Critical thinking and logical reasoning', value: 'nyaya', guna: 'sattva' },
      { text: 'Direct experience of consciousness', value: 'vedanta', guna: 'sattva' },
      { text: 'Systematic practice and discipline', value: 'yoga', guna: 'rajas' },
      { text: 'Understanding the elements of nature', value: 'vaisheshika', guna: 'sattva' }
    ]
  }
]

export const rishiProfiles: Record<string, RishiProfile> = {
  nyaya: {
    darshana: 'Nyaya',
    chakra: 'Ajna (Third Eye)',
    archetype: 'The Logical Sage',
    description: 'You are drawn to systematic analysis and logical reasoning. Your path is one of intellectual clarity and precise understanding.',
    recommendedCourses: ['Logic & Critical Thinking through Nyaya', 'Sanskrit for Beginners', 'Vedanta Philosophy'],
    color: 'from-blue-500 to-indigo-600',
    characteristics: ['Analytical thinking', 'Logical reasoning', 'Debate and discussion', 'Systematic approach'],
    practices: ['Meditation on logic', 'Study of Nyaya Sutras', 'Critical analysis', 'Philosophical debates'],
    guna: 'sattva'
  },
  vedanta: {
    darshana: 'Vedanta',
    chakra: 'Sahasrara (Crown)',
    archetype: 'The Unity Seeker',
    description: 'You seek the ultimate truth and unity of all existence. Your path leads to self-realization and liberation.',
    recommendedCourses: ['Advaita Upanishad Studies', 'Isha Upanishad: Essence of Oneness', 'Vedanta Philosophy'],
    color: 'from-purple-500 to-violet-600',
    characteristics: ['Spiritual seeking', 'Unity consciousness', 'Inner peace', 'Transcendental awareness'],
    practices: ['Advaita meditation', 'Upanishad study', 'Self-inquiry', 'Contemplation'],
    guna: 'sattva'
  },
  yoga: {
    darshana: 'Yoga',
    chakra: 'Manipura (Solar Plexus)',
    archetype: 'The Disciplined Practitioner',
    description: 'You value systematic practice and self-discipline. Your path is one of gradual mastery over body and mind.',
    recommendedCourses: ['Yoga Darshan: Complete Journey', 'Daily Yogic Practices', 'Yoga Darshan: Beyond Physical Practice'],
    color: 'from-orange-500 to-red-600',
    characteristics: ['Self-discipline', 'Systematic practice', 'Mind-body awareness', 'Progressive mastery'],
    practices: ['Ashtanga Yoga', 'Pranayama', 'Meditation', 'Physical asanas'],
    guna: 'rajas'
  },
  sankhya: {
    darshana: 'Sankhya',
    chakra: 'Svadhisthana (Sacral)',
    archetype: 'The Analytical Observer',
    description: 'You observe patterns and understand the dualistic nature of reality. Your path is one of discrimination and wisdom.',
    recommendedCourses: ['Sanskrit for Beginners', 'Vedanta Philosophy', 'Yoga Darshan: Beyond Physical Practice'],
    color: 'from-green-500 to-teal-600',
    characteristics: ['Pattern recognition', 'Dualistic understanding', 'Observational wisdom', 'Discrimination'],
    practices: ['Sankhya meditation', 'Pattern observation', 'Discrimination practice', 'Wisdom cultivation'],
    guna: 'sattva'
  },
  vaisheshika: {
    darshana: 'Vaisheshika',
    chakra: 'Muladhara (Root)',
    archetype: 'The Natural Philosopher',
    description: 'You seek to understand the material world and its fundamental elements. Your path is one of systematic observation.',
    recommendedCourses: ['Sanskrit for Beginners', 'Vedanta Philosophy', 'Yoga Darshan: Beyond Physical Practice'],
    color: 'from-yellow-500 to-orange-600',
    characteristics: ['Material understanding', 'Elemental awareness', 'Systematic observation', 'Natural wisdom'],
    practices: ['Element meditation', 'Nature observation', 'Material study', 'Systematic analysis'],
    guna: 'sattva'
  }
}

export const gunaDescriptions = {
  sattva: {
    name: 'Sattva',
    description: 'The quality of purity, wisdom, and harmony',
    characteristics: ['Clarity', 'Wisdom', 'Peace', 'Harmony', 'Balance']
  },
  rajas: {
    name: 'Rajas',
    description: 'The quality of activity, passion, and energy',
    characteristics: ['Action', 'Passion', 'Energy', 'Movement', 'Transformation']
  },
  tamas: {
    name: 'Tamas',
    description: 'The quality of inertia, darkness, and stability',
    characteristics: ['Stability', 'Grounding', 'Rest', 'Protection', 'Endurance']
  }
}

export const chakraInfo = {
  'Muladhara (Root)': {
    element: 'Earth',
    color: 'Red',
    focus: 'Survival, grounding, stability'
  },
  'Svadhisthana (Sacral)': {
    element: 'Water',
    color: 'Orange',
    focus: 'Creativity, emotions, relationships'
  },
  'Manipura (Solar Plexus)': {
    element: 'Fire',
    color: 'Yellow',
    focus: 'Power, will, transformation'
  },
  'Ajna (Third Eye)': {
    element: 'Light',
    color: 'Indigo',
    focus: 'Intuition, wisdom, insight'
  },
  'Sahasrara (Crown)': {
    element: 'Consciousness',
    color: 'Violet/White',
    focus: 'Spirituality, unity, enlightenment'
  }
}
