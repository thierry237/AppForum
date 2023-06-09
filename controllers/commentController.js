const db = require('../models/index');
const Post = db.Post;
const User = db.User;
const Comment = db.Comment;


//liste tous les commentaires
exports.commentList = async function (req, res) {
    await Comment.findAll({ include: [User, Post] })
        .then(data => {
            console.log("All Comments:", JSON.stringify(data, null, 2));
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
}


//ajouter un commentaire
exports.commentCreate = async function (req, res) {
    //on récupère l'identifiant de l'utilisateur
    const { id_User } = req;
    // const { id_Post } = req.params.idPost;
    let comment = Comment.build({
        comment: req.body.comment, like: req.body.like, idUser: id_User,
        idPost: req.body.idPost
    })

    // Vérifier si les paramètres requis sont présents et valides
    if (comment.comment == null) {
        return res.status(400).json({ 'error': 'missing parameters' });
    }
    if (comment.comment.trim() == "") {
        return res.status(400).json({ 'error': 'missing parameters' });
    }
    // Enregistrer le commentaire dans la base de données
    await comment.save()
        .then(data => {
            console.log(comment.toJSON());
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })

}

//modifier un commentaire
exports.commentUpdate = async function (req, res) {
    const { id_User } = req;
    let comment = Comment.build({
        comment: req.body.comment, like: req.body.like

    })
    // Vérifier si les paramètres requis sont présents et valides
    if (req.params.idComment > 0) {
        if (comment.comment == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }
        if (comment.comment.trim() == "") {
            return res.status(400).json({ 'error': 'missing parameters' });
        }
        //modification en BD
        await Comment.update(
            {
                comment: comment.comment, like: comment.like, idUser: comment.idUser,
                idPost: comment.idPost
            },
            { where: { idComment: req.params.idComment } }
        )
            .then(data => {
                if (data[0] == 0) { res.status(400).json({ message: 'Comment not found' }) }
                else res.json({ message: 'Comment updated' })
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
    else res.status(400).json({ message: 'Comment not found' })
}

//supprimer un commentaire
exports.commentDelete = async function (req, res) {
    if (req.params.idComment) {
        await Comment.destroy({ where: { idComment: req.params.idComment } })
            .then(data => {
                if (data == 0) res.status(400).json({ message: 'Comment not found' });
                else res.json({ message: 'Comment deleted' });
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
    else res.status(400).json({ message: 'Comment not found' })
}

//afficher un commentaire précis
exports.commentFindOne = async function (req, res) {
    if (req.params.idComment) {
        await Comment.findOne({ where: { idComment: req.params.idComment }, include: [User, Post] })
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
    else res.status(400).json({ message: 'Comment not found' })
}

//rechercher un commentaire
// const { Op } = require("sequelize");
exports.commentFindOp = async function (req, res) {
    let params = {};
    Object.entries(req.body).forEach(([key, value]) => {
        params[key] = value;
    });
    await Comment.findAll({ where: params })
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
}

//afficher tous les commentaires liés à un post
exports.listCommentPost = async function (req, res) {
    if (req.params.idPost) {
        await Comment.findAll({ where: { idPost: req.params.idPost } })
            .then(data => {
                console.log("All Comments:", JSON.stringify(data, null, 2));
                res.status(200).json(data);
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
    else res.status(400).json({ message: 'Post not found' })
}

//afficher tous les commentaires liés à un utilisateur
exports.listCommentUser = async function (req, res) {
    if (req.params.idUser) {
        await Comment.findAll({ where: { idUser: req.params.idUser } })
            .then(data => {
                console.log("All Comments:", JSON.stringify(data, null, 2));
                res.json(data);
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
    else res.status(400).json({ message: 'Post not found' })
}
