const express = require('express');
const bodyParser = require('body-parser');

const app = express();

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
    const post = req.body;
    console.log(post);
    res.status(201).json({
        message: "Post Added Successfully"
    });
});

// Fetch Posts
app.get('/api/posts', (req, res, next) => {
    const posts = [{
            id: 'sdf12eqw',
            title: 'First server-side post',
            content: 'This is coming from the server'
        },
        {
            id: 'siudhiuh2131',
            title: 'Second server-side post',
            content: 'This is coming from the server!'
        }
    ];
    res.status(200).json({
        message: 'Posts Fetched Successfully!',
        posts: posts
    });
});

module.exports = app;
