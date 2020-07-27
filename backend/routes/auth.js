const router = require('express').Router();
const bcrypt = require('bcryptjs');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
    const email = req.body.email;
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

module.exports = router;