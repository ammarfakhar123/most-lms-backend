const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'learner', 'accessor', 'iqa', 'eqa'),
    allowNull: false
  },
  userId: {
    type: DataTypes.STRING,
    unique: true
  },
  createdBy: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING
  },
  phone: {
    type: DataTypes.STRING
  },
  dateOfBirth: {
    type: DataTypes.STRING
  },
  registrationDate: {
    type: DataTypes.STRING,
    defaultValue: () => new Date().toLocaleDateString()
  },
  ethnicity: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'users',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
      if (!user.userId) {
        const prefix = user.role.toUpperCase().substring(0, 3);
        const existingUsers = await User.findAll({
          where: {
            role: user.role,
            userId: { [sequelize.Sequelize.Op.like]: `${prefix}%` }
          },
          order: [['userId', 'ASC']]
        });
        
        let nextNumber = 1;
        for (const existingUser of existingUsers) {
          const currentNumber = parseInt(existingUser.userId.substring(3));
          if (currentNumber === nextNumber) {
            nextNumber++;
          } else {
            break;
          }
        }
        
        user.userId = `${prefix}${String(nextNumber).padStart(4, '0')}`;
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

User.prototype.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;