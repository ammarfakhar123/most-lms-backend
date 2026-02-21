require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/Task');

const createTaskForLearner = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find learner1 and accessor1
    const learner = await User.findOne({ username: 'learner1' });
    const accessor = await User.findOne({ username: 'accessor1' });

    if (!learner) {
      console.log('learner1 not found. Available users:');
      const users = await User.find().select('username role');
      users.forEach(u => console.log(`- ${u.username} (${u.role})`));
      return;
    }

    if (!accessor) {
      console.log('accessor1 not found. Available users:');
      const users = await User.find().select('username role');
      users.forEach(u => console.log(`- ${u.username} (${u.role})`));
      return;
    }

    console.log(`Creating task for learner: ${learner.username} (${learner._id})`);
    console.log(`Assigned to accessor: ${accessor.username} (${accessor._id})`);

    // Create the Python assignment task
    const task = new Task({
      title: 'Python Assignment',
      description: 'Complete the Python programming assignment covering basic data structures and algorithms',
      learner: learner._id,
      accessor: accessor._id,
      status: 'assigned'
    });

    await task.save();
    console.log('Task created successfully!');
    console.log(`Task ID: ${task._id}`);

    // Verify the task was created
    const createdTask = await Task.findById(task._id).populate('learner accessor', 'username');
    console.log('\nTask verification:');
    console.log(`- Title: ${createdTask.title}`);
    console.log(`- Learner: ${createdTask.learner.username}`);
    console.log(`- Accessor: ${createdTask.accessor.username}`);
    console.log(`- Status: ${createdTask.status}`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createTaskForLearner();