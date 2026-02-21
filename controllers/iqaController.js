const Task = require('../models/Task');
const Notification = require('../models/Notification');

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ status: 'accessor_pass' })
      .populate('learner', 'username userId')
      .populate('accessor', 'username');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const reviewTask = async (req, res) => {
  try {
    const { result, feedback } = req.body;
    const task = await Task.findOne({ _id: req.params.id, status: 'accessor_pass' })
      .populate('learner', 'username userId');
    
    if (!task) return res.status(404).json({ error: 'Task not found or not ready for IQA review' });

    task.status = result === 'pass' ? 'iqa_pass' : 'iqa_fail';
    task.feedback.iqa = feedback;
    task.assessedAt.iqa = new Date();
    task.iqa = req.user._id;
    await task.save();
    
    // Create notification if task failed
    if (result === 'fail') {
      await Notification.create({
        recipient: task.learner._id,
        title: 'Task Failed - IQA Review',
        message: `Your task "${task.title}" has failed the IQA review. Feedback: ${feedback}`,
        type: 'task_reviewed',
        relatedTask: task._id
      });
    }
    
    res.json({ message: 'Task reviewed successfully', task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getTasks, reviewTask };