require('dotenv').config();
const { sequelize } = require('./models');
const User = require('./models/User');

async function createAdmin() {
  try {
    // Sync database
    await sequelize.sync();
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      where: { role: 'admin' } 
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists:');
      console.log('Username:', existingAdmin.username);
      console.log('Email:', existingAdmin.email);
      console.log('User ID:', existingAdmin.userId);
      console.log('\nTo create a new admin, delete the existing one first.');
      process.exit(0);
    }
    
    // Create admin user
    const admin = await User.create({
      username: 'admin',
      email: 'admin@lms.com',
      password: 'admin123',
      role: 'admin',
      name: 'System Administrator'
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('📝 Login Details:');
    console.log('Username:', admin.username);
    console.log('Email:', admin.email);
    console.log('Password: admin123');
    console.log('User ID:', admin.userId);
    console.log('Role:', admin.role);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
}

createAdmin();
