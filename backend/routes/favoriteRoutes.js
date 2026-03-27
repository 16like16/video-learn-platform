const express = require('express');
const { addFavorite, removeFavorite, getFavorites } = require('../controllers/favoriteController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

const router = express.Router();

// Favorite routes
router.post('/add', authenticateJWT, addFavorite);
router.delete('/remove', authenticateJWT, removeFavorite);
router.get('/list', authenticateJWT, getFavorites);

module.exports = router;