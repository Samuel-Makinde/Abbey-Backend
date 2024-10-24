const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/dbConnect'); 
const Follower = require('./Follower');


const User = sequelize.define('User', {
  fullname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true 
    }
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, 
    validate: {
      notEmpty: true 
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, 
    validate: {
      isEmail: true, 
      notEmpty: true 
    }
  },
  bio: {
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false 
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false 
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100], 
      notEmpty: true
    }
  }
}, {
 tableName: "users",
  timestamps: true 
});

// // Associations
// User.hasMany(Follower, { foreignKey: 'followerId' }); // A user can follow many users
// User.hasMany(Follower, { foreignKey: 'followingId' }); // A user can be followed by many users
// Follower.belongsTo(User, { foreignKey: 'followerId' });
// Follower.belongsTo(User, { foreignKey: 'followingId' });
// Associations
User.hasMany(Follower, { foreignKey: 'followerId', as: 'followers' }); // Users that this user is following
User.hasMany(Follower, { foreignKey: 'followingId', as: 'followings' }); // Users that are following this user
Follower.belongsTo(User, { foreignKey: 'followerId', as: 'follower' }); // The user who is following
Follower.belongsTo(User, { foreignKey: 'followingId', as: 'following' });

module.exports = User;
