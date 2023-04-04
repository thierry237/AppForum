const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Comment = sequelize.define('comment', {
    idComment: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    // idPost: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     unique: false
    // },
    // idUser: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     unique: false
    // },
    comment: {
        type: DataTypes.STRING,
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
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
},
    {
        timestamps: false
    }
);

module.exports = Comment;

