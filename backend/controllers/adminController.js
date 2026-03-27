const { users, courses, comments, videos, favorites, learningRecords } = require('../models/dataStore');

// 获取所有用户
exports.getUsers = (req, res) => {
  if (req.user.role !== 'admin') {
    return res.error('权限不足', 403);
  }
  res.success(users);
};

// 删除用户
exports.deleteUser = (req, res) => {
  if (req.user.role !== 'admin') {
    return res.error('权限不足', 403);
  }
  const userIndex = users.findIndex(user => user.id === parseInt(req.params.id));
  if (userIndex === -1) {
    return res.error('用户未找到', 404);
  }
  const deletedUserId = users[userIndex].id;
  users.splice(userIndex, 1);
  for (let i = favorites.length - 1; i >= 0; i -= 1) {
    if (favorites[i].user_id === deletedUserId) {
      favorites.splice(i, 1);
    }
  }
  for (let i = learningRecords.length - 1; i >= 0; i -= 1) {
    if (learningRecords[i].user_id === deletedUserId) {
      learningRecords.splice(i, 1);
    }
  }
  for (let i = comments.length - 1; i >= 0; i -= 1) {
    if (comments[i].user_id === deletedUserId) {
      comments.splice(i, 1);
    }
  }
  for (let i = courses.length - 1; i >= 0; i -= 1) {
    if (courses[i].creator_id === deletedUserId) {
      const courseId = courses[i].id;
      courses.splice(i, 1);
      for (let j = videos.length - 1; j >= 0; j -= 1) {
        if (videos[j].course_id === courseId) {
          videos.splice(j, 1);
        }
      }
    }
  }
  res.success({ message: '用户删除成功' });
};

// 获取所有课程
exports.getCourses = (req, res) => {
  if (req.user.role !== 'admin') {
    return res.error('权限不足', 403);
  }
  res.success(courses);
};

// 删除课程
exports.deleteCourse = (req, res) => {
  if (req.user.role !== 'admin') {
    return res.error('权限不足', 403);
  }
  const courseIndex = courses.findIndex(course => course.id === parseInt(req.params.id));
  if (courseIndex === -1) {
    return res.error('课程未找到', 404);
  }
  courses.splice(courseIndex, 1);
  res.success({ message: '课程删除成功' });
};

// 获取所有评论
exports.getComments = (req, res) => {
  if (req.user.role !== 'admin') {
    return res.error('权限不足', 403);
  }
  res.success(comments);
};

// 删除评论
exports.deleteComment = (req, res) => {
  if (req.user.role !== 'admin') {
    return res.error('权限不足', 403);
  }
  const commentIndex = comments.findIndex(comment => comment.id === parseInt(req.params.id));
  if (commentIndex === -1) {
    return res.error('评论未找到', 404);
  }
  comments.splice(commentIndex, 1);
  res.success({ message: '评论删除成功' });
};