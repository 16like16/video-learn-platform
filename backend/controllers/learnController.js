const { learningRecords } = require('../models/dataStore');

// Save learning progress
exports.saveProgress = (req, res) => {
  const videoId = parseInt(req.body.video_id, 10);
  const { progress } = req.body;
  if (!videoId || progress === undefined) {
    return res.error('video_id and progress are required', 400);
  }
  const existingRecord = learningRecords.find(record => record.video_id === videoId && record.user_id === req.user.id);
  if (existingRecord) {
    existingRecord.progress = progress;
    existingRecord.updated_at = new Date().toISOString();
  } else {
    const nextId = learningRecords.length ? Math.max(...learningRecords.map((record) => record.id)) + 1 : 1;
    const newRecord = {
      id: nextId,
      video_id: videoId,
      user_id: req.user.id,
      progress,
      updated_at: new Date().toISOString(),
    };
    learningRecords.push(newRecord);
  }
  res.success({ message: 'Learning progress saved successfully' });
};

// Get learning records
exports.getLearningRecords = (req, res) => {
  const userRecords = learningRecords.filter(record => record.user_id === req.user.id);
  res.success(userRecords);
};