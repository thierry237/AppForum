const db = require('../models/index');
const { sequelize, Op } = require('sequelize');
const Post = db.Post;
const User = db.User;
const Comment = db.Comment;
const Course = db.Course;
const Insert = db.Insert;

//afficher tous les cours
exports.courseList = async function (req, res) {
    await Course.findAll({ include: [User, Post] })
        .then(data => {
            console.log("All Courses:", JSON.stringify(data, null, 2));
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
}

//ajouter un cours 
exports.courseCreate = async function (req, res) {
    let course = Course.build({
        name: req.body.name, description: req.body.description
    })
    if (course.name == null || course.description == null) {
        return res.status(400).json({ message: 'missing parameters' })
    }
    if (course.name.trim() == "" || course.description.trim() == "") {
        return res.status(400).json({ message: 'missing parameters " "' })
    }
    try {
        const courseFound = await Course.findOne({ attributes: ['name'], where: { name: course.name } })
        if (courseFound == null) {
            await course.save();
            // Récupérer l'ID de l'utilisateur connecté
            const { id_User } = req;
            let insert = Insert.build({
                idCourse: course.idCourse,
                idUser: id_User
            });
            await insert.save();
            console.log(insert.toJSON());
            res.status(200).json({ message: 'Course created successfully.', course });
        }
        else {
            return res.status(409).json({ message: 'course already exists' });
        }

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

//modifier un cours
exports.courseUpdate = async function (req, res) {
    if (req.params.idCourse > 0) {
        let course = Course.build({
            name: req.body.name, description: req.body.description
        })
        // Vérifier si les paramètres requis sont présents et valides
        if (course.name == null || course.description == null) {
            return res.status(400).json({ message: 'missing parameters' })
        }
        if (course.name.trim() == "" || course.description.trim() == "") {
            return res.status(400).json({ message: 'missing parameters " "' })
        }
        // Rechercher le cours existant à mettre à jour
        const courseFound = await Course.findOne({ where: { idCourse: req.params.idCourse } })
        // Vérifier si un autre cours existe déjà avec le même nom (sauf pour le cours en cours de mise à jour)
        const checkCourse = await Course.findAll({
            where: {
                name: course.name, idCourse: {
                    [Op.not]: req.params.idCourse // exclure un cours dans la recherche
                }
            }
        })
        // Si aucun autre cours avec le même nom n'est trouvé et le cours existant correspond à l'ID spécifié
        if (checkCourse == false && (courseFound && courseFound.idCourse == parseInt(req.params.idCourse))) {
            // Mettre à jour les informations du cours dans la base de données
            await Course.update(
                {
                    name: course.name, description: course.description
                },
                { where: { idCourse: req.params.idCourse } }
            )
                .then(data => {
                    res.status(200).json({ message: 'Course updated' })
                })
                .catch(err => {
                    res.status(500).json({ message: err.message })
                })
        } else {
            // Si un autre cours avec le même nom existe déjà, renvoyer une réponse avec un statut 409 (Conflit)
            return res.status(409).json({ message: 'course already exists' });
        }

    }
    // Si l'ID du cours n'est pas valide, renvoyer une réponse avec un statut 400 (Mauvaise requête)
    else res.status(400).json({ message: 'Course not found' })
}

// supprimer un cours
exports.courseDelete = async function (req, res) {
    if (req.params.idCourse) {
        await Course.destroy({ where: { idCourse: req.params.idCourse } })
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

//afficher un cours précis
exports.courseFindOne = async function (req, res) {
    if (req.params.idCourse) {
        await Course.findOne({ where: { idCourse: req.params.idCourse }, include: [User, Post] })
            .then(data => {
                res.status(200).json(data);
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
    else res.status(400).json({ message: 'Course not found' })
}

//rechercher un cours 
// const { Op } = require("sequelize");
exports.courseFindOp = async function (req, res) {
    let params = {};
    // Parcourir les paires clé-valeur du corps de la requête et les ajouter à l'objet params
    Object.entries(req.body).forEach(([key, value]) => {
        params[key] = value;
    });
    // Rechercher les cours correspondants aux paramètres spécifiés, en incluant les associations avec les modèles User et Post
    await Course.findAll({ where: params, include: [User, Post] })
        .then(data => {
            console.log("All Courses:", JSON.stringify(data, null, 2));
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
}

//afficher tous les posts d'un cours donné
exports.listPostCourse = async function (req, res) {
    if (req.params.idCourse) {
        await Post.findAll({ where: { idCourse: req.params.idCourse } })
            .then(data => {
                console.log("All Posts:", JSON.stringify(data, null, 2));
                res.status(200).json(data);
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
    else res.status(400).json({ message: 'Post not found' })
}

//afficher tous les utilisateurs d'un cours
exports.listUserCourse = async function (req, res) {
    if (req.params.idCourse) {
        await Course.findOne({ where: { idCourse: req.params.idCourse }, include: [{ model: User, through: { model: Insert, attributes: [] } }] })
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
