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
    let post = Post.build({
        title: req.body.title, message: req.body.message, createdAt: req.body.createdAt,
        idUser: req.body.idUser, idCourse: req.body.idCourse
    })
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
        await Post.update(
            {
                title: req.body.title, message: req.body.message, createdAt: req.body.createdAt,
                idUser: req.body.idUser
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
    if (req.params.idPost) {
        await Post.destroy({ where: { idPost: req.params.idPost } })
            .then(data => {
                if (data == 0) res.status(400).json({ message: 'Post not found' });
                else res.json(data);
            })
            .catch(err => {
                res.status(500).json({ message: "Post deleted" })
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
    console.log(req.params.idUser);
    if (req.params.idUser) {
        await Post.destroy({ where: { idUser: req.params.idUser } })
            .then(data => {
                if (data == 0) res.status(400).json({ message: 'Post not found' });
                else res.json({ message: 'Post deleted' });
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
    else res.status(400).json({ message: 'Post not found' })
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
