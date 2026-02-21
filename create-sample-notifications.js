require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Notification = require('./models/Notification');

const createSampleNotifications = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const learner = await User.findOne({ username: 'learner1' });
    if (!learner) {
      console.log('Learner not found');
      return;
    }

    // Create sample notifications
    const notifications = [
      {
        recipient: learner._id,
        title: 'Welcome to LMS',
        message: 'Welcome to the Learning Management System! Start exploring your tasks.',
        type: 'system'
      },
      {
        recipient: learner._id,
        title: 'New Task Assigned',
        message: 'You have been assigned a new task: "Python Assignment"',
        type: 'task_assigned'
      },
      {
        recipient: learner._id,
        title: 'Task Review Complete',
        message: 'Your submission for "Health and Safety Assessment" has been reviewed',
        type: 'task_reviewed'
      }
    ];

    await Notification.insertMany(notifications);
    console.log('Sample notifications created successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createSampleNotifications();