const jwt = require('jsonwebtoken');

// JWT authentication middleware
exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.error('Unauthorized', 401);
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.error('Invalid token', 403);
  }
};