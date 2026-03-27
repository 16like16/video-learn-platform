const express = require('express');
const { saveProgress, getLearningRecords } = require('../controllers/learnController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

const router = express.Router();

// Learning record routes
router.post('/save', authenticateJWT, saveProgress);
router.get('/list', authenticateJWT, getLearningRecords);

module.exports = router;