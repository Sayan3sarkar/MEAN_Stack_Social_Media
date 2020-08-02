const router = require('express').Router();

const checkMimeType = require('../middleware/check-mime-type');
const checkAuth = require('../middleware/check-auth');

const postControllers = require('../controllers/posts');

// Fetch Posts
router.get('/', postControllers.getPostsController);

// Add a Post
router.post('/', checkAuth, checkMimeType, postControllers.addPostController);

// Fetch a specific post by id
router.get('/:id', postControllers.getSinglePostController);

// Update a specfic post based on id
router.put('/:id', checkAuth, checkMimeType, postControllers.updatePostController);

// Delete Posts
router.delete('/:id', checkAuth, postControllers.deletePostController);

module.exports = router;