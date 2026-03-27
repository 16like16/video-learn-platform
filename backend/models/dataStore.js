const bcrypt = require('bcryptjs');

const users = [];
const courses = [];
const videos = [];
const comments = [];
const favorites = [];
const learningRecords = [];

const ensureAdminUser = () => {
  const hasAdmin = users.some((user) => user.role === 'admin');
  if (hasAdmin) {
    return;
  }

  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  users.push({
    id: 1,
    username: 'admin',
    password: bcrypt.hashSync(adminPassword, 10),
    role: 'admin',
    avatar: '',
  });
};

ensureAdminUser();

module.exports = {
  users,
  courses,
  videos,
  comments,
  favorites,
  learningRecords,
};