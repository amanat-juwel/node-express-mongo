const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController');
const authenticate = require('../middleware/authenticate');

router.get('/', PostController.getAllPosts);
router.get('/:id', PostController.getPost);
router.post('/', authenticate, PostController.createPost);
router.put('/:id', authenticate, PostController.updatePost);
router.delete('/:id', authenticate, PostController.deletePost);

module.exports = router;
