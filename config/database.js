const { Sequelize } = require('sequelize');

// Check if we're in Vercel environment
const isVercel = process.env.VERCEL === '1';

let sequelize;

if (isVercel) {
  // For Vercel serverless deployment, use PostgreSQL
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required for Vercel deployment');
  }
  
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  });
} else {
  // For local development, use SQLite
  const { Sequelize } = require('sequelize');
  
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './lms_database.sqlite',
    logging: console.log,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  });
}

module.exports = { sequelize };
