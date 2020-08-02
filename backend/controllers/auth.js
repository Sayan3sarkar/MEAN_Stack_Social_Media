const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/user');

/**
 * Controller for User Signup
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.signupController = (req, res, next) => {
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
};

/**
 * Controller for user Login
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.loginController = (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: "Authentication Failed. Please Try again with valid credentials"
                });
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: "Authentication Failed. Please Try again with valid credentials"
                });
            }
            const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id },
                `${process.env.JWT_SECRET_KEY}`, { expiresIn: '1h' }
            );
            res.status(200).json({
                message: 'Logged In',
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id
            });
        })
        .catch(err => {
            return res.status(401).json({
                message: "Authentication Failed. Please Try again with valid credentials"
            });
        });
};