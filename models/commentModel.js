const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const db = require('../models/index');
const Post = db.Post;

const Comment = sequelize.define('comment', {
    idComment: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: false
    },
    like: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        unique: false
    },
    createdAt: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
},
    {
        timestamps: false
    }
);

module.exports = Comment;

