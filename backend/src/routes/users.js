const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/auth');
const { getUserProfile, updateUserProfile, updateUserProfileById } = require('../controllers/UserController');


router.get('/profile', protect, getUserProfile);
router.put('/profile/update', protect, updateUserProfile);
router.get('/profile/:userid', protect,updateUserProfileById);//updateuser profile by id

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    // Get user's recent orders
    const recentOrders = await Order.find({ customer: req.user._id })
      .sort({ orderDate: -1 })
      .limit(5)
      .select('orderNumber status total orderDate');

    // Get order statistics
    const orderStats = await Order.aggregate([
      { $match: { customer: req.user._id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' }
        }
      }
    ]);

    // Get status distribution
    const statusDistribution = await Order.aggregate([
      { $match: { customer: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get monthly spending for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlySpending = await Order.aggregate([
      {
        $match: {
          customer: req.user._id,
          orderDate: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$orderDate' },
            month: { $month: '$orderDate' }
          },
          total: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        recentOrders,
        stats: orderStats[0] || { totalOrders: 0, totalSpent: 0, averageOrderValue: 0 },
        statusDistribution,
        monthlySpending
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard data'
    });
  }
});

// @desc    Upload verification documents
// @route   POST /api/users/verification
// @access  Private
router.post('/verification', protect, async (req, res) => {
  try {
    const { documentType, documentUrl } = req.body;

    if (!documentType || !documentUrl) {
      return res.status(400).json({
        success: false,
        message: 'Document type and URL are required'
      });
    }

    const validDocumentTypes = ['gst-certificate', 'business-license', 'pan-card', 'aadhar-card', 'other'];
    
    if (!validDocumentTypes.includes(documentType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document type'
      });
    }

    const user = await User.findById(req.user._id);
    
    // Check if document already exists
    const existingDoc = user.verificationDocuments.find(
      doc => doc.type === documentType
    );

    if (existingDoc) {
      // Update existing document
      existingDoc.documentUrl = documentUrl;
      existingDoc.uploadedAt = new Date();
      existingDoc.isVerified = false; // Reset verification status
    } else {
      // Add new document
      user.verificationDocuments.push({
        type: documentType,
        documentUrl,
        uploadedAt: new Date(),
        isVerified: false
      });
    }

    await user.save();

    res.json({
      success: true,
      message: 'Document uploaded successfully. Pending verification.',
      data: {
        user: {
          id: user._id,
          verificationDocuments: user.verificationDocuments
        }
      }
    });
  } catch (error) {
    console.error('Upload verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload document'
    });
  }
});

// @desc    Get verification status
// @route   GET /api/users/verification
// @access  Private
router.get('/verification', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('verificationDocuments isVerified');
    
    res.json({
      success: true,
      data: {
        verificationDocuments: user.verificationDocuments,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Get verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get verification status'
    });
  }
});

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status, businessType } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { ownerName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (status === 'verified') {
      filter.isVerified = true;
    } else if (status === 'pending') {
      filter.isVerified = false;
    }

    if (businessType) {
      filter.businessType = businessType;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalUsers: total,
          hasNextPage: skip + users.length < total,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// @desc    Get user by ID (Admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
router.get('/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's orders
    const orders = await Order.find({ customer: user._id })
      .sort({ orderDate: -1 })
      .limit(10)
      .select('orderNumber status total orderDate');

    res.json({
      success: true,
      data: {
        user,
        orders
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
});

// @desc    Update user verification status (Admin only)
// @route   PUT /api/users/:id/verify
// @access  Private/Admin
router.put('/:id/verify', protect, admin, async (req, res) => {
  try {
    const { isVerified, adminNotes } = req.body;

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isVerified = isVerified;
    if (adminNotes) {
      user.adminNotes = adminNotes;
    }

    await user.save();

    res.json({
      success: true,
      message: `User ${isVerified ? 'verified' : 'unverified'} successfully`,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Update verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update verification status'
    });
  }
});

// @desc    Update user status (Admin only)
// @route   PUT /api/users/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status'
    });
  }
});

module.exports = router; 