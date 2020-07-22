const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

// Database Connection
mongoose.connect("***", { useUnifiedTopology: true, useNewUrlParser: true }) // Insert Connection String in place of ***
    .then(() => {
        console.log('Connected to Database');
    })
    .catch(() => {
        console.log('Connection Failed');
    });

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));

// CORS Handling Middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //List of clients to be allowed to access server
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS'); //List of methods of client to be allowed to access server
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, X-Requested-With, Accept'); //List of headers of client to be allowed to access server
    next();
});

// Add posts
app.post('/api/posts', (req, res, next) => {
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

// Fetch Posts
app.get('/api/posts', (req, res, next) => {
    Post.find()
        .then(posts => {
            console.log(posts);
            res.status(200).json({
                message: 'Posts Fetched Successfully!',
                posts: posts
            });
        });
});

// Delete Posts
app.delete('/api/posts/:id', (req, res, next) => {
    // console.log(req.params.id);
    Post.deleteOne({ _id: req.params.id })
        .then(result => {
            console.log(result);
            res.status(200).json({ message: 'Post Deleted!' });
        });

});

module.exports = app;
