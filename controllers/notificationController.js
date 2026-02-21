const Notification = require('../models/Notification');

const getNotifications = async (req, res) => {
  try {
    const { filter } = req.query;
    let query = { recipient: req.user._id };
    
    if (filter === 'read') {
      query.read = true;
    } else if (filter === 'unread') {
      query.read = false;
    }
    
    const notifications = await Notification.find(query)
      .populate('relatedTask', 'title')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createNotification = async (recipientId, title, message, type = 'system', relatedTaskId = null) => {
  try {
    const notification = new Notification({
      recipient: recipientId,
      title,
      message,
      type,
      relatedTask: relatedTaskId
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

const clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ recipient: req.user._id });
    res.json({ message: 'All notifications cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead, clearAllNotifications, createNotification };