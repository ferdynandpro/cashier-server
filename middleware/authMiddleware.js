// authenticateToken.js

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Extract token from headers or wherever it's stored
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Authentication failed: No token provided' });
  }

  // Verify token and decode user information
  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Authentication failed: Invalid token' });
    }

    // Set decoded user information on request object
    req.user = decoded.user;
    next(); // Proceed to next middleware
  });
};

module.exports = authenticateToken;
