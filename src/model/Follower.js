const { DataTypes } = require('sequelize');
const { sequelize } = require("../config/dbConnect");


const Follower = sequelize.define('Follower', {
    followerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', 
            key: 'id'
        }
    },
    followingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', 
            key: 'id'
        }
    }
}, {
    tableName: 'followers',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['followerId', 'followingId'] 
        }
    ]
});

module.exports = Follower;
