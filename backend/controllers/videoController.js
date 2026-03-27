const { courses, videos, learningRecords } = require('../models/dataStore');

// Get videos
exports.getVideos = (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const courseVideos = videos.filter(video => video.course_id === courseId);
  res.success(courseVideos);
};

// Upload video
exports.uploadVideo = (req, res) => {
  const { course_id, title } = req.body;
  const parsedCourseId = parseInt(course_id, 10);
  if (!parsedCourseId || !courses.find((course) => course.id === parsedCourseId)) {
    return res.error('Course not found', 404);
  }
  if (!title) {
    return res.error('Video title is required', 400);
  }
  if (!req.file) {
    return res.error('No video file uploaded', 400);
  }
  const nextId = videos.length ? Math.max(...videos.map((video) => video.id)) + 1 : 1;
  const newVideo = {
    id: nextId,
    course_id: parsedCourseId,
    title,
    video_url: `/uploads/${req.file.filename}`,
    creator_id: req.user.id,
  };
  videos.push(newVideo);
  res.success({ message: 'Video uploaded successfully', video: newVideo });
};

// Delete video
exports.deleteVideo = (req, res) => {
  const videoIndex = videos.findIndex(video => video.id === parseInt(req.params.id));
  if (videoIndex === -1) {
    return res.error('Video not found', 404);
  }
  const video = videos[videoIndex];
  if (video.creator_id !== req.user.id && req.user.role !== 'admin') {
    return res.error('Permission denied', 403);
  }
  const videoId = video.id;
  videos.splice(videoIndex, 1);
  for (let i = learningRecords.length - 1; i >= 0; i -= 1) {
    if (learningRecords[i].video_id === videoId) {
      learningRecords.splice(i, 1);
    }
  }
  res.success({ message: 'Video deleted successfully' });
};