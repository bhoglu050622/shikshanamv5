import { CollectionConfig } from 'payload/types';

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: '../public/media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'desktop',
        width: 1920,
        height: undefined,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
  },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
    group: 'Content',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      required: false,
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
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
      name: 'category',
      type: 'select',
      options: [
        {
          label: 'Hero Images',
          value: 'hero',
        },
        {
          label: 'Course Images',
          value: 'course',
        },
        {
          label: 'Testimonial Images',
          value: 'testimonial',
        },
        {
          label: 'Gallery Images',
          value: 'gallery',
        },
        {
          label: 'Background Images',
          value: 'background',
        },
        {
          label: 'Icons',
          value: 'icon',
        },
        {
          label: 'Videos',
          value: 'video',
        },
        {
          label: 'Documents',
          value: 'document',
        },
      ],
      required: false,
    },
    {
      name: 'metadata',
      type: 'group',
      fields: [
        {
          name: 'width',
          type: 'number',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'height',
          type: 'number',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'fileSize',
          type: 'number',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'mimeType',
          type: 'text',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'usage',
      type: 'relationship',
      relationTo: ['pages', 'courses', 'testimonials'],
      hasMany: true,
      admin: {
        readOnly: true,
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        // Update usage tracking when media is used
        if (operation === 'create') {
          // Handle new media creation
        }
      },
    ],
  },
};
