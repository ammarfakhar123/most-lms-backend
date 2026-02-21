require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/Task');

const createTestData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find users
    const admin = await User.findOne({ role: 'admin' });
    const learner = await User.findOne({ role: 'learner' });
    const accessor = await User.findOne({ role: 'accessor' });

    if (!admin || !learner || !accessor) {
      console.log('Please create admin, learner, and accessor users first');
      return;
    }

    console.log('Found users:', {
      admin: admin.username,
      learner: learner.username,
      accessor: accessor.username
    });

    // Create test tasks
    const tasks = [
      {
        title: 'Health and Safety Assessment',
        description: 'Complete the health and safety knowledge assessment',
        learner: learner._id,
        accessor: accessor._id,
        status: 'assigned'
      },
      {
        title: 'Risk Assessment Project',
        description: 'Submit a comprehensive risk assessment for your workplace',
        learner: learner._id,
        accessor: accessor._id,
        status: 'submitted',
        submission: {
          content: 'I have completed the risk assessment for my workplace. The main hazards identified include slip and fall risks, electrical hazards, and ergonomic issues. I have provided recommendations for each identified risk.',
          files: [],
          submittedAt: new Date()
        }
      },
      {
        title: 'Emergency Procedures Review',
        description: 'Review and document emergency procedures',
        learner: learner._id,
        accessor: accessor._id,
        status: 'accessor_pass',
        submission: {
          content: 'Emergency procedures have been reviewed and documented according to current regulations.',
          files: [],
          submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
        },
        feedback: {
          accessor: 'Excellent work! All procedures are well documented and compliant.'
        },
        assessedAt: {
          accessor: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
        }
      }
    ];

    // Delete existing tasks for clean test
    await Task.deleteMany({ $or: [{ accessor: accessor._id }, { learner: learner._id }] });

    // Create new tasks
    for (const taskData of tasks) {
      const task = new Task(taskData);
      await task.save();
      console.log(`Created task: ${task.title} (${task.status})`);
    }

    console.log('Test data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating test data:', error);
    process.exit(1);
  }
};

createTestData();