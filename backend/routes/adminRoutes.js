const express = require('express');
const { getUsers, deleteUser, getCourses, deleteCourse, getComments, deleteComment } = require('../controllers/adminController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

const router = express.Router();

// Admin routes
router.get('/users', authenticateJWT, getUsers);
router.delete('/user/delete/:id', authenticateJWT, deleteUser);
router.get('/courses', authenticateJWT, getCourses);
router.delete('/course/delete/:id', authenticateJWT, deleteCourse);
router.get('/comments', authenticateJWT, getComments);
router.delete('/comment/delete/:id', authenticateJWT, deleteComment);

module.exports = router;