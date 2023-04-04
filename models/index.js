const Sequelize = require('sequelize')
const sequelize = require('../db.js');

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./userModel');
db.Post = require('./postModel');
db.Comment = require('./commentModel')

//relation 1 à plusieurs entre user et post
db.Post.belongsTo(db.User, { foreignKey: "idUser" });
db.User.hasMany(db.Post, { foreignKey: "idUser" });

//relation n à n entre user et post 
db.User.belongsToMany(db.Post, { through: db.Comment, foreignKey: "idUser", otherKey: "idPost" })
db.Post.belongsToMany(db.User, { through: db.Comment, foreignKey: "idPost", otherKey: "idUser" })


module.exports = db