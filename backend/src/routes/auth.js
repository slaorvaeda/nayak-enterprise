const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const { protect, generateToken } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../middleware/validation');
const { registerUser, loginUser } = require('../controllers/authContoller');
const { getUserProfile, updateUserProfile } = require('../controllers/UserController');

// Register new user
router.post('/register',registerValidation, registerUser);

// Login user
router.post('/login', loginValidation, loginUser);

//Get current user profile
router.get('/me', protect, getUserProfile);

// @desc    Update user profile
router.put('/profile/update', protect, updateUserProfile);

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    const user = await User.findById(req.user._id);

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
});

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @desc    Check if email exists
// @route   POST /api/auth/check-email
// @access  Public
router.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ email });
    
    res.json({
      success: true,
      data: {
        exists: !!user
      }
    });
  } catch (error) {
    console.error('Check email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check email'
    });
  }
});

module.exports = router; 