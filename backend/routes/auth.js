const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

// Used for user signup. Endpoint: '<hostname>/api/auth/signup
router.post('/signup', authController.signupController);

// Used for user login. Endpoint: '<hostname>/api/auth/login
router.post('/login', authController.loginController);

module.exports = router;