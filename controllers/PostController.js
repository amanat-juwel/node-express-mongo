const { body, validationResult } = require('express-validator');
const Post = require('../models/post');
const { successResponse, errorResponse } = require('../utils/responseHandler');

// Get all blog posts
async function getAllPosts(req, res) {
  try {
    const posts = await Post.find().populate({path:'userId',select:'username'});
    res.json(successResponse(posts));
  } catch (err) {
    res.status(500).json(errorResponse('GET_POSTS_FAILED', err.message));
  }
}

// Get a specific blog post
async function getPost(req, res) {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId).populate({path:'userId',select:'username'});
    if (!post) {
      return res.status(404).json(errorResponse('POST_NOT_FOUND', 'Post not found'));
    }
    res.json(successResponse(post));
  } catch (err) {
    res.status(500).json(errorResponse('GET_POST_FAILED', err.message));
  }
}

// Create a new blog post
async function createPost(req, res) {
  try {

    // Start Request validation using express-validator
    const validations = [
      body('title').notEmpty().withMessage('Title is required'),
      body('content').notEmpty().withMessage('Content is required').isLength({ min: 10 }).withMessage('Content should be at least 10 characters long'),
      body('year').notEmpty().withMessage('Year is required'),
    ];

    for (const validation of validations) { await validation.run(req); }
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      const errorMessage = errorMessages.join(', ');
      return res.status(400).json(errorResponse('VALIDATION_ERROR', errorMessage));
    }

    const { title, content, year } = req.body;
    const userId = req.userId; // Extracted from the JWT token in the authentication middleware

    const post = new Post({ title, content, year, userId });
    await post.save();

    res.status(201).json(successResponse(post, 'Post created successfully'));
  } catch (err) {
    res.status(400).json(errorResponse('CREATE_POST_FAILED', err.message));
  }
}

// Update a blog post
async function updatePost(req, res) {
  try {

    // Start Request validation using express-validator
    const validations = [
      body('title').notEmpty().withMessage('Title is required'),
      body('content').notEmpty().withMessage('Content is required').isLength({ min: 10 }).withMessage('Content should be at least 10 characters long'),
      body('year').notEmpty().withMessage('Year is required'),
    ];

    for (const validation of validations) { await validation.run(req); }
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      const errorMessage = errorMessages.join(', ');
      return res.status(400).json(errorResponse('VALIDATION_ERROR', errorMessage));
    }
    
    const postId = req.params.id;
    const { title, content, year } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json(errorResponse('POST_NOT_FOUND', 'Post not found'));
    }

    post.title = title;
    post.content = content;
    post.year = year;
    await post.save();

    res.json(successResponse(post, 'Post updated successfully'));
  } catch (err) {
    res.status(400).json(errorResponse('UPDATE_POST_FAILED', err.message));
  }
}

// Delete a blog post
async function deletePost(req, res) {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json(errorResponse('POST_NOT_FOUND', 'Post not found'));
    }

    await post.remove();

    res.json(successResponse(null, 'Post deleted successfully'));
  } catch (err) {
    res.status(500).json(errorResponse('DELETE_POST_FAILED', err.message));
  }
}

module.exports = {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
};
