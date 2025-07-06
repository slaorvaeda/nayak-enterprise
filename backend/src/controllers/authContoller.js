const User = require('../models/User.model');
const { protect, generateToken } = require('../middleware/auth');
const bcrypt = require('bcryptjs');


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



