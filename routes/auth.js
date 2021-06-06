const router = require('express').Router();
const authController = require('./../controllers/authController');

// Render Sign up form
router.get('/register', authController.getSignup);

// Render Login form
router.get('/login', authController.getLogin);

// Sign Up Route
router.post('/register', authController.postSignup);

// Login Route
router.post('/login', authController.postLogin);

module.exports = router;
