import { CollectionConfig } from 'payload/types';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    verify: {
      generateEmailHTML: ({ token, user }) => {
        return `
          <h1>Verify your email</h1>
          <p>Please click the link below to verify your email:</p>
          <a href="${process.env.PAYLOAD_PUBLIC_SERVER_URL}/verify-email?token=${token}">
            Verify Email
          </a>
        `;
      },
    },
    forgotPassword: {
      generateEmailHTML: ({ token, user }) => {
        return `
          <h1>Reset your password</h1>
          <p>Please click the link below to reset your password:</p>
          <a href="${process.env.PAYLOAD_PUBLIC_SERVER_URL}/reset-password?token=${token}">
            Reset Password
          </a>
        `;
      },
    },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Admin',
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true;
      return {
        id: {
          equals: user?.id,
        },
      };
    },
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => {
      if (user?.role === 'admin') return true;
      return {
        id: {
          equals: user?.id,
        },
      };
    },
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
      unique: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
        {
          label: 'Author',
          value: 'author',
        },
      ],
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'bio',
      type: 'textarea',
      required: false,
    },
    {
      name: 'permissions',
      type: 'group',
      fields: [
        {
          name: 'canPublish',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'canDelete',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'canManageUsers',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'canManageSettings',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        // Set default permissions based on role
        if (data.role === 'admin') {
          data.permissions = {
            canPublish: true,
            canDelete: true,
            canManageUsers: true,
            canManageSettings: true,
          };
        } else if (data.role === 'editor') {
          data.permissions = {
            canPublish: true,
            canDelete: false,
            canManageUsers: false,
            canManageSettings: false,
          };
        } else if (data.role === 'author') {
          data.permissions = {
            canPublish: false,
            canDelete: false,
            canManageUsers: false,
            canManageSettings: false,
          };
        }
        return data;
      },
    ],
  },
};
