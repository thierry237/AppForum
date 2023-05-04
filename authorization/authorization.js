const jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_SECRET;
const db = require('../models/index');
const Post = db.Post;


exports.isAuthorized = async function (req, res, next) {
    if (typeof req.headers.authorization !== "undefined") {
        // retrieve the authorization header and parse out the
        // JWT using the split function
        let token = req.headers.authorization.split(" ")[1];
        // Here we validate that the JSON Web Token is valid 
        jwt.verify(token, jwtKey, (err, user) => {
            if (err) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            req.isAdmin = user.isAdmin;
            req.id_User = user.idUser;
            const id = req.params;
            next();

        });
    } else {
        // No authorization header exists on the incoming
        // request, return not authorized and throw a new error 
        return res.status(401).json({ message: "Unauthorized" });
    }
}

exports.isAuthorizedAdminUser = async function (req, res, next) {
    const { isAdmin, id_User } = req;
    const { idPost } = req.params;
    const post = await Post.findOne({ where: { idPost: idPost } });
    if (isAdmin || id_User === post.idUser) {
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

exports.isAdmin = async function (req, res, next) {
    const { isAdmin } = req;
    console.log(isAdmin);
    if (isAdmin) {
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}



