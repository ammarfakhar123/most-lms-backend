require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function createAllUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');
    
    const users = [
      {
        username: 'admin@lms.com',
        email: 'admin@lms.com',
        password: 'password123',
        role: 'admin',
        personalDetails: {
          name: 'System Administrator',
          registrationDate: '2025-01-01'
        }
      },
      {
        username: 'hashim.yaqub@gmail.com',
        email: 'hashim.yaqub@gmail.com',
        password: 'password123',
        role: 'learner',
        personalDetails: {
          name: 'Hashim Yaqoob',
          phone: '00923365555683',
          dateOfBirth: '1983-01-25',
          ethnicity: 'Pakistan',
          registrationDate: '18/03/2025'
        }
      },
      {
        username: 'accessor@lms.com',
        email: 'accessor@lms.com',
        password: 'password123',
        role: 'accessor',
        personalDetails: {
          name: 'Dr. Sarah Johnson',
          registrationDate: '2025-01-15'
        }
      },
      {
        username: 'iqa@lms.com',
        email: 'iqa@lms.com',
        password: 'password123',
        role: 'iqa',
        personalDetails: {
          name: 'Prof. Michael Smith',
          registrationDate: '2025-01-10'
        }
      },
      {
        username: 'eqa@lms.com',
        email: 'eqa@lms.com',
        password: 'password123',
        role: 'eqa',
        personalDetails: {
          name: 'Board Representative',
          registrationDate: '2025-01-05'
        }
      }
    ];
    
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${userData.username} (${userData.role})`);
    }
    
    console.log('\nAll users created successfully!');
    console.log('Password for all users: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createAllUsers();