import { CollectionConfig } from 'payload/types';

export const Quizzes: CollectionConfig = {
  slug: 'quizzes',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'difficulty', 'questionCount', 'updatedAt'],
    group: 'Courses',
  },
  versions: {
    drafts: {
      autosave: {
        interval: 2000,
      },
    },
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Sanskrit',
          value: 'sanskrit',
        },
        {
          label: 'Vedanta',
          value: 'vedanta',
        },
        {
          label: 'Yoga',
          value: 'yoga',
        },
        {
          label: 'Meditation',
          value: 'meditation',
        },
        {
          label: 'Philosophy',
          value: 'philosophy',
        },
        {
          label: 'Spirituality',
          value: 'spirituality',
        },
        {
          label: 'General Knowledge',
          value: 'general',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'difficulty',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Beginner',
          value: 'beginner',
        },
        {
          label: 'Intermediate',
          value: 'intermediate',
        },
        {
          label: 'Advanced',
          value: 'advanced',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Published',
          value: 'published',
        },
        {
          label: 'Archived',
          value: 'archived',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'questions',
      type: 'array',
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            {
              label: 'Multiple Choice',
              value: 'multiple-choice',
            },
            {
              label: 'True/False',
              value: 'true-false',
            },
            {
              label: 'Fill in the Blank',
              value: 'fill-blank',
            },
            {
              label: 'Essay',
              value: 'essay',
            },
          ],
          defaultValue: 'multiple-choice',
        },
        {
          name: 'options',
          type: 'array',
          fields: [
            {
              name: 'option',
              type: 'text',
              required: true,
            },
            {
              name: 'isCorrect',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'explanation',
              type: 'textarea',
              required: false,
            },
          ],
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'multiple-choice',
          },
        },
        {
          name: 'correctAnswer',
          type: 'text',
          required: false,
          admin: {
            condition: (data, siblingData) => 
              siblingData?.type === 'true-false' || 
              siblingData?.type === 'fill-blank',
          },
        },
        {
          name: 'points',
          type: 'number',
          required: true,
          defaultValue: 1,
          min: 1,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
        {
          name: 'hint',
          type: 'text',
          required: false,
        },
        {
          name: 'explanation',
          type: 'richText',
          required: false,
        },
      ],
      required: true,
      minRows: 1,
    },
    {
      name: 'settings',
      type: 'group',
      fields: [
        {
          name: 'timeLimit',
          type: 'number',
          required: false,
          admin: {
            description: 'Time limit in minutes (leave empty for no limit)',
          },
        },
        {
          name: 'passingScore',
          type: 'number',
          required: true,
          defaultValue: 70,
          min: 0,
          max: 100,
        },
        {
          name: 'allowRetakes',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'maxRetakes',
          type: 'number',
          required: false,
          min: 1,
          admin: {
            condition: (data, siblingData) => siblingData?.allowRetakes === true,
          },
        },
        {
          name: 'showResults',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'showCorrectAnswers',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'randomizeQuestions',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'randomizeOptions',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'requireAllQuestions',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'results',
      type: 'array',
      fields: [
        {
          name: 'scoreRange',
          type: 'group',
          fields: [
            {
              name: 'min',
              type: 'number',
              required: true,
              min: 0,
              max: 100,
            },
            {
              name: 'max',
              type: 'number',
              required: true,
              min: 0,
              max: 100,
            },
          ],
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: false,
        },
        {
          name: 'recommendations',
          type: 'array',
          fields: [
            {
              name: 'recommendation',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'courses',
          type: 'relationship',
          relationTo: 'courses',
          hasMany: true,
          required: false,
        },
      ],
      admin: {
        position: 'sidebar',
        description: 'Define result categories based on score ranges',
      },
    },
    {
      name: 'certificate',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'template',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
        {
          name: 'minimumScore',
          type: 'number',
          required: false,
          min: 0,
          max: 100,
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'analytics',
      type: 'group',
      fields: [
        {
          name: 'totalAttempts',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'averageScore',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'passRate',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'completionRate',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: false,
        },
        {
          name: 'description',
          type: 'textarea',
          required: false,
        },
        {
          name: 'keywords',
          type: 'text',
          required: false,
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        // Calculate question count
        if (data.questions) {
          data.questionCount = data.questions.length;
        }
        
        // Calculate total points
        if (data.questions) {
          data.totalPoints = data.questions.reduce((total, question) => {
            return total + (question.points || 1);
          }, 0);
        }
        
        return data;
      },
    ],
  },
};
