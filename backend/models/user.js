const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Initialize Sequelize to use SQLite and store database in database directory
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database', 'users.db')
});

// Define User schema
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

// Sync model with database
sequelize.sync();

module.exports = { User, sequelize };
