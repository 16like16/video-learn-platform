const express = require('express');
const { registerUser, loginUser, getUserInfo, updateUser } = require('../controllers/userController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

const router = express.Router();

// User routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/info', authenticateJWT, getUserInfo);
router.put('/update', authenticateJWT, updateUser);

module.exports = router;