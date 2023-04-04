let express = require('express');
let router = express.Router();

// Import note controller
const userController = require('./controllers/userController');
const postController = require('./controllers/postController');

router.get('/', (req, res) => res.redirect('/users'));

//api utilisateurs
router.get('/users', userController.userList);
router.post('/user', userController.userCreate);
router.put('/user/:idUser', userController.userUpdate);
router.delete('/user/:idUser', userController.userDelete);
router.get('/user/:idUser', userController.userFindOne);

//api posts
router.get('/posts', postController.postList);
router.post('/post', postController.postCreate);
router.put('/post/:idPost', postController.postUpdate);
router.delete('/post/:idPost', postController.postDelete);
router.get('/post/:idPost', postController.postFindOne);
router.post('/user/filter', userController.userFindOp);



module.exports = router;