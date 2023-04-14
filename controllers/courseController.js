const db = require('../models/index');
const Post = db.Post;
const User = db.User;
const Comment = db.Comment;
const Course = db.Course;
const Insert = db.Insert;

exports.courseList = async function (req, res) {
    await Course.findAll({ include: [User, Post] })
        .then(data => {
            console.log("All Courses:", JSON.stringify(data, null, 2));
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
}

exports.courseCreate = async function (req, res) {
    let course = Course.build({
        name: req.body.name, description: req.body.description, createdAt: req.body.createdAt,
        idPost: req.body.idPost
    })

    let insert = Insert.build({
        idCourse: req.body.idCourse, idUser: req.body.idUser
    })
    await course.save()
        .then(data => {
            console.log(course.toJSON());
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })

}

exports.courseUpdate = async function (req, res) {
    if (req.params.idCourse > 0) {
        await Course.update(
            {
                name: req.body.name, description: req.body.description, createdAt: req.body.createdAt,
                idPost: req.body.idPost
            },
            { where: { idCourse: req.params.idCourse } }
        )
            .then(data => {
                if (data[0] == 0) { res.status(400).json({ message: 'Course not found' }) }
                else res.json({ message: 'done' })
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
    else res.status(400).json({ message: 'Course not found' })
}

exports.courseDelete = async function (req, res) {
    if (req.params.idCourse) {
        await Comment.destroy({ where: { idCourse: req.params.idCourse } })
            .then(data => {
                if (data == 0) res.status(400).json({ message: 'Course not found' });
                else res.json({ message: 'Course deleted' });
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
    else res.status(400).json({ message: 'Course not found' })
}

exports.courseFindOne = async function (req, res) {
    if (req.params.idCourse) {
        await Course.findOne({ where: { idCourse: req.params.idCourse }, include: [User, Post] })
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
    else res.status(400).json({ message: 'Course not found' })
}

// const { Op } = require("sequelize");
exports.commentFindOp = async function (req, res) {
    let params = {};
    Object.entries(req.body).forEach(([key, value]) => {
        params[key] = value;
    });
    await Course.findAll({ where: params })
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
}

//afficher tous les commentaires liés à un post
exports.listPostCourse = async function (req, res) {
    if (req.params.idCourse) {
        await Post.findAll({ where: { idCourse: req.params.idCourse } })
            .then(data => {
                console.log("All Posts:", JSON.stringify(data, null, 2));
                res.json(data);
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
    else res.status(400).json({ message: 'Post not found' })
}

//afficher tous les commentaires liés à un utilisateur
exports.listUserCourse = async function (req, res) {
    if (req.params.idCourse) {
        await User.findAll({ where: { idCourse: req.params.idCourse } })
            .then(data => {
                console.log("All users:", JSON.stringify(data, null, 2));
                res.json(data);
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
    else res.status(400).json({ message: 'users not found' })
}
