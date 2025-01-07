const jwt = require('jsonwebtoken'); // Assuming you're using JWT for authentication

module.exports = (req, res, next) => {
  const token = req.headers['authorization']; // Get token from headers

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' }); // No token provided
  }

  jwt.verify(token, 'your_secret_key', (err, decoded) => { // Replace 'your_secret_key' with your actual secret
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' }); // Token is invalid
    }
    req.user = decoded; // Attach user info to request
    next(); // Proceed to the next middleware/route handler
  });
};