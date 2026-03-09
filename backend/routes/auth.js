const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @route   POST /auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      verificationToken
    });

    // Send verification email
    const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify/${verificationToken}`;
    const message = `
      <h1>Email Verification</h1>
      <p>Please verify your email to activate your account.</p>
      <a href="${verifyUrl}" clicktracking=off>${verifyUrl}</a>
    `;

    try {
      await sendEmail(user.email, 'Verify Your Email - Task Manager', message);
      res.status(201).json({
        message: 'Registration successful. Please check your email to verify your account.'
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
      // Still create user but log email error
      res.status(201).json({
        message: 'Registration successful, but email could not be sent.'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /auth/verify/:token
// @desc    Verify user email
// @access  Public
router.get('/verify/:token', async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    // Update user as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    // Send welcome email
    const welcomeMessage = `
      <h1>Welcome to Task Manager!</h1>
      <p>Hello ${user.name},</p>
      <p>Your account has been successfully verified.</p>
      <p>You can now log in and start managing your tasks.</p>
    `;

    try {
      await sendEmail(user.email, 'Welcome to Task Manager', welcomeMessage);
    } catch (emailError) {
      console.error('Welcome email error:', emailError);
    }

    // Redirect to frontend with success message
    const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/login?verified=true`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    console.log('Login request:', req.body);
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'yes' : 'no');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email before logging in' });
    }

    // Check for password
    const isMatch = await user.matchPassword(password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    const message = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
      <p>This link will expire in 15 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `;

    try {
      await sendEmail(user.email, 'Password Reset - Task Manager', message);
      res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
      console.error('Password reset email error:', error);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /auth/reset-password/:token
// @desc    Reset password
// @access  Public
router.post('/reset-password/:token', async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = require('crypto')
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

