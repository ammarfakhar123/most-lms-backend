const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  course: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id'
    }
  },
  learner: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  accessor: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  iqa: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  eqa: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  resourceFiles: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('assigned', 'submitted', 'accessor_pass', 'accessor_fail', 'iqa_pass', 'iqa_fail', 'eqa_pass', 'eqa_fail', 'completed'),
    defaultValue: 'assigned'
  },
  submission: {
    type: DataTypes.JSON,
    defaultValue: {
      content: null,
      files: [],
      submittedAt: null
    }
  },
  feedback: {
    type: DataTypes.JSON,
    defaultValue: {
      accessor: null,
      iqa: null,
      eqa: null
    }
  },
  assessedAt: {
    type: DataTypes.JSON,
    defaultValue: {
      accessor: null,
      iqa: null,
      eqa: null
    }
  }
}, {
  tableName: 'tasks'
});

module.exports = Task;