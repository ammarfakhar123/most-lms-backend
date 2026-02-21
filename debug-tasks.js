require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/Task');

const debugTasks = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find().select('username email role');
    console.log('\n=== ALL USERS ===');
    users.forEach(user => {
      console.log(`${user.role.toUpperCase()}: ${user.username} (${user._id})`);
    });

    // Get all tasks
    const tasks = await Task.find().populate('learner accessor', 'username role');
    console.log('\n=== ALL TASKS ===');
    tasks.forEach(task => {
      console.log(`Task: ${task.title}`);
      console.log(`  Learner: ${task.learner?.username} (${task.learner?._id})`);
      console.log(`  Accessor: ${task.accessor?.username} (${task.accessor?._id})`);
      console.log(`  Status: ${task.status}`);
      console.log('---');
    });

    // Check specific learner tasks
    const learner = await User.findOne({ username: 'learner1' });
    if (learner) {
      const learnerTasks = await Task.find({ learner: learner._id });
      console.log(`\n=== TASKS FOR ${learner.username} ===`);
      console.log(`Found ${learnerTasks.length} tasks`);
      learnerTasks.forEach(task => {
        console.log(`- ${task.title} (${task.status})`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

debugTasks();