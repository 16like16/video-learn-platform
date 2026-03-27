const express = require('express');
const { getComments, addComment, deleteComment } = require('../controllers/commentController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

const router = express.Router();

// Comment routes
router.get('/list/:courseId', getComments);
router.post('/add', authenticateJWT, addComment);
router.delete('/delete/:id', authenticateJWT, deleteComment);

module.exports = router;