const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts');

const app = express();

// Database Connection
mongoose.connect("**", { useUnifiedTopology: true, useNewUrlParser: true }) // Insert Connection String in place of ***
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

app.use('/api/posts', postsRoutes);

module.exports = app;
