const { DataTypes, NOW } = require('sequelize');
const sequelize = require('../db');

const Course = sequelize.define('course', {
    idCourse: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    description: {
        type: DataTypes.STRING,
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

module.exports = Course;

