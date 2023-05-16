const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Post = sequelize.define('post', {
    idPost: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: false
    },
    createdAt: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
},
    {
        timestamps: false
    }
);

module.exports = Post;

