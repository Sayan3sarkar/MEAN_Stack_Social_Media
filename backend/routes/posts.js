const router = require('express').Router();
const Post = require('../models/post');

// Fetch Posts
router.get('/', (req, res, next) => {
    Post.find()
        .then(posts => {
            console.log(posts);
            res.status(200).json({
                message: 'Posts Fetched Successfully!',
                posts: posts
            });
        });
});

// Add a Post
router.post('/', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save().then(createdPost => {
        res.status(201).json({
            message: "Post Added Successfully",
            postId: createdPost._id
        });
    });
});

// Fetch a specific post by id
router.get('/:id', (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: 'Post Not found' });
        }
    });
});

// Update a specfic post based on id
router.put('/:id', (req, res, next) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });
    Post.updateOne({ _id: req.params.id }, post)
        .then(result => {
            res.status(200).json({ message: 'Update Successful' });
        });
});

// Delete Posts
router.delete('/:id', (req, res, next) => {
    // console.log(req.params.id);
    Post.deleteOne({ _id: req.params.id })
        .then(result => {
            console.log(result);
            res.status(200).json({ message: 'Post Deleted!' });
        });

});

module.exports = router;
