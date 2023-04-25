const { query } = require('express');
const db = require('../models/index');
const Post = db.Post;
const User = db.User;
const Course = db.Course;
const Comment = db.Comment;

//afficher tous les posts
exports.postList = async function (req, res) {
    await Post.findAll({ include: [User, Course, Comment] })
        .then(data => {
            console.log("All Posts:", JSON.stringify(data, null, 2));
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
}

//ajouter un post
exports.postCreate = async function (req, res) {
    const { id_User } = req;
    // const id_Course = req.params.idCourse;
    let post = Post.build({
        title: req.body.title, message: req.body.message,
        idUser: id_User, idCourse: req.body.idCourse
    })
    if (post.title == null || post.message == null) {
        return res.status(400).json({ 'error': 'missing parameters' })
    }
    if (post.title.trim() == "" || post.message.trim() == "") {
        return res.status(400).json({ 'error': 'missing parameters' })
    }
    await post.save()
        .then(data => {
            console.log(post.toJSON());
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })

}

//modifier un post
exports.postUpdate = async function (req, res) {
    if (req.params.idPost > 0) {
        let post = Post.build({
            title: req.body.title, message: req.body.message,
            idUser: id_User, idCourse: req.body.idCourse
        })
        if (post.title == null || post.message == null) {
            return res.status(400).json({ 'error': 'missing parameters' })
        }
        if (post.title.trim() == "" || post.message.trim() == "") {
            return res.status(400).json({ 'error': 'missing parameters' })
        }
        await Post.update(
            {
                title: post.title, message: post.message,
                idUser: post.idUser, idCourse: post.idCourse
            },
            { where: { idPost: req.params.idPost } }
        )
            .then(data => {
                if (data[0] == 0) { res.status(400).json({ message: 'Post not found' }) }
                else res.json({ message: 'Post updated' })
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
    else res.status(400).json({ message: 'Post not found' })
}

//supprimer un post
exports.postDelete = async function (req, res) {
    if (req.params.idPost > 0) {
        await Post.destroy({ where: { idPost: req.params.idPost } })
            .then(data => {
                if (data == 0) res.status(400).json({ message: 'Post not found' });
                else res.json({ message: "Post deleted" });
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
    else res.status(400).json({ message: 'Post not found' })
}

//chercher un post
exports.postFindOne = async function (req, res) {
    if (req.params.idPost) {
        await Post.findOne({ where: { idPost: req.params.idPost }, include: [User, Comment] })
            .then(data => {
                if (data != null) res.json(data);
                else res.status(400).json({ message: 'Post not found' })
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
    else res.status(400).json({ message: 'Post not found' })
}

// const { Op } = require("sequelize");
exports.postFindOp = async function (req, res) {
    let params = {};
    Object.entries(req.body).forEach(([key, value]) => {
        params[key] = value;
    });
    await Post.findAll({ where: params })
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
}

//afficher tous les posts liés à un utilisateur
exports.listPostUser = async function (req, res) {
    if (req.params.idUser) {
        await Post.findAll({ where: { idUser: req.params.idUser } })
            .then(data => {
                if (data != 0) {
                    console.log("All Posts:", JSON.stringify(data, null, 2));
                    res.json(data);
                }
                else res.status(400).json({ message: 'User not found' })
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
    else res.status(400).json({ message: 'User not found' })
}

//supprimer tous les posts liés à un utilisateur
exports.deleteAllPostUser = async function (req, res) {
    if (req.params.idUser) {
        const userFound = await User.findOne({ where: { idUser: req.params.idUser } });
        console.log(userFound);
        if (userFound) {
            await Post.destroy({ where: { idUser: req.params.idUser } })
                .then(data => {
                    if (data == 0) res.status(400).json({ message: 'Posts not found' });
                    else res.json({ message: 'Post deleted' });
                })
                .catch(err => {
                    res.status(500).json({ message: err.message })
                })
        } else {
            return res.status(400).json({ message: 'User not found' })
        }
    }
    else res.status(400).json({ message: 'User not found' })
}

//afficher tous les commentaires d'un post
exports.allCommentPost = async function (req, res) {
    if (req.params.idPost) {
        await Comment.findAll({ where: { idPost: req.params.idPost } })
            .then(data => {
                if (data != 0) {
                    console.log("All Comments:", JSON.stringify(data, null, 2));
                    res.json(data);
                }
                else res.status(400).json({ message: 'Post not found' })

            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
    else res.status(400).json({ message: 'Post not found' })
}

//afficher tous les utilisateurs d'un post
exports.listUsersPost = async function (req, res) {
    if (req.params.idPost) {
        await Comment.findAll({ attributes: ['idUser'], where: { idPost: req.params.idPost }, group: ['idUser'] })
            .then(data => {
                if (data != 0) {
                    console.log("All Users:", JSON.stringify(data, null, 2));
                    res.json(data);
                }
                else res.status(400).json({ message: 'Users not found' })

            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
    else res.status(400).json({ message: 'Users not found' })
}

