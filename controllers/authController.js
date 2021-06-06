const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../utils/validation');

exports.postSignup = async (req, res) => {
  try {
    // Validate the data before saving a user.
    const { error } = registerValidation(req.body);
    if (error)
      return res
        .status(400)
        .render('signup', { message: error.details[0].message });

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
    // Checking if the user is already registered
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
      return res
        .status(400)
        .render('signup', { message: 'Error: Email Already Exists' });
    }
    console.log(error);
    return res
      .status(400)
      .render('signup', { message: 'Internal Error: User not created' });
  }
};

exports.postLogin = async (req, res) => {
  try {
    // Validate the data before logging a user.
    const { error } = loginValidation(req.body);
    if (error)
      return res
        .status(400)
        .render('login', { message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });

    // Create and assign token
    const token = jwt.sign(
      { _id: user._id, user: user.name },
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
    // Checking if the email exists

    if (!user)
      return res.status(400).render('login', { message: 'user not found' });

    // Checking if the password is correct
    const validpass = await bcrypt.compare(req.body.password, user.password);
    if (!validpass)
      return res.status(400).render('login', { message: 'Invalid Password' });

    console.log(error);

    return res
      .status(400)
      .render('login', { message: 'Internal error Occured Please try again' });
  }
};

exports.getSignup = (req, res) => {
  res.render('signup');
};

exports.getLogin = (req, res) => {
  res.render('login');
};
