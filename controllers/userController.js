const db = require('../models/index');
const jwt = require("jsonwebtoken");
const User = db.User;
const bcrypt = require('bcrypt');

//const
const jwtKey = process.env.JWT_SECRET;
const jwtExpirySeconds = 1800;
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const PASSWORD_REGEX = /^.{4,8}$/
const USERNAME_REGEX = /^[a-zA-Z0-9\-\.\+\_\@\~\#]{3,15}$/

//Get All users
exports.userList = async function (req, res) {
    await User.findAll({ attributes: ['lastname', 'firstname', 'username', 'email', 'password', 'createdAt'] })
        .then(data => {
            console.log("All users:", JSON.stringify(data, null, 2));
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
}

//Add User
exports.userCreate = async (req, res) => {

    let user = User.build({
        lastname: req.body.lastname, firstname: req.body.firstname, username: req.body.username, email: req.body.email,
        password: req.body.password, isAdmin: req.body.isAdmin
    })
    if (user.lastname == null || user.firstname == null || user.username == null || user.email == null || user.password == null) {
        return res.status(400).json({ 'error': 'missing parameters' })

    }
    if (user.lastname.trim() == "" || user.firstname.trim() == "" || user.username.trim() == "" || user.email.trim() == "" || user.password.trim() == "") {
        return res.status(400).json({ 'error': 'missing parameters " "' })
    }
    if (!USERNAME_REGEX.test(user.username)) {
        return res.status(400).json({ message: 'wrong username (must be length 3 - 14)' })
    }
    if (!EMAIL_REGEX.test(user.email)) {
        return res.status(400).json({ message: 'email is not correct' })
    }
    if (!PASSWORD_REGEX.test(user.password)) {
        return res.status(400).json({ message: 'passsword invalid (must be length 4 - 8)' })
    }

    try {
        const userFound = await User.findOne({ attributes: ['email'], where: { email: user.email } });
        if (userFound == null) {
            const bcryptedPassword = await bcrypt.hash(user.password, 5);
            const newUser = await User.create({
                lastname: user.lastname,
                firstname: user.firstname,
                username: user.username,
                email: user.email,
                password: bcryptedPassword,
                isAdmin: user.isAdmin
            });
            return res.status(201).json({
                'idUser': newUser.idUser,
                'username': newUser.username,
                'isAdmin': newUser.isAdmin
            });
        } else {
            return res.status(409).json({ message: 'email already exists' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


//Update user
exports.userUpdate = async function (req, res) {
    if (req.params.idUser > 0) {
        let user = User.build({
            lastname: req.body.lastname, firstname: req.body.firstname, username: req.body.username, email: req.body.email,
            password: req.body.password, isAdmin: req.body.isAdmin
        })
        if (user.lastname == null || user.firstname == null || user.username == null || user.email == null || user.password == null) {
            return res.status(400).json({ 'error': 'missing parameters' })
        }
        if (user.username >= 15 || user.username <= 2) {
            return res.status(400).json({ 'error': 'wrong username (must be length 3 - 14)' })
        }
        if (!EMAIL_REGEX.test(user.email)) {
            return res.status(400).json({ 'error': 'email is not correct (must be aaaa@aaa.aaa)' })
        }
        if (!PASSWORD_REGEX.test(user.password)) {
            return res.status(400).json({ 'error': 'passsword invalid (must be length 4 - 8)' })
        }
        const bcryptedPassword = await bcrypt.hash(user.password, 5);
        await User.update(
            {
                lastname: user.lastname, firstname: user.firstname, username: user.username, email: user.email,
                password: bcryptedPassword, isAdmin: user.isAdmin
            },
            { where: { idUser: req.params.idUser } }
        )
            .then(data => {
                if (data[0] == 0) { res.status(400).json({ message: 'Not found' }) }
                else res.json({ message: 'User updated' })
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
    else res.status(400).json({ message: 'User not found' })
}

//Delete User
exports.userDelete = async function (req, res) {
    if (req.params.idUser) {
        await User.destroy({ where: { idUser: req.params.idUser } })
            .then(data => {
                if (data == 0) res.status(400).json({ message: 'User not found' });
                else res.json({ message: 'User deleted' })
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
    else res.status(400).json({ message: 'User not found' })
}

//search user
exports.userFindOne = async function (req, res) {
    if (req.params.idUser) {
        await User.findOne({ attributes: ['lastname', 'firstname', 'username', 'email', 'createdAt', 'isAdmin'], where: { idUser: req.params.idUser } })
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
//find with parameters
exports.userFindOp = async function (req, res) {
    let params = {};
    Object.entries(req.body).forEach(([key, value]) => {
        params[key] = value;

    });
    await User.findAll({ attributes: ['lastname', 'firstname', 'username', 'email', 'createdAt'], where: params })
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
}


//connect and generate token
exports.loginUser = async function (req, res) {
    let user = User.build({
        email: req.body.email,
        password: req.body.password
    });

    const userFound = await User.findOne({ where: { email: user.email } });
    if (userFound) {
        const checkPassword = bcrypt.compare(user.password, userFound.password);
        checkPassword.then((match) => {
            if (match) {
                const token = jwt.sign({ idUser: userFound.idUser, isAdmin: userFound.isAdmin, username: userFound.username }, jwtKey, { expiresIn: jwtExpirySeconds });
                res.cookie('token', token, { httpOnly: true, secure: true, maxAge: jwtExpirySeconds * 1000 });
                return res.status(200).json({
                    "idUser": userFound.idUser,
                    "isAdmin": userFound.isAdmin,
                    "username": userFound.username,
                    "token": token

                });
            } else {
                return res.status(400).json({ message: 'incorrect password' });
            }
        }).catch((error) => {
            return res.status(400).json({ message: 'error: ' + error.message });
        })

    } else {
        return res.status(400).json({ message: 'user doesnt exist (check your email)' });
    }
};
