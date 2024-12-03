const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    // Check if the Authorization header is present
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(400).json({ error: 'Authorization token is required.' });
    }

    // Verify the token using the JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by the decoded ID
    const user = await User.findOne({ where: { id: decoded.id } });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Attach token and user to the request object for future use
    req.token = token;
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle different types of errors (invalid token, token expired, etc.)
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired.' });
    }

    // Handle unexpected errors
    console.error(error);
    res.status(500).json({ error: 'Server error during authentication.' });
  }
};

module.exports = authMiddleware;
