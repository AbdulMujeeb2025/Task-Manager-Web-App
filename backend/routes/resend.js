const express = require('express');
const router = express.Router();
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @route   POST /auth/resend-verification
// @desc    Resend verification email
// @access  Public
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    // Check if user is already verified
    if (user.isVerified) {
      return res.status(400).json({ message: 'This account is already verified. You can log in.' });
    }

    // Check if user has a verification token
    if (!user.verificationToken) {
      // Generate a new verification token if it doesn't exist
      const crypto = require('crypto');
      user.verificationToken = crypto.randomBytes(20).toString('hex');
      await user.save();
    }

    // Send verification email
    const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify/${user.verificationToken}`;
    const message = `
      <h1>Email Verification</h1>
      <p>Please verify your email to activate your account.</p>
      <p>You requested this verification email manually.</p>
      <a href="${verifyUrl}" clicktracking=off>${verifyUrl}</a>
    `;

    try {
      await sendEmail(user.email, 'Verify Your Email - Task Manager', message);
      res.status(200).json({ message: 'Verification email has been sent. Please check your inbox.' });
    } catch (emailError) {
      console.error('Resend verification email error:', emailError);
      res.status(500).json({ message: 'Email could not be sent. Please try again later.' });
    }
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

