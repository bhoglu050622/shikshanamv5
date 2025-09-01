import payload from 'payload';
import config from '../payload.config';

async function initAdmin() {
  try {
    // Initialize Payload
    await payload.init({
      config,
    });

    // Check if admin user already exists
    const existingAdmin = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'admin@shikshanam.com',
        },
      },
    });

    if (existingAdmin.docs.length > 0) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create default admin user
    const adminUser = await payload.create({
      collection: 'users',
      data: {
        name: 'Admin',
        email: 'admin@shikshanam.com',
        password: 'adminadmin',
        role: 'admin',
        permissions: {
          canPublish: true,
          canDelete: true,
          canManageUsers: true,
          canManageSettings: true,
        },
      },
    });

    console.log('✅ Default admin user created successfully!');
    console.log('📧 Email: admin@shikshanam.com');
    console.log('🔑 Password: adminadmin');
    console.log('🔗 Login at: http://localhost:3000/cms');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

initAdmin();
