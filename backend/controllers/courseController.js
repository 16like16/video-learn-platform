const { courses, videos, comments, favorites, learningRecords } = require('../models/dataStore');

// Get courses
exports.getCourses = (req, res) => {
  const { page = 1, pageSize = 10, keyword = '' } = req.query;
  const pageNum = Number(page);
  const pageSizeNum = Number(pageSize);
  const filteredCourses = courses.filter(course => course.title.includes(keyword));
  const paginatedCourses = filteredCourses.slice((pageNum - 1) * pageSizeNum, pageNum * pageSizeNum);
  res.success({ list: paginatedCourses, total: filteredCourses.length });
};

// Get course detail
exports.getCourseDetail = (req, res) => {
  const course = courses.find(course => course.id === parseInt(req.params.id));
  if (!course) {
    return res.error('Course not found', 404);
  }
  res.success(course);
};

// Create course
exports.createCourse = (req, res) => {
  const { title, description, cover } = req.body;
  if (!title) {
    return res.error('Course title is required', 400);
  }
  const nextId = courses.length ? Math.max(...courses.map((course) => course.id)) + 1 : 1;
  const newCourse = {
    id: nextId,
    title,
    description: description || '',
    cover: cover || '',
    creator_id: req.user.id,
  };
  courses.push(newCourse);
  res.success({ message: 'Course created successfully', course: newCourse });
};

// Update course
exports.updateCourse = (req, res) => {
  const course = courses.find(course => course.id === parseInt(req.params.id));
  if (!course) {
    return res.error('Course not found', 404);
  }
  if (course.creator_id !== req.user.id && req.user.role !== 'admin') {
    return res.error('Permission denied', 403);
  }
  const { title, description, cover } = req.body;
  course.title = title || course.title;
  course.description = description || course.description;
  course.cover = cover || course.cover;
  res.success({ message: 'Course updated successfully' });
};

// Delete course
exports.deleteCourse = (req, res) => {
  const courseIndex = courses.findIndex(course => course.id === parseInt(req.params.id));
  if (courseIndex === -1) {
    return res.error('Course not found', 404);
  }
  const course = courses[courseIndex];
  if (course.creator_id !== req.user.id && req.user.role !== 'admin') {
    return res.error('Permission denied', 403);
  }
  const courseId = course.id;
  courses.splice(courseIndex, 1);
  for (let i = videos.length - 1; i >= 0; i -= 1) {
    if (videos[i].course_id === courseId) {
      const videoId = videos[i].id;
      videos.splice(i, 1);
      for (let j = learningRecords.length - 1; j >= 0; j -= 1) {
        if (learningRecords[j].video_id === videoId) {
          learningRecords.splice(j, 1);
        }
      }
    }
  }
  for (let i = comments.length - 1; i >= 0; i -= 1) {
    if (comments[i].course_id === courseId) {
      comments.splice(i, 1);
    }
  }
  for (let i = favorites.length - 1; i >= 0; i -= 1) {
    if (favorites[i].course_id === courseId) {
      favorites.splice(i, 1);
    }
  }
  res.success({ message: 'Course deleted successfully' });
};