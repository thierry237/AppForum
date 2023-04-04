const db = require('../models/index');
const User = db.User;




exports.userList = async function (req, res) {
    await User.findAll()
        .then(data => {
            console.log("All users:", JSON.stringify(data, null, 2));
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
}

exports.userCreate = async (req, res) => {
    let user = User.build({
        lastname: req.body.lastname, firstname: req.body.firstname, username: req.body.username, email: req.body.email,
        password: req.body.password, createdAt: req.body.createdAt
    })
    await user.save()
        .then(data => {
            console.log(user.toJSON());
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
}

exports.userUpdate = async function (req, res) {
    if (req.params.idUser > 0) {
        await User.update(
            {
                lastname: req.body.lastname, firstname: req.body.firstname, username: req.body.username, email: req.body.email,
                password: req.body.password, createdAt: req.body.createdAt
            },
            { where: { idUser: req.params.idUser } }
        )
            .then(data => {
                if (data[0] == 0) { res.status(400).json({ message: 'Not found' }) }
                else res.json({ message: 'done' })
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
    else res.status(400).json({ message: 'User not found' })
}

exports.userDelete = async function (req, res) {
    if (req.params.idUser) {
        await User.destroy({ where: { idUser: req.params.idUser } })
            .then(data => {
                if (data == 0) res.status(400).json({ message: 'Not found' });
                else res.json({ message: 'done' })
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
    else res.status(400).json({ message: 'User not found' })
}

exports.userFindOne = async function (req, res) {
    if (req.params.idUser) {
        await User.findOne({ where: { idUser: req.params.idUser } })
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
    else res.status(400).json({ message: 'User not found' })
}

// const { Op } = require("sequelize");
exports.userFindOp = async function (req, res) {
    let params = {};
    Object.entries(req.body).forEach(([key, value]) => {
        params[key] = value;

    });
    await User.findAll({ where: params })
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
}