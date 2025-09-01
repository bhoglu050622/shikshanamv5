import { CollectionConfig } from 'payload/types';

export const Courses: CollectionConfig = {
  slug: 'courses',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'price', 'enrollmentCount', 'updatedAt'],
    group: 'Courses',
    preview: (doc) => {
      return `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/courses/${doc.slug}`;
    },
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
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            }
            return value;
          },
        ],
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
        {
          label: 'Coming Soon',
          value: 'coming-soon',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'shortDescription',
      type: 'text',
      required: true,
      maxLength: 160,
    },
    {
      name: 'content',
      type: 'richText',
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
          label: 'Masterclass',
          value: 'masterclass',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'level',
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
        {
          label: 'All Levels',
          value: 'all-levels',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'duration',
      type: 'group',
      fields: [
        {
          name: 'hours',
          type: 'number',
          required: true,
          defaultValue: 0,
        },
        {
          name: 'minutes',
          type: 'number',
          required: true,
          defaultValue: 0,
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'lessons',
      type: 'array',
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
          name: 'duration',
          type: 'number', // in minutes
          required: false,
        },
        {
          name: 'videoUrl',
          type: 'text',
          required: false,
        },
        {
          name: 'content',
          type: 'richText',
          required: false,
        },
        {
          name: 'resources',
          type: 'array',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              required: true,
            },
            {
              name: 'type',
              type: 'select',
              options: [
                { label: 'PDF', value: 'pdf' },
                { label: 'Video', value: 'video' },
                { label: 'Audio', value: 'audio' },
                { label: 'Link', value: 'link' },
              ],
            },
          ],
        },
        {
          name: 'quiz',
          type: 'relationship',
          relationTo: 'quizzes',
          required: false,
        },
      ],
      admin: {
        description: 'Add lessons to this course',
      },
    },
    {
      name: 'pricing',
      type: 'group',
      fields: [
        {
          name: 'price',
          type: 'number',
          required: true,
          defaultValue: 0,
          admin: {
            description: 'Price in USD',
          },
        },
        {
          name: 'originalPrice',
          type: 'number',
          required: false,
          admin: {
            description: 'Original price for discount display',
          },
        },
        {
          name: 'currency',
          type: 'select',
          options: [
            { label: 'USD', value: 'USD' },
            { label: 'INR', value: 'INR' },
            { label: 'EUR', value: 'EUR' },
          ],
          defaultValue: 'USD',
        },
        {
          name: 'discountPercentage',
          type: 'number',
          required: false,
          min: 0,
          max: 100,
        },
        {
          name: 'isFree',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'paymentPlan',
          type: 'select',
          options: [
            { label: 'One-time', value: 'one-time' },
            { label: 'Monthly', value: 'monthly' },
            { label: 'Yearly', value: 'yearly' },
          ],
          defaultValue: 'one-time',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'enrollment',
      type: 'group',
      fields: [
        {
          name: 'maxStudents',
          type: 'number',
          required: false,
          admin: {
            description: 'Leave empty for unlimited',
          },
        },
        {
          name: 'currentEnrollment',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'enrollmentDeadline',
          type: 'date',
          required: false,
        },
        {
          name: 'startDate',
          type: 'date',
          required: false,
        },
        {
          name: 'endDate',
          type: 'date',
          required: false,
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'instructor',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'prerequisites',
      type: 'array',
      fields: [
        {
          name: 'prerequisite',
          type: 'text',
          required: true,
        },
      ],
      required: false,
    },
    {
      name: 'learningOutcomes',
      type: 'array',
      fields: [
        {
          name: 'outcome',
          type: 'text',
          required: true,
        },
      ],
      required: false,
    },
    {
      name: 'certificate',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'template',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
        {
          name: 'criteria',
          type: 'select',
          options: [
            { label: 'Complete all lessons', value: 'complete-all' },
            { label: 'Pass all quizzes', value: 'pass-quizzes' },
            { label: 'Complete 80% of course', value: 'complete-80' },
          ],
          defaultValue: 'complete-all',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'reviews',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'rating',
      type: 'group',
      fields: [
        {
          name: 'average',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'count',
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
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'settings',
      type: 'group',
      fields: [
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'allowEnrollment',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'showProgress',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'allowReviews',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'requireApproval',
          type: 'checkbox',
          defaultValue: false,
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
        // Set publishedAt when status changes to published
        if (data.status === 'published' && !data.publishedAt) {
          data.publishedAt = new Date().toISOString();
        }
        
        // Calculate total duration from lessons
        if (data.lessons && data.lessons.length > 0) {
          const totalMinutes = data.lessons.reduce((total, lesson) => {
            return total + (lesson.duration || 0);
          }, 0);
          
          data.duration = {
            hours: Math.floor(totalMinutes / 60),
            minutes: totalMinutes % 60,
          };
        }
        
        return data;
      },
    ],
  },
};
