const { comments } = require('../models/dataStore');

// Get comments
exports.getComments = (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const courseComments = comments.filter(comment => comment.course_id === courseId);
  res.success(courseComments);
};

// Add comment
exports.addComment = (req, res) => {
  const { course_id, content } = req.body;
  if (!course_id || !content) {
    return res.error('course_id and content are required', 400);
  }
  const nextId = comments.length ? Math.max(...comments.map((comment) => comment.id)) + 1 : 1;
  const newComment = {
    id: nextId,
    course_id: parseInt(course_id),
    user_id: req.user.id,
    user: req.user.username,
    content,
    create_time: new Date().toISOString(),
  };
  comments.push(newComment);
  res.success({ message: 'Comment added successfully', comment: newComment });
};

// Delete comment
exports.deleteComment = (req, res) => {
  const commentIndex = comments.findIndex(comment => comment.id === parseInt(req.params.id));
  if (commentIndex === -1) {
    return res.error('Comment not found', 404);
  }
  const comment = comments[commentIndex];
  if (comment.user_id !== req.user.id && req.user.role !== 'admin') {
    return res.error('Permission denied', 403);
  }
  comments.splice(commentIndex, 1);
  res.success({ message: 'Comment deleted successfully' });
};