import { CollectionConfig } from 'payload/types';

export const Bundles: CollectionConfig = {
  slug: 'bundles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'price', 'courseCount', 'updatedAt'],
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
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
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
      name: 'courses',
      type: 'relationship',
      relationTo: 'courses',
      hasMany: true,
      required: true,
      admin: {
        description: 'Select courses to include in this bundle',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Sanskrit Bundle',
          value: 'sanskrit-bundle',
        },
        {
          label: 'Vedanta Bundle',
          value: 'vedanta-bundle',
        },
        {
          label: 'Yoga Bundle',
          value: 'yoga-bundle',
        },
        {
          label: 'Meditation Bundle',
          value: 'meditation-bundle',
        },
        {
          label: 'Complete Learning Path',
          value: 'complete-path',
        },
        {
          label: 'Starter Pack',
          value: 'starter-pack',
        },
        {
          label: 'Advanced Pack',
          value: 'advanced-pack',
        },
        {
          label: 'Custom Bundle',
          value: 'custom-bundle',
        },
      ],
      admin: {
        position: 'sidebar',
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
            description: 'Bundle price in USD',
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
          name: 'savings',
          type: 'number',
          required: false,
          admin: {
            description: 'Amount saved compared to individual course prices',
            readOnly: true,
          },
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
        {
          name: 'installments',
          type: 'number',
          required: false,
          min: 2,
          max: 12,
          admin: {
            description: 'Number of installments for payment plan',
          },
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'features',
      type: 'array',
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: false,
        },
        {
          name: 'icon',
          type: 'text',
          required: false,
        },
      ],
      required: false,
    },
    {
      name: 'benefits',
      type: 'array',
      fields: [
        {
          name: 'benefit',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: false,
        },
      ],
      required: false,
    },
    {
      name: 'requirements',
      type: 'array',
      fields: [
        {
          name: 'requirement',
          type: 'text',
          required: true,
        },
      ],
      required: false,
    },
    {
      name: 'targetAudience',
      type: 'array',
      fields: [
        {
          name: 'audience',
          type: 'text',
          required: true,
        },
      ],
      required: false,
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
            { label: 'Complete all courses', value: 'complete-all' },
            { label: 'Complete 80% of courses', value: 'complete-80' },
            { label: 'Pass all quizzes', value: 'pass-quizzes' },
          ],
          defaultValue: 'complete-all',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'support',
      type: 'group',
      fields: [
        {
          name: 'communityAccess',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'liveSessions',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'oneOnOneSupport',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'emailSupport',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'supportDuration',
          type: 'select',
          options: [
            { label: 'Lifetime', value: 'lifetime' },
            { label: '1 Year', value: '1-year' },
            { label: '6 Months', value: '6-months' },
            { label: '3 Months', value: '3-months' },
          ],
          defaultValue: 'lifetime',
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
          name: 'views',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'conversions',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'conversionRate',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'revenue',
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
        {
          name: 'limitedTime',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'exclusive',
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
        
        // Calculate course count
        if (data.courses) {
          data.courseCount = data.courses.length;
        }
        
        // Calculate savings if original price is provided
        if (data.pricing?.originalPrice && data.pricing?.price) {
          data.pricing.savings = data.pricing.originalPrice - data.pricing.price;
        }
        
        return data;
      },
    ],
  },
};
