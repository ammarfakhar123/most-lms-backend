const User = require('../models/User');
const Task = require('../models/Task');
const Course = require('../models/Course');
const { createNotification } = require('./notificationController');

const createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const user = await User.create({ username, email, password, role, createdBy: req.user.id });
    res.status(201).json({ message: 'User created', user: { id: user.id, userId: user.userId, username, email, role } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { username, email, role, password } = req.body;
    const updateData = { username, email, role };
    
    if (password) {
      updateData.password = password;
    }
    
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    await user.update(updateData);
    
    const userResponse = user.toJSON();
    delete userResponse.password;
    res.json({ message: 'User updated', user: userResponse });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCourse = async (req, res) => {
  try {
    const { title, description, code } = req.body;
    const course = new Course({ title, description, code, createdBy: req.user._id });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('createdBy', 'username');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, courseId, learnerId, accessorId } = req.body;
    
    if (!title || !description || !courseId || !learnerId) {
      return res.status(400).json({ error: 'Title, description, course, and learner are required' });
    }
    
    const files = [];
    if (req.files && req.files.length > 0) {
      const { uploadToSupabase } = require('../middleware/upload');
      for (const file of req.files) {
        try {
          const result = await uploadToSupabase(file, 'task-resources');
          files.push(result.url);
        } catch (error) {
          console.error('Upload failed:', error.message);
        }
      }
    }
    
    const task = new Task({ 
      title, 
      description,
      course: courseId,
      learner: learnerId, 
      accessor: accessorId,
      resourceFiles: files
    });
    await task.save();
    
    await createNotification(
      learnerId,
      'New Task Assigned',
      `You have been assigned a new task: "${title}"`,
      'task_assigned',
      task._id
    );
    
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('learner accessor', 'username email userId')
      .populate('course', 'title code');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, description, learnerId, accessorId } = req.body;
    
    const updateData = { title, description, learner: learnerId, accessor: accessorId };
    
    if (req.files && req.files.length > 0) {
      const { uploadToSupabase } = require('../middleware/upload');
      const files = [];
      for (const file of req.files) {
        try {
          const result = await uploadToSupabase(file, 'task-resources');
          files.push(result.url);
        } catch (error) {
          console.error('Upload failed:', error.message);
        }
      }
      updateData.resourceFiles = files;
    }
    
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('learner accessor', 'username email');
    
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task updated', task });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(400).json({ error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    
    // Delete related notifications
    const Notification = require('../models/Notification');
    await Notification.deleteMany({ relatedTask: req.params.id });
    
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const Course = require('../models/Course');
    const Notification = require('../models/Notification');
    
    // Find all tasks in this course
    const tasks = await Task.find({ course: req.params.id });
    const taskIds = tasks.map(task => task._id);
    
    // Delete notifications related to these tasks
    await Notification.deleteMany({ relatedTask: { $in: taskIds } });
    
    // Delete tasks in this course
    await Task.deleteMany({ course: req.params.id });
    
    // Delete the course
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    
    res.json({ message: 'Course and related tasks deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createUser, getUsers, updateUser, deleteUser, createCourse, getCourses, deleteCourse, createTask, getTasks, updateTask, deleteTask };