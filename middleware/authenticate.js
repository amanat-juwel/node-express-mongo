const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/responseHandler');
const { JWT_SECRET_KEY } = require('../utils/config');

function authenticate(req, res, next) {
  // Check if the request contains the 'Authorization' header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json(errorResponse('UNAUTHORIZED', 'Unauthorized #1000'));
  }

  // Extract the token from the 'Authorization' header
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json(errorResponse('UNAUTHORIZED', 'Unauthorized #1001'));
  }

  try {
    // Verify the token
    const decodedToken = jwt.verify(token, JWT_SECRET_KEY);

    // Attach the decoded user ID to the request object
    req.userId = decodedToken.userId;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    return res.status(401).json(errorResponse('UNAUTHORIZED', 'Unauthorized #1002'));
  }
}

module.exports = authenticate;
