let express = require('express');
let router = express.Router();

// Import  controller
const userController = require('./controllers/userController');
const postController = require('./controllers/postController');
const commentController = require('./controllers/commentController');
const courseController = require('./controllers/courseController');
const auth = require('./authorization/authorization')

router.get('/', (req, res) => res.redirect('/login'));

//login
router.post('/login', userController.loginUser);

//api utilisateurs
router.get('/users', auth.isAuthorized, auth.isAdmin, userController.userList);
router.post('/user', userController.userCreate);
router.put('/user/:idUser', auth.isAuthorized, auth.isAuthorizedAdminUser, userController.userUpdate);
router.delete('/user/:idUser', auth.isAuthorized, auth.isAuthorizedAdminUser, userController.userDelete);
router.get('/user/:idUser', auth.isAuthorized, userController.userFindOne);
router.post('/user/filter', auth.isAuthorized, auth.isAdmin, userController.userFindOp);

//api course
router.get('/courses', auth.isAuthorized, courseController.courseList);
router.post('/course', auth.isAuthorized, auth.isAdmin, courseController.courseCreate);
router.put('/course/:idCourse', auth.isAuthorized, auth.isAdmin, courseController.courseUpdate);
router.delete('/course/:idCourse', auth.isAuthorized, auth.isAdmin, courseController.courseDelete);
router.get('/course/:idCourse', auth.isAuthorized, courseController.courseFindOne);
router.get('/course/:idCourse/posts', auth.isAuthorized, courseController.listPostCourse);
router.get('/course/:idCourse/users', auth.isAuthorized, courseController.listUserCourse);

//api posts
router.get('/posts', auth.isAuthorized, postController.postList);
router.post('/post', auth.isAuthorized, postController.postCreate);
router.put('/post/:idPost', auth.isAuthorized, auth.isAuthorizedAdminUser, postController.postUpdate);
router.delete('/post/:idPost', auth.isAuthorized, auth.isAuthorizedAdminUser, postController.postDelete);
router.get('/post/:idPost', auth.isAuthorized, postController.postFindOne);
router.get('/user/:idUser/posts', auth.isAuthorized, postController.listPostUser);
router.delete('/user/:idUser/posts', auth.isAuthorized, auth.isAdmin, postController.deleteAllPostUser);
router.get('/post/:idPost/comments', auth.isAuthorized, postController.allCommentPost); //idem
router.get('/post/:idPost/users', auth.isAuthorized, postController.listUsersPost);


//api Comments
router.get('/comments', auth.isAuthorized, commentController.commentList);
router.post('/comment', auth.isAuthorized, commentController.commentCreate);
router.put('/comment/:idComment', auth.isAuthorized, auth.isAuthorizedAdminUser, commentController.commentUpdate);
router.delete('/comment/:idComment', auth.isAuthorized, auth.isAuthorizedAdminUser, commentController.commentDelete);
router.get('/comment/:idComment', auth.isAuthorized, commentController.commentFindOne);
router.post('/comment/filter', auth.isAuthorized, commentController.commentFindOp);
router.get('/post/:idPost/comments', auth.isAuthorized, commentController.listCommentPost); //idem
router.get('/user/:idUser/comments', auth.isAuthorized, commentController.listCommentUser);


module.exports = router;