const { favorites } = require('../models/dataStore');

// Add favorite
exports.addFavorite = (req, res) => {
  const courseId = parseInt(req.body.course_id, 10);
  if (!courseId) {
    return res.error('course_id is required', 400);
  }
  if (favorites.find(fav => fav.course_id === courseId && fav.user_id === req.user.id)) {
    return res.error('Course already favorited', 400);
  }
  const nextId = favorites.length ? Math.max(...favorites.map((fav) => fav.id)) + 1 : 1;
  const newFavorite = { id: nextId, course_id: courseId, user_id: req.user.id };
  favorites.push(newFavorite);
  res.success({ message: 'Course favorited successfully' });
};

// Remove favorite
exports.removeFavorite = (req, res) => {
  const courseId = parseInt(req.body.course_id, 10);
  const favoriteIndex = favorites.findIndex(fav => fav.course_id === courseId && fav.user_id === req.user.id);
  if (favoriteIndex === -1) {
    return res.error('Favorite not found', 404);
  }
  favorites.splice(favoriteIndex, 1);
  res.success({ message: 'Favorite removed successfully' });
};

// Get favorites
exports.getFavorites = (req, res) => {
  const userFavorites = favorites.filter(fav => fav.user_id === req.user.id);
  res.success(userFavorites);
};