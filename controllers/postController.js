const db = require('../models/index');
const Post = db.Post;
const User = db.User;

exports.postList = async function (req, res) {
    await Post.findAll({ include: [User] })
        .then(data => {
            console.log("All Posts:", JSON.stringify(data, null, 2));
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
}

exports.postCreate = async function (req, res) {
    let post = Post.build({
        title: req.body.title, message: req.body.message, createdAt: req.body.createdAt,
        idUser: req.body.idUser
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
                else res.json({ message: 'done' })
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
    else res.status(400).json({ message: 'Post not found' })
}

exports.postDelete = async function (req, res) {
    if (req.params.idPost) {
        await Post.destroy({ where: { idPost: req.params.idPost } })
            .then(data => {
                if (data == 0) res.status(400).json({ message: 'Post not found' });
                else res.json(data);
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
    else res.status(400).json({ message: 'Post not found' })
}

exports.postFindOne = async function (req, res) {
    if (req.params.idPost) {
        await Post.findOne({ where: { idPost: req.params.idPost }, include: [User] })
            .then(data => {
                res.json(data);
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
