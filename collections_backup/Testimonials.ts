import { CollectionConfig } from 'payload/types';

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'rating', 'status', 'course', 'createdAt'],
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
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'title',
      type: 'text',
      required: false,
      admin: {
        description: 'Professional title or role',
      },
    },
    {
      name: 'company',
      type: 'text',
      required: false,
    },
    {
      name: 'location',
      type: 'text',
      required: false,
    },
    {
      name: 'rating',
      type: 'select',
      required: true,
      options: [
        {
          label: '5 Stars',
          value: 5,
        },
        {
          label: '4 Stars',
          value: 4,
        },
        {
          label: '3 Stars',
          value: 3,
        },
        {
          label: '2 Stars',
          value: 2,
        },
        {
          label: '1 Star',
          value: 1,
        },
      ],
      defaultValue: 5,
    },
    {
      name: 'testimonial',
      type: 'textarea',
      required: true,
      maxLength: 1000,
    },
    {
      name: 'shortTestimonial',
      type: 'text',
      required: false,
      maxLength: 200,
      admin: {
        description: 'Short version for cards and previews',
      },
    },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: false,
      admin: {
        description: 'Course this testimonial is for (if applicable)',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: false,
      options: [
        {
          label: 'Course Review',
          value: 'course-review',
        },
        {
          label: 'General Feedback',
          value: 'general-feedback',
        },
        {
          label: 'Success Story',
          value: 'success-story',
        },
        {
          label: 'Student Testimonial',
          value: 'student-testimonial',
        },
        {
          label: 'Instructor Review',
          value: 'instructor-review',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Approved',
          value: 'approved',
        },
        {
          label: 'Rejected',
          value: 'rejected',
        },
        {
          label: 'Featured',
          value: 'featured',
        },
      ],
      admin: {
        position: 'sidebar',
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
      name: 'approvedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'approvedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        readOnly: true,
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
      name: 'socialProof',
      type: 'group',
      fields: [
        {
          name: 'verified',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'verifiedAt',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'verifiedBy',
          type: 'relationship',
          relationTo: 'users',
        },
        {
          name: 'purchaseVerified',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'courseCompleted',
          type: 'checkbox',
          defaultValue: false,
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
          name: 'likes',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'shares',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'helpful',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'notHelpful',
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
      name: 'settings',
      type: 'group',
      fields: [
        {
          name: 'allowPublicDisplay',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'allowContact',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'anonymous',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'hideEmail',
          type: 'checkbox',
          defaultValue: true,
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
        // Set approvedAt when status changes to approved
        if (data.status === 'approved' && !data.approvedAt) {
          data.approvedAt = new Date().toISOString();
          data.approvedBy = req.user?.id;
        }
        
        // Set featured status based on status field
        if (data.status === 'featured') {
          data.featured = true;
        }
        
        return data;
      },
    ],
  },
};
