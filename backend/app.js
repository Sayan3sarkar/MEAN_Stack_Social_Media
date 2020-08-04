const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const postsRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');
const cron = require('node-cron');

const app = express();

// Database Connection
mongoose.connect(`${process.env.MONGODB_ATLAS_URI}`, { useUnifiedTopology: true, useNewUrlParser: true }) // Insert Connection String in place of ***
    .then(() => {
        console.log('Connected to Database');
    })
    .catch(() => {
        console.log('Connection Failed');
    });

app.use(bodyParser.json());

app.use('/images', express.static(path.join('images'))); // gives access to static folders like images

// CORS Handling Middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //List of clients to be allowed to access server
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS'); //List of methods of client to be allowed to access server
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, X-Requested-With, Accept'); //List of headers of client to be allowed to access server
    next();
});

const Post = require('./models/post');

cron.schedule('*/5 * * * *', () => { // cron job to delete non usable images every 5 mins
    console.log('Start Cron Job');
    const dbFileNames = [];
    const localFiles = [];
    let uncommonFiles = [];
    Post.find().then(posts => {
        for (const post of posts) {
            const imagePathURL = new URL(post.imagePath);
            const imagePath = imagePathURL.pathname.split('/');
            dbFileNames.push(imagePath[2]);
        }
        fs.readdir(path.join('images'), (err, files) => {
            if (err) {
                return console.log('Unable to scan directory:' + err);
            }
            files.forEach(file => {
                localFiles.push(file.toString());
            });
            uncommonFiles = localFiles.filter(file => dbFileNames.indexOf(file) === -1);
            for (const file of uncommonFiles) {
                fs.unlinkSync(path.join('images/' + file));
            }
            console.log('End CRON job');
        });
    });
});

app.use('/api/posts', postsRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;