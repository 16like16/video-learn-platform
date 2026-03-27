const express = require('express');
const { getVideos, uploadVideo, deleteVideo } = require('../controllers/videoController');
const { authenticateJWT } = require('../middlewares/authMiddleware');
const multer = require('multer');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Video routes
router.get('/list/:courseId', getVideos);
router.post('/upload', authenticateJWT, upload.single('video'), uploadVideo);
router.delete('/delete/:id', authenticateJWT, deleteVideo);

module.exports = router;