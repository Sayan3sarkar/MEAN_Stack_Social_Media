const express = require('express');

const app = express();

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
