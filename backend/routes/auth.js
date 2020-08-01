const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/user');

// Used for user signup. Endpoint: '<hostname>/api/auth/signup
router.post('/signup', (req, res, next) => {
    // const email = req.body.email;
    const password = req.body.password;
    bcrypt.hash(password, 12)
        .then(hashedPw => {
            const user = new User({
                email: req.body.email,
                password: hashedPw
            });
            user.save()
                .then(result => {
                    res.status(201).json({
                        message: 'User Created',
                        result: result
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
        });
});

// Used for user login. Endpoint: '<hostname>/api/auth/login
router.post('/login', (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: "Authentication Failed. Please Try again with valid credentials"
                });
            }
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: "Authentication Failed. Please Try again with valid credentials"
                });
            }
            const token = jwt.sign({ email: user.email, userId: user._id },
                `${process.env.JWT_SECRET_KEY}`, { expiresIn: '1h' }
            );
            res.status(200).json({
                message: 'Logged In',
                token: token
            });
        })
        .catch(err => {
            return res.status(401).json({
                message: "Authentication Failed. Please Try again with valid credentials"
            });
        });
});

module.exports = router;