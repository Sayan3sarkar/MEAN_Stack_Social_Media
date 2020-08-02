const Post = require('../models/post');

/**
 * Controller to fetch all posts
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.getPostsController = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1)) // if pageSize = 10 and currentPage  = 2, we would like to skip first page
            // posts, i.e. the first (10 x (2 - 1)) = 10 posts;
            .limit(pageSize);
    }
    postQuery
        .then(posts => {
            fetchedPosts = posts;
            return Post.countDocuments();
        }).then(count => {
            res.status(200).json({
                message: 'Posts Fetched Successfully!',
                posts: fetchedPosts,
                maxPosts: count
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Fetching posts failed'
            });
        });
};

/**
 * Controller for adding new post
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.addPostController = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename,
        creator: req.userData.userId
    });
    post.save().then(createdPost => {
            res.status(201).json({
                message: "Post Added Successfully",
                post: {
                    ...createdPost,
                    id: createdPost._id
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Creating a post failed'
            });
        });
};

/**
 * Controller for reading a single post
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.getSinglePostController = (req, res, next) => {
    Post.findById(req.params.id).then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: 'Post Not found' });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'Fetching a post failed'
            });
        });
};

/**
 * Controller to update a single post
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.updatePostController = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename;
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    console.log('Post from server: ' + post);
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
        .then(result => {
            if (result.n > 0) {
                res.status(200).json({ message: 'Update Successful' });
            } else {
                res.status(401).json({ message: 'Not Authorized' });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'Updating failed. Could\'\nt update post'
            });
        });
};

/**
 * Controller to delete a single post
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.deletePostController = (req, res, next) => {
    // console.log(req.params.id);
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
        .then(result => {
            if (result.n > 0) {
                res.status(200).json({ message: 'Post Deleted' });
            } else {
                res.status(401).json({ message: 'Not Authorized' });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'Deletion of this post could not be performed. Try again after some time'
            });
        });
};