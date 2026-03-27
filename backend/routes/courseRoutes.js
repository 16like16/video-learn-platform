const express = require('express');
const { getCourses, getCourseDetail, createCourse, updateCourse, deleteCourse } = require('../controllers/courseController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

const router = express.Router();

// Course routes
router.get('/list', getCourses);
router.get('/detail/:id', getCourseDetail);
router.post('/create', authenticateJWT, createCourse);
router.put('/update/:id', authenticateJWT, updateCourse);
router.delete('/delete/:id', authenticateJWT, deleteCourse);

module.exports = router;