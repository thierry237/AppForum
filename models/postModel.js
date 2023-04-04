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
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
},
    {
        timestamps: false
    }
);

module.exports = Post;

