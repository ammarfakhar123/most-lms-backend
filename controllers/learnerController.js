const Task = require('../models/Task');
const User = require('../models/User');
const { uploadToSupabase } = require('../middleware/upload');
const { createNotification } = require('./notificationController');

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ learner: req.user._id })
      .populate('accessor', 'username')
      .select('title description status resourceFiles submission feedback createdAt accessor learner');
    
    console.log('Learner tasks query result:');
    tasks.forEach(task => {
      console.log(`Task: ${task.title}, ResourceFiles: ${task.resourceFiles ? task.resourceFiles.length : 'undefined'} files`);
      if (task.resourceFiles && task.resourceFiles.length > 0) {
        console.log('  Files:', task.resourceFiles);
      }
    });
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const submitTask = async (req, res) => {
  try {
    const { content } = req.body;
    const task = await Task.findOne({ _id: req.params.id, learner: req.user._id });
    
    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (task.status !== 'assigned' && task.status !== 'accessor_fail') {
      return res.status(400).json({ error: 'Task cannot be submitted' });
    }

    const files = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const result = await uploadToSupabase(file);
          files.push(result.url);
        } catch (error) {
          console.error('Upload failed:', error.message);
          files.push(`[${file.originalname}]`);
        }
      }
    }
    
    task.submission = { content, files, submittedAt: new Date() };
    task.status = 'submitted';
    await task.save();
    
    // Create notification for accessor
    await createNotification(
      task.accessor,
      'New Task Submission',
      `${req.user.username} has submitted "${task.title}" for review`,
      'task_submitted',
      task._id
    );
    
    res.json({ message: 'Task submitted successfully', task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLoginAttempts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('loginAttempts');
    res.json(user.loginAttempts || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePersonalDetails = async (req, res) => {
  try {
    const { name, phone, dateOfBirth, ethnicity } = req.body;
    const user = await User.findById(req.user._id);
    
    user.personalDetails = {
      ...user.personalDetails,
      name,
      phone,
      dateOfBirth,
      ethnicity
    };
    
    await user.save();
    res.json({ message: 'Personal details updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPersonalDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('personalDetails username email userId');
    res.json({
      userId: user.userId,
      username: user.username,
      email: user.email,
      ...user.personalDetails
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getResources = async (req, res) => {
  try {
    const tasks = await Task.find({ learner: req.user._id, resourceFiles: { $exists: true, $ne: [] } })
      .select('title description resourceFiles createdAt course')
      .populate('course', 'title code')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getTasks, submitTask, getLoginAttempts, updatePersonalDetails, getPersonalDetails, getResources };