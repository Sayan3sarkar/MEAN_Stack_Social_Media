const express = require('express');

const app = express();

// CORS Handling Middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //List of clients to be allowed to access server
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS'); //List of methods of client to be allowed to access server
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, X-Requested-With, Accept'); //List of headers of client to be allowed to access server
    next();
});

app.use('/api/posts', (req, res, next) => {
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
