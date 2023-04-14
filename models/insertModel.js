const { DataTypes } = require('sequelize');
const sequelize = require('../db');

//relation entre la table user et course
const Insert = sequelize.define('insert', {
    idInsert: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
},
    {
        timestamps: false
    }
);

module.exports = Insert;

