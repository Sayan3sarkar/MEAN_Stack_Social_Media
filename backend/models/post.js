const mongoose = require('mongoose');

const postSchema = mongoose.Schema({ // Schema is basically the blueprint of our code
    title: { type: String, required: true },
    content: { type: String, required: true },
    imagePath: { type: String, required: true }
});

module.exports = mongoose.model('Post', postSchema); // Collection name is 'posts' since Model name is 'Post'
