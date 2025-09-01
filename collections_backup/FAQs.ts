import { CollectionConfig } from 'payload/types';

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'status', 'order', 'updatedAt'],
    group: 'Content',
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
      name: 'question',
      type: 'text',
      required: true,
    },
    {
      name: 'answer',
      type: 'richText',
      required: true,
    },
    {
      name: 'shortAnswer',
      type: 'text',
      required: false,
      maxLength: 200,
      admin: {
        description: 'Short version for previews and search results',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        {
          label: 'General',
          value: 'general',
        },
        {
          label: 'Courses',
          value: 'courses',
        },
        {
          label: 'Enrollment',
          value: 'enrollment',
        },
        {
          label: 'Payment',
          value: 'payment',
        },
        {
          label: 'Technical',
          value: 'technical',
        },
        {
          label: 'Account',
          value: 'account',
        },
        {
          label: 'Certificates',
          value: 'certificates',
        },
        {
          label: 'Support',
          value: 'support',
        },
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
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'subcategory',
      type: 'text',
      required: false,
      admin: {
        position: 'sidebar',
        description: 'Optional subcategory for better organization',
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
      name: 'order',
      type: 'number',
      required: false,
      admin: {
        position: 'sidebar',
        description: 'Order within category (lower numbers appear first)',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
      required: false,
    },
    {
      name: 'relatedFAQs',
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
      required: false,
      admin: {
        position: 'sidebar',
        description: 'Related FAQs to suggest to users',
      },
    },
    {
      name: 'relatedCourses',
      type: 'relationship',
      relationTo: 'courses',
      hasMany: true,
      required: false,
      admin: {
        position: 'sidebar',
        description: 'Related courses to suggest',
      },
    },
    {
      name: 'helpful',
      type: 'group',
      fields: [
        {
          name: 'yes',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'no',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'total',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'percentage',
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
          name: 'searches',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'clicks',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'lastViewed',
          type: 'date',
          admin: {
            readOnly: true,
            date: {
              pickerAppearance: 'dayAndTime',
            },
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
    {
      name: 'settings',
      type: 'group',
      fields: [
        {
          name: 'allowComments',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'allowRating',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'showInSearch',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'showInSitemap',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'autoExpand',
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
        // Calculate helpful percentage
        if (data.helpful) {
          const total = (data.helpful.yes || 0) + (data.helpful.no || 0);
          data.helpful.total = total;
          data.helpful.percentage = total > 0 ? Math.round((data.helpful.yes / total) * 100) : 0;
        }
        
        return data;
      },
    ],
  },
};
