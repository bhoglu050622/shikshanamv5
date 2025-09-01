import { CollectionConfig } from 'payload/types';

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
    group: 'Content',
    preview: (doc) => {
      return `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/preview/${doc.slug}`;
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
      name: 'template',
      type: 'select',
      required: true,
      defaultValue: 'default',
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Home',
          value: 'home',
        },
        {
          label: 'About',
          value: 'about',
        },
        {
          label: 'Course',
          value: 'course',
        },
        {
          label: 'Contact',
          value: 'contact',
        },
        {
          label: 'Landing',
          value: 'landing',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'layout',
      type: 'select',
      required: true,
      defaultValue: 'default',
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Full Width',
          value: 'full-width',
        },
        {
          label: 'Sidebar',
          value: 'sidebar',
        },
        {
          label: 'Centered',
          value: 'centered',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: false,
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
        {
          name: 'ogTitle',
          type: 'text',
          required: false,
        },
        {
          name: 'ogDescription',
          type: 'textarea',
          required: false,
        },
        {
          name: 'twitterCard',
          type: 'select',
          options: [
            { label: 'Summary', value: 'summary' },
            { label: 'Summary Large Image', value: 'summary_large_image' },
          ],
          defaultValue: 'summary',
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
          name: 'hideFromNavigation',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'hideFromSitemap',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'redirectUrl',
          type: 'text',
          required: false,
        },
        {
          name: 'redirectType',
          type: 'select',
          options: [
            { label: '301 Permanent', value: '301' },
            { label: '302 Temporary', value: '302' },
          ],
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
        // Set publishedAt when status changes to published
        if (data.status === 'published' && !data.publishedAt) {
          data.publishedAt = new Date().toISOString();
        }
        return data;
      },
    ],
  },
};
