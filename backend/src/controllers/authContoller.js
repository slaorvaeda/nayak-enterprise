const User = require('../models/User.model');
const { protect, generateToken } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ProductModel = require('../models/Product.model');
const crypto = require('crypto');
const { sendPasswordResetEmail, sendPasswordResetSuccessEmail } = require('../utils/emailService');


// Register User
exports.registerUser =  async (req, res) => {
    const {
        businessName,
        businessType,
        ownerName,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        gstNumber,
        password,
        businessDescription
    } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }


        // Create new user (password will be hashed by the pre-save hook)
        const user = await User.create({
            businessName,
            businessType,
            gstNumber,
            businessDescription,
            ownerName,
            email,
            phone,
            address: {
                street: address,
                city,
                state,
                pincode
            },
            password
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Registration successful. Please wait for account verification.',
            data: {
                user: {
                    _id: user._id,
                    email: user.email
                },
                token
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      message: 'Please provide email and password' 
    });
  }
  
  try {
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          businessName: user.businessName,
          ownerName: user.ownerName,
          email: user.email,
          phone: user.phone,
          isVerified: user.isVerified,
          role: user.role,
          businessStatus: user.businessStatus
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

//Login Admin
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (user.role !== 'admin') return res.status(403).json({ message: 'Not an admin user' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

//Admin Auth
exports.adminAuth = (req, res, next) => {
  // The protect middleware already verified the token and set req.user
  if (!req.user) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' });
  }

  next();
};

//admin get the all users
exports.userAdmin = async(req, res, next ) =>{
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
  
  
};

// Admin: Create a new user
exports.adminCreateUser = async (req, res) => {
  try {
    const {
      businessName,
      businessType,
      ownerName,
      email,
      phone,
      image,
      address,
      city,
      state,
      pincode,
      gstNumber,
      businessDescription,
      password,
      isVerified,
      isActive,
      role
    } = req.body;

    // Compose address object
    const addressObj = address ? address : {
      street: address,
      city,
      state,
      pincode
    };

    // Create user
    const user = await User.create({
      businessName,
      businessType,
      ownerName,
      email,
      phone,
      image,
      address: addressObj,
      gstNumber,
      businessDescription,
      password,
      isVerified,
      isActive,
      role
    });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { user: userObj }
    });
  } catch (error) {
    console.error('Admin create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message
    });
  }
};

// Admin: Update any user by ID
exports.adminUpdateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // If address fields are present, compose address object
    if (updateData.address || updateData.city || updateData.state || updateData.pincode) {
      updateData.address = updateData.address || {};
      if (updateData.city) updateData.address.city = updateData.city;
      if (updateData.state) updateData.address.state = updateData.state;
      if (updateData.pincode) updateData.address.pincode = updateData.pincode;
      if (updateData.street) updateData.address.street = updateData.street;
    }

    // Remove undefined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Admin update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
};

//admin get the all products
exports.getProducts = async (req, res) => {
  try {
    const products = await ProductModel.find()
      .select('-__v')
      .sort({ createdAt: -1 });
    
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User with this email does not exist'
      });
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    // Send email
    const emailSent = await sendPasswordResetEmail(user.email, resetToken, resetUrl);

    if (emailSent) {
      res.json({
        success: true,
        message: 'Password reset email sent successfully'
      });
    } else {
      // If email fails, still return success but with the reset URL for development
      console.log('Email sending failed, returning reset URL for development');
      res.json({
        success: true,
        message: 'Password reset link generated (email not configured)',
        data: {
          resetUrl,
          resetToken // Remove this in production
        }
      });
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    
    // Reset user fields if error occurs
    if (error.code !== 404) {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
      }
    }

    res.status(500).json({
      success: false,
      message: 'Failed to send password reset email'
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:resetToken
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password is required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Set new password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Send success email
    await sendPasswordResetSuccessEmail(user.email);

    res.json({
      success: true,
      message: 'Password reset successful'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
};
