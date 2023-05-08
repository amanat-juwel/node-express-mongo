const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { JWT_SECRET_KEY } = require('../utils/config');

// Generate JWT token
function generateToken(user) {
  return jwt.sign({ userId: user._id }, JWT_SECRET_KEY, { expiresIn: '1h' });
}

// User registration
async function register(req, res) {
  try {
    const { username, password } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json(errorResponse('USER_EXISTS', 'Username already exists'));
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({ username, password: hashedPassword });
    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    res.status(201).json(successResponse({ token }));
  } catch (err) {
    res.status(400).json(errorResponse('REGISTRATION_FAILED', err.message));
  }
}

// User login
async function login(req, res) {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json(errorResponse('INVALID_CREDENTIALS', 'Invalid username or password'));
    }

    // Compare the passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json(errorResponse('INVALID_CREDENTIALS', 'Invalid username or password'));
    }

    // Generate JWT token
    const token = generateToken(user);

    res.json(successResponse({ token }));
  } catch (err) {
    res.status(400).json(errorResponse('LOGIN_FAILED', err.message));
  }
}

module.exports = {
  register,
  login,
};
