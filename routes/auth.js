const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { registerValidation, loginValidation } = require('../validation');

// Render Sign up form
router.get('/register', (req, res) => {
  res.render('signup');
});

// Render Login form
router.get('/login', (req, res) => {
  res.render('login');
});

// Sign Up Route
router.post('/register', async (req, res) => {
  try {
    // Validate the data before saving a user.
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Checking if the user is already registered
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) res.status(400).send('Email already registered');

    // Hashing the password
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    // Create a new user
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    // Save the user created to database
    const savedUser = await user.save();

    res.status(200).render('successfull');
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error.message,
    });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    // Validate the data before logging a user.
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Checking if the email exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email not found');

    // Checking if the password is correct
    const validpass = await bcrypt.compare(req.body.password, user.password);
    if (!validpass) return res.status(400).send('Invalid password');

    // Create and assign token
    const token = jwt.sign(
      { _id: user._id, user: user },
      process.env.JWT_SECRET
    );
    res
      .cookie('jwt', token, {
        secure: true,
        httpOnly: true,
      })
      .redirect('/api/files');

    // Redirecting to the Uploading files page
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error.message,
    });
  }
});

module.exports = router;
