const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users } = require('../models/dataStore');

// Register user
exports.registerUser = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.error('Username and password are required', 400);
  }
  if (users.find(user => user.username === username)) {
    return res.error('User already exists', 400);
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  const nextId = users.length ? Math.max(...users.map((user) => user.id)) + 1 : 1;
  const newUser = { id: nextId, username, password: hashedPassword, role: 'user', avatar: '' };
  users.push(newUser);
  res.success({ message: 'User registered successfully' });
};

// Login user
exports.loginUser = (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.error('Invalid credentials', 401);
  }
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, 'secret', { expiresIn: '1h' });
  res.success({ token, userInfo: { id: user.id, username: user.username, role: user.role } });
};

// Get user info
exports.getUserInfo = (req, res) => {
  const user = users.find(user => user.id === req.user.id);
  if (!user) {
    return res.error('User not found', 404);
  }
  res.success({ id: user.id, username: user.username, avatar: '', role: user.role });
};

// Update user
exports.updateUser = (req, res) => {
  const { username, avatar } = req.body;
  const user = users.find(user => user.id === req.user.id);
  if (!user) {
    return res.error('User not found', 404);
  }
  if (username && users.some((u) => u.username === username && u.id !== user.id)) {
    return res.error('Username already exists', 400);
  }
  user.username = username || user.username;
  user.avatar = avatar || user.avatar;
  res.success({ message: 'User updated successfully' });
};