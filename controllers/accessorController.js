const Task = require('../models/Task');

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ accessor: req.user._id })
      .populate('learner', 'username email userId')
      .select('title description status resourceFiles submission feedback createdAt learner');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSubmittedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ accessor: req.user._id, status: 'submitted' })
      .populate('learner', 'username email userId')
      .select('title description status resourceFiles submission feedback createdAt learner');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const assessTask = async (req, res) => {
  try {
    const { result, feedback } = req.body;
    const task = await Task.findOne({ _id: req.params.id, accessor: req.user._id }).populate('learner', 'username');
    
    if (!task || (task.status !== 'submitted' && task.status !== 'accessor_fail')) {
      return res.status(404).json({ error: 'Task not found or not ready for assessment' });
    }

    task.status = result === 'pass' ? 'accessor_pass' : 'accessor_fail';
    task.feedback.accessor = feedback;
    task.assessedAt.accessor = new Date();
    await task.save();
    
    // Create notification for learner
    const { createNotification } = require('./notificationController');
    const notificationTitle = result === 'pass' ? 'Assessment Passed!' : 'Assessment Needs Revision';
    const notificationMessage = result === 'pass' 
      ? `Congratulations! Your submission for "${task.title}" has been approved by your assessor.`
      : `Your submission for "${task.title}" needs revision. Please check the feedback and resubmit.`;
    
    await createNotification(
      task.learner._id,
      notificationTitle,
      notificationMessage,
      'task_reviewed',
      task._id
    );
    
    res.json({ message: 'Task assessed successfully', task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMyAssessments = async (req, res) => {
  try {
    const tasks = await Task.find({ 
      accessor: req.user._id, 
      status: { $in: ['accessor_pass', 'accessor_fail', 'iqa_pass', 'iqa_fail', 'completed', 'eqa_fail'] }
    })
      .populate('learner', 'username userId')
      .select('title description status feedback assessedAt learner createdAt');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getTasks, getSubmittedTasks, assessTask, getMyAssessments };