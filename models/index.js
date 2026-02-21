const { sequelize } = require('../config/database');
const User = require('./User');
const Course = require('./Course');
const Task = require('./Task');
const Notification = require('./Notification');

// Define associations
User.hasMany(Course, { foreignKey: 'createdBy', as: 'createdCourses' });
Course.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

User.hasMany(Task, { foreignKey: 'learner', as: 'learnerTasks' });
User.hasMany(Task, { foreignKey: 'accessor', as: 'accessorTasks' });
User.hasMany(Task, { foreignKey: 'iqa', as: 'iqaTasks' });
User.hasMany(Task, { foreignKey: 'eqa', as: 'eqaTasks' });

Task.belongsTo(User, { foreignKey: 'learner', as: 'learnerUser' });
Task.belongsTo(User, { foreignKey: 'accessor', as: 'accessorUser' });
Task.belongsTo(User, { foreignKey: 'iqa', as: 'iqaUser' });
Task.belongsTo(User, { foreignKey: 'eqa', as: 'eqaUser' });

Course.hasMany(Task, { foreignKey: 'course', as: 'tasks' });
Task.belongsTo(Course, { foreignKey: 'course', as: 'courseData' });

User.hasMany(Notification, { foreignKey: 'recipient', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'recipient', as: 'recipientUser' });

Task.hasMany(Notification, { foreignKey: 'relatedTask', as: 'notifications' });
Notification.belongsTo(Task, { foreignKey: 'relatedTask', as: 'taskData' });

module.exports = {
  sequelize,
  User,
  Course,
  Task,
  Notification
};
