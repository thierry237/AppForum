let express = require('express');
let router = express.Router();

// Import note controller
const userController = require('./controllers/userController');
const postController = require('./controllers/postController');
const commentController = require('./controllers/commentController');
const courseController = require('./controllers/courseController');

router.get('/', (req, res) => res.redirect('/users'));

//api utilisateurs
router.get('/users', userController.userList);
router.post('/user', userController.userCreate);
router.put('/user/:idUser', userController.userUpdate);
router.delete('/user/:idUser', userController.userDelete);
router.get('/user/:idUser', userController.userFindOne);
router.post('/user/filter', userController.userFindOp);


//api posts
router.get('/posts', postController.postList);
router.post('/post', postController.postCreate);
router.put('/post/:idPost', postController.postUpdate);
router.delete('/post/:idPost', postController.postDelete);
router.get('/post/:idPost', postController.postFindOne);
router.get('/user/:idUser/posts', postController.listPostUser);
router.delete('/user/:idUser/posts', postController.deleteAllPostUser);
router.get('/post/:idPost/comments', postController.allCommentPost);





//api Comments
router.get('/comments', commentController.commentList);
router.post('/comment', commentController.commentCreate);
router.put('/comment/:idComment', commentController.commentUpdate);
router.delete('/comment/:idComment', commentController.commentDelete);
router.get('/comment/:idComment', commentController.commentFindOne);
router.post('/comment/filter', commentController.commentFindOp);
router.get('/post/:idPost/comments', commentController.listCommentPost);
router.get('/user/:idUser/comments', commentController.listCommentUser);

//api course
router.get('/courses', courseController.courseList);
router.post('/course', courseController.courseCreate);
router.put('/course/:idCourse', courseController.courseUpdate);
router.delete('/course/:idCourse', courseController.courseDelete);
router.get('/course/:idCourse', courseController.courseFindOne);
router.get('/course/:idCourse/posts', courseController.listPostCourse);
router.delete('/course/:idCourse/users', courseController.listUserCourse);
module.exports = router;