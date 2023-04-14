const Sequelize = require('sequelize')
const sequelize = require('../db.js');

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./userModel');
db.Post = require('./postModel');
db.Comment = require('./commentModel');
db.Course = require('./courseModel');
db.Insert = require('./insertModel');

//relation 1 à plusieurs entre user et post
db.Post.belongsTo(db.User, { foreignKey: "idUser" });
db.User.hasMany(db.Post, { foreignKey: "idUser" });

//relation 1 à plusieurs entre user et comment
db.User.hasMany(db.Comment, { foreignKey: 'idUser' });
db.Comment.belongsTo(db.User, { foreignKey: 'idUser' });

//relation 1 à plusieurs entre post et comment
db.Post.hasMany(db.Comment, { foreignKey: 'idPost', onDelete: 'CASCADE' });
db.Comment.belongsTo(db.Post, { foreignKey: 'idPost' });


//relation 1 à plusieurs entre post et course
db.Course.hasMany(db.Post, { foreignKey: 'idCourse', onDelete: 'CASCADE' });
db.Post.belongsTo(db.Course, { foreignKey: 'idCourse' });

//relation 1 à plusieurs entre user et insert
db.User.hasMany(db.Insert, { foreignKey: 'idUser' });
db.Insert.belongsTo(db.User, { foreignKey: 'idUser' });

//relation 1 à plusieurs entre course et insert
db.Course.hasMany(db.Insert, { foreignKey: 'idCourse', onDelete: 'CASCADE' });
db.Insert.belongsTo(db.Course, { foreignKey: 'idCourse' });

//relation n à n entre user et post 
db.User.belongsToMany(db.Post, { through: db.Comment, foreignKey: "idUser", otherKey: "idPost" })
db.Post.belongsToMany(db.User, { through: db.Comment, foreignKey: "idPost", otherKey: "idUser" })

//relation n à n entre user et course 
db.User.belongsToMany(db.Course, { through: db.Insert, foreignKey: "idUser", otherKey: "idCourse" })
db.Course.belongsToMany(db.User, { through: db.Insert, foreignKey: "idCourse", otherKey: "idUser" })


module.exports = db