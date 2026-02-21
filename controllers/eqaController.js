const Task = require('../models/Task');

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ status: 'iqa_pass' })
      .populate('learner', 'username userId')
      .populate('accessor iqa', 'username');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const reviewTask = async (req, res) => {
  try {
    const { result, feedback } = req.body;
    const task = await Task.findOne({ _id: req.params.id, status: 'iqa_pass' });
    
    if (!task) return res.status(404).json({ error: 'Task not found or not ready for EQA review' });

    task.status = result === 'pass' ? 'completed' : 'eqa_fail';
    task.feedback.eqa = feedback;
    task.assessedAt.eqa = new Date();
    task.eqa = req.user._id;
    await task.save();
    
    res.json({ message: 'Task reviewed successfully', task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getTasks, reviewTask };