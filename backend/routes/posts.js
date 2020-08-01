const router = require('express').Router();
const multer = require('multer');

const checkMimeType = require('../middleware/check-mime-type');
const checkAuth = require('../middleware/check-auth');

const postControllers = require('../controllers/posts');

// Fetch Posts
router.get('/', postControllers.getPostsController);

// Add a Post
router.post('/', checkAuth, multer({ storage: checkMimeType }).single('image'), postControllers.addPostController);

// Fetch a specific post by id
router.get('/:id', postControllers.getSinglePostController);

// Update a specfic post based on id
router.put('/:id', checkAuth, multer({ storage: checkMimeType }).single('image'), postControllers.updatePostController);

// Delete Posts
router.delete('/:id', checkAuth, postControllers.deletePostController);

module.exports = router;